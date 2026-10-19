#!/usr/bin/env python3
import json
import csv
import re
import os
import sys

BASE_URL = "https://chuoicungung.com"

def mask_url(url, base_url=BASE_URL):
    if not url or not isinstance(url, str):
        return url or ""
    # Regex match https://products.trangvangvietnam.com/... or pic / logo / img
    pattern = r'^https?://(products|pic|logo|img)\.trangvangvietnam\.com/(.+)$'
    match = re.match(pattern, url.strip(), re.IGNORECASE)
    if match:
        subdomain = match.group(1).lower()
        path = match.group(2)
        return f"{base_url}/api/media/{subdomain}/{path}"
    return url

def mask_record(record, base_url=BASE_URL):
    rec = dict(record)
    if 'logo' in rec and rec['logo']:
        rec['logo'] = mask_url(rec['logo'], base_url)
    if 'images' in rec and isinstance(rec['images'], list):
        rec['images'] = [mask_url(u, base_url) for u in rec['images']]
    return rec

def process_and_export(input_jsonl, output_jsonl, output_csv, sample_limit=1000):
    total = 0
    masked_logos = 0
    masked_images = 0
    csv_rows = []

    headers = [
        'Tên doanh nghiệp', 'Địa chỉ', 'Tỉnh thành', 'Điện thoại', 'Mã số thuế',
        'Tên người phụ trách', 'Chức vụ', 'Nhóm sản phẩm dịch vụ', 'Từ khoá sản phẩm dịch vụ',
        'Email', 'Website', 'Logo (CCU Media Link)', 'Số lượng ảnh', 'Mẫu link ảnh sản phẩm (CCU Media Link)',
        'Năm thành lập', 'Loại hình kinh doanh'
    ]

    print(f"Bắt đầu chuyển đổi dữ liệu từ {input_jsonl}...")

    with open(input_jsonl, 'r', encoding='utf-8') as fin, \
         open(output_jsonl, 'w', encoding='utf-8') as fout:
        for line in fin:
            line = line.strip()
            if not line:
                continue
            total += 1
            try:
                data = json.loads(line)
                orig_logo = data.get('logo', '')
                orig_images = data.get('images', [])

                masked = mask_record(data)

                if orig_logo and 'trangvangvietnam' in orig_logo:
                    masked_logos += 1
                if orig_images and any('trangvangvietnam' in img for img in orig_images):
                    masked_images += 1

                fout.write(json.dumps(masked, ensure_ascii=False) + '\n')

                if len(csv_rows) < sample_limit:
                    contact = masked.get('contactPerson') or {}
                    phones = ', '.join(masked.get('phones') or [])
                    products = ' | '.join(masked.get('productGroups') or masked.get('products') or [])
                    keywords = ', '.join(masked.get('keywords') or [])
                    emails = ', '.join(masked.get('emails') or ([masked['email']] if masked.get('email') else []))
                    websites = ', '.join(masked.get('websites') or ([masked['website']] if masked.get('website') else []))
                    images = masked.get('images') or []
                    first_img = images[0] if images else ''

                    row = [
                        masked.get('name') or masked.get('companyName') or '',
                        masked.get('address', ''),
                        masked.get('province', ''),
                        phones,
                        masked.get('taxCode', ''),
                        contact.get('name', ''),
                        contact.get('role', ''),
                        products,
                        keywords,
                        emails,
                        websites,
                        masked.get('logo', ''),
                        len(images),
                        first_img,
                        masked.get('establishedYear', ''),
                        masked.get('businessType', '')
                    ]
                    csv_rows.append(row)

                if total % 20000 == 0:
                    print(f"Đã xử lý {total:,} doanh nghiệp...")
            except Exception as e:
                continue

    # Write CSV
    with open(output_csv, 'w', encoding='utf-8-sig', newline='') as fcsv:
        writer = csv.writer(fcsv)
        writer.writerow(headers)
        writer.writerows(csv_rows)

    print(f"✅ HOÀN TẤT!")
    print(f"  • Tổng số doanh nghiệp đã xử lý: {total:,}")
    print(f"  • File JSONL chuẩn hóa đã lưu tại: {output_jsonl}")
    print(f"  • File CSV xuất khẩu đã lưu tại: {output_csv}")

if __name__ == '__main__':
    input_path = '.supplier-data/browser-archive/pilot-484435/suppliers.jsonl'
    output_jsonl = '.supplier-data/browser-archive/pilot-484435/suppliers_ccu_media.jsonl'
    output_csv = 'DU_LIEU_1000_DOANH_NGHIEP_MOI_NHAT.csv'

    process_and_export(input_path, output_jsonl, output_csv, sample_limit=1000)
