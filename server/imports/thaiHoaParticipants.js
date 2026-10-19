import { createHash } from 'node:crypto';

export const DIRECTORY_SOURCE_ID = '1TwLGGOaPU2Yq7nKzDKyeq3Pm5GKX-Upw';
const groups = {
  'Group A': 'Tìm nguồn cung nội khu',
  'Group B': 'Mua chung',
  'Group C': 'Dịch vụ kỹ thuật & chuyên môn',
  'Group D': 'Vận hành & hạ tầng dùng chung',
};
const organizations = new Set(['THIP Members', 'TeamKCN Members', 'GEM Members']);
const text = value => typeof value === 'string' ? value.trim() : '';

// Import business fields only. THIP tenants are grouped as Buyers; the
// TeamKCN/GEM network as Suppliers. This is not a verified individual RFQ.
export function buildDirectoryParticipants(rows, programId) {
  const companies = new Map();
  for (const row of rows) {
    const name = text(row.company);
    if (!name) continue;
    if (!organizations.has(row.org)) throw new Error('Unknown directory organization');
    if (!groups[row.groupCode]) throw new Error('Unknown connection group');
    const key = `${row.org}|${name.normalize('NFC').toLocaleLowerCase('vi')}`;
    if (!companies.has(key)) companies.set(key, {
      id: `thaihoa-directory-${createHash('sha256').update(key).digest('hex').slice(0, 20)}`,
      programId, name, role: row.org === 'THIP Members' ? 'BUYER' : 'SUPPLIER',
      industry: text(row.field), organization: row.org,
      visibility: 'PUBLIC', publishStatus: 'PUBLISHED', status: 'CONFIRMED',
      logo: '', productsServices: [], connectionGroups: [], sourceId: DIRECTORY_SOURCE_ID,
    });
    const company = companies.get(key);
    if (!company.connectionGroups.includes(groups[row.groupCode])) company.connectionGroups.push(groups[row.groupCode]);
  }
  return [...companies.values()].map(company => ({ ...company, publicSummary: `Mục tiêu kết nối: ${company.connectionGroups.join('; ')}.` }));
}

export function mergeDirectoryParticipants(program, incoming) {
  const existing = program.participants || program.workflowContent?.participants || [];
  const merged = new Map(existing.map(p => [p.id, p]));
  for (const participant of incoming) {
    const previous = merged.get(participant.id);
    // Reimports must not undo moderation or erase an enriched business profile.
    merged.set(participant.id, previous ? { ...participant, ...previous } : participant);
  }
  return { ...program, participants: [...merged.values()] };
}
