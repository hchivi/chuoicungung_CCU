import React from 'react';
import './ProgramDiscovery.css';

export default function ProgramInvitationSignup({ data, industries, onChange, onSubmit, submitted, error = '' }) {
  const update = (key, value) => onChange({ ...data, [key]: value });
  const input = (key, label, type, placeholder, autoComplete) => <label className="pd-invitation-field" htmlFor={`invitation-${key}`}>
    <span>{label} <span aria-hidden="true">*</span></span>
    <input id={`invitation-${key}`} name={key} type={type} required autoComplete={autoComplete} placeholder={placeholder} value={data[key]} onChange={event => update(key, event.target.value)} />
  </label>;
  return <section id="dang-ky-thong-tin-phu-hop" className="pd-invitation" aria-labelledby="pd-invitation-title">
    <div className="pd-invitation-intro">
      <p className="pd-invitation-salutation">Dành cho doanh nghiệp của bạn</p>
      <h3 id="pd-invitation-title">Nhận thư mời.<br /><span>Đúng nhu cầu.</span></h3>
      <p>Chưa tìm thấy chương trình phù hợp? Chọn địa bàn và ngành hàng doanh nghiệp quan tâm.</p>
      <div className="pd-invitation-formats"><span>Ngày hội Chuỗi Cung Ứng</span><span>Gặp nhà cung ứng 1:1</span></div>
      <p className="pd-invitation-audience">Nhà máy · Nhà cung cấp<br />Hội / Hiệp hội / Tổ chức</p>
    </div>
    <div className="pd-invitation-content">
      {submitted ? <div className="pd-invitation-success" role="status" tabIndex={-1}>
        <h4>Đã lưu lựa chọn của bạn.</h4>
        <p>Địa bàn: <strong>{data.zone}</strong><br />Ngành hàng: <strong>{data.industry}</strong></p>
        <p>Thông tin được lưu trên trình duyệt này. Chưa có thư mời được gửi và chưa xác nhận suất tham gia.</p>
      </div> : <form onSubmit={onSubmit} aria-describedby="pd-invitation-storage">
        <h4>Thông tin nhận thư mời</h4>
        <div className="pd-invitation-fields">
          {input('name', 'Họ và tên', 'text', 'Nguyễn Văn A', 'name')}
          {input('company', 'Công ty / Nhà máy', 'text', 'Tên doanh nghiệp', 'organization')}
          {input('email', 'Email nhận thư mời', 'email', 'purchasing@company.vn', 'email')}
          {input('phone', 'Điện thoại / Zalo', 'tel', '0912 345 678', 'tel')}
        </div>
        <div className="pd-invitation-preferences">
          <label className="pd-invitation-field pd-invitation-zone" htmlFor="invitation-zone"><span>Địa bàn / KCN mong muốn</span><select id="invitation-zone" name="zone" value={data.zone} onChange={event => update('zone', event.target.value)}>
            <option value="Miền Nam">Miền Nam</option><option value="Miền Bắc">Miền Bắc</option><option value="Miền Trung">Miền Trung</option>
          </select></label>
          <label className="pd-invitation-field" htmlFor="invitation-industry"><span>Ngành hàng quan tâm</span><select id="invitation-industry" name="industry" value={data.industry} onChange={event => update('industry', event.target.value)}>{industries.map(industry => <option key={industry} value={industry}>{industry}</option>)}</select></label>
          <label className="pd-invitation-field" htmlFor="invitation-role"><span>Vai trò của bạn</span><select id="invitation-role" name="role" value={data.role} onChange={event => update('role', event.target.value)}><option value="supplier">Nhà cung cấp</option><option value="buyer">Nhà máy / Người mua</option><option value="partner">Hội / Hiệp hội / Tổ chức / KCN</option></select></label>
        </div>
        <label className="pd-invitation-consent"><input name="consent" type="checkbox" required checked={data.consent} onChange={event => update('consent', event.target.checked)} /><span>Tôi đồng ý nhận thông tin về chương trình và cơ hội chuỗi cung ứng theo lựa chọn trên.</span></label>
        {error && <p className="pd-invitation-error" role="alert">{error}</p>}
        <button className="pd-primary pd-invitation-submit" type="submit">Đăng ký nhận thư mời</button>
        <p id="pd-invitation-storage" className="pd-invitation-storage">Bản xem trước: thông tin chỉ được lưu trên trình duyệt, chưa gửi đến ban tổ chức.</p>
      </form>}
    </div>
  </section>;
}
