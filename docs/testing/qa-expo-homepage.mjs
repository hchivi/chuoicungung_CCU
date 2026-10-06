import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { EXPO_HOME_ROLES } from '../../src/components/home/expoHomepageContent.js';

const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage();
const errors=[],failedResponses=[],results=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)failedResponses.push({status:response.status(),url:response.url()});});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const root='[data-expo-home]';
async function bringIntoView(){await page.$eval(root,el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-130,behavior:'instant'}));}
async function choose(role){
  await page.focus('[data-expo-role="'+role.id+'"]');
  await page.keyboard.press('Enter');
  await page.waitForFunction(id=>document.querySelector('[data-expo-role="'+id+'"]').getAttribute('aria-pressed')==='true',{},role.id);
  assert.equal(await page.$eval('[data-expo-role-link]',el=>el.getAttribute('href')),role.href);
  assert.equal(await page.$eval('#expo-home-role-panel h3',el=>el.textContent),role.title);
  assert.equal(await page.$eval('#expo-home-role-panel',el=>el.getAttribute('aria-labelledby')),'expo-home-role-'+role.id);
}
try {
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.goto('http://localhost:3000/',{waitUntil:'networkidle2'});
  await page.waitForSelector(root);
  assert.equal(await page.$('[data-expo-invitation-note]'),null,'Removed yellow photo note');
  await page.waitForSelector('[data-expo-invitation-ticket]');
  for(const width of [320,375,414,768,1024,1280,1440,1920]){
    await page.setViewport({width,height:1000});await bringIntoView();
    await page.waitForFunction(()=>{const img=document.querySelector('[data-expo-photo]');return img&&img.complete&&img.naturalWidth>0;});
    for(const role of EXPO_HOME_ROLES){
      await choose(role);
      const state=await page.$eval(root,el=>{
        const box=el.getBoundingClientRect();
        const controls=[...el.querySelectorAll('a,button')];
        const overflow=[...el.querySelectorAll('*')].some(child=>{const b=child.getBoundingClientRect();return b.width>0&&(b.left<box.left-1||b.right>box.right+1);});
        const title=el.querySelector('h2');
        // Count actual text lines, not the global Vietnamese-diacritic padding on h2/span.
        const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT),lineTops=new Set();
        while(walker.nextNode()){
          const range=document.createRange();range.selectNodeContents(walker.currentNode);
          for(const rect of range.getClientRects())lineTops.add(Math.round(rect.top));
        }
        return {overflow,canvas:el.querySelectorAll('canvas').length,
          titleLines:lineTops.size,
          selected:el.querySelectorAll('[aria-pressed="true"]').length,
          focus:getComputedStyle(document.activeElement).outlineStyle,
          controls:controls.map(control=>({height:control.getBoundingClientRect().height,wrap:getComputedStyle(control).whiteSpace})),
          photo:el.querySelector('[data-expo-photo]').currentSrc,
          background:getComputedStyle(el).backgroundColor};
      });
      assert.equal(state.overflow,false,'Block overflow: '+width+' '+role.id);
      assert.equal(state.canvas,0);assert.equal(state.selected,1);assert.equal(state.focus,'solid');
      assert.ok(state.titleLines<=2.1,'Title lines at '+width+': '+state.titleLines);
      assert.ok(state.controls.every(item=>item.height>=44));
      assert.equal(state.background,'rgb(245, 248, 246)');
      results.push({width,role:role.id,...state});
    }
    await choose(EXPO_HOME_ROLES[0]);
    if([375,1280].includes(width)){
      // Tall screenshot viewport keeps the global sticky header/mascot outside the crop.
      await page.setViewport({width,height:1700});await bringIntoView();await page.mouse.move(0,0);
      await page.$eval(root,el=>document.activeElement.blur());
      await (await page.$(root)).screenshot({path:'/tmp/ccu-expo-home-'+width+'.png'});
    }
  }
  await page.setViewport({width:1280,height:1000});await bringIntoView();
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  const cta=await page.$('[data-expo-program-link]');const box=await cta.boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await delay(250);
  assert.notEqual(await page.$eval('[data-expo-program-link] svg',el=>getComputedStyle(el).transform),'none');
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  assert.equal(await page.$eval('[data-expo-program-link] svg',el=>getComputedStyle(el).transform),'none');
  await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:'dark'}]);
  assert.equal(await page.$eval(root,el=>getComputedStyle(el).backgroundColor),'rgb(245, 248, 246)');
  // Native read-only navigations. Never submit the registration form.
  for(const role of EXPO_HOME_ROLES){
    await page.goto('http://localhost:3000/',{waitUntil:'networkidle2'});await page.waitForSelector(root);await bringIntoView();await choose(role);
    await page.focus('[data-expo-role-link]');await page.keyboard.press('Enter');
    await page.waitForFunction(href=>location.pathname+location.search===href,{},role.href);
    if(role.id!=='organizer'){
      // Lazy routes may retain the previous page for one paint after the URL changes.
      const expected=role.id==='buyer'?'CẦN MUA':'CUNG CẤP SẢN PHẨM / DỊCH VỤ';
      await page.waitForFunction(text=>[...document.querySelectorAll('#main-content form strong')].some(el=>el.textContent===text),{},expected);
    }else await page.waitForSelector('.mm-page');
  }
  await page.goto('http://localhost:3000/',{waitUntil:'networkidle2'});await page.waitForSelector(root);await bringIntoView();
  await page.focus('[data-expo-program-link]');await page.keyboard.press('Enter');
  await page.waitForFunction(()=>location.pathname==='/chuong-trinh');
  await page.waitForFunction(()=>!document.querySelector('[data-expo-home]')&&document.querySelector('#main-content h1'));
  const fallbackPage=await browser.newPage();await fallbackPage.setRequestInterception(true);
  fallbackPage.on('request',request=>request.url().includes('sourcing-meeting-home-v1')?request.abort():request.continue());
  await fallbackPage.goto('http://localhost:3000/',{waitUntil:'networkidle2'});
  await fallbackPage.waitForSelector(root);
  await fallbackPage.$eval(root,el=>el.scrollIntoView());
  await fallbackPage.waitForSelector('.expo-home-photo-fallback[role="status"]');
  assert.equal(await fallbackPage.$eval('[data-expo-role-link]',el=>el.getAttribute('href')),EXPO_HOME_ROLES[0].href);
  await fallbackPage.close();
  assert.deepEqual(errors,[]);assert.deepEqual(failedResponses,[]);
  console.log(JSON.stringify({verdict:'PASS',checks:results.length,breakpoints:[...new Set(results.map(item=>item.width))],
    roles:'3 selected-state and destination checks at every breakpoint',
    title:'2 lines; readable DOM text; no WebGL',motion:'hover response and live reduced-motion fallback',
    interactions:'keyboard selection, focus rings, 44px targets, program link and all three role destinations',
    errorFallback:'blocked photograph: status and next step stay usable',
    errors,failedResponses,visualRegression:'INCONCLUSIVE: no committed baseline',screenshots:['/tmp/ccu-expo-home-1280.png','/tmp/ccu-expo-home-375.png']},null,2));
}finally{
  const ownChrome=browser.process();
  const timer=setTimeout(()=>{browser.disconnect();ownChrome?.kill('SIGTERM');},5000);
  try{await browser.close();}finally{clearTimeout(timer);}
}
process.exit(0);
