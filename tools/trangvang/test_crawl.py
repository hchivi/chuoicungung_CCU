import importlib.util
import pathlib
import tempfile
import unittest

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


if __name__ == '__main__':
    unittest.main()
