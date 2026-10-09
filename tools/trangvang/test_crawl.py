import importlib.util
import pathlib
import tempfile
import unittest
import asyncio
import json
import sqlite3
import sys
import types
from unittest.mock import patch

MODULE = pathlib.Path(__file__).with_name('crawl.py')
spec = importlib.util.spec_from_file_location('trangvang_crawl', MODULE) if MODULE.exists() else None
crawl = importlib.util.module_from_spec(spec) if spec else None
if crawl:
    spec.loader.exec_module(crawl)


class CrawlTests(unittest.TestCase):
    def test_implementation_present(self):
        self.assertIsNotNone(crawl, 'Missing resumable Crawl4AI pipeline')

    def test_discovery_all_pagination_scoped_to_current_category(self):
        html = '<main><a href="/categories/12/sample.html">Ngành mẫu (40)</a><a href="/findex?page=2">2</a><a href="/findex/Z">Z</a></main>'
        page = crawl.parse_page('https://trangvangvietnam.com/findex', html)
        self.assertEqual(len(page['categories']), 1)
        self.assertEqual(len(page['next']), 2)
        html = '<a href="/categories/12/sample.html?page=2">2</a><a href="/categories/13/other.html">Khác</a><a href="/listings/123456789/example.html">Nhà cung ứng</a>'
        page = crawl.parse_page('https://trangvangvietnam.com/categories/12/sample.html', html)
        self.assertEqual(len(page['listings']), 1)
        self.assertEqual(len(page['next']), 1)

    def test_structured_business_contacts_gallery_no_footer_or_tracking_images(self):
        html = '''<main><h1>Công ty mẫu</h1><script type="application/ld+json">{"@type":"LocalBusiness","name":"Công ty mẫu","address":{"streetAddress":"Đường mẫu","addressLocality":"Hà Nội"},"telephone":"0000000000","email":"sample@example.invalid","taxID":"0100000000"}</script><section id="gallery"><img data-src="https://pic.trangvangvietnam.com/one.jpg" alt="Sản phẩm mẫu"><img src="data:image/gif,abc"></section></main><footer><a href="tel:0000000001">Điện thoại ban biên tập</a><img src="/tracking.png"></footer>'''
        row = crawl.parse_page('https://trangvangvietnam.com/listings/123456789/example.html', html)['supplier']
        self.assertEqual(row['sourceId'], '123456789')
        self.assertEqual(row['phones'], ['0000000000'])
        self.assertIn('Hà Nội', row['address'])
        self.assertEqual(len(row['images']), 1)
        self.assertEqual(row['imageCaptions'], ['Sản phẩm mẫu'])

    def test_robots_fail_closed_and_challenge_is_not_a_valid_page(self):
        for text in ['<html>Sorry, you have been blocked</html>', '<title>Just a moment...</title>', '']:
            with self.assertRaises(crawl.CrawlBlocked):
                crawl.ensure_accessible(text, 200)
        with self.assertRaises(crawl.CrawlBlocked):
            crawl.robots_policy('<html>Cloudflare</html>', 200)
        policy = crawl.robots_policy('User-agent: *\nDisallow: /listings/\nCrawl-delay: 7', 200)
        self.assertFalse(policy.can_fetch(crawl.USER_AGENT, 'https://trangvangvietnam.com/listings/1/a'))
        self.assertEqual(policy.crawl_delay('*'), 7)

    def test_queue_dedup_resume_failure_does_not_mark_done(self):
        with tempfile.TemporaryDirectory() as directory:
            db = crawl.Queue(pathlib.Path(directory) / 'queue.sqlite')
            url = 'https://trangvangvietnam.com/findex'
            db.add(url, 'index')
            db.add(url, 'index')
            job = db.take()
            self.assertEqual(job['url'], url)
            db.close()
            db = crawl.Queue(pathlib.Path(directory) / 'queue.sqlite')
            self.assertEqual(db.take()['url'], url)
            db.finish(url, {'categories': [], 'listings': [], 'next': []})
            self.assertIsNone(db.take())
            db.close()

    def test_source_links_and_page_shape_are_validated(self):
        self.assertIsNone(crawl.source_url('https://example.invalid/findex', 'https://trangvangvietnam.com/findex'))
        self.assertIsNone(crawl.source_url('javascript:alert(1)', 'https://trangvangvietnam.com/findex'))
        with self.assertRaises(ValueError):
            crawl.parse_page('https://trangvangvietnam.com/listings/123456789/example.html', '<main>Không có hồ sơ</main>')

    def test_second_runner_does_not_reset_live_jobs(self):
        with tempfile.TemporaryDirectory() as directory:
            path = pathlib.Path(directory)
            db = crawl.Queue(path / 'queue.sqlite')
            db.add(crawl.ORIGIN + '/findex', 'index')
            db.take()
            db.close()
            (path / 'run.lock').write_text('active')
            args = types.SimpleNamespace(output=directory, start=crawl.ORIGIN + '/findex', export_only=False, probe=True)
            with self.assertRaises(FileExistsError):
                asyncio.run(crawl.run(args))
            with sqlite3.connect(path / 'queue.sqlite') as check:
                self.assertEqual(check.execute('SELECT state FROM jobs').fetchone()[0], 'running')

    def test_mocked_crawl4ai_traversal_exports_contacts_and_all_memberships(self):
        pages = {
            crawl.ORIGIN + '/findex': '<a href="/categories/12/a.html">Ngành A</a><a href="/categories/13/b.html">Ngành B</a>',
            crawl.ORIGIN + '/categories/12/a.html': '<a href="/listings/123456789/a.html">Công ty</a>',
            crawl.ORIGIN + '/categories/13/b.html': '<a href="/listings/123456789/a.html">Công ty</a>',
            crawl.ORIGIN + '/listings/123456789/a.html': '<main><h1>Công ty ví dụ</h1><a href="tel:0000000000">Gọi</a><a href="mailto:sample@example.invalid">Email</a><div itemprop="address">Địa chỉ mẫu</div></main>'
        }
        class Browser:
            def __init__(self, **kwargs):
                pass
            async def __aenter__(self):
                return self
            async def __aexit__(self, *args):
                pass
            async def arun(self, url, config):
                return types.SimpleNamespace(html=pages[url], status_code=200, success=True)
        fake = types.SimpleNamespace(AsyncWebCrawler=Browser, BrowserConfig=lambda **kwargs: kwargs, CrawlerRunConfig=lambda **kwargs: kwargs, CacheMode=types.SimpleNamespace(BYPASS='bypass'))
        policy = crawl.robots_policy('User-agent: *\nAllow: /', 200)
        with tempfile.TemporaryDirectory() as directory, patch.dict(sys.modules, {'crawl4ai': fake}), patch.object(crawl, 'read_robots', return_value=policy), patch.object(crawl.asyncio, 'sleep', new=unittest.mock.AsyncMock()):
            args = types.SimpleNamespace(output=directory, start=crawl.ORIGIN + '/findex', export_only=False, probe=False, delay=3, max_pages=10)
            result = asyncio.run(crawl.run(args))
            self.assertTrue(result['complete'])
            self.assertEqual(result['suppliers'], 1)
            row = json.loads((pathlib.Path(directory) / 'suppliers.jsonl').read_text())
            self.assertEqual(len(row['categories']), 2)
            self.assertEqual(row['phones'], ['0000000000'])
            self.assertEqual(row['emails'], ['sample@example.invalid'])
            self.assertFalse((pathlib.Path(directory) / 'run.lock').exists())

    def test_access_failure_keeps_pending_queue_and_private_report(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(crawl, 'read_robots', side_effect=crawl.CrawlBlocked('blocked')):
            args = types.SimpleNamespace(output=directory, start=crawl.ORIGIN + '/findex', export_only=False, probe=False)
            with self.assertRaises(crawl.CrawlBlocked):
                asyncio.run(crawl.run(args))
            report = json.loads((pathlib.Path(directory) / 'status.json').read_text())
            self.assertFalse(report['complete'])
            self.assertEqual(report['jobs'], {'pending': 1})
            self.assertEqual((pathlib.Path(directory) / 'suppliers.jsonl').stat().st_mode & 0o777, 0o600)

    def test_export_only_does_not_add_a_new_index_job_to_a_category_pilot(self):
        with tempfile.TemporaryDirectory() as directory:
            path = pathlib.Path(directory)
            db = crawl.Queue(path / 'queue.sqlite')
            db.add(crawl.ORIGIN + '/categories/12/a.html', 'category')
            db.close()
            args = types.SimpleNamespace(output=directory, start=crawl.ORIGIN + '/findex', export_only=True)
            result = asyncio.run(crawl.run(args))
            self.assertEqual(result['jobs'], {'pending': 1})

    def test_current_listing_markup_scopes_contacts_and_extracts_profile_and_gallery(self):
        html = '''<header><a href="tel:9999999999">Platform</a></header>
        <script type="application/ld+json">{"@type":"Organization","name":"Công ty mẫu","telephone":"9999999999","email":"platform@example.invalid"}</script>
        <div class="listing_trai"><div class="tvxl-hero"><div class="tvxl-logo"><img src="https://logo.trangvangvietnam.com/company.gif"></div>
        <div class="tvxl-main"><h1>Công ty mẫu</h1><div class="tvxl-row"><i class="fa-location-dot"></i><div>Đường mẫu, <span>Hà Nội</span>, Việt Nam</div></div>
        <div class="tvxl-row"><i class="fa-map-location-dot"></i><div><b>Chi nhánh:</b> Chi nhánh mẫu<br><b>Địa chỉ theo MST:</b> Trụ sở mẫu</div></div>
        <a href="tel:0000000000">Gọi</a><div class="tvxl-acts"><a class="tvxl-act" href="https://supplier.example.invalid">Website</a></div></div></div>
        <div class="tvxb-fact"><div class="k">Loại hình kinh doanh</div><div class="v">Sản xuất</div></div>
        <div class="tvxb-fact"><div class="k">Thị trường chính</div><div class="v">Toàn quốc</div></div>
        <div class="tvxb-fact"><div class="k">Khách hàng chính</div><div class="v">Nhà máy</div></div>
        <div id="section1"><h2>Giới thiệu công ty</h2><div class="gioithieucongty_img">Mô tả năng lực thực tế</div></div>
        <div id="section3"><img><div class="tvxg-img"><img src="https://pic.trangvangvietnam.com/company/photo.jpg" alt="Sản phẩm"></div></div>
        <div id="section4"><div class="tvxf-r"><div class="tvxf-k">Mã số thuế</div><div class="tvxf-v">0100000000</div></div>
        <div class="tvxf-r"><div class="tvxf-k">Năm thành lập</div><div class="tvxf-v">2017</div></div>
        <div class="tvxf-r"><div class="tvxf-k">Số lượng nhân viên</div><div class="tvxf-v">11–50</div></div></div></div>
        <div class="listing_phai"><div class="tvxc"><a href="tel:0000000001">Miền Nam</a><a href="mailto:sample@example.invalid">Email</a></div>
        <div class="tvx-reg"><a href="tel:9999999998">Platform sales</a></div></div>
        <div class="tvx-foot"><a href="mailto:platform@example.invalid">Platform footer</a></div>'''
        row = crawl.parse_page(crawl.ORIGIN + '/listings/123456789/a.html', html)['supplier']
        self.assertEqual(row['phones'], ['0000000000', '0000000001'])
        self.assertEqual(row['emails'], ['sample@example.invalid'])
        self.assertEqual(row['websites'], ['https://supplier.example.invalid'])
        self.assertEqual(row['images'], ['https://pic.trangvangvietnam.com/company/photo.jpg'])
        self.assertEqual(row['logo'], 'https://logo.trangvangvietnam.com/company.gif')
        self.assertIn('Đường mẫu', row['address'])
        self.assertEqual(row['province'], 'Hà Nội')
        self.assertEqual(row['taxCode'], '0100000000')
        self.assertEqual(row['establishedYear'], '2017')
        self.assertEqual(row['employees'], '11–50')
        self.assertEqual(row['businessType'], 'Sản xuất')
        self.assertEqual(row['mainMarkets'], 'Toàn quốc')
        self.assertEqual(row['mainCustomers'], 'Nhà máy')
        self.assertEqual(row['description'], 'Mô tả năng lực thực tế')
        self.assertIn('Chi nhánh mẫu', row['branches'])


if __name__ == '__main__':
    unittest.main()
