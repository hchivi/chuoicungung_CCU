import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
const browser = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page = await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
let checks=0;const screenshots=[];
const base='http://localhost:3000/docs/testing/assistant-homepage-options.html';
try {
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.goto(base,{waitUntil:'networkidle2'});
  for(const width of [320,375,414,768,1024,1280,1440,1920]){
    await page.setViewport({width,height:1200});
    for(const option of ['journey','desk','editorial']){
      await page.click('[data-design-option="'+option+'"]');
      await page.waitForSelector('[data-assistant-option="'+option+'"]');
      await page.waitForFunction(()=>[...document.querySelectorAll('[data-mascot]')].every(el=>el.dataset.mediaState==='success'));
      const state=await page.$eval('#ai-design-result',root=>{
        const nodes=[...root.querySelectorAll('*')];
        const overflow=nodes.filter(el=>getComputedStyle(el).display!=='none').filter(el=>{
          if(el.tagName==='IMG')return false; // Intentional sprite sheet clipping within its viewport.
          const b=el.getBoundingClientRect();return b.width>0&&(b.left < -1||b.right>innerWidth+1);
        }).map(el=>el.className);
        const controls=[...root.querySelectorAll('button,a')].map(el=>({h:el.getBoundingClientRect().height,w:el.getBoundingClientRect().width,whiteSpace:getComputedStyle(el).whiteSpace}));
        const nameLines=[...root.querySelectorAll('.ccu-duo-identity strong,.ai-selector-name,.ai-poster-copy h3')].map(el=>{
          const range=document.createRange();range.selectNodeContents(el);
          return {name:el.textContent,lines:new Set([...range.getClientRects()].map(rect=>Math.round(rect.top))).size};
        });
        return {nameLines,overflow,documentOverflow:document.documentElement.scrollWidth>innerWidth,controls,mascots:root.querySelectorAll('[data-mascot]').length,mascotWidths:[...root.querySelectorAll('[data-mascot]')].map(el=>el.getBoundingClientRect().width),links:[...root.querySelectorAll('[data-assistant-link]')].map(el=>el.getAttribute('href'))};
      });
      assert.deepEqual(state.overflow,[],option+' '+width);assert.equal(state.documentOverflow,false);
      assert.equal(state.mascots,2);assert.ok(state.controls.every(c=>c.h>=44&&c.w>=44&&c.whiteSpace==='nowrap'));
      assert.ok(state.nameLines.every(name=>name.lines===1),'Mascot names must not split: '+option+' '+width+' '+JSON.stringify(state.nameLines));
      if(width>=1280)assert.ok(state.mascotWidths.every(w=>w>=300),'Desktop mascots must dominate visually: '+option);
      assert.ok(state.links.includes('/tro-ly-ai?assistant=suppi'));assert.ok(state.links.includes('/tro-ly-ai?assistant=chainy'));
      if(option==='desk'){
        for(const role of ['chainy','suppi']){
          await page.focus('[data-assistant-task="'+role+'"]');await page.keyboard.press('Enter');
          assert.equal(await page.$eval('#ai-option-task-panel .ai-option-name',el=>el.textContent),role.toUpperCase());
          assert.equal(await page.$$eval('[data-assistant-task][aria-pressed=true]',els=>els.length),1);
          assert.equal(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'solid');
        }
      }
      if([320,375,414,768,1280].includes(width)){
        await page.evaluate(()=>document.activeElement.blur());
        const path='/tmp/ccu-assistant-'+option+'-'+width+'.png';await (await page.$('#ai-design-result')).screenshot({path});screenshots.push(path);
      }
      checks++;
    }
  }
  const contrast=await page.evaluate(()=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const luminance=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);const rgb=[...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
    const s=getComputedStyle(document.querySelector('.ai-options'));
    return [['--ai-ink','--ai-surface'],['--ai-muted','--ai-surface'],['--ai-muted','--ai-mint'],['--ai-green','--ai-mint'],['--ai-surface','--ai-green'],['--ai-surface','--ai-green-light'],['--ai-error','--ai-surface'],['--ai-ink','--ai-stage'],['--ai-muted','--ai-stage'],['--ai-outline-ink','--ai-surface']].map(([fg,bg])=>{const a=luminance(s.getPropertyValue(fg)),b=luminance(s.getPropertyValue(bg));return {fg,bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};});
  });
  assert.ok(contrast.every(pair=>pair.ratio>=4.5),JSON.stringify(contrast));
  for(const option of ['journey','desk','editorial']){
    const failure=await browser.newPage();await failure.setRequestInterception(true);
    failure.on('request',r=>r.url().includes('/mascots/')?r.abort():r.continue());
    await failure.goto(base+'?option='+option,{waitUntil:'networkidle2'});
    await failure.waitForFunction(()=>document.querySelectorAll('[data-media-state=error]').length===2);
    assert.equal(await failure.$$eval('[data-assistant-link]',els=>els.length),2);await failure.close();
  }
  await page.goto(base+'?option=unknown',{waitUntil:'networkidle2'});await page.waitForSelector('[data-assistant-option=journey]');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({verdict:'PASS',checks,breakpoints:8,variants:3,keyboard:'both desk tasks',imageFailures:'3/3 keep both routes',contrast,errors,screenshots,visualRegression:'INCONCLUSIVE: no committed baseline',aiBackend:'not called or validated'},null,2));
}finally{await browser.close();}
