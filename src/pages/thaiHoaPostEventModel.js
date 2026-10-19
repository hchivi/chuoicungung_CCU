import { EVENT_ID } from './thaiHoaEventLandingModel.js';
import { publicResults, safeMediaUrl } from '../components/programs/programWorkflowModel.js';

const list = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' ? value.trim() : '';
const count = value => Number.isSafeInteger(value) && value >= 0 ? value : null;
export const OUTCOME_TYPES = [
  { id: 'CONTINUE', label: 'Tiếp tục trao đổi', color: '#0065ef' },
  { id: 'QUOTE', label: 'Báo giá', color: '#f17a00' },
  { id: 'SURVEY', label: 'Khảo sát', color: '#04ac72' },
  { id: 'SAMPLE', label: 'Gửi mẫu', color: '#42b7c6' },
  { id: 'SECOND_MEETING', label: 'Meeting lần 2', color: '#879cc0' },
  { id: 'NOT_FIT', label: 'Chưa phù hợp', color: '#c5d3e7' },
];

// Public aggregates only. Owner-specific follow-up tasks must never be read
// from this public bootstrap record, even when the visitor is signed in.
export function postEventSnapshot(program = {}, participants = []) {
  const programId = program.id || EVENT_ID;
  const THAI_HOA_IDS = new Set([EVENT_ID, 'PRG-2026-TEAMKCN-THAIHOA', 'biz-matching-kcn-thai-hoa-team-kcn']);
  const isSameProgram = id => !id || id === programId || (THAI_HOA_IDS.has(programId) && THAI_HOA_IDS.has(id));
  const approved = item => item?.visibility === 'PUBLIC' && item?.publishStatus === 'PUBLISHED' && isSameProgram(item.programId);
  const source = program.workflowContent?.postEvent;
  const published = approved(source);
  const data = published ? source : {};
  const metrics = Object.fromEntries(['registered', 'attended', 'checkedIn', 'buyers', 'suppliers', 'meetings', 'needs', 'nextActions'].map(key => [key, count(data.metrics?.[key])]));
  const byId = new Map(participants.map(item => [item.id, item]));
  const attended = [...new Set(list(data.attendedParticipantIds))].map(id => byId.get(id)).filter(Boolean);
  const rawOutcomes = list(data.outcomes);
  const outcomes = OUTCOME_TYPES.map(type => ({ ...type, count: count(rawOutcomes.find(item => item?.id === type.id)?.count), percent: null }));
  const total = outcomes.reduce((sum, item) => sum + (item.count || 0), 0);
  const validOutcomes = rawOutcomes.length === OUTCOME_TYPES.length && outcomes.every(item => item.count !== null) && Number.isSafeInteger(total) && total > 0 && (metrics.meetings === null || total === metrics.meetings);
  if (validOutcomes) outcomes.forEach(item => { item.percent = item.count / total * 100; });
  const seenThemes = new Set();
  const themes = list(data.demandThemes).filter(item => {
    const label = text(item?.label);
    if (!label || seenThemes.has(label) || count(item.count) === null) return false;
    seenThemes.add(label);
    return true;
  }).map(item => ({ label: text(item.label), count: item.count })).sort((a, b) => b.count - a.count);
  const themeTotal = themes.reduce((sum, item) => sum + item.count, 0);
  themes.forEach(item => { item.percent = Number.isSafeInteger(themeTotal) && themeTotal > 0 ? item.count / themeTotal * 100 : null; });
  const seenDocuments = new Set();
  const documents = list(data.documents).filter(item => {
    if (!approved(item) || !text(item.id) || !text(item.title) || !safeMediaUrl(item.url) || seenDocuments.has(item.id)) return false;
    seenDocuments.add(item.id);
    return true;
  }).map(item => ({ id: item.id, title: text(item.title), url: safeMediaUrl(item.url), kind: text(item.kind), sizeBytes: count(item.sizeBytes) }));
  const media = [];
  const seenMedia = new Set();
  list(data.media).forEach(item => {
    if (!approved(item) || !['PHOTO', 'VIDEO'].includes(item.kind) || !safeMediaUrl(item.url) || seenMedia.has(item.url)) return;
    seenMedia.add(item.url);
    media.push({ id: text(item.id) || item.url, kind: item.kind, url: safeMediaUrl(item.url), caption: text(item.caption) || 'Tư liệu sự kiện đã công bố', poster: safeMediaUrl(item.poster) });
  });
  publicResults({ ...program, id: programId }).photos.forEach(item => {
    if (seenMedia.has(item.url)) return;
    seenMedia.add(item.url);
    media.push({ ...item, kind: 'PHOTO' });
  });
  return { published, isHypothetical: Boolean(source?.isHypothetical), metrics, attended, matchedSuggestions: count(data.matchedSuggestions), outcomes, outcomeTotal: validOutcomes ? total : null, themes, documents, report: documents.find(item => item.kind === 'SUMMARY') || null, media };
}
