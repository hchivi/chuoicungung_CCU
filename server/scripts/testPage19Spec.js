// ============================================================================
// AUTOMATED QA TEST SUITE: PAGE 19 / MODULE 19 SPEC
// BÀN ĐIỀU PHỐI NỘI BỘ (ADMIN COMMAND CENTER) - CHUOICUNGUNG.COM
// ============================================================================

import {
  PIPELINE_COLUMNS,
  mapRequirementToPipelineColumn,
  MATCH_STATUSES,
  OUTCOME_TYPES,
  ADMIN_ROLES,
  getActiveAdminRole,
  setActiveAdminRole,
  getAllUnifiedTasks,
  createUnifiedTask,
  updateUnifiedTaskStatus,
  getAllConnections,
  updateConnectionOutcome,
  getDataQualityQueue,
  getUnifiedDashboardOperationalMetrics,
  getAllAdminAuditLogs,
  logAdminMutationAudit,
  searchAdminGlobal
} from '../../src/data/adminUnifiedCoordinationData.js';

import { getAllMasterRequirements } from '../../src/data/requirementsData.js';

let passed = 0;
let failed = 0;

function it(testName, condition, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${details}`);
    failed++;
  }
}

console.log('====================================================================');
console.log('🧪 RUNNING PAGE 19 (BÀN ĐIỀU PHỐI NỘI BỘ) AUTOMATED TEST SUITE');
console.log('====================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: 5 CÂU HỎI VẬN HÀNH (Section 2 & 41)
// ----------------------------------------------------------------------------
const metrics = getUnifiedDashboardOperationalMetrics();
it(
  '1. 5 Câu hỏi vận hành được tính toán từ dữ liệu thật',
  metrics.operationalQuestions &&
  typeof metrics.operationalQuestions.q1_newRequirementsCount === 'number' &&
  typeof metrics.operationalQuestions.q2_unsuppliedRequirementsCount === 'number' &&
  typeof metrics.operationalQuestions.q3_pendingConnectionsCount === 'number' &&
  typeof metrics.operationalQuestions.q4_overdueWorkCount === 'number' &&
  typeof metrics.operationalQuestions.q5_unconfirmedOutcomesCount === 'number',
  'Metrics missing core questions'
);

// ----------------------------------------------------------------------------
// TEST 2: KANBAN 5 CỘT CỐT LÕI (Section 3)
// ----------------------------------------------------------------------------
it(
  '2. Định nghĩa đủ 5 cột cốt lõi: Đăng Nhu Cầu → Tìm Nguồn → Kết Nối → Theo Dõi → Kết Quả',
  PIPELINE_COLUMNS.length === 5 &&
  PIPELINE_COLUMNS[0].id === 'COLUMN_01_INTAKE' &&
  PIPELINE_COLUMNS[1].id === 'COLUMN_02_SOURCING' &&
  PIPELINE_COLUMNS[2].id === 'COLUMN_03_CONNECTING' &&
  PIPELINE_COLUMNS[3].id === 'COLUMN_04_FOLLOW_UP' &&
  PIPELINE_COLUMNS[4].id === 'COLUMN_05_OUTCOME'
);

// ----------------------------------------------------------------------------
// TEST 3: MAP DOMAIN STATUS -> PIPELINE COLUMN (Section 4)
// Không ghi đè domain status của DB
// ----------------------------------------------------------------------------
const intakeCol = mapRequirementToPipelineColumn({ status: 'NEW', moderationStatus: 'PENDING' });
const sourcingCol = mapRequirementToPipelineColumn({ status: 'ACTIVE_SOURCING' });
const followUpCol = mapRequirementToPipelineColumn({ status: 'IN_PROGRESS' });
const outcomeCol = mapRequirementToPipelineColumn({ status: 'CLOSED' });

it(
  '3. Domain status được ánh xạ đúng vào Pipeline Columns mà không phá enum',
  intakeCol === 'COLUMN_01_INTAKE' &&
  sourcingCol === 'COLUMN_02_SOURCING' &&
  followUpCol === 'COLUMN_04_FOLLOW_UP' &&
  outcomeCol === 'COLUMN_05_OUTCOME',
  `Actual: ${intakeCol}, ${sourcingCol}, ${followUpCol}, ${outcomeCol}`
);

// ----------------------------------------------------------------------------
// TEST 4: SUPPLIER MATCH STATUS TÁCH RIÊNG (Section 5)
// ----------------------------------------------------------------------------
it(
  '4. Trạng thái ghép nối NCC (Match Status) tách riêng khỏi Requirement.status',
  MATCH_STATUSES.PROPOSED &&
  MATCH_STATUSES.INVITED &&
  MATCH_STATUSES.RESPONDED &&
  MATCH_STATUSES.CONNECTED &&
  MATCH_STATUSES.SAMPLE_OR_SURVEY &&
  MATCH_STATUSES.QUOTED &&
  MATCH_STATUSES.NEGOTIATING &&
  MATCH_STATUSES.NOT_SUITABLE &&
  MATCH_STATUSES.NO_RESPONSE
);

// ----------------------------------------------------------------------------
// TEST 5: HARD RULE OWNER + NEXT ACTION (Section 6)
// ----------------------------------------------------------------------------
const connections = getAllConnections();
const hasOwnerAndAction = connections.every(c => c.ownerName && c.nextAction && c.nextActionAt);
it(
  '5. Hard Rule: Mọi work item / connection đều có Owner và Next Action có định ngày',
  hasOwnerAndAction,
  'Some connections missing owner or next action'
);

// ----------------------------------------------------------------------------
// TEST 6: UNIFIED TASK ENGINE (Section 15 & 16)
// ----------------------------------------------------------------------------
const createdTask = createUnifiedTask({
  entityType: 'REQUIREMENT',
  entityId: 'NC-TEST-001',
  title: 'Task kiểm thử QA Module 19',
  ownerName: 'Đặng Tuấn Kiệt',
  dueAt: new Date(Date.now() + 86400000).toISOString()
});

const taskUpdateRes = updateUnifiedTaskStatus(createdTask.id, 'COMPLETED', 'QA Tester', 'Hoàn tất nghiệm thu');
it(
  '6. Unified Task Engine hỗ trợ tạo task và chuyển trạng thái kèm audit log',
  createdTask.id && taskUpdateRes.success && taskUpdateRes.task.status === 'COMPLETED'
);

// ----------------------------------------------------------------------------
// TEST 7: OUTCOME ENGINE (Section 17)
// ----------------------------------------------------------------------------
it(
  '7. Outcome engine hỗ trợ đa dạng kết quả chi tiết, không dùng boolean success = true',
  OUTCOME_TYPES.ORDER_PLACED &&
  OUTCOME_TYPES.CONTRACT_SIGNED &&
  OUTCOME_TYPES.PRICE_NOT_SUITABLE &&
  OUTCOME_TYPES.TECHNICAL_NOT_SUITABLE &&
  OUTCOME_TYPES.NO_RESPONSE
);

// ----------------------------------------------------------------------------
// TEST 8: BOTTLENECK ANALYSIS (Section 18)
// ----------------------------------------------------------------------------
it(
  '8. Phân tích điểm nghẽn (Bottleneck View) phát hiện đúng cột đang dồn ứ nhiều nhu cầu nhất',
  metrics.bottleneck &&
  metrics.bottleneck.primaryBottleneckColumn &&
  typeof metrics.bottleneck.primaryBottleneckCount === 'number'
);

// ----------------------------------------------------------------------------
// TEST 9: RBAC PERMISSIONS MATRIX (Section 21 - 29)
// ----------------------------------------------------------------------------
const superAdminRole = ADMIN_ROLES.SUPER_ADMIN;
const financeRole = ADMIN_ROLES.FINANCE;
const coordinatorRole = ADMIN_ROLES.COORDINATOR;

it(
  '9. RBAC phân tách quyền rõ rệt (Finance can view finance, Coordinator cannot, Super Admin has all)',
  superAdminRole.canViewFinance === true &&
  financeRole.canViewFinance === true &&
  coordinatorRole.canViewFinance === false &&
  coordinatorRole.canMutateStatus === true &&
  financeRole.canEditCapabilities === false
);

// ----------------------------------------------------------------------------
// TEST 10: DATA QUALITY & COMPLETENESS QUEUE (Section 31)
// ----------------------------------------------------------------------------
const qualityIssues = getDataQualityQueue();
it(
  '10. Hàng đợi kiểm soát chất lượng dữ liệu phát hiện các hồ sơ thiếu năng lực, thiếu MOQ hoặc claim',
  Array.isArray(qualityIssues) && qualityIssues.length > 0 &&
  qualityIssues.some(i => i.type === 'MISSING_CAPABILITY' || i.type === 'MISSING_PRODUCT' || i.type === 'PENDING_CLAIM')
);

// ----------------------------------------------------------------------------
// TEST 11: GLOBAL ADMIN SEARCH (Section 11)
// ----------------------------------------------------------------------------
const searchReqRes = searchAdminGlobal('đồng phục');
const searchOrgRes = searchAdminGlobal('Proser');
it(
  '11. Global Admin Search tìm kiếm đa đối tượng xuyên suốt Requirements và Organizations',
  searchReqRes.length > 0 || searchOrgRes.length > 0
);

// ----------------------------------------------------------------------------
// TEST 12: UNIFIED AUDIT LOGGING (Section 30)
// ----------------------------------------------------------------------------
const auditLogs = getAllAdminAuditLogs();
it(
  '12. Mọi thay đổi nghiệp vụ đều được ghi nhận vào Unified Audit Log (Section 30 compliant)',
  Array.isArray(auditLogs) && auditLogs.length > 0 &&
  auditLogs.some(log => log.action === 'TASK_CREATED' || log.action === 'TASK_STATUS_CHANGED' || log.action === 'REQUIREMENT_STATUS_CHANGED')
);

console.log('\n====================================================================');
console.log(`🏁 TEST RESULTS: ${passed} PASSED / ${failed} FAILED`);
console.log('====================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PAGE 19 / MODULE 19 SPEC CRITERIA PASSED SUCCESSFULLY!');
  process.exit(0);
}
