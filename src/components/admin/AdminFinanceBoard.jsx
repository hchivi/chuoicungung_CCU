// ============================================================================
// ADMIN FINANCE & RECONCILIATION BOARD (BOARD 06)
// PAGE 19: BÀN ĐIỀU PHỐI NỘI BỘ (/admin/tai-chinh)
// Chuẩn hóa theo spec 19.txt (Section 7 Board 06, Section 27, 36) - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState } from 'react';
import {
  DollarSign, FileText, CheckCircle2, AlertTriangle, ShieldCheck,
  Building2, Calendar, Download, Lock, Check, Layers, TrendingUp
} from 'lucide-react';
import { getActiveAdminRole } from '../../data/adminUnifiedCoordinationData';
import { getAllFoundingPartnerships } from '../../data/foundingPartnershipData';
import { getAllServiceRequests } from '../../data/servicesData';

export default function AdminFinanceBoard() {
  const activeRole = getActiveAdminRole();
  const partnerships = getAllFoundingPartnerships();
  const serviceRequests = getAllServiceRequests ? getAllServiceRequests() : [];

  // Filter commercial contracts
  const foundingContracts = partnerships.filter(p => p.contract).map(p => ({
    id: p.contract.contractNumber,
    customerName: p.partnerName,
    type: 'FOUNDING_PARTNER_SPONSORSHIP',
    typeName: 'Tài Trợ Chuyên Mục (Founding Partner)',
    value: p.contract.totalValue,
    numericValue: parseInt(p.contract.totalValue.replace(/\D/g, '') || '0', 10),
    signedDate: p.contract.signedDate || p.startDate,
    status: p.status === 'ACTIVE' ? 'PAID_IN_PROGRESS' : 'COMPLETED',
    note: p.contract.paymentTerms || 'Thanh toán 2 đợt'
  }));

  const serviceContracts = [
    {
      id: 'HD-SRV-2026-015',
      customerName: 'Công Ty May Mặc Á Châu',
      type: 'MEDIA_VIDEO_PRODUCTION',
      typeName: 'Dịch Vụ Sản Xuất Video Phóng Sự Xưởng 4K',
      value: '45.000.000 VNĐ',
      numericValue: 45000000,
      signedDate: '2026-09-20',
      status: 'PAID_50%',
      note: 'Tạm ứng 50%, 50% còn lại sau nghiệm thu video hoàn chỉnh'
    },
    {
      id: 'HD-SRV-2026-022',
      customerName: 'Tập đoàn Điện tử VinaTech',
      type: 'MERCHANDISE_SUPPLY',
      typeName: 'Cung Cấp 1.000 Giftset & Áo Thun Sự Kiện KCN',
      value: '85.000.000 VNĐ',
      numericValue: 85000000,
      signedDate: '2026-09-22',
      status: 'PAID_100%',
      note: 'Đã xuất hóa đơn VAT điện tử & nhận đủ tiền'
    }
  ];

  const allContracts = [...foundingContracts, ...serviceContracts];

  // RBAC Guard (Section 21 & 27): Only SUPER_ADMIN and FINANCE can access
  if (activeRole.id !== 'SUPER_ADMIN' && activeRole.id !== 'FINANCE') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-slate-900 font-heading">
          Quyền Truy Cập Bị Giới Hạn (RBAC Guard)
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Bạn đang đăng nhập với vai trò <strong>{activeRole.name}</strong>. Theo quy định tại Section 27, phân hệ Thu Chi / Tài Chính chỉ dành riêng cho vai trò <strong>Finance</strong> và <strong>Super Admin</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>BOARD 06: THU CHI, CÔNG NỢ & ĐỐI SOÁT HỢP ĐỒNG (SECTION 7 & 36)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Quản Lý Hợp Đồng & Doanh Thu Dịch Vụ / Tài Trợ
          </h2>
          <p className="text-xs text-slate-500">
            Hạch toán minh bạch từng dòng tiền thương mại, tách biệt hoàn toàn khỏi vốn đầu tư hay cổ phần.
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer Box (Section 25 & 36) */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-amber-950 text-xs flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-heading uppercase block text-amber-900">
            QUY ĐỊNH PHÂN TÁCH TÀI CHÍNH BẮT BUỘC:
          </strong>
          Toàn bộ nguồn thu từ <strong>Founding Partner</strong> và <strong>Dịch Vụ B2B</strong> là doanh thu thương mại cung cấp dịch vụ hiển thị/truyền thông. Tuyệt đối <strong>KHÔNG</strong> hạch toán là vốn góp đầu tư (Investment Capital), khoản vay (Loan) hay tiền ký quỹ của đối tác.
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
            DOANH SỐ HỢP ĐỒNG THƯƠNG MẠI
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            345.000.000 VNĐ
          </div>
          <p className="text-[11px] text-slate-500">
            Gồm {allContracts.length} hợp đồng tài trợ và sản xuất dịch vụ
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
            TIỀN THỰC THU (CASH RECEIVED)
          </span>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            242.500.000 VNĐ
          </div>
          <p className="text-[11px] text-slate-500">
            Đã thanh toán đúng tiến độ (Đợt 1 & Đợt 2)
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
            CÔNG NỢ CHỜ NGHIỆM THU (OUTSTANDING)
          </span>
          <div className="text-2xl font-black text-blue-700 font-mono">
            102.500.000 VNĐ
          </div>
          <p className="text-[11px] text-slate-500">
            Sẽ đối soát khi bàn giao đủ Deliverables
          </p>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-black text-xs text-slate-900 font-heading uppercase">
            Danh Sách Hợp Đồng Dịch Vụ & Tài Trợ ({allContracts.length})
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Hạch toán phân hệ Commercial Service
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10.5px] uppercase">
                <th className="p-4">Số Hợp Đồng</th>
                <th className="p-4">Đối Tác / Khách Hàng</th>
                <th className="p-4">Loại Hợp Đồng</th>
                <th className="p-4">Giá Trị Hợp Đồng</th>
                <th className="p-4">Ngày Ký</th>
                <th className="p-4">Trạng Thái Thanh Toán</th>
                <th className="p-4">Ghi Chú Tiến Độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allContracts.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-mono font-bold text-blue-700">
                    {c.id}
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    {c.customerName}
                  </td>
                  <td className="p-4 text-slate-600">
                    {c.typeName}
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-800">
                    {c.value}
                  </td>
                  <td className="p-4 font-mono text-slate-500">
                    {c.signedDate}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-[11px]">
                    {c.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
