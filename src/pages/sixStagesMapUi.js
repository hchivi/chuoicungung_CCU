import { stagesData } from '../data/mockData.js';

// Bright stage identity colors remain decorative; darker inks keep small text readable.
export const MAP_STAGE_PALETTES = {
  1: { ink: '#6b21a8', surface: '#f6f0ff', selected: '#eee2ff' },
  2: { ink: '#047857', surface: '#edf9f2', selected: '#ddf3e6' },
  3: { ink: '#9a3412', surface: '#fff5ed', selected: '#ffeadb' },
  4: { ink: '#075985', surface: '#eef8ff', selected: '#dcefff' },
  5: { ink: '#854d0e', surface: '#fffae6', selected: '#fff0c2' },
  6: { ink: '#9f1239', surface: '#fff1f3', selected: '#ffe0e7' }
};

export function mapStageStyle(id) {
  const stage = stagesData.find(item => item.id === id) || stagesData[0];
  const palette = MAP_STAGE_PALETTES[stage.id];
  return {
    '--stage-color': stage.color,
    '--stage-ink': palette.ink,
    '--stage-surface': palette.surface,
    '--stage-selected': palette.selected
  };
}

export function resolveMapSelection(savedStage, savedPhase) {
  const stage = stagesData.find(item => String(item.id) === String(savedStage)) || stagesData[0];
  const phase = stagesData.flatMap(item => item.phases).find(item => item.id === savedPhase);
  if (savedStage === 'all') return { stageId: 'all', phaseId: (phase || stage.phases[0]).id };
  return { stageId: stage.id, phaseId: phase?.stageId === stage.id ? phase.id : stage.phases[0].id };
}

export function selectMapStage(selection, stageId) {
  return resolveMapSelection(stageId, selection.phaseId);
}

export function selectMapPhase(selection, phaseId) {
  const stage = stagesData.find(item => item.phases.some(phase => phase.id === phaseId));
  if (!stage) return resolveMapSelection(selection.stageId, selection.phaseId);
  return { stageId: selection.stageId === 'all' ? 'all' : stage.id, phaseId };
}

export function getMapContext(selection) {
  const resolved = resolveMapSelection(selection.stageId, selection.phaseId);
  const stage = stagesData.find(item => item.phases.some(phase => phase.id === resolved.phaseId));
  return { stage, phase: stage.phases.find(item => item.id === resolved.phaseId) };
}

export function mapKeywordHref(keyword) {
  const slug = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `/tu-khoa/${slug}?q=${encodeURIComponent(keyword)}`;
}
