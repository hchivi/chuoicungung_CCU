// One collector and at most one offline exporter. No browser/DB/network setup
// here: dependencies are supplied by the authorized session's caller.
export async function runArchivePipeline({ collect, exportData, onState = async () => {}, deadlineMs, now = Date.now, batchPages = 120 }) {
  if (typeof collect !== 'function' || typeof exportData !== 'function' || typeof deadlineMs !== 'number' || Number.isNaN(deadlineMs) || !Number.isInteger(batchPages) || batchPages < 1) throw new Error('Invalid pipeline options');
  const state = { state: 'running', batches: 0, lastExport: null, reason: null };
  let pending = null, generation = 0, exportedGeneration = 0, exportFailure = null, failure = null;
  const beginExport = () => {
    const target = generation;
    pending = Promise.resolve().then(exportData).then(result => {
      state.lastExport = result;
      exportedGeneration = target;
    }).catch(error => { exportFailure = error; }).finally(() => { pending = null; });
  };
  try {
    await onState({ ...state });
    while (now() < deadlineMs) {
      if (exportFailure) throw exportFailure;
      const result = await collect({ maxPages: batchPages, deadlineMs, onProgress: () => { if (exportFailure) throw exportFailure; } });
      generation++;
      state.batches++;
      if (exportFailure) throw exportFailure;
      if (!pending) beginExport();
      await onState({ ...state });
      if (result.complete || result.reason !== 'page-limit') {
        state.reason = result.complete ? 'queue-complete' : result.reason;
        break;
      }
    }
    state.reason ||= 'time-budget';
  } catch (error) { failure = error; }
  // Drain the one exporter before returning or surfacing an error, so a
  // restart never overlaps writers. Flush the newest completed manifest.
  if (pending) await pending;
  failure ||= exportFailure;
  if (!failure && exportedGeneration < generation) {
    beginExport();
    await pending;
    failure = exportFailure;
  }
  state.state = 'stopped';
  if (failure) state.reason = 'error';
  await onState({ ...state });
  if (failure) throw failure;
  return state;
}
