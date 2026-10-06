import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, CalendarCheck, ImageOff, Search } from 'lucide-react';
import './AssistantDuoStage.css';

const assistants = [
  {
    id: 'suppi', name: 'SUPPI', caption: 'Tìm nhà cung cấp', title: 'TRỢ LÝ TÌM NGUỒN', Icon: Search,
    description: 'Làm rõ sản phẩm, quy cách và khu vực cần tìm; hỗ trợ tra cứu nhà cung cấp và soạn yêu cầu báo giá.',
  },
  {
    id: 'chainy', name: 'CHAINY', caption: 'Điều phối kết nối', title: 'TRỢ LÝ ĐIỀU PHỐI', Icon: CalendarCheck,
    description: 'Chuẩn bị nội dung kết nối, lịch gặp, gửi mẫu và báo giá; giúp doanh nghiệp xác định việc cần làm tiếp theo.',
  },
];

const CLOCKWISE = [
  'right',
  'down-right',
  'down',
  'down-left',
  'left',
  'up-left',
  'up',
  'up-right',
];
const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 60;

const DIRECTION_OFFSETS = {
  'up-left': { row: 0, col: 0 },
  'up': { row: 0, col: 1 },
  'up-right': { row: 0, col: 2 },
  'left': { row: 1, col: 0 },
  'center': { row: 1, col: 1 },
  'right': { row: 1, col: 2 },
  'down-left': { row: 2, col: 0 },
  'down': { row: 2, col: 1 },
  'down-right': { row: 2, col: 2 },
};

function wrap(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function LaptopMascot({ assistant, direction }) {
  const [state, setState] = useState('loading');
  const dir = direction || (assistant.id === 'suppi' ? 'down-left' : 'down-right');
  const offset = DIRECTION_OFFSETS[dir] || DIRECTION_OFFSETS[assistant.id === 'suppi' ? 'down-left' : 'down-right'];
  const imgStyle = {
    top: `${-(offset.row * 100)}%`,
    left: `${-(offset.col * 100)}%`,
  };

  return (
    <span className={'ccu-duo-mascot ccu-duo-mascot--' + assistant.id} data-mascot={assistant.id} data-media-state={state} aria-busy={state === 'loading'}>
      {state === 'error' ? (
        <span className="ccu-duo-image-fallback" role="status"><ImageOff size={24} aria-hidden="true" />{assistant.name}<span>Hình chưa tải được</span></span>
      ) : (
        <img
          src={'/mascots/' + assistant.id + '-directions.webp?v=8'}
          width="1080"
          height="1080"
          decoding="async"
          loading="lazy"
          alt={'Mascot ' + assistant.name + ' cầm laptop của CCU'}
          style={imgStyle}
          onLoad={() => setState('success')}
          onError={() => setState('error')}
        />
      )}
    </span>
  );
}

export default function AssistantDuoStage({ titleId = 'ccu-assistant-title', linkComponent: ActionLink = 'a' }) {
  const [directionSuppi, setDirectionSuppi] = useState('down-left');
  const [directionChainy, setDirectionChainy] = useState('down-right');
  const stageRef = useRef(null);
  const sectorRef = useRef(-1);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const resetToWorkingAngle = () => {
      sectorRef.current = -1;
      setDirectionSuppi('down-left');
      setDirectionChainy('down-right');
    };

    const onPointerMove = (event) => {
      const stage = stageRef.current;
      if (stage) {
        const box = stage.getBoundingClientRect();
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;

        if (Math.hypot(dx, dy) < DEAD_ZONE) {
          sectorRef.current = -1;
          setDirectionSuppi('center');
          setDirectionChainy('center');
        } else {
          const angle = Math.atan2(dy, dx);
          const currSector = sectorRef.current;
          if (currSector === -1 || Math.abs(wrap(angle - currSector * SECTOR)) >= SECTOR / 2 + HYSTERESIS) {
            const nextSector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
            sectorRef.current = nextSector;
            const nextDir = CLOCKWISE[nextSector];
            setDirectionSuppi(nextDir);
            setDirectionChainy(nextDir);
          }
        }
      }

      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(resetToWorkingAngle, 3000);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="ccu-assistant-duo" data-assistant-duo data-composition="duo-stage" aria-labelledby={titleId}>
      <header className="ccu-duo-heading">
        <h2 id={titleId}>CÓ VIỆC. <span>CÓ TRỢ LÝ.</span></h2>
        <p>Hai trợ lý AI giúp doanh nghiệp làm rõ nhu cầu tìm nguồn và chuẩn bị các bước kết nối.</p>
      </header>
      <div className="ccu-duo-stage" ref={stageRef}>
        <div className="ccu-duo-identity ccu-duo-identity--suppi"><strong>SUPPI</strong><span>{assistants[0].caption}</span></div>
        <figure className="ccu-duo-pair" aria-label="Hai mascot SUPPI và CHAINY hiện có của CCU">
          <LaptopMascot assistant={assistants[0]} direction={directionSuppi} />
          <LaptopMascot assistant={assistants[1]} direction={directionChainy} />
        </figure>
        <div className="ccu-duo-identity ccu-duo-identity--chainy"><strong>CHAINY</strong><span>{assistants[1].caption}</span></div>
      </div>
      <div className="ccu-duo-roles">
        {assistants.map((assistant, index) => {
          const destination = '/tro-ly-ai?assistant=' + assistant.id;
          const linkProps = ActionLink === 'a' ? { href: destination } : { to: destination };
          return (
            <React.Fragment key={assistant.id}>
              {index === 1 && <ArrowRight className="ccu-duo-transfer" size={32} aria-hidden="true" />}
              <article className={'ccu-duo-role ccu-duo-role--' + assistant.id}>
                <assistant.Icon size={24} aria-hidden="true" />
                <div className="ccu-duo-role-copy"><h3>{assistant.name} <span>{assistant.title}</span></h3><p>{assistant.description}</p></div>
                <ActionLink {...linkProps} className={'ccu-duo-action ccu-duo-action--' + assistant.id} data-assistant-link={assistant.id}>Hỏi {assistant.name}<ArrowUpRight size={19} aria-hidden="true" /></ActionLink>
              </article>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
