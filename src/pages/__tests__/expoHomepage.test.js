import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

async function markup() {
  const entry=fileURLToPath(new URL('../../components/home/SupplyChainExpoPaper3D.jsx',import.meta.url));
  const result=await build({entryPoints:[entry],bundle:true,write:false,platform:'node',format:'cjs',external:['react','react-dom','react-router-dom'],loader:{'.css':'empty'}});
  const mod=new Module(entry);mod.filename=entry;mod.paths=Module._nodeModulePaths(fileURLToPath(new URL('../..',import.meta.url)));mod._compile(result.outputFiles[0].text,entry);
  const {StaticRouter}=createRequire(import.meta.url)('react-router-dom/server');
  return renderToStaticMarkup(React.createElement(StaticRouter,{location:'/'},React.createElement(mod.exports.default)));
}
test('business visitors can read the event purpose without a WebGL canvas',async()=>{
  const html=await markup();
  assert.match(html,/<h2[^>]*id="expo-home-title"/);
  assert.match(html,/NGÀY HỘI/);assert.match(html,/CHUỖI CUNG ỨNG/);
  assert.match(html,/Sourcing Day/);assert.match(html,/href="\/chuong-trinh"/);
  assert.doesNotMatch(html,/<canvas|Official Program|2026|đảm bảo|cam kết|phù hợp nhất/);
  const source=await readFile(new URL('../../components/home/SupplyChainExpoPaper3D.jsx',import.meta.url),'utf8');
  assert.doesNotMatch(source,/from 'three'|createPaperTexture|requestAnimationFrame|touch-none/);
});
test('approved exhibition invitation has a ticket frame without the yellow photo note',async()=>{
  const html=await markup();
  assert.match(html,/data-expo-invitation/);
  assert.match(html,/data-expo-invitation-ticket/);
  assert.match(html,/Trân trọng mời doanh nghiệp/);
  assert.doesNotMatch(html,/data-expo-invitation-note|Xem mẫu\.<br/);
  assert.doesNotMatch(html,/class="expo-home-banner"|class="expo-home-participation"/);
  assert.match(html,/aria-live="polite"/);
  assert.match(html,/data-photo-state="loading"/);
});
test('factory, supplier and organizer choices each have a real scoped next step',async()=>{
  const {EXPO_HOME_ROLES,resolveExpoRole}=await import('../../components/home/expoHomepageContent.js');
  assert.deepEqual(EXPO_HOME_ROLES.map(role=>role.id),['buyer','supplier','organizer']);
  assert.equal(resolveExpoRole('supplier').label,'Nhà cung cấp');
  assert.equal(resolveExpoRole('organizer').label,'Hội / Hiệp hội / Tổ chức');
  assert.match(resolveExpoRole('buyer').href,/role=buyer/);
  assert.match(resolveExpoRole('supplier').href,/role=supplier/);
  assert.equal(resolveExpoRole('organizer').href,'/dich-vu/to-chuc-ket-noi');
  for(const bad of [null,'',undefined,'admin',{},42])assert.equal(resolveExpoRole(bad).id,'buyer');
  for(const role of EXPO_HOME_ROLES){assert.ok(role.benefits.length===3);assert.ok(role.title.length>0);assert.ok(role.action.length>0);}
});
test('role choices expose their selected state and accessible changing content',async()=>{
  const html=await markup();
  assert.equal((html.match(/data-expo-role=/g)||[]).length,3);
  assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
  assert.match(html,/aria-controls="expo-home-role-panel"/);
  assert.match(html,/id="expo-home-role-panel"/);
  assert.match(html,/aria-labelledby="expo-home-role-buyer"/);
  assert.match(html,/href="\/tim-hieu-hinh-thuc-tham-gia\?role=buyer"/);
});
test('editorial photograph reserves space, loads lazily and has a working error fallback',async()=>{
  const html=await markup();
  assert.match(html,/data-expo-photo/);assert.match(html,/loading="lazy"/);
  assert.match(html,/width="1536" height="1024"/);
  assert.match(html,/alt="Doanh nghiệp trao đổi nhu cầu và xem mẫu sản phẩm tại bàn kết nối B2B"/);
  const source=await readFile(new URL('../../components/home/SupplyChainExpoPaper3D.jsx',import.meta.url),'utf8');
  assert.match(source,/onError=/);assert.match(source,/role="status"/);
});
test('light brand styling is scoped with explicit mobile and reduced-motion rules',async()=>{
  const css=await readFile(new URL('../../components/home/ExpoHomepage.css',import.meta.url),'utf8');
  assert.match(css,/\.expo-home/);assert.match(css,/minmax\(0,/);
  assert.match(css,/min-width: 48rem/);assert.match(css,/prefers-reduced-motion: reduce/);
  assert.match(css,/focus-visible/);assert.doesNotMatch(css,/backdrop-filter|100vh|text-shadow|transition:\s*all/);
  for(const state of ['is-hover','is-focus','is-active','disabled','loading','error','success']) assert.ok(css.includes(state),state);
});
test('body, role labels and primary CTA token colors meet AA text contrast',async()=>{
  const tokens=await readFile(new URL('../../../tokens.css',import.meta.url),'utf8');
  const scoped=tokens.match(/\.expo-home\s*\{([^}]+)\}/)[1];
  const color=name=>scoped.match(new RegExp('--expo-'+name+':\\s*(#[a-f0-9]{6})','i'))[1];
  const luminance=hex=>{
    const channels=hex.replace('#','').match(/../g).map(value=>parseInt(value,16)/255)
      .map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
    return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
  };
  for(const [fg,bg]of [['ink','paper'],['muted','paper'],['green','paper'],['green-deep','mint'],['surface','green-light'],['surface','green-deep']]){
    const foreground=color(fg),background=color(bg);
    const a=luminance(foreground),b=luminance(background);
    assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,foreground+' / '+background);
  }
});
