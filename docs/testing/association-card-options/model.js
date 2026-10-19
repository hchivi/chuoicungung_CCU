import { getAssociationsListing } from '../../../src/data/associationsData.js';
import { getProgramByIdOrSlug } from '../../../src/data/programsData.js';

export const LIVE_ORIGIN = 'http://localhost:3000';
export const OPTIONS = [
  { id: 'publication', letter: 'A', title: 'Bìa kỷ yếu', description: 'Nhận diện đậm, bố cục như một ấn phẩm tổ chức. Tên đầy đủ được ưu tiên, chương trình là điểm đọc tiếp theo.', rationale: 'Phù hợp khi muốn mỗi tổ chức có sức nặng và nhận diện riêng ngay từ cái nhìn đầu tiên.' },
  { id: 'folio', letter: 'B', title: 'Hồ sơ mở', description: 'Một hồ sơ hai trang: bản sắc tổ chức bên trái, chuyên môn và hoạt động bên phải. Đọc như một cuốn sổ đối tác.', rationale: 'Phù hợp khi muốn lãnh đạo đọc kỹ năng lực và phạm vi hợp tác trước khi mở hồ sơ.' },
  { id: 'signature', letter: 'C', title: 'Danh thiếp lãnh đạo', description: 'Thẻ cô đọng, tên tổ chức rõ và thông tin quan trọng nhìn thấy ngay. Bung phần kết nối khi cần.', rationale: 'Phù hợp với danh bạ nhiều tổ chức, ưu tiên quét nhanh và chủ động khám phá.' },
];

export const previewAssociations = [...new Map(getAssociationsListing().associations.map(a => [a.id, a])).values()].slice(0, 3);
const scopes = { NATIONAL: 'Toàn quốc', REGIONAL: 'Liên vùng', PROVINCIAL: 'Tỉnh / Thành phố', SPECIALIZED_INDUSTRY: 'Chuyên ngành' };

export function associationView(association) {
  const profile = association.profile || {};
  const recorded = profile.id && profile.id !== `ASSOC-PROF-${association.id}`;
  return {
    ...association,
    shortName: profile.shortName?.length <= 18 ? profile.shortName : '',
    scope: scopes[profile.scopeType] || 'Xem phạm vi trong hồ sơ',
    geography: profile.geographicScope?.join(', ') || association.province || 'Xem địa bàn trong hồ sơ',
    industries: profile.industryScope || association.capabilities || [],
    description: profile.scopeDescription || association.description || '',
    members: recorded && profile.confirmedMembersCount > 0 ? profile.confirmedMembersCount : null,
    year: recorded ? profile.establishedYear : null,
    hasCatalogue: Boolean(profile.hasCatalogue),
    profileUrl: `${LIVE_ORIGIN}/hiep-hoi/${association.id}`,
    programs: (association.activePrograms || []).map(program => {
      const record = getProgramByIdOrSlug(program.programSlug) || getProgramByIdOrSlug(program.programId);
      return { ...program, href: record && record.publishable !== false ? `${LIVE_ORIGIN}/chuong-trinh/${record.slug || record.id}` : null };
    }),
  };
}
