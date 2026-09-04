import json
import unicodedata
import re
import os

with open('src/data/categoriesAlphabetical.json', 'r', encoding='utf-8') as f:
    cats = json.load(f)

def clean_str(s):
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = s.lower().replace('đ', 'd').replace('Đ', 'd')
    return s.strip()

def slugify(s):
    clean = clean_str(s)
    clean = re.sub(r'[^a-z0-9\s-]', '', clean)
    clean = re.sub(r'\s+', '-', clean).strip('-')
    return clean

# Rich 45+ Industrial Image Domains
IMAGE_DATABASE = {
    # 1. Sensors & Measurement
    'sensors': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85',
    
    # 2. Backpacks & Travel Bags
    'travel_backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=85',
    'promotional_bags': 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=1400&q=85',
    
    # 3. Rainwear & Umbrellas
    'rainwear': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=85',
    
    # 4. Apparel & Uniforms
    'uniforms': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1400&q=85',
    'textile_sewing': 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=1400&q=85',
    
    # 5. PPE & Safety
    'safety_ppe': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85',
    
    # 6. Packaging, Carton, Printing
    'packaging': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1400&q=85',
    'printing': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=85',
    
    # 7. CNC & Precision Machining
    'cnc_machining': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85',
    'metal_fabrication': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=85',
    'bearings_mechanical': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1400&q=85',
    
    # 8. Electrical, MEP, Substation
    'substation_power': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=85',
    'electronics_pcb': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85',
    'fire_protection': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1400&q=85',
    
    # 9. Warehouse, Logistics, Forklift
    'warehouse_logistics': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85',
    
    # 10. Construction & Steel
    'steel_construction': 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1400&q=85',
    
    # 11. Cleanroom, Epoxy, Chemicals
    'cleanroom_epoxy': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1400&q=85',
    'chemicals_lab': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=85',
    'plastics_polymers': 'https://images.unsplash.com/photo-1585336261026-41ff346399c5?auto=format&fit=crop&w=1400&q=85',
    
    # 12. Food & Catering
    'catering_food': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85',
    'coffee_agriculture': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=85',
    
    # 13. Automation & Solar
    'robotics_automation': 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1400&q=85',
    'solar_energy': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1400&q=85',
    
    # 14. Industrial Real Estate
    'industrial_park': 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=1400&q=85',
    
    # 15. HR & Training
    'workforce_hr': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85',
    
    # 16. Furniture & Wood
    'wood_furniture': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1400&q=85',
    
    # 17. Pumps & Piping
    'pumps_piping': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1400&q=85',
    'boiler_pressure': 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1400&q=85',
    
    # 18. Environment & Wastewater
    'wastewater_env': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85',
    
    # 19. Audio, Visual, Stage
    'audio_visual': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1400&q=85',
    
    # 20. Security & CCTV
    'security_cctv': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1400&q=85',
    
    # 21. Medical & Pharma
    'medical_pharma': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=85',
    
    # 22. Automotive & Vehicles
    'automotive': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1400&q=85',
    
    # 23. IT & Software
    'software_it': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85',
    
    # 24. Beauty & Cosmetics
    'beauty_cosmetics': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=85',
    
    # 25. Gifts & Promotions
    'gifts_promo': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=85',
    
    # 26. Marine & Water Safety
    'marine_safety': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85',
    
    # 27. Paper, Books, Office
    'paper_books': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=85',

    # Default
    'default_factory': '/images/supplier_b2b_hero.jpg'
}

RULES = [
    # Cảm biến, Đo lưu lượng, Thiết bị đo, Áp kế, Nhiệt kế
    (r'cam\s*bien|do\s*luu\s*luong|dong\s*ho\s*do|thiet\s*bi\s*do|ap\s*ke|nhiet\s*ke|can\s*dien\s*tu|luu\s*luong|do\s*luong|thi\s*nghiem|do\s*dac|trac\s*dia|ban\s*do|thi\s*nghiem', IMAGE_DATABASE['sensors']),
    
    # Ba Lô Du Lịch, Vali, Túi Du Lịch
    (r'ba\s*lo.*du\s*lich|du\s*lich.*ba\s*lo|balo.*du\s*lich|tui.*du\s*lich|du\s*lich|vali|hanh\s*ly|phuot|camping|da\s*ngoai', IMAGE_DATABASE['travel_backpack']),
    
    # Balo Quảng Cáo, Balo Quà Tặng, Cặp Học Sinh, May Balo, Túi Canvas
    (r'ba\s*lo|balo|cap\s*sach|cap\s*hoc\s*sinh|gio\s*xach|tui\s*xach|tui\s*vai|tui\s*canvas|tui\s*tote|may\s*balo|bop|vi\s*da', IMAGE_DATABASE['promotional_bags']),
    
    # Áo Mưa, Ô Dù, Bạt Che
    (r'ao\s*mua|bat\s*che|du\s*che|o\s*du|mai\s*che|mai\s*hien|che\s*nang', IMAGE_DATABASE['rainwear']),
    
    # Đồng Phục, May Mặc, Thời Trang, Áo Thun, Vải, Dệt May
    (r'dong\s*phuc|ao\s*thun|may\s*mac|quan\s*ao|vai|det\s*may|theu|in\s*ao|thoi\s*trang|ao\s*so\s*mi|ao\s*khoac|ao\s*gio|ao\s*choang|ao\s*phong|ao\s*gile|dam|vay|det|soi|chi\s*may|phu\s*lieu\s*may', IMAGE_DATABASE['uniforms']),
    
    # Bảo Hộ Lao Động, Giày, Mũ, Kính, Găng Tay
    (r'bao\s*ho|ppe|giay\s*bao\s*ho|mu\s*bao\s*ho|gang\s*tay|ao\s*phan\s*quang|khau\s*trang|kinh\s*bao\s*ho|ung\s*cach\s*dien|ung\s*loi|nut\s*tai|day\s*an\s*toan|thiet\s*bi\s*bao\s*ho', IMAGE_DATABASE['safety_ppe']),
    
    # Bảng Mạch In, Linh Kiện Điện Tử, Vi Mạch
    (r'bang\s*mach|pcb|vi\s*mach|chip|linh\s*kien\s*dien\s*tu|dien\s*tu|ic\b', IMAGE_DATABASE['electronics_pcb']),

    # Bạc Đạn, Vòng Bi, Ốc Vít, Cơ Khí
    (r'bac\s*dan|vong\s*bi|goi\s*do|khop\s*noi|truc\s*vit|banh\s*rang|xich|sen\s*xich', IMAGE_DATABASE['bearings_mechanical']),
    
    # Bao Bì, Thùng Carton, Hộp Giấy, In Ấn, Tem Nhãn
    (r'bao\s*bi|carton|thung\s*carton|hop\s*giay|in\s*an|khuyen\s*mai|qua\s*tang|tui\s*giay|decal|tem\s*nhan|mang\s*pe|bang\s*keo|hop\s*qua|nhan\s*mac|in\s*lua|in\s*offset|in\s*ky\s*thuat\s*so', IMAGE_DATABASE['packaging']),
    
    # Robot AGV, Tự Động Hóa, Solar
    (r'robot|agv|tu\s*dong\s*hoa|dien\s*mat\s*troi|solar|iot|scada|mes|erp|chuyen\s*doi\s*so|ai|lap\s*trinh|tu\s*dong', IMAGE_DATABASE['robotics_automation']),
    
    # Xe Nâng, Kho Bãi, Logistics, Băng Tải, Cảng
    (r'xe\s*nang|kho\s*bai|logistics|van\s*tai|giao\s*nhan|bang\s*tai|pallet|cang|xuat\s*nhap\s*khau|giao\s*hang|hai\s*quan|pa\s*lang|cau\s*truc|van\s*chuyen|chuyen\s*phat|baga|gia\s*xe\s*cho\s*hang', IMAGE_DATABASE['warehouse_logistics']),
    
    # Sơn Sàn Epoxy, Phòng Sạch, Hóa Chất, Bột Giặt, Zeolit
    (r'son\s*san|epoxy|phong\s*sach|cleanroom|vach\s*panel|hoa\s*chat|nhua|hat\s*nhua|keo|dung\s*moi|xa\s*bong|bot\s*giat|zeolit|son|tay\s*rua|chat\s*tay|phu\s*gia', IMAGE_DATABASE['cleanroom_epoxy']),
    
    # Nhựa, Ca Nhựa, Bình Nhựa, Cao Su, Foam
    (r'ca\s*nhua|coc\s*nhua|binh\s*nhua|ep\s*nhua|nhua\s*dinh\s*hinh|cao\s*su|foam|eva|ong\s*nhua|mang\s*nhua|tam\s*nhua|nhua', IMAGE_DATABASE['plastics_polymers']),
    
    # CNC, Cơ Khí, Khuôn Mẫu, Cắt Laser
    (r'cnc|phay|tien|khuon\s*mau|cat\s*laser|dot\s*dap|co\s*khi|bu\s*long|oc\s*vit|gia\s*cong\s*co\s*khi|dao\s*phay|luoi\s*cua|khuon|ban\s*thao\s*tac|ban\s*lap\s*rap', IMAGE_DATABASE['cnc_machining']),
    
    # Hàn, Mạ Crom, Thép, Inox, Nhôm, Anode
    (r'(\bhan\b|han\s*xi|may\s*han)|kim\s*loai|thep|nhom|dong|inox|anode|anodiz|ma\s*crom|ma\s*dong|xi\s*ma|\bsat\s*thep\b|luyen\s*kim|xa\s*go|ton|ong\s*thep|thep\s*tam|thep\s*hinh', IMAGE_DATABASE['metal_fabrication']),
    
    # Lò Hơi, Áp Lực, Thiết Bị Áp Lực, Bàn Là Hơi
    (r'lo\s*hoi|ap\s*luc|noi\s*hoi|ban\s*la|ban\s*ui|khi\s*nen', IMAGE_DATABASE['boiler_pressure']),

    # Trạm Biến Áp, Tủ Điện PLC, MEP, PCCC, HVAC
    (r'co\s*dien|mep|tram\s*bien\s*ap|dien|tu\s*dien|plc|pccc|phong\s*chay|hvac|dieu\s*hoa|thong\s*gio|chieu\s*sang|may\s*phat\s*dien|day\s*dien|cap\s*dien|thiet\s*bi\s*dien|den\s*led|bong\s*den', IMAGE_DATABASE['substation_power']),
    
    # Xây Dựng, Nhà Thép, Bê Tông, Gạch 3D, Đá
    (r'xay\s*dung|nha\s*xuong|nha\s*thep|tien\s*che|ket\s*cau\s*thep|ep\s*coc|be\s*tong|vlxd|san\s*go|gach|ximang|da\s*cuoi|khai\s*thac\s*da|kien\s*truc|quy\s*hoach|giam\s*sat|ep\s*coc|mong', IMAGE_DATABASE['steel_construction']),
    
    # Cà Phê, Nông Sản, Trà
    (r'ca\s*phe|may\s*moc.*ca\s*phe|che\s*bien\s*ca\s*phe|tra|nong\s*san|che\s*bien\s*che|hat\s*dieu|tieu|lua\s*gao|gao', IMAGE_DATABASE['coffee_agriculture']),
    
    # Suất Ăn, Thực Phẩm, Bánh Kẹo, Kem Ăn, Hải Sản
    (r'suat\s*an|cang\s*tin|thuc\s*pham|am\s*thuc|bua\s*an|bep\s*an|nau\s*an|banh\s*keo|kem\s*an|hai\s*san|thit|rau|cu|qua|nuoc\s*ngot|bia|ruou|gia\s*vi', IMAGE_DATABASE['catering_food']),
    
    # Gỗ, Nội Thất, Bảng Viết, Vách Ngăn, Rèm
    (r'go|noi\s*that|ban\s*ghe|composite|sofa|giuong|tu|van\s*ep|vach\s*ngan|rem\s*cuon|lam\s*che\s*nang|cua|go\s*tu\s*nhien|go\s*cong\s*nghiep|san\s*nhua|tham|bang\s*viet|bang\s*kinh|bang\s*lich|bang\s*don', IMAGE_DATABASE['wood_furniture']),
    
    # Âm Thanh, Ánh Sáng, Amply, Karaoke, Radio, Ăng Ten
    (r'amply|am\s*thanh|anh\s*sang|san\s*khau|karaoke|radio|loa|micro|tai\s*nghe|ang\s*ten', IMAGE_DATABASE['audio_visual']),
    
    # An Ninh, Camera, An Toàn Giao Thông
    (r'an\s*ninh|an\s*toan|camera|giam\s*sat|giao\s*thong|bien\s*bao|khoa\s*cua|kiem\s*soat\s*ra\s*vao', IMAGE_DATABASE['security_cctv']),
    
    # Sách, Xuất Bản, Album Ảnh, In 3D, Văn Phòng Phẩm
    (r'sach|nha\s*xuat\s*ban|album|in\s*3d|nha\s*sach|van\s*phong\s*pham|tap\s*vo|but|giay\s*in', IMAGE_DATABASE['paper_books']),
    
    # Y Tế, Bệnh Viện, Dụng Cụ Y Khoa
    (r'y\s*te|benh\s*vien|y\s*khoa|dung\s*cu\s*y\s*te|duoc\s*pham|thuoc|phong\s*kham|nha\s*khoa|y\s*duoc', IMAGE_DATABASE['medical_pharma']),
    
    # Da, Bọc Vô Lăng, Áo Da
    (r'(\bda\b|gia\s*da)|da\s*boc|boc\s*vo\s*lang|ao\s*da|nem|boc\s*ghe|nem\s*xe|ao\s*ghe', IMAGE_DATABASE['leather_goods_upholstery'] if 'leather_goods_upholstery' in IMAGE_DATABASE else IMAGE_DATABASE['travel_backpack']),
    
    # Website, Phần Mềm
    (r'website|trang\s*web|phan\s*mem|it|cntt|may\s*tinh|may\s*chu|server|hosting|ten\s*mien', IMAGE_DATABASE['software_it']),
    
    # Làm Đẹp, Móng, Mi, Kềm
    (r'lam\s*dep|mong|mi|kem\s*nghia|my\s*pham|spa|tham\s*my|toc|cham\s*soc\s*da', IMAGE_DATABASE['beauty_cosmetics']),
    
    # Quà Tặng, Hoa
    (r'qua\s*tang|dien\s*hoa|hoa\s*tuoi|cup|ky\s*niem\s*chuong|bieu\s*trung|qua\s*luu\s*niem', IMAGE_DATABASE['gifts_promo']),
    
    # Phao Cứu Sinh, Áo Phao, Sông Nước
    (r'phao|ao\s*phao|song\s*nuoc|hang\s*hai|thuyen|cano|tau\s*thuy', IMAGE_DATABASE['marine_safety']),
    
    # Bơm, Van, Thủy Lực, Khí Nén
    (r'bom|van|duong\s*ong|thuy\s*luc|khi\s*nen|may\s*nen\s*khi|ong\s*dan|phu\s*tung\s*may', IMAGE_DATABASE['pumps_piping']),
    
    # Nước Thải, Khí Thải, Môi Trường
    (r'nuoc\s*thai|khi\s*thai|moi\s*truong|quan\s*trac|be\s*xu\s*ly|loc\s*bui|hut\s*bui|xu\s*ly\s*chat\s*thai', IMAGE_DATABASE['wastewater_env']),
    
    # Ô tô, Xe máy, Phụ tùng xe
    (r'o\s*to|xe\s*may|xe\s*tai|phu\s*tung\s*xe|lop\s*xe|sam\s*xe|ac\s*quy|gara|rua\s*xe', IMAGE_DATABASE['automotive']),
]

category_images_map = {}

for letter, items in cats.items():
    for item in items:
        name = item['name']
        clean = clean_str(name)
        s = slugify(name)
        
        matched_url = IMAGE_DATABASE['default_factory']
        for pattern, url in RULES:
            if re.search(pattern, clean):
                matched_url = url
                break
        
        category_images_map[name] = matched_url
        category_images_map[s] = matched_url

# Write out map to src/data/categoryImagesMap.json
os.makedirs('src/data', exist_ok=True)
with open('src/data/categoryImagesMap.json', 'w', encoding='utf-8') as out_f:
    json.dump(category_images_map, out_f, ensure_ascii=False, indent=2)

print(f"SUCCESS: Generated src/data/categoryImagesMap.json with {len(category_images_map)} keys!")
