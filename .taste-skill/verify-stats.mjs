import { Browser } from 'file:///C:/Users/SidDev/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const browser = await Browser.launch();
try {
for (const width of [320,390,640,768,1024,1440]) {
const page = await browser.newPage({width,height:1000,reducedMotion:true});
await page.goto('http://localhost:3000',{settleMs:300});
console.log(JSON.stringify(await page.eval(() => {
const stats=document.querySelector('.instagram-stats');
const r=stats.getBoundingClientRect();
const button=document.querySelector('button').getBoundingClientRect();
const cards=document.querySelector('#about article').getBoundingClientRect();
const selectors=['h1','button','.hero-sakura-art','#about article'];
const positions=()=>selectors.map(s=>{const b=document.querySelector(s).getBoundingClientRect();return [b.x,b.y,b.width,b.height]});
const before=positions();stats.style.display='none';const after=positions();stats.style.display='';
return {width:innerWidth,noLayoutShift:JSON.stringify(before)===JSON.stringify(after),belowButton:r.top>=button.bottom,aboveCards:r.bottom<cards.top,noOverflow:r.left>=0&&r.right<=innerWidth};
})));
if(width===390) await page.screenshot({path:'.taste-skill/stats-positioned/mobile-full.jpg',fullPage:true});
await page.send('Target.closeTarget',{targetId:page.targetId});
}
} finally {await browser.close()}
