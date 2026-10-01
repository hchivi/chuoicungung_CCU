import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Radio, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight,
  Clock, MapPin, Calendar, Building2, Package, FileText, Video,
  Send, HelpCircle, ChevronRight, Eye, QrCode, FileCheck,
  Check, X, Sparkles, RefreshCw, Layers, ExternalLink, Info,
  Smartphone, UserCheck, MessageSquare, AlertCircle, BookmarkCheck
} from 'lucide-react';
import {
  REPRESENTATION_SCOPE_FLAGS,
  DEFAULT_RESTRICTIONS,
  REMOTE_PRESENCE_STATUSES,
  SAMPLE_RETURN_OPTIONS,
  EXCLUSION_ITEMS,
  getEligibleRemotePrograms,
  getAllRemoteRequests,
  submitRemotePresenceRequest,
  submitRemotePresenceInterest
} from '../data/remotePresenceData.js';

export default function RemotePresenceServicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledProgramId = searchParams.get('programId') || searchParams.get('program') || '';

  const eligiblePrograms = getEligibleRemotePrograms();

  // State Form Đăng Ký
  const [selectedProgramId, setSelectedProgramId] = useState(prefilledProgramId || (eligiblePrograms[0]?.id || ''));
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [selectedProductsText, setSelectedProductsText] = useState('');
  const [hasSample, setHasSample] = useState(false);
  const [sampleDetails, setSampleDetails] = useState('');
  const [sampleQuantity, setSampleQuantity] = useState(1);
  const [returnOption, setReturnOption] = useState('RETURN_TO_SUPPLIER');
  const [responderName, setResponderName] = useState('');
  const [responderRole, setResponderRole] = useState('');
  const [responderPhone, setResponderPhone] = useState('');
  const [responderEmail, setResponderEmail] = useState('');
  const [slaHours, setSlaHours] = useState(8);
  const [selectedScopes, setSelectedScopes] = useState([
    'CAN_PRESENT_APPROVED_PROFILE',
    'CAN_SHOW_APPROVED_VIDEO',
    'CAN_SHOW_CATALOGUE',
    'CAN_EXPLAIN_APPROVED_PRODUCT_SUMMARY',
    'CAN_COLLECT_CONTACT_REQUEST',
    'CAN_FORWARD_APPROVED_MATERIALS',
    'CAN_RECORD_QUESTIONS'
  ]);
  const [consent, setConsent] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedRequestCode, setSubmittedRequestCode] = useState('');
  const [formError, setFormError] = useState('');

  // State Đăng ký quan tâm khi không có sự kiện phù hợp
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestOrg, setInterestOrg] = useState('');
  const [interestContact, setInterestContact] = useState('');
  const [interestPhone, setInterestPhone] = useState('');
  const [interestSuccess, setInterestSuccess] = useState(false);

  // SEO Setup (Section 65)
  useEffect(() => {
    document.title = 'Hien Dien Tu Xa | CHUOICUNGUNG.COM';

    // Meta description & canonical
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Dịch vụ hiện diện từ xa tại sự kiện chuỗi cung ứng: giới thiệu hồ sơ năng lực, video, catalogue, mẫu thử theo kịch bản được duyệt khi doanh nghiệp chưa thể có mặt trực tiếp.';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://chuoicungung.com/dich-vu/hien-dien-tu-xa';

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Hien Dien Tu Xa",
      "description": "Giới thiệu hồ sơ, video, catalogue hoặc mẫu sản phẩm tại chương trình phù hợp khi doanh nghiệp chưa thể có mặt trực tiếp; phạm vi đại diện và quyền lợi được thống nhất rõ.",
      "provider": {
        "@type": "Organization",
        "name": "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      },
      "url": "https://chuoicungung.com/dich-vu/hien-dien-tu-xa",
      "serviceType": "B2B Remote Presence and Proxy Representation"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'remote-presence-service-schema';
    script.text = JSON.stringify(schemaData);
    const old = document.getElementById('remote-presence-service-schema');
    if (old) old.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('remote-presence-service-schema');
      if (el) el.remove();
    };
  }, []);

  const handleScopeToggle = (key) => {
    if (selectedScopes.includes(key)) {
      setSelectedScopes(selectedScopes.filter(k => k !== key));
    } else {
      setSelectedScopes([...selectedScopes, key]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!companyName.trim()) {
      setFormError('Vui lòng nhập tên công ty / doanh nghiệp.');
      return;
    }
    if (!responderName.trim() || !responderPhone.trim()) {
      setFormError('Vui lòng nhập đầy đủ họ tên và số điện thoại người phụ trách phản hồi.');
      return;
    }
    if (!consent) {
      setFormError('Bạn cần đồng ý với điều khoản dịch vụ và ranh giới đại diện ủy thác.');
      return;
    }

    // Tách các sản phẩm theo dòng hoặc dấu phẩy
    const rawProducts = selectedProductsText
      .split(/[\n,]+/)
      .map(p => p.trim())
      .filter(Boolean);

    if (rawProducts.length === 0) {
      setFormError('Vui lòng liệt kê ít nhất 1 sản phẩm/năng lực cụ thể.');
      return;
    }
    if (rawProducts.length > 3) {
      setFormError('Chỉ được chọn tối đa 3 sản phẩm/năng lực trọng tâm phù hợp nhất (Section 7).');
      return;
    }

    try {
      const newReq = submitRemotePresenceRequest({
        programId: selectedProgramId,
        supplierName: companyName,
        selectedProducts: rawProducts.map((p, idx) => ({ id: `P-${idx + 1}`, name: p })),
        responderName,
        responderRole,
        responderPhone,
        responderEmail,
        slaHours: Number(slaHours),
        representationScope: selectedScopes,
        sampleInfo: {
          hasSample,
          description: sampleDetails,
          quantity: sampleQuantity,
          returnOption
        },
        consent: true
      });

      setSubmittedRequestCode(newReq.requestPublicCode);
      setFormSubmitted(true);
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra khi nộp hồ sơ.');
    }
  };

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    if (!interestOrg.trim() || !interestPhone.trim()) return;

    submitRemotePresenceInterest({
      organizationName: interestOrg,
      contactName: interestContact,
      contactPhone: interestPhone,
      consent: true
    });
    setInterestSuccess(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Breadcrumbs */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-400 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link to="/dich-vu" className="hover:text-white transition-colors">Dịch vụ B2B</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-blue-400 font-medium">Hien Dien Tu Xa</span>
        </div>
      </div>

      {/* 1. HERO SECTION (Section 2) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-blue-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
            Dịch vụ B2B ủy thác nội dung chính ngạch
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            Hien Dien Tu Xa
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-bold text-blue-200 uppercase tracking-wide">
            Giới thiệu doanh nghiệp tại chương trình dù bạn chưa thể có mặt
          </p>
          
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Đưa hồ sơ, video, catalogue hoặc mẫu sản phẩm của doanh nghiệp đến chương trình phù hợp. Đội điều phối giới thiệu nội dung đã được duyệt, ghi nhận yêu cầu liên hệ và chuyển lại đầu việc theo phạm vi thỏa thuận.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#dang-ky-hien-dien"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/30 transition-all gap-2"
            >
              <span>Yêu cầu tư vấn</span>
              <Send className="w-4 h-4 text-blue-200" />
            </a>
            <a
              href="#quy-trinh"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base transition-all gap-2"
            >
              <span>Xem quy trình</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* 4 Ranh giới cốt lõi (Section 2) */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3.5 text-center">
              <span className="text-xs font-semibold text-rose-300 block">KHÔNG PHẢI</span>
              <p className="text-sm font-medium text-slate-200 mt-1">Dịch vụ bán lead ảo</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3.5 text-center">
              <span className="text-xs font-semibold text-rose-300 block">KHÔNG PHẢI</span>
              <p className="text-sm font-medium text-slate-200 mt-1">Cam kết doanh số / chốt đơn</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3.5 text-center">
              <span className="text-xs font-semibold text-blue-300 block">ĐIỀU PHỐI VIÊN</span>
              <p className="text-sm font-medium text-slate-200 mt-1">Chỉ nói trong kịch bản đã duyệt</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3.5 text-center">
              <span className="text-xs font-semibold text-emerald-300 block">BẢO MẬT & TRUNG LẬP</span>
              <p className="text-sm font-medium text-slate-200 mt-1">Không thiên vị thuật toán Matching</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHƯƠNG TRÌNH ĐANG NHẬN HIỆN DIỆN TỪ XA (Section 3, 4, 5) */}
      <section id="danh-sach-chuong-trinh" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">Cơ hội kết nối thực tế</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Chương Trình Đang Nhận Hồ Sơ Hiện Diện Từ Xa</h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Chỉ các chương trình có cấu hình <span className="font-semibold text-slate-800">remotePresenceEnabled</span> và còn hạn nộp hồ sơ mới được hiển thị tại đây.
            </p>
          </div>
          <button
            onClick={() => setShowInterestModal(true)}
            className="text-sm font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg self-start md:self-auto"
          >
            Đăng ký nhận tin khi có chương trình mới
          </button>
        </div>

        {eligiblePrograms.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Hiện chưa có chương trình phù hợp đang nhận hồ sơ từ xa</h3>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
              Ban điều phối đang khảo sát nhu cầu cho các kỳ tiếp theo. Hãy để lại thông tin để nhận thông báo sớm nhất.
            </p>
            <button
              onClick={() => setShowInterestModal(true)}
              className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              Đăng Ký Quan Tâm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligiblePrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {prog.publicCode}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Đang nhận hồ sơ
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-blue-600">
                    {prog.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{prog.date} ({prog.time})</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{prog.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{prog.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-600 font-medium pt-1 border-t border-slate-100">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Hạn chót: {new Date(prog.remoteSubmissionDeadline).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tiếp nhận mẫu:</span>
                      <span className={prog.acceptsSample ? 'font-semibold text-emerald-700' : 'text-slate-400'}>
                        {prog.acceptsSample ? 'Có (theo quy chuẩn)' : 'Không nhận mẫu'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mức phí tham gia:</span>
                      <span className="font-bold text-blue-700">
                        {prog.feeType === 'FIXED' ? `${prog.feeAmount.toLocaleString('vi-VN')} đ` : 'Nhận báo giá'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <a
                    href="#dang-ky-hien-dien"
                    onClick={() => setSelectedProgramId(prog.id)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors gap-1.5"
                  >
                    <span>Chọn Chương Trình Này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. NỘI DUNG DOANH NGHIỆP CÓ THỂ GỬI & LƯU Ý SẢN PHẨM (Section 6, 7) */}
      <section className="py-16 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Chuẩn bị nội dung</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Nội Dung Doanh Nghiệp Có Thể Gửi</h2>
            <p className="text-slate-600 text-sm mt-2">
              Chúng tôi không nhận tài liệu thô để tự chọn sản phẩm. Doanh nghiệp cần chọn <span className="font-bold text-slate-800">1–3 sản phẩm hoặc năng lực cốt lõi</span> phù hợp nhất với nhóm Buyer của sự kiện.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <FileText className="w-7 h-7 text-blue-600 mb-2" />
              <h4 className="font-bold text-sm text-slate-800">Hồ Sơ Số (Profile)</h4>
              <p className="text-xs text-slate-600 mt-1">Bản tóm tắt năng lực 1 trang, chứng chỉ ISO/IATF và diện tích xưởng.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <Video className="w-7 h-7 text-indigo-600 mb-2" />
              <h4 className="font-bold text-sm text-slate-800">Video 1 Phút</h4>
              <p className="text-xs text-slate-600 mt-1">Clip ngắn giới thiệu dây chuyền máy móc, phòng QC và sản phẩm chủ lực.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <FileCheck className="w-7 h-7 text-emerald-600 mb-2" />
              <h4 className="font-bold text-sm text-slate-800">Catalogue / Tờ Rơi</h4>
              <p className="text-xs text-slate-600 mt-1">Catalogue bản in hoặc brochure A4 song ngữ kèm mã QR quét tải số.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <Package className="w-7 h-7 text-amber-600 mb-2" />
              <h4 className="font-bold text-sm text-slate-800">Mẫu Đối Chứng</h4>
              <p className="text-xs text-slate-600 mt-1">Vật mẫu thực tế (nếu chương trình chấp nhận) để khách đối chứng dung sai.</p>
            </div>
          </div>

          {/* SUPPI Advisor Note (Section 7, 46) */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <span className="font-bold">Gợi ý từ trợ lý SUPPI:</span> Đừng gửi danh bạ hàng ngàn mã sản phẩm. Tại một sự kiện B2B 1:1, Buyer chỉ có từ 5–10 phút để nắm bắt năng lực. Tập trung vào 1 dòng chi tiết máy hoặc thế mạnh sản xuất vượt trội nhất sẽ giúp điều phối viên giới thiệu hiệu quả gấp nhiều lần.
            </div>
          </div>
        </div>
      </section>

      {/* 4. PHẦN VIỆC ĐƯỢC THỰC HIỆN & PHẠM VI ĐẠI DIỆN (Section 10, 11, 12, 13) */}
      <section id="quy-trinh" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Cột trái: Phần việc được thực hiện */}
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Trách nhiệm đội ngũ</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Phần Việc Được Thực Hiện Tại Sự Kiện</h2>
            <p className="text-slate-600 text-sm mt-2 mb-6">
              Đội điều phối địa phương thực thi nhiệm vụ theo đúng kịch bản đã được doanh nghiệp phê duyệt trước giờ khai mạc.
            </p>

            <div className="space-y-3">
              {[
                'Kiểm tra và chuẩn hóa bộ tư liệu giới thiệu doanh nghiệp',
                'Bố trí vị trí trưng bày catalogue, standee hoặc khay mẫu theo gói',
                'Trình chiếu video giới thiệu xưởng trên màn hình kết nối luân phiên',
                'Trình bày thông tin năng lực theo đúng kịch bản duyệt (Approved Script)',
                'Hỗ trợ khách tham quan quét mã QR hồ sơ hoặc nhận tài liệu số',
                'Ghi nhận câu hỏi chuyên môn và chuyển về đầu mối của doanh nghiệp',
                'Thu thập danh thiếp / yêu cầu kết nối khi người tham gia có consent',
                'Báo cáo nghiệm thu bằng chứng trưng bày và số liệu tương tác sau sự kiện'
              ].map((task, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white border border-slate-200 p-3 rounded-lg text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải: Ranh giới & 11 Điều cấm tuyệt đối (Section 13) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold uppercase mb-4">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                Ranh giới đại diện & Điều cấm tuyệt đối
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Đội Điều Phối KHÔNG Phải Là Đội Sales Bán Hàng</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Để bảo vệ quyền lợi thương mại và bí mật kinh doanh của doanh nghiệp, điều phối viên tại hiện trường tuân thủ nghiêm ngặt 11 nguyên tắc cấm:
              </p>

              <div className="space-y-2 text-xs text-slate-300">
                {DEFAULT_RESTRICTIONS.slice(0, 7).map((res) => (
                  <div key={res.id} className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{res.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 italic">
              Khi Buyer hỏi giá hoặc yêu cầu kỹ thuật chuyên sâu, điều phối viên ghi nhận và chuyển thành phiếu <span className="text-amber-300 font-semibold">QUOTE_REQUESTED</span> để doanh nghiệp tự mình phản hồi.
            </div>
          </div>
        </div>
      </section>

      {/* 5. ĐO LƯỜNG MINH BẠCH & TÁCH BẠCH METRIC (Section 18, 19, 47, 51) */}
      <section className="py-16 bg-slate-100 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Báo cáo & Đo lường</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Báo Cáo Minh Bạch Từng Loại Tương Tác</h2>
            <p className="text-slate-600 text-sm mt-2">
              Chúng tôi tôn trọng sự thật và từ chối các số liệu gộp mơ hồ. Báo cáo nghiệm thu phân tách rõ ràng từng hành vi của khách tham quan:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 block mb-1">CẤP ĐỘ 1: HIỂN THỊ</span>
              <p className="text-base font-bold text-slate-800">Lượt Xem Hồ Sơ & Video</p>
              <p className="text-xs text-slate-500 mt-1">Số lần mở hồ sơ số hoặc xem clip xưởng tại màn hình</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-indigo-500 block mb-1">CẤP ĐỘ 2: TƯƠNG TÁC</span>
              <p className="text-base font-bold text-slate-800">Quét QR & Mở Catalogue</p>
              <p className="text-xs text-slate-500 mt-1">Khách chủ động lưu tài liệu về điện thoại</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-amber-500 block mb-1">CẤP ĐỘ 3: QUAN TÂM</span>
              <p className="text-base font-bold text-slate-800">Yêu Cầu Liên Hệ Có Consent</p>
              <p className="text-xs text-slate-500 mt-1">Danh thiếp và yêu cầu kết nối được đồng ý chia sẻ</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-emerald-600 block mb-1">CẤP ĐỘ 4: CHUYỂN GIAO</span>
              <p className="text-base font-bold text-slate-800">Câu Hỏi Buyer & RFQ</p>
              <p className="text-xs text-slate-500 mt-1">Phiếu câu hỏi kỹ thuật chuyển giao cho xưởng phản hồi</p>
            </div>
          </div>

          {/* Hard rule reminder (Section 18, 51) */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed text-center max-w-3xl mx-auto">
            <span className="font-bold">Nguyên tắc nghiệm thu cốt lõi:</span> Dịch vụ Hiện diện từ xa hoàn tất (<span className="font-semibold text-slate-900">COMPLETED</span>) khi toàn bộ quyền lợi và bằng chứng bàn giao đã được thực hiện đủ. Dịch vụ không cam kết thay cho kết quả chốt đơn thương mại của doanh nghiệp.
          </div>
        </div>
      </section>

      {/* 6. FORM ĐĂNG KÝ HIỆN DIỆN TỪ XA (Section 32, 33, 34) */}
      <section id="dang-ky-hien-dien" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-6 text-white">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">Tiếp nhận hồ sơ</div>
            <h2 className="text-2xl font-bold mt-1">Đăng Ký Hiện Diện Từ Xa</h2>
            <p className="text-sm text-blue-100 mt-1">
              Điền thông tin doanh nghiệp và sản phẩm trọng tâm để được bộ phận điều phối thẩm định phạm vi giới thiệu.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Tiếp Nhận Hồ Sơ Thành Công!</h3>
              <p className="text-slate-600 text-sm max-w-lg mx-auto">
                Mã hồ sơ yêu cầu: <span className="font-mono font-bold text-blue-700 text-base">{submittedRequestCode}</span>.
                Điều phối viên khu vực sẽ liên hệ với đầu mối phản hồi trong vòng 24 giờ làm việc để thống nhất kịch bản giới thiệu.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg"
                >
                  Nộp hồ sơ khác
                </button>
                <Link
                  to="/tai-khoan/dich-vu"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
                >
                  Theo dõi yêu cầu của tôi
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
              {formError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Chọn chương trình */}
              <div>
                <label htmlFor="remote-program-select" className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  1. Chương trình tham gia từ xa <span className="text-rose-500">*</span>
                </label>
                <select
                  id="remote-program-select"
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {eligiblePrograms.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      [{prog.publicCode}] {prog.title} ({prog.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Thông tin doanh nghiệp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="remote-company-name" className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    2. Tên doanh nghiệp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="remote-company-name"
                    type="text"
                    required
                    placeholder="VD: Công ty Cơ khí Chính xác ABC"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="remote-tax-code" className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Mã số thuế (Tùy chọn)
                  </label>
                  <input
                    id="remote-tax-code"
                    type="text"
                    placeholder="VD: 0312345678"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 3. Sản phẩm trọng tâm (1-3 sản phẩm) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="remote-products-text" className="block text-xs font-bold text-slate-700 uppercase">
                    3. Sản phẩm / Năng lực cốt lõi muốn giới thiệu (Tối đa 3) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-500">Mỗi sản phẩm cách nhau bởi dấu phẩy hoặc xuống dòng</span>
                </div>
                <textarea
                  id="remote-products-text"
                  rows={2}
                  required
                  placeholder="VD: Gia công đồ gá Jig kiểm tra; Tiện chi tiết nhôm chính xác; Đúc áp lực vỏ động cơ"
                  value={selectedProductsText}
                  onChange={(e) => setSelectedProductsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* 4. Quy cách hàng mẫu (nếu gửi mẫu) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasSampleCheck"
                      checked={hasSample}
                      onChange={(e) => setHasSample(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="hasSampleCheck" className="text-xs font-bold text-slate-800 uppercase cursor-pointer">
                      Có gửi hàng mẫu đối chứng trưng bày tại sự kiện
                    </label>
                  </div>
                  <span className="text-xs text-slate-500">Cần tuân thủ quy chuẩn kích thước</span>
                </div>

                {hasSample && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label htmlFor="remote-sample-details" className="block text-xs font-semibold text-slate-600 mb-1">Mô tả mẫu sản phẩm</label>
                        <input
                          id="remote-sample-details"
                          type="text"
                          placeholder="VD: 02 chi tiết trục tiện mẫu kích thước 15x5cm"
                          value={sampleDetails}
                          onChange={(e) => setSampleDetails(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label htmlFor="remote-sample-quantity" className="block text-xs font-semibold text-slate-600 mb-1">Số lượng mẫu</label>
                        <input
                          id="remote-sample-quantity"
                          type="number"
                          min={1}
                          max={5}
                          value={sampleQuantity}
                          onChange={(e) => setSampleQuantity(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="remote-sample-return" className="block text-xs font-semibold text-slate-600 mb-1">Phương án xử lý mẫu sau sự kiện</label>
                      <select
                        id="remote-sample-return"
                        value={returnOption}
                        onChange={(e) => setReturnOption(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                      >
                        {Object.values(SAMPLE_RETURN_OPTIONS).map(opt => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Lưu ý: Doanh nghiệp chịu cước phí chuyển phát mẫu hai chiều theo quy định (Section 25).
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Đầu mối phản hồi của doanh nghiệp */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="block text-xs font-bold text-slate-800 uppercase mb-3">
                  5. Đầu Mối Tiếp Nhận Câu Hỏi & Báo Giá (Responder) <span className="text-rose-500">*</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="remote-responder-name" className="block text-xs font-semibold text-slate-600 mb-1">Họ tên người phụ trách</label>
                    <input
                      id="remote-responder-name"
                      type="text"
                      required
                      placeholder="VD: Trần Văn Minh"
                      value={responderName}
                      onChange={(e) => setResponderName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="remote-responder-role" className="block text-xs font-semibold text-slate-600 mb-1">Chức vụ / Vai trò</label>
                    <input
                      id="remote-responder-role"
                      type="text"
                      placeholder="VD: Giám đốc Kỹ thuật / Trưởng phòng Kinh doanh"
                      value={responderRole}
                      onChange={(e) => setResponderRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="remote-responder-phone" className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại liên hệ</label>
                    <input
                      id="remote-responder-phone"
                      type="tel"
                      required
                      placeholder="VD: 0912 345 678"
                      value={responderPhone}
                      onChange={(e) => setResponderPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="remote-responder-email" className="block text-xs font-semibold text-slate-600 mb-1">Email nhận câu hỏi Buyer</label>
                    <input
                      id="remote-responder-email"
                      type="email"
                      required
                      placeholder="VD: minh.tv@congty.com"
                      value={responderEmail}
                      onChange={(e) => setResponderEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <label htmlFor="remote-sla-hours">Thời gian phản hồi cam kết (SLA):</label>
                  <select
                    id="remote-sla-hours"
                    value={slaHours}
                    onChange={(e) => setSlaHours(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800"
                  >
                    <option value={4}>Trong 4 giờ làm việc</option>
                    <option value={8}>Trong 8 giờ làm việc (1 ngày)</option>
                    <option value={24}>Trong 24 giờ</option>
                  </select>
                </div>
              </div>

              {/* 6. Phạm vi đại diện */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  6. Phạm vi cho phép điều phối viên đại diện (Section 12)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.values(REPRESENTATION_SCOPE_FLAGS).map((scope) => (
                    <label
                      key={scope.key}
                      htmlFor={`scope-${scope.key}`}
                      className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                    >
                      <input
                        id={`scope-${scope.key}`}
                        type="checkbox"
                        checked={selectedScopes.includes(scope.key)}
                        onChange={() => handleScopeToggle(scope.key)}
                        className="mt-0.5 rounded text-blue-600"
                      />
                      <div>
                        <span className="font-semibold text-slate-800 block">{scope.label}</span>
                        <span className="text-[11px] text-slate-500">{scope.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 7. Đồng ý điều khoản & Submit */}
              <div className="pt-4 border-t border-slate-200">
                <label htmlFor="remote-consent-check" className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    id="remote-consent-check"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 text-blue-600 rounded"
                  />
                  <span>
                    Doanh nghiệp xác nhận thông tin cung cấp là chính xác, chấp thuận ranh giới điều phối viên không tự ý báo giá/đàm phán hợp đồng, và đồng ý để ban tổ chức chuẩn hóa kịch bản giới thiệu theo quy định.
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Gửi Hồ Sơ Đăng Ký Hiện Diện Từ Xa</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 7. FAQ & CHÍNH SÁCH BẢO HỘ THƯƠNG HIỆU */}
      <section className="py-16 bg-slate-100 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-slate-900">Câu Hỏi Thường Gặp & Cam Kết Minh Bạch</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sm text-slate-800">
                Nếu đối tác tham quan hỏi giá trực tiếp tại bàn thì điều phối viên xử lý thế nào?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Điều phối viên tuân thủ nghiêm ngặt quy định: không tự ý phát ngôn về giá cả. Chúng tôi ghi nhận chính xác nhu cầu số lượng, quy cách vào phiếu <span className="font-semibold text-blue-700">QUOTE_REQUESTED</span> và chuyển tiếp về đầu mối của doanh nghiệp qua Zalo/Email để quý công ty trực tiếp gửi báo giá chính thức.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sm text-slate-800">
                Hiện diện từ xa có giúp tăng điểm Matching hoặc được gắn tick xanh không?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Không. Thuật toán kết nối SupplierMatching hoàn toàn độc lập và trung lập, chỉ dựa trên năng lực xưởng, máy móc và vị trí địa lý. Mua gói hiện diện từ xa không làm tăng điểm ưu ái và không thay thế cho quy trình thẩm định cấp tick xanh (Section 22, 40).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sm text-slate-800">
                Nếu chương trình bị hoãn hoặc hủy vì lý do bất khả kháng?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Bản ghi yêu cầu và quyền lợi của doanh nghiệp được bảo lưu 100% trong hệ thống. Ban điều phối sẽ hỗ trợ chuyển sang kỳ tổ chức tiếp theo hoặc hoàn trả chi phí/hàng mẫu theo hợp đồng thỏa thuận (Section 62).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL: ĐĂNG KÝ QUAN TÂM KHI CHƯA CÓ CHƯƠNG TRÌNH PHÙ HỢP */}
      {showInterestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => { setShowInterestModal(false); setInterestSuccess(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {interestSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Đã Lưu Thông Tin Quan Tâm!</h4>
                <p className="text-xs text-slate-600">
                  Khi có chương trình tại địa bàn hoặc ngành hàng phù hợp, điều phối viên sẽ gửi thông báo sớm nhất cho quý doanh nghiệp.
                </p>
                <button
                  onClick={() => { setShowInterestModal(false); setInterestSuccess(false); }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleInterestSubmit} className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Đăng Ký Nhận Thông Báo Chương Trình</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Nhận thông tin khi có sự kiện kết nối mở cổng hiện diện từ xa tại tỉnh thành của bạn.
                  </p>
                </div>

                <div>
                  <label htmlFor="interest-org-input" className="block text-xs font-semibold text-slate-700 mb-1">Tên doanh nghiệp</label>
                  <input
                    id="interest-org-input"
                    type="text"
                    required
                    placeholder="VD: Công ty Cơ khí Việt Hàn"
                    value={interestOrg}
                    onChange={(e) => setInterestOrg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label htmlFor="interest-contact-input" className="block text-xs font-semibold text-slate-700 mb-1">Người liên hệ</label>
                  <input
                    id="interest-contact-input"
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Nam"
                    value={interestContact}
                    onChange={(e) => setInterestContact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label htmlFor="interest-phone-input" className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại Zalo</label>
                  <input
                    id="interest-phone-input"
                    type="tel"
                    required
                    placeholder="VD: 0987 654 321"
                    value={interestPhone}
                    onChange={(e) => setInterestPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Xác Nhận Đăng Ký
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
