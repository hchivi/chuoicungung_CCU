// Presentation helpers only. Commercial state and persistence stay in the existing data layer.
export function getScopeClusters(clusters, category) {
  if (!category) return [];
  return clusters.filter(cluster => cluster.categorySlug === category.slug || cluster.categoryId === category.id);
}

export function resolveFoundingScope(categories, clusters, categoryParam, clusterParam) {
  const requestedCluster = clusters.find(cluster => cluster.id === clusterParam || cluster.slug === clusterParam);
  const category = categories.find(item => item.slug === categoryParam || item.id === categoryParam)
    || categories.find(item => item.slug === requestedCluster?.categorySlug || item.id === requestedCluster?.categoryId)
    || categories[0] || null;
  const available = getScopeClusters(clusters, category);
  return { category, cluster: available.find(item => item.id === requestedCluster?.id) || available[0] || null };
}

export function durationLabel(period) {
  return ({ '6_MONTHS': '6 tháng', '12_MONTHS': '12 tháng', '24_MONTHS': '24 tháng' })[period] || 'Theo thỏa thuận';
}

// Keep the existing inquiry schema: additional capability context travels in
// objective and is displayed verbatim in review. No keyword/location quota.
export function buildFoundingObjective({ objective, capabilityNotes, plan } = {}) {
  if (!capabilityNotes?.trim() && !plan) return objective?.trim() || '';
  return [
    plan && `Gói quan tâm: ${plan}`,
    capabilityNotes?.trim() && `Phạm vi năng lực đề xuất: ${capabilityNotes.trim()}`,
    objective?.trim() && `Mục tiêu đồng hành: ${objective.trim()}`,
  ].filter(Boolean).join('\n');
}

export function getFoundingErrors(data) {
  const errors = {};
  for (const [key, label] of [['companyName', 'tên doanh nghiệp'], ['contactName', 'người liên hệ'], ['roleTitle', 'chức vụ'], ['contactEmail', 'email'], ['contactPhone', 'số điện thoại']]) {
    if (!data[key]?.trim()) errors[key] = `Vui lòng bổ sung ${label}.`;
  }
  if (data.contactEmail?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim())) errors.contactEmail = 'Vui lòng nhập email hợp lệ.';
  if (data.contactPhone?.trim() && (!/^[+\d\s().-]+$/.test(data.contactPhone.trim()) || data.contactPhone.replace(/\D/g, '').length < 8)) errors.contactPhone = 'Vui lòng kiểm tra số điện thoại.';
  if (!data.consent) errors.consent = 'Vui lòng đồng ý để CCU liên hệ về đề xuất này.';
  return errors;
}
