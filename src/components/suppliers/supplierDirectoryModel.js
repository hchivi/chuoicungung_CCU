export function getSupplierPhases(supplier, taxonomy, selectedPhase) {
  const ids = Array.isArray(supplier?.phases) ? supplier.phases : [];
  const matches = [...new Set(ids)].map(id => taxonomy.find(phase => phase.id === id)).filter(Boolean);
  return matches.sort((a, b) => Number(b.id === selectedPhase) - Number(a.id === selectedPhase));
}

export function normalizeDirectoryText(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();
}

export function findDirectoryCategories(categories, query) {
  const tokens = normalizeDirectoryText(query).split(/\s+/).filter(Boolean);
  return categories.filter(category => tokens.every(token => normalizeDirectoryText(category.name).includes(token)));
}

export function getSupplierMaskedPhone(supplier) {
  const recorded = [supplier?.phone, supplier?.hotline, supplier?.tel, supplier?.mobile, supplier?.contactPhone]
    .filter(value => value != null)
    .map(value => String(value).trim())
    .find(value => value.replace(/\D/g, '').length >= 7 || value.includes('•••'));
  if (!recorded) return '';
  if (recorded.includes('•••')) return recorded;
  let digits = recorded.replace(/\D/g, '');
  if (digits.startsWith('84') && digits.length > 9) digits = '0' + digits.slice(2);
  return `${digits.slice(0, 3)} ••• ${digits.slice(-3)}`;
}
