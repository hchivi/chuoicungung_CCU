import React from 'react';
import { Link } from 'react-router-dom';
import './EcosystemConnectSection.css';

const paths = [
  {
    role: 'Nhà máy',
    title: 'Tìm nguồn cung cho nhu cầu của bạn.',
    description: 'Mô tả sản phẩm, dịch vụ hoặc công việc cần thực hiện để nhà cung cấp hiểu rõ yêu cầu.',
    preparation: ['Quy cách', 'Số lượng', 'Tiến độ'],
    action: 'Đăng nhu cầu',
    destination: '/dang-nhu-cau',
    variant: 'buyer',
  },
  {
    role: 'Nhà cung cấp',
    title: 'Đưa năng lực đến gần bên mua.',
    description: 'Giới thiệu ngành nghề, sản phẩm và khả năng đáp ứng để nhà máy có cơ sở tìm hiểu doanh nghiệp.',
    preparation: ['Ngành nghề', 'Pha cung ứng', 'Hình ảnh năng lực'],
    action: 'Giới thiệu năng lực',
    destination: '/tao-ho-so',
    variant: 'supplier',
  },
];

export default function EcosystemConnectSection() {
  return (
    <section className="ecosystem-connect" id="ket-noi" aria-labelledby="ecosystem-connect-title">
      <div className="ecosystem-connect__statement">
        <div className="ecosystem-connect__intro">
          <h2 id="ecosystem-connect-title" className="font-heading">
            <span>Nhu cầu</span>
            <span>gặp năng lực.</span>
          </h2>
          <p>Mỗi doanh nghiệp là một mắt xích.
            Bắt đầu từ điều bạn cần, hoặc điều bạn làm tốt.</p>
        </div>
        <figure className="ecosystem-connect__visual">
          <img
            src="/images/roles/hero_card_supplier_cnc.jpg"
            alt="Xưởng gia công CNC với máy móc và đội ngũ kỹ thuật"
            width="1376" height="768" loading="lazy" decoding="async"
          />
          <figcaption>Hệ sinh thái Chuỗi Cung Ứng</figcaption>
        </figure>
      </div>

      <div className="ecosystem-connect__paths">
        <p className="ecosystem-connect__prompt">Doanh nghiệp của bạn muốn bắt đầu từ đâu?</p>
        {paths.map((path) => (
          <article className={`ecosystem-connect__path ecosystem-connect__path--${path.variant}`} key={path.role}>
            <p className="ecosystem-connect__role">{path.role}</p>
            <h3 className="font-heading">{path.title}</h3>
            <p className="ecosystem-connect__description">{path.description}</p>
            <div className="ecosystem-connect__next">
              <div className="ecosystem-connect__prepare">
                <p>Thông tin nên có</p>
                <ul aria-label={`Thông tin ${path.role.toLowerCase()} nên chuẩn bị`}>
                  {path.preparation.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <Link className={`ecosystem-connect__action ecosystem-connect__action--${path.variant}`} to={path.destination}>
                <span>{path.action}</span><span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
