/**
 * Scaffolding & Idempotent Backfill Script for Canonical Organizations
 * Standardized according to codex_fixed.txt Section V.
 *
 * Usage:
 *   node server/scripts/backfillOrganizations.js --dry-run
 *   CONFIRM_MIGRATE=1 node server/scripts/backfillOrganizations.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Enterprise from '../models/Enterprise.js';
import Organization from '../models/Organization.js';

dotenv.config();

const isDryRun = process.argv.includes('--dry-run');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function run() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ CẤM chạy script migration trên môi trường production!');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chuoicungung';
  console.log(`Connecting to MongoDB for Organization Backfill...`);
  await mongoose.connect(mongoUri);

  console.log(`\n--- ORGANIZATION BACKFILL SCAFFOLDING ---`);
  console.log(`Chế độ: ${isDryRun ? 'DRY-RUN (chỉ kiểm tra & báo cáo, không ghi vào DB)' : 'THỰC THI (áp dụng vào DB)'}`);

  const enterprises = await Enterprise.find({}).limit(500).lean();
  console.log(`Số lượng Enterprises tìm thấy để khảo sát: ${enterprises.length}`);

  let createdCount = 0;
  let linkedCount = 0;
  let conflictCount = 0;
  const slugTracker = new Set();

  for (const ent of enterprises) {
    const rawName = ent.name || ent.tenDoanhNghiep || 'Doanh Nghiệp Chưa Đặt Tên';
    const canonicalSlug = slugify(ent.slug || rawName);

    if (slugTracker.has(canonicalSlug)) {
      conflictCount += 1;
      console.warn(`[Conflict] Trùng slug phát hiện: '${canonicalSlug}' cho doanh nghiệp id: ${ent.id}`);
      continue;
    }
    slugTracker.add(canonicalSlug);

    const orgId = `ORG-${ent.id || Math.random().toString(36).substring(2, 9)}`;
    const roles = ['SUPPLIER'];
    if (ent.role?.includes('Nhà máy') || ent.isFactory) roles.push('FACTORY');

    if (!isDryRun) {
      if (process.env.CONFIRM_MIGRATE !== '1') {
        console.error('❌ Yêu cầu biến CONFIRM_MIGRATE=1 để thực thi ghi vào database.');
        await mongoose.disconnect();
        process.exit(1);
      }

      await Organization.findOneAndUpdate(
        { id: orgId },
        {
          $setOnInsert: {
            id: orgId,
            name: rawName,
            normalized_name: rawName.trim().toLowerCase(),
            tax_code: ent.taxCode || null,
            roles,
            canonical_slug: canonicalSlug,
            status: 'PUBLISHED',
            verification_status: ent.verified ? 'VERIFIED' : 'UNVERIFIED',
            is_sponsored: false
          }
        },
        { upsert: true, new: true }
      );

      await Enterprise.updateOne({ _id: ent._id }, { $set: { organization_id: orgId } });
      linkedCount += 1;
    } else {
      createdCount += 1;
    }
  }

  console.log(`\n--- BÁO CÁO KẾT QUẢ BACKFILL ---`);
  console.log(`• Tổng số xử lý: ${enterprises.length}`);
  console.log(`• Sẽ tạo Organization: ${isDryRun ? createdCount : linkedCount}`);
  console.log(`• Số xung đột slug phát hiện: ${conflictCount}`);
  console.log(`• Trạng thái: ${isDryRun ? 'DRY-RUN THÀNH CÔNG (0 dữ liệu thay đổi)' : 'THỰC THI HOÀN TẤT'}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('Lỗi khi backfill:', err);
  process.exit(1);
});
