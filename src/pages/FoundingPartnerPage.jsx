import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown, ChevronRight, Compass, Crown, FileText, Gem, Layers, Medal, ShieldCheck, Video, X } from 'lucide-react';
import { submitFoundingPartnershipInquiry, ENTITLEMENT_TYPES } from '../data/foundingPartnershipData';
import { CURATED_CATEGORIES } from '../data/categoryHubData';
import { KEYWORD_CLUSTERS } from '../data/keywordClustersData';
import { buildFoundingObjective, durationLabel, getFoundingErrors, getScopeClusters, resolveFoundingScope } from './foundingPartnerUi';
import { FOUNDING_PLANS as TIERS, FOUNDING_FAQS } from './foundingPartnerContent';
import './FoundingPartnerPage.css';

const TIER_ICONS = {
  starter: Compass,
  silver: Medal,
  gold: Crown,
  diamond: Gem,
};

const POSITIONS = [
  ['TOP_CATEGORY_SPONSORED_BLOCK', 'Khối tài trợ đầu chuyên mục'],
  ['TOP_KEYWORD_SPONSORED_BLOCK', 'Khối tài trợ trong cụm nhu cầu'],
  ['CATEGORY_SIDEBAR_SPONSOR', 'Cột nội dung đồng hành chuyên mục'],
];
const LOCATIONS = ['Toàn quốc', 'Đồng Nai & TP.HCM', 'Bắc Ninh & Hà Nội', 'Bình Dương', 'Hải Phòng & Quảng Ninh'];
const serviceName = key => key === 'VIDEO_SHOWCASE' ? 'Video giới thiệu năng lực' : ENTITLEMENT_TYPES[key]?.shortName || key;
const clusterName = cluster => cluster?.name || cluster?.clusterName || cluster?.canonicalKeyword || 'Chưa có cụm nhu cầu';

function Field({ id, label, error, children, wide = false }) {
  return <div className={'fp-field' + (wide ? ' fp-field-wide' : '')}>
    <label htmlFor={'fp-' + id}>{label}</label>{children}
    {error && <span className="fp-error" id={'fp-' + id + '-error'}>{error}</span>}
  </div>;
}

export default function FoundingPartnerPage() {
  const [params] = useSearchParams();
  const [scope, setScope] = useState(() => {
    const initial = resolveFoundingScope(CURATED_CATEGORIES, KEYWORD_CLUSTERS, params.get('category') || params.get('cat'), params.get('cluster') || params.get('kw'));
    return { categorySlug: initial.category?.slug || '', clusterId: initial.cluster?.id || '', location: 'Toàn quốc', kcn: '', period: '6_MONTHS', position: 'TOP_CATEGORY_SPONSORED_BLOCK' };
  });
  const category = CURATED_CATEGORIES.find(item => item.slug === scope.categorySlug);
  const clusters = useMemo(() => getScopeClusters(KEYWORD_CLUSTERS, category), [category]);
  const cluster = clusters.find(item => item.id === scope.clusterId);
  const [services, setServices] = useState(['CAPABILITY_PROFILE_SHOWCASE', 'CATALOGUE_INCLUSION']);
  const [tierId, setTierId] = useState('starter');
  const tier = TIERS.find(item => item.id === tierId);
  const [form, setForm] = useState({ companyName: '', contactName: '', roleTitle: '', contactEmail: '', contactPhone: '', objective: '', capabilityNotes: '', budget: 'Cần tư vấn gói phù hợp', consent: false });
  const proposedPlan = TIERS.find(item => item.budget === form.budget);
  const [errors, setErrors] = useState({});
  const [reviewing, setReviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState('');
  const reviewRef = useRef(null);

  useEffect(() => {
    document.title = 'Founding Partner | Đồng hành theo năng lực từ 6 triệu | CCU';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Founding Partner: 4 gói đồng hành theo phạm vi năng lực, từ 6 triệu/6 tháng. Nhiều điểm hiện diện phù hợp, không tính phí riêng từng từ khóa hoặc địa bàn, không ưu tiên matching SUPPI.');
  }, []);
  const scrollTo = id => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };
  const updateScope = (key, value) => {
    setReviewing(false);
    if (key === 'categorySlug') {
      const next = CURATED_CATEGORIES.find(item => item.slug === value);
      setScope(prev => ({ ...prev, categorySlug: value, clusterId: getScopeClusters(KEYWORD_CLUSTERS, next)[0]?.id || '' }));
    } else setScope(prev => ({ ...prev, [key]: value }));
  };
  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
    setSaveError('');
  };
  const chooseTier = selectedTier => {
    setTierId(selectedTier.id);
    setReviewing(false);
    setForm(prev => ({ ...prev, budget: selectedTier.budget }));
    setScope(prev => ({ ...prev, period: selectedTier.period }));
    scrollTo('fp-proposal');
  };
  const startReview = event => {
    event.preventDefault();
    const nextErrors = getFoundingErrors(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById('fp-' + Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setReviewing(true);
  };
  useEffect(() => { if (reviewing) reviewRef.current?.focus(); }, [reviewing]);
  const saveInquiry = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError('');
    try {
      const response = await submitFoundingPartnershipInquiry({
        companyName: form.companyName.trim(), contactName: form.contactName.trim(), roleTitle: form.roleTitle.trim(),
        contactEmail: form.contactEmail.trim(), contactPhone: form.contactPhone.trim(),
        categoryId: scope.categorySlug, categoryName: category?.name || '',
        keywordClusterId: scope.clusterId || null, keywordClusterName: cluster?.name || '',
        locationName: scope.location, industrialParkName: scope.kcn,
        expectedDuration: scope.period, displayPosition: scope.position,
        servicesInterested: services, objective: buildFoundingObjective({ ...form, plan: proposedPlan?.name }), budget: form.budget, consentToContact: form.consent,
      });
      // Existing persistence is local, not a server submission. Verify before displaying a confirmation.
      const persisted = JSON.parse(window.localStorage.getItem('ccu_founding_partnerships_v1') || '[]');
      if (!response.success || !persisted.some(item => item.id === response.inquiry?.id)) throw new Error('not-persisted');
      setResult(response);
      scrollTo('fp-proposal');
    } catch {
      setSaveError('Chưa lưu được đề xuất. Vui lòng kiểm tra quyền lưu trữ của trình duyệt rồi thử lại. Thông tin vẫn còn trong biểu mẫu.');
    } finally { setSaving(false); }
  };
  const scopeSummary = <dl className="fp-scope-summary">
    <div><dt>Gói quan tâm</dt><dd>{proposedPlan ? proposedPlan.name + ': ' + proposedPlan.price + ' triệu ' + proposedPlan.billing : 'Cần tư vấn gói phù hợp'}</dd></div>
    <div><dt>Phạm vi năng lực đề xuất</dt><dd>{form.capabilityNotes || 'Chưa bổ sung; cần đối chiếu khi trao đổi.'}</dd></div>
    <div><dt>Chuyên mục tham chiếu</dt><dd>{category?.name || 'Chưa chọn'}</dd></div>
    <div><dt>Nhu cầu tham chiếu</dt><dd>{clusterName(cluster)}</dd></div>
    <div><dt>Địa bàn tham chiếu</dt><dd>{scope.location}{scope.kcn && <small>{scope.kcn}</small>}</dd></div>
    <div><dt>Thời hạn</dt><dd>{durationLabel(scope.period)}</dd></div>
    <div><dt>Vị trí đề xuất</dt><dd>{POSITIONS.find(([value]) => value === scope.position)?.[1]}</dd></div>
  </dl>;
  return <div className="fp-page">
    <section className="relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center" aria-labelledby="fp-title">
      {/* Right Half Panoramic Showcase Visual with Smooth Gradient Fade matching Image 2 */}
      <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
        <img 
          src="/images/partners/founding-campus-v2.jpg" 
          width="1440" 
          height="960" 
          fetchpriority="high" 
          decoding="async" 
          alt="Ảnh minh họa khuôn viên công nghiệp với nhà xưởng và khối văn phòng" 
          className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-30 sm:opacity-45 lg:opacity-100 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="w-[min(1280px,calc(100%-48px))] mx-auto relative z-10 w-full py-8 sm:py-10">
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Đường dẫn">
          <Link to="/" className="hover:text-slate-900 transition">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <Link to="/hop-tac" className="hover:text-slate-900 transition">Hợp tác</Link>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-900 font-medium" aria-current="page">Founding Partner</span>
        </nav>

        <div className="max-w-xl">
          <p className="text-sm font-semibold text-[#008060] tracking-wide mb-3">
            Chương trình đối tác đồng hành sáng lập
          </p>

          <h1 id="fp-title" className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">
            Một gói đồng hành.<br />Đúng phạm vi năng lực.
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug mb-3">
            Đúng năng lực cốt lõi.<br />Rõ quyền lợi đồng hành.
          </p>

          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal max-w-xl mb-6">
            Giới thiệu năng lực doanh nghiệp tại những điểm phù hợp, không mua riêng từng từ khóa hay địa bàn.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => scrollTo('fp-proposal')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#00A86B] to-[#008060] hover:from-[#00925c] hover:to-[#007054] text-white text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <span>Trao đổi phạm vi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#tiers-section"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#005e46] transition p-2"
            >
              <span>Xem mức đồng hành</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          <p className="font-medium text-slate-700">Đồng hành dài hạn cùng 480+ KCN và cộng đồng nhà cung ứng toàn quốc.</p>
          <a href="#tiers-section" className="inline-flex items-center gap-1 text-[#008060] font-semibold hover:underline">
            Xem các gói đồng hành <ChevronDown size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <div className="fp-container">
      <div className="fp-intro-strip">
        <span>Nhà sản xuất, nhà cung ứng và doanh nghiệp dịch vụ B2B</span>
        <span><ShieldCheck aria-hidden="true" />Tài trợ không ảnh hưởng kết quả tìm kiếm</span>
      </div>
      <nav className="fp-section-nav" aria-label="Nội dung trang">
        {[['fp-benefits', 'Quyền lợi'], ['fp-presence', 'Cách hiện diện'], ['tiers-section', 'Mức đồng hành'], ['fp-scope', 'Chọn phạm vi'], ['fp-principles', 'Nguyên tắc'], ['fp-proposal', 'Đề xuất hợp tác']].map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}
      </nav>
      <section id="fp-benefits" className="fp-section fp-benefits" aria-labelledby="fp-benefits-title">
        <div className="fp-section-heading">
          <h2 id="fp-benefits-title">Founding Partner là gì?</h2>
          <p>Gói đồng hành thương mại giúp doanh nghiệp tổ chức hồ sơ, nội dung và phạm vi hiện diện trên CHUOICUNGUNG.COM theo <strong>những gì doanh nghiệp thực sự có khả năng cung ứng.</strong></p>
          <p>Thay vì mua từng từ khóa, doanh nghiệp và CCU thống nhất nhóm năng lực, hạng mục triển khai và thời hạn. Các sản phẩm, từ khóa và địa bàn liên quan được xem xét trong cùng phạm vi đó.</p>
          <p>Phù hợp với nhà máy giới thiệu năng lực sản xuất, nhà cung ứng trình bày sản phẩm, hoặc doanh nghiệp dịch vụ B2B làm rõ khả năng phục vụ.</p>
          <p className="fp-definition-note">Tên Founding Partner không tạo tư cách đồng sáng lập, nhà đầu tư, cổ đông, xác minh doanh nghiệp hay chứng nhận chất lượng.</p>
        </div>
        <div className="fp-benefit-list">
          {[
            [FileText, 'Khách hiểu bạn cung ứng được gì', 'Hồ sơ, sản phẩm và tài liệu được trình bày nhất quán, giúp bên mua hiểu năng lực và điều kiện đáp ứng trước khi trao đổi.'],
            [Layers, 'Một phạm vi, nhiều cách tìm thấy', 'Một năng lực có thể liên quan tới nhiều danh mục và cách diễn đạt nhu cầu. Không tách mỗi từ khóa hoặc địa bàn thành một khoản phí.'],
            [Video, 'Nội dung gắn với năng lực thực', 'Catalogue, bài viết hoặc video cần dựa trên thông tin doanh nghiệp cung cấp. Nội dung sản xuất mới và chi phí bổ sung phải được thống nhất riêng.'],
            [CheckCircle2, 'Biết rõ hạng mục được bàn giao', 'Vị trí tài trợ, thời hạn, đầu việc và minh chứng bàn giao cần được ghi rõ trước khi triển khai; không thay bằng lời hứa có đơn hàng.'],
          ].map(([Icon, title, description]) => <article key={title} className="fp-benefit-row"><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div></article>)}
        </div>
      </section>
      <section id="fp-presence" className="fp-section fp-presence" aria-labelledby="fp-presence-title">
        <div className="fp-presence-heading"><h2 id="fp-presence-title">Một gói, nhiều điểm hiện diện phù hợp</h2><p>Một nhà cung ứng có thể liên quan tới nhiều danh mục, sản phẩm, từ khóa và địa bàn nếu hồ sơ năng lực thực tế phù hợp. Số điểm hiện diện không phải một quota từ khóa được bán riêng.</p></div>
        <div className="fp-presence-map">
          <div className="fp-capability-origin"><Layers aria-hidden="true" /><h3>Năng lực của doanh nghiệp</h3><p>Nhóm sản phẩm hoặc dịch vụ có khả năng đáp ứng thực tế, kèm thông tin và tài liệu để đối chiếu.</p></div>
          <ul aria-label="Những điểm hiện diện có thể liên quan">{[
            ['Danh mục', 'Lĩnh vực hoạt động thực tế'], ['Sản phẩm / dịch vụ', 'Những gì doanh nghiệp cung ứng'], ['Từ khóa', 'Các cách gọi cùng một nhu cầu'], ['Địa bàn', 'Nơi có khả năng phục vụ'],
          ].map(([name, description]) => <li key={name}><Check aria-hidden="true" /><div><h3>{name}</h3><p>{description}</p></div></li>)}</ul>
        </div>
        <div className="fp-capability-example"><div><span>Ví dụ minh họa, không phải kết quả matching</span><h3>Một năng lực gia công CNC</h3></div><p>“Gia công CNC”, “gia công chi tiết máy” và “đồ gá” có thể là các cách tìm liên quan nếu hồ sơ cho thấy doanh nghiệp đáp ứng được. Đồng Nai và Bình Dương chỉ là địa bàn phù hợp khi doanh nghiệp thực sự có khả năng phục vụ tại đó.</p></div>
        <p className="fp-presence-rule"><strong>CCU không tính phí riêng từng từ khóa hoặc địa bàn.</strong> Phạm vi được xác nhận từ năng lực, không phải lời hứa xuất hiện ở mọi ngành hay mọi nơi.</p>
      </section>
      <section id="tiers-section" className="fp-section fp-tiers" aria-labelledby="fp-tiers-title">
        <div className="fp-pricing-heading">
          <p className="fp-eyebrow">Mức đồng hành</p>
          <h2 id="fp-tiers-title">Bắt đầu vừa sức.<br />Mở rộng đúng năng lực.</h2>
          <p>Chọn theo nhóm năng lực cần trình bày và thời gian đồng hành. Không chọn theo số lượng từ khóa.</p>
        </div>
        <p className="fp-pricing-caption"><FileText aria-hidden="true" />Giá tham khảo theo gói. Starter có thời hạn 6 tháng; các gói còn lại tính theo năm.</p>
        <div className="fp-tier-layout">
          <div className="fp-tier-options" role="group" aria-label="Chọn mức đồng hành">
            {TIERS.map(item => {
              const TierIcon = TIER_ICONS[item.id] || Compass;
              return (
                <article key={item.id} data-tier={item.id} className={'fp-tier-card' + (tierId === item.id ? ' is-selected' : '') + (item.isPopular ? ' is-popular' : '') + (item.isFlagship ? ' is-flagship' : '')}>
                  {item.badge && <span className={'fp-tier-pill-badge' + (item.isPopular ? ' is-popular' : item.isFlagship ? ' is-flagship' : '')}>{item.badge}</span>}
                  <span className="fp-tier-top">
                    <span className={'fp-tier-symbol fp-tier-symbol-' + item.id} aria-hidden="true">
                      <TierIcon className="fp-tier-icon-svg" />
                    </span>
                    <span className="fp-tier-identity">
                      <strong>{item.name}</strong>
                      <small>{item.english}</small>
                    </span>
                  </span>
                  <span id={'fp-tier-' + item.id + '-cost'} className="fp-tier-cost">
                    <strong>{item.price}<span>triệu</span></strong>
                    <small>{item.billing}</small>
                  </span>
                  <span id={'fp-tier-' + item.id + '-focus'} className="fp-tier-focus">{item.scope}</span>
                  <p className="fp-tier-summary">{item.summary}</p>
                  <button className="fp-button fp-tier-choose" onClick={() => chooseTier(item)}>
                    Chọn gói {item.name} <ArrowRight aria-hidden="true" />
                  </button>
                  <button
                    aria-label={'Quyền lợi gói ' + item.name}
                    aria-describedby={'fp-tier-' + item.id + '-cost fp-tier-' + item.id + '-focus'}
                    aria-pressed={tierId === item.id}
                    aria-controls="fp-tier-detail"
                    className="fp-tier-select"
                    onClick={() => setTierId(item.id)}
                  >
                    {tierId === item.id ? 'Đang xem quyền lợi' : 'Xem quyền lợi'}
                    {tierId === item.id ? <CheckCircle2 aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
                  </button>
                </article>
              );
            })}
          </div>
          <div id="fp-tier-detail" className="fp-tier-detail" data-tier={tier.id} aria-live="polite" aria-atomic="true">
            <div className="fp-tier-story">
              <span className="fp-detail-label">{tier.focus}</span>
              <div className="fp-tier-story-header">
                {(() => {
                  const CurrentIcon = TIER_ICONS[tier.id] || Compass;
                  return <CurrentIcon className="fp-tier-story-icon" aria-hidden="true" />;
                })()}
                <h3>Quyền lợi gói {tier.name}</h3>
              </div>
              <p>{tier.target}</p>
              <small>Chọn gói là bước chuẩn bị đề xuất, chưa phải ký kết hay thanh toán.</small>
            </div>
            <div className="fp-tier-features">
              <h4>Phạm vi và hạng mục dự kiến</h4>
              <ul>{tier.features.map(item => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}</ul>
            </div>
          </div>
        </div>
        <div className="fp-pricing-assurance"><ShieldCheck aria-hidden="true" /><p><strong>Không mua thứ hạng matching.</strong> Các nhóm năng lực là định hướng để chọn gói, không phải giới hạn từ khóa. Hạng mục, thuế, nội dung cần sản xuất mới và chi phí bổ sung phải được làm rõ trong đề xuất thương mại.</p><a href="#fp-principles">Xem nguyên tắc <ArrowUpRight aria-hidden="true" /></a></div>
      </section>
      <section id="fp-scope" className="fp-section" aria-labelledby="fp-scope-title">
        <div className="fp-section-intro"><h2 id="fp-scope-title">Bắt đầu từ năng lực của bạn.</h2><p>Mô tả các nhóm sản phẩm hoặc dịch vụ thực tế, nơi có thể phục vụ và tài liệu đang có. Các lựa chọn ngành, nhu cầu và địa bàn bên dưới là thông tin tham chiếu để trao đổi, không phải các khoản phí riêng.</p></div>
        <div className="fp-configurator">
          <div className="fp-config-fields">
            <div className="fp-field-grid">
              <Field id="capabilityNotes" label="Các nhóm năng lực và phạm vi phục vụ" wide><textarea id="fp-capabilityNotes" rows={4} value={form.capabilityNotes} onChange={e => { setReviewing(false); updateForm('capabilityNotes', e.target.value); }} placeholder="Ví dụ: gia công CNC, đồ gá; sản phẩm tiêu biểu; phục vụ Đồng Nai và Bình Dương; có hồ sơ thiết bị và catalogue..." /></Field>
              <Field id="category" label="Chuyên mục ngành"><select id="fp-category" value={scope.categorySlug} onChange={e => updateScope('categorySlug', e.target.value)}>{CURATED_CATEGORIES.map(item => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></Field>
              <Field id="cluster" label="Cụm nhu cầu"><select id="fp-cluster" value={scope.clusterId} disabled={!clusters.length} onChange={e => updateScope('clusterId', e.target.value)}>{!clusters.length && <option value="">Chưa có cụm nhu cầu cho ngành này</option>}{clusters.map(item => <option key={item.id} value={item.id}>{clusterName(item)}</option>)}</select></Field>
              <Field id="location" label="Địa bàn"><select id="fp-location" value={scope.location} onChange={e => updateScope('location', e.target.value)}>{LOCATIONS.map(item => <option key={item}>{item}</option>)}</select></Field>
              <Field id="kcn" label="Khu công nghiệp (nếu có)"><input id="fp-kcn" value={scope.kcn} onChange={e => updateScope('kcn', e.target.value)} placeholder="Tên KCN hoặc để trống" /></Field>
              <Field id="period" label="Thời hạn dự kiến"><select id="fp-period" value={scope.period} onChange={e => updateScope('period', e.target.value)}>{['6_MONTHS', '12_MONTHS', '24_MONTHS', 'CUSTOM'].map(item => <option key={item} value={item}>{durationLabel(item)}</option>)}</select></Field>
              <Field id="position" label="Vị trí hiển thị đề xuất"><select id="fp-position" value={scope.position} onChange={e => updateScope('position', e.target.value)}>{POSITIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
            </div>
            <fieldset className="fp-entitlements"><legend>Hạng mục quan tâm</legend><div>{Object.keys(ENTITLEMENT_TYPES).map(key => <label key={key} className="fp-checkbox"><input type="checkbox" checked={services.includes(key)} onChange={e => { setReviewing(false); setServices(prev => e.target.checked ? [...prev, key] : prev.filter(item => item !== key)); }} /><span>{serviceName(key)}</span></label>)}</div></fieldset>
            <p className="fp-field-note">Không cần liệt kê đủ mọi từ khóa. Nếu doanh nghiệp có nhiều nhóm năng lực hoặc nhiều địa bàn, mô tả ở ô phía trên. CCU cần đối chiếu trước khi xác nhận phạm vi; các trường tham chiếu không giới hạn toàn bộ năng lực của doanh nghiệp.</p>
            <p className="fp-field-note">Hạng mục quan tâm không mặc nhiên được bao gồm trong gói. Nếu đổi thời hạn khác gói đang chọn, cần xác nhận lại ngân sách; trang không tự tính một báo giá mới.</p>
          </div>
          <aside className="fp-scope-preview" aria-label="Tóm tắt phạm vi đang chọn">
            <h3>Phạm vi bạn đang đề xuất</h3>{scopeSummary}
            <div className="fp-preview-services"><span>{services.length ? 'Hạng mục quan tâm' : 'Chưa chọn hạng mục'}</span><ul>{services.map(key => <li key={key}>{serviceName(key)}</li>)}</ul></div>
            <button className="fp-button" onClick={() => scrollTo('fp-proposal')}>Trao đổi phạm vi <ArrowRight aria-hidden="true" /></button>
            <small>Chưa xác nhận năng lực, chưa kích hoạt tài trợ. Đề xuất cần được đối chiếu trước khi ký kết.</small>
          </aside>
        </div>
      </section>
      <section id="fp-principles" className="fp-section fp-principles" aria-labelledby="fp-principles-title">
        <div className="fp-section-heading"><p className="fp-eyebrow">Nguyên tắc minh bạch</p><h2 id="fp-principles-title">Trả phí cho hiện diện.<br />Không trả phí cho thứ hạng.</h2><p>Founding Partner hỗ trợ phạm vi hiện diện thương mại. SUPPI vẫn đối chiếu thông tin thực tế, không lấy gói tài trợ làm lý do ưu tiên kết quả.</p><div className="fp-matching-factors" aria-label="Các yếu tố matching SUPPI">{['Nhu cầu', 'Năng lực', 'Địa bàn', 'Thời gian', 'Khả năng đáp ứng'].map(item => <span key={item}>{item}</span>)}</div><p className="fp-field-note">Các yếu tố này được xem xét cùng nhau. Thanh toán không thay thế dữ liệu năng lực, thời gian giao hàng hay khả năng đáp ứng một yêu cầu cụ thể.</p></div>
        <div className="fp-principle-content"><div className="fp-label-example"><span className="fp-sponsor-label">Đối tác tài trợ chuyên mục</span><p>Khối tài trợ cần có nhãn rõ ràng và tách biệt với kết quả tìm kiếm tự nhiên. Nhãn này không phải dấu “đã xác minh”.</p></div><ul className="fp-rules">{['Không cam kết số lead, lượt liên hệ hoặc đơn hàng.', 'Không mua thứ hạng matching, độc quyền nhu cầu hay loại nhà cung ứng khác khỏi kết quả.', 'Không phải chứng nhận chất lượng hoặc quy trình xác minh doanh nghiệp.', 'Không tạo tư cách đồng sáng lập, nhà đầu tư, cổ đông hay quyền quản trị CCU.', 'Không cho phép truy cập thông tin riêng tư của bên mua khi chưa có quyền.'].map(item => <li key={item}><X aria-hidden="true" /><span>{item}</span></li>)}</ul></div>
      </section>
      <section className="fp-section fp-process" aria-labelledby="fp-process-title"><div className="fp-section-intro"><h2 id="fp-process-title">Từ năng lực đến kế hoạch đồng hành.</h2><p>Chọn gói chỉ là điểm bắt đầu. Phạm vi và quyền lợi được đối chiếu, thống nhất trước khi triển khai.</p></div><ol>{[
        ['Mô tả năng lực', 'Sản phẩm, dịch vụ, địa bàn phục vụ và tài liệu doanh nghiệp đang có.'],
        ['Đối chiếu phạm vi', 'Làm rõ nhóm năng lực, điểm hiện diện phù hợp và gói cần trao đổi.'],
        ['Thống nhất hạng mục', 'Chốt giá, thời hạn, khối tài trợ, nội dung và điều kiện triển khai bằng thỏa thuận.'],
        ['Bàn giao & xem lại', 'Đối soát đầu việc bằng minh chứng; xem lại phạm vi khi năng lực hoặc kế hoạch thay đổi.'],
      ].map(([title, description]) => <li key={title}><h3>{title}</h3><p>{description}</p></li>)}</ol></section>
      <section id="fp-proposal" className="fp-section fp-proposal" aria-labelledby="fp-proposal-title">
        <div className="fp-proposal-intro"><h2 id="fp-proposal-title">Chưa chắc chọn gói nào?<br />Bắt đầu từ nhu cầu của bạn.</h2><p>Cho CCU biết doanh nghiệp cung ứng được gì và muốn giới thiệu năng lực tới ai. Có thể chuẩn bị đề xuất trước, chưa cần chọn gói hoặc quyết định ngân sách.</p><p>Với KCN, ban quản lý, hội/hiệp hội muốn tổ chức chương trình, hoặc nhà đầu tư tìm hiểu góp vốn: xem hình thức hợp tác phù hợp tại trung tâm Hợp tác. Founding Partner không thay thế các vai trò này.</p><div className="fp-local-notice"><FileText aria-hidden="true" /><div><strong>Đề xuất trên bản hiện tại</strong><p>Thông tin chỉ lưu trên trình duyệt này, chưa gửi đến máy chủ hoặc đội ngũ CCU. Không tạo hợp đồng, không kích hoạt tài trợ.</p></div></div><Link className="fp-text-link" to="/hop-tac">Tìm hình thức hợp tác khác <ArrowUpRight aria-hidden="true" /></Link></div>
        <div className="fp-proposal-form">
          {result ? <div className="fp-saved" role="status"><CheckCircle2 aria-hidden="true" /><h3>Đã lưu đề xuất trên trình duyệt.</h3><p>Mã đề xuất: <strong>{result.publicCode}</strong></p><p>Trạng thái INQUIRY. Đề xuất này chưa được gửi đến CCU và chưa kích hoạt hợp tác.</p>{result.isConflictWarning && <p>Có thể có xung đột với phạm vi trong dữ liệu hiện có. Cần kiểm tra khi trao đổi chính thức.</p>}<button className="fp-button fp-button-secondary" onClick={() => { setResult(null); setReviewing(false); }}>Quay lại chỉnh thông tin <ArrowRight aria-hidden="true" /></button></div>
          : reviewing ? <div className="fp-review" ref={reviewRef} tabIndex={-1}><p className="fp-eyebrow">Kiểm tra trước khi lưu</p><h3>Đề xuất của {form.companyName}</h3><dl className="fp-contact-summary"><div><dt>Người liên hệ</dt><dd>{form.contactName} · {form.roleTitle}</dd></div><div><dt>Liên lạc</dt><dd>{form.contactEmail}<br />{form.contactPhone}</dd></div><div><dt>Ngân sách</dt><dd>{form.budget}</dd></div><div><dt>Mục tiêu</dt><dd>{form.objective || 'Chưa bổ sung'}</dd></div></dl>{scopeSummary}<p>Hạng mục: {services.length ? services.map(serviceName).join(', ') : 'Chưa chọn'}</p><p className="fp-field-note">Lưu vào trình duyệt của bạn. Đây chưa phải bước gửi đăng ký chính thức.</p>{saveError && <p className="fp-error" role="alert">{saveError}</p>}<div className="fp-form-actions"><button className="fp-button fp-button-secondary" onClick={() => setReviewing(false)}>Chỉnh thông tin</button><button className="fp-button" disabled={saving} onClick={saveInquiry}>{saving ? 'Đang lưu...' : 'Lưu đề xuất trên máy'}<ArrowRight aria-hidden="true" /></button></div></div>
          : <form noValidate onSubmit={startReview}>
            <h3>Thông tin doanh nghiệp</h3><p className="fp-form-hint">Các mục có dấu * cần được bổ sung.</p>
            {Object.values(errors).some(Boolean) && <p className="fp-error" role="alert">Vui lòng kiểm tra các mục được đánh dấu bên dưới.</p>}
            <div className="fp-field-grid">
              {[
                ['companyName', 'Tên doanh nghiệp / tổ chức *', 'text', 'Tên đầy đủ của doanh nghiệp', 'organization', true],
                ['contactName', 'Người liên hệ *', 'text', 'Họ và tên', 'name', false],
                ['roleTitle', 'Chức vụ *', 'text', 'Chức vụ hoặc bộ phận', 'organization-title', false],
                ['contactEmail', 'Email công việc *', 'email', 'email@doanhnghiep.vn', 'email', false],
                ['contactPhone', 'Điện thoại / Zalo *', 'tel', 'Số điện thoại liên hệ', 'tel', false],
              ].map(([key, label, type, placeholder, autoComplete, wide]) => <Field key={key} id={key} label={label} error={errors[key]} wide={wide}><input id={'fp-' + key} name={key} required type={type} autoComplete={autoComplete} placeholder={placeholder} value={form[key]} onChange={e => updateForm(key, e.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? 'fp-' + key + '-error' : undefined} /></Field>)}
              <Field id="objective" label="Mục tiêu đồng hành" wide><textarea id="fp-objective" rows={3} placeholder="Năng lực muốn giới thiệu, nhóm khách hàng và nội dung quan tâm..." value={form.objective} onChange={e => updateForm('objective', e.target.value)} /></Field>
              <Field id="budget" label="Ngân sách dự kiến" wide><select id="fp-budget" value={form.budget} onChange={e => { setReviewing(false); updateForm('budget', e.target.value); const nextPlan = TIERS.find(item => item.budget === e.target.value); if (nextPlan) { setTierId(nextPlan.id); setScope(prev => ({ ...prev, period: nextPlan.period })); } }}>{['Cần tư vấn gói phù hợp', ...TIERS.map(item => item.budget)].map(item => <option key={item}>{item}</option>)}</select></Field>
            </div>
            <div className="fp-form-scope"><div><strong>Phạm vi đang đề xuất</strong><a href="#fp-scope">Thay đổi <ArrowUpRight aria-hidden="true" /></a></div><p>{form.capabilityNotes || 'Chưa mô tả các nhóm năng lực.'}<br /><span>Tham chiếu: {category?.name}, {scope.location}, {durationLabel(scope.period)}</span></p></div>
            <label className="fp-checkbox fp-consent" htmlFor="fp-consent"><input id="fp-consent" type="checkbox" checked={form.consent} onChange={e => updateForm('consent', e.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'fp-consent-error' : undefined} /><span>Tôi đồng ý để CCU liên hệ về đề xuất khi thông tin được gửi chính thức. Tôi hiểu tài trợ không tạo quyền sở hữu, xác minh hay ưu tiên matching.</span></label>
            {errors.consent && <p className="fp-error" id="fp-consent-error">Vui lòng đồng ý để CCU liên hệ về đề xuất này.</p>}
            <button type="submit" className="fp-button fp-form-submit">Xem lại đề xuất <ArrowRight aria-hidden="true" /></button>
          </form>}
        </div>
      </section>
      <section className="fp-section fp-faq" aria-labelledby="fp-faq-title">
        <div><h2 id="fp-faq-title">Những điều khách hàng thường hỏi.</h2><p>Hiểu rõ phạm vi, chi phí và nguyên tắc trước khi chuẩn bị đề xuất.</p></div>
        <div>{FOUNDING_FAQS.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
      </section>
      <div className="fp-closing"><div><h2>Đưa đúng năng lực đến đúng nhu cầu.</h2><p>Bắt đầu bằng nhóm năng lực chính. Chọn gói vừa sức, thống nhất phạm vi trước khi đồng hành.</p></div><a href="#fp-proposal">Trao đổi phạm vi <ArrowUpRight aria-hidden="true" /></a></div>
    </div>
  </div>;
}
