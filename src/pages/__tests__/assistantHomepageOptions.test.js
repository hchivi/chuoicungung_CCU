import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ASSISTANT_OPTIONS, resolveAssistantOption } from '../../components/home/assistantHomepageOptionsUi.js';

async function load() {
  const entry=fileURLToPath(new URL('../../components/home/AssistantHomepageOptions.jsx',import.meta.url));
  const result=await build({entryPoints:[entry],bundle:true,write:false,platform:'node',format:'cjs',external:['react','react-dom'],loader:{'.css':'empty'}});
  const mod=new Module(entry);mod.filename=entry;mod.paths=Module._nodeModulePaths(fileURLToPath(new URL('../..',import.meta.url)));mod._compile(result.outputFiles[0].text,entry);
  return mod.exports;
}
test('three distinct alternatives retain the two original laptop mascots and both assistant routes',async()=>{
  const {default:Block,ASSISTANT_OPTIONS}=await load();
  assert.deepEqual(ASSISTANT_OPTIONS.map(x=>x.id),['journey','desk','editorial']);
  for(const option of ASSISTANT_OPTIONS){
    const html=renderToStaticMarkup(React.createElement(Block,{option:option.id}));
    assert.match(html,new RegExp('data-assistant-option="'+option.id+'"'));
    assert.match(html,/\/mascots\/suppi-directions.webp\?v=8/);
    assert.match(html,/\/mascots\/chainy-directions.webp\?v=8/);
    assert.match(html,/href="\/tro-ly-ai\?assistant=suppi"/);
    assert.match(html,/href="\/tro-ly-ai\?assistant=chainy"/);
    assert.doesNotMatch(html,/21.680|đảm bảo|phù hợp nhất|—|–/);
  }
});
test('invalid options fall back safely without changing the homepage mount',async()=>{
  const {default:Block}=await load();
  for(const option of ASSISTANT_OPTIONS)assert.equal(resolveAssistantOption(option.id),option);
  for(const bad of [undefined,null,{},42,'<script>',''])assert.equal(resolveAssistantOption(bad).id,'journey');
  const html=renderToStaticMarkup(React.createElement(Block,{option:'bad'}));
  assert.match(html,/data-assistant-option="journey"/);
  const home=await readFile(new URL('../HomePage.jsx',import.meta.url),'utf8');
  assert.doesNotMatch(home,/AssistantHomepageOptions/);
});
test('review-only selector and state demo have accessible native controls and no AI network calls',async()=>{
  const {default:Block}=await load();
  const html=renderToStaticMarkup(React.createElement(Block,{option:'desk'}));
  assert.match(html,/aria-pressed="true"/);assert.match(html,/aria-live="polite"/);
  const css=await readFile(new URL('../../components/home/AssistantHomepageOptions.css',import.meta.url),'utf8');
  for(const state of ['is-hover','is-focus','is-active','disabled','loading','error','success'])assert.ok(css.includes(state),state);
  assert.match(css,/prefers-reduced-motion: reduce/);assert.match(css,/minmax\(0,/);
  assert.doesNotMatch(css,/transition:\s*all|text-shadow|backdrop-filter|100vh/);
  const entry=await readFile(new URL('../../components/home/AssistantHomepageOptionsPreview.jsx',import.meta.url),'utf8');
  assert.doesNotMatch(entry,/fetch\(|localStorage|sessionStorage/);
  const page=await readFile(new URL('../../../docs/testing/assistant-homepage-options.html',import.meta.url),'utf8');
  assert.match(page,/noindex,nofollow/);
});
test('second revision replaces plain role grids with three different mascot-led compositions', async()=>{
  const {default:Block}=await load();
  const concepts={journey:'duo-stage',desk:'visual-selector',editorial:'brand-poster'};
  for(const [option,composition] of Object.entries(concepts)){
    const html=renderToStaticMarkup(React.createElement(Block,{option}));
    assert.match(html,new RegExp('data-composition="'+composition+'"'));
    assert.equal((html.match(/data-mascot=/g)||[]).length,2);
    assert.doesNotMatch(html,/ai-option-role|ai-option-journey|ai-option-editorial-roles/);
  }
  const desk=renderToStaticMarkup(React.createElement(Block,{option:'desk'}));
  assert.match(desk,/aria-label="Chọn SUPPI tìm nguồn"/);
  assert.match(desk,/aria-label="Chọn CHAINY theo việc"/);
});
