import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OPTIONS, previewAssociations, associationView } from './model.js';

const entry = fileURLToPath(new URL('./Preview.jsx', import.meta.url));
const bundle = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom'], loader: { '.css': 'empty' } });
const module = new Module(entry); module.filename = entry; module.paths = Module._nodeModulePaths(fileURLToPath(new URL('.', import.meta.url))); module._compile(bundle.outputFiles[0].text, entry);
const { AssociationOptionCard } = module.exports;
const render = props => renderToStaticMarkup(React.createElement(AssociationOptionCard, { onClaim() {}, ...props }));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

test('exactly three distinct options share three unique existing organizations', () => {
  assert.deepEqual(OPTIONS.map(option => option.id), ['publication', 'folio', 'signature']);
  assert.equal(previewAssociations.length, 3); assert.equal(new Set(previewAssociations.map(item => item.id)).size, 3);
  const hooks = ['ac-publication__cover', 'ac-folio__connections', 'ac-signature__details'];
  OPTIONS.forEach((option, index) => { const html = render({ association: previewAssociations[0], variant: option.id }); assert.ok(html.includes(hooks[index])); hooks.filter((_, i) => i !== index).forEach(hook => assert.ok(!html.includes(hook))); });
});

test('every option retains complete source information and real profile destinations', () => {
  const snapshot = JSON.stringify(previewAssociations);
  for (const option of OPTIONS) for (const association of previewAssociations) {
    const html = render({ association, variant: option.id }); const view = associationView(association);
    for (const value of [view.name, view.geography, view.description, ...view.industries]) assert.ok(html.includes(escape(value)), `${option.id}: ${value}`);
    assert.ok(html.includes(escape(association.logo))); assert.ok(html.includes(`href="http://localhost:3000/hiep-hoi/${association.id}"`));
    for (const program of view.programs) { for (const value of [program.title, program.roleLabel, program.dates].filter(Boolean)) assert.ok(html.includes(escape(value))); if (program.href) assert.ok(html.includes(escape(program.href))); }
    assert.doesNotMatch(html, /<svg|hội viên xác thực|line-clamp|gradient/);
  }
  assert.equal(JSON.stringify(previewAssociations), snapshot);
});

test('generated default facts are suppressed and absent programs do not invent links', () => {
  const association = { id: 'TEST', name: 'Hội kiểm thử', profile: { id: 'ASSOC-PROF-TEST', establishedYear: 2016, confirmedMembersCount: 200 }, activePrograms: [{ title: 'Chưa công bố', programId: 'missing', roleLabel: 'Đồng tổ chức' }] };
  for (const option of OPTIONS) { const html = render({ association, variant: option.id }); assert.doesNotMatch(html, /2016|200|href="[^"]*chuong-trinh/); assert.match(html, /Đang cập nhật thông tin chương trình/); }
});

test('disabled, loading, image error and completion states are explicit', () => {
  for (const option of OPTIONS) {
    const base = { association: previewAssociations[0], variant: option.id };
    for (const state of ['disabled', 'loading']) assert.match(render({ ...base, state }), /disabled=""/);
    assert.match(render({ ...base, state: 'loading' }), /aria-busy="true"/);
    assert.match(render({ ...base, state: 'error' }), /data-image-state="error"/);
    assert.match(render({ ...base, state: 'success' }), /minh họa trong bản xem thử/);
  }
});
