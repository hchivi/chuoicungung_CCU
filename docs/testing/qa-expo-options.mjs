import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { EXPO_HOME_ROLES } from '../../src/components/home/expoHomepageContent.js';
const browser = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let checks = 0;
const screenshots = [];
try {
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.goto('http://localhost:3000/docs/testing/expo-homepage-options.html', {waitUntil:'networkidle2'});
  for (const width of [320,375,414,768,1024,1280,1440,1920]) {
    await page.setViewport({width,height:1700});
    for (const option of ['invitation','table','poster']) {
      await page.click('[data-design-option="'+option+'"]');
      await page.waitForSelector(option === 'invitation' ? '[data-expo-invitation]' : '[data-expo-option="'+option+'"]');
      const root = '#expo-design-review-result';
      await page.$eval(root, el => el.scrollIntoView({behavior:'instant',block:'start'}));
      await page.waitForFunction(() => {const img=document.querySelector('#expo-design-review-result img[width="1536"]'); return img?.complete && img.naturalWidth > 0;});
      const selector = option === 'invitation' ? 'data-expo-role' : 'data-option-role';
      for (const role of EXPO_HOME_ROLES) {
        await page.focus('['+selector+'="'+role.id+'"]');
        await page.keyboard.press('Enter');
        const expectedLink = option === 'invitation' ? '[data-expo-role-link]' : '[data-option-cta]';
        await page.waitForFunction(({s,href})=>document.querySelector(s)?.getAttribute('href')===href,{}, {s:expectedLink,href:role.href});
        const state = await page.$eval(root, rootEl => {
          const controls=[...rootEl.querySelectorAll('button,a')];
          const overflow=[...rootEl.querySelectorAll('*')].filter(el=>getComputedStyle(el).display!=='none').some(el=>{const b=el.getBoundingClientRect();return b.width>0&&(b.left < -1 || b.right>window.innerWidth+1);});
          return {overflow, selected:rootEl.querySelectorAll('[aria-pressed="true"]').length, controls:controls.map(el=>({height:el.getBoundingClientRect().height, nowrap:getComputedStyle(el).whiteSpace})),focus:getComputedStyle(document.activeElement).outlineStyle};
        });
        assert.equal(state.overflow,false,'overflow: '+option+' '+width+' '+role.id);
        assert.equal(state.selected,1);
        assert.equal(state.focus,'solid');
        assert.ok(state.controls.every(c=>c.height>=44 && c.nowrap==='nowrap'),'control sizing: '+option+' '+width);
        checks++;
      }
      if ([375,1280].includes(width)) {
        await page.focus('['+selector+'="buyer"]'); await page.keyboard.press('Enter');
        await page.$eval(root,el=>document.activeElement.blur());
        const path='/tmp/ccu-expo-'+option+'-'+width+'.png';
        await (await page.$(root)).screenshot({path}); screenshots.push(path);
      }
    }
  }
  // Real image errors: every design retains its role controls and destination.
  for(const option of ['invitation','table','poster']) {
    const failure=await browser.newPage();
    await failure.setRequestInterception(true);
    failure.on('request',request=>request.url().includes('/images/services/sourcing-')?request.abort():request.continue());
    await failure.goto('http://localhost:3000/docs/testing/expo-homepage-options.html?option='+option,{waitUntil:'networkidle2'});
    await failure.$eval('#expo-design-review-result',el=>el.scrollIntoView());
    await failure.waitForSelector(option==='invitation'?'.expo-home-photo-fallback':'.expo-option-photo-error');
    const roleSelector=option==='invitation'?'data-expo-role':'data-option-role';
    await failure.click('['+roleSelector+'="supplier"]');
    const linkSelector=option==='invitation'?'[data-expo-role-link]':'[data-option-cta]';
    assert.equal(await failure.$eval(linkSelector,el=>el.getAttribute('href')),EXPO_HOME_ROLES[1].href);
    await failure.close();
  }
  // Canvas converts the approved ivory ticket to sRGB for actual contrast checking.
  await page.click('[data-design-option="invitation"]');
  const contrast=await page.$eval('[data-expo-invitation-ticket]',el=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const sample=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});};
    const luminance=rgb=>rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
    const styles=getComputedStyle(el),a=luminance(sample(styles.color)),b=luminance(sample(styles.backgroundColor));
    return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  });
  assert.ok(contrast>=4.5);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({verdict:'PASS',checks,options:3,breakpoints:8,roles:3,errors,screenshots,imageFailures:'3/3 usable',ivoryTicketContrast:contrast,visualRegression:'INCONCLUSIVE — no committed baseline'},null,2));
} finally { await browser.close(); }
