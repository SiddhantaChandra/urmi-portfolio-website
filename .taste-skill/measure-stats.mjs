import { Browser } from 'file:///C:/Users/SidDev/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const browser = await Browser.launch();
try {
for (const width of [1440,1024,768,640,390,320]) {
const page = await browser.newPage({width,height:1000,reducedMotion:true});
await page.goto('http://localhost:3000',{settleMs:500});
console.log(JSON.stringify({width,bounds:await page.eval(() => Object.fromEntries(['h1','button','.instagram-stats','.hero-portrait','.hero-sakura-art','#about article'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return [s,{x:r.x,y:r.y,w:r.width,h:r.height}]})))}));
await page.send('Target.closeTarget',{targetId:page.targetId});
}
} finally {await browser.close()}

