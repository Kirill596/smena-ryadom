import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import vm from 'node:vm';
const config = JSON.parse(readFileSync('public/config.json', 'utf8'));
const chunk = readdirSync('docs/_next/static/chunks').find(n => /^986-/.test(n));
const bundle = readFileSync('docs/_next/static/chunks/' + chunk, 'utf8');
const component = bundle.slice(bundle.indexOf('function isSamokat('), bundle.indexOf('var c=t(6475)'));
assert(component.length > 1000);
const offer = {id:'samokat-courier',employer:'Самокат',title:'Approved title',description:'Approved copy',income:'Approved income',city_ids:[],apply_url:'https://example.com/stale'};
function render(item, {detail = false, ready = true} = {}) {
  let call = 0;
  const state = [[item], config.affiliateUrl, '', '', detail ? item.id : '', ready];
  const jsx = (type, props) => ({type, ...props});
  const context = vm.createContext({s:{useState:() => [state[call++],()=>{}],useEffect:()=>{}},
    i:{jsx,jsxs:jsx},r:{us:item},o:{E:[]},n:{l:p=>'/smena-ryadom'+p},srText:v=>v,ev:()=>{},URL,String});
  return vm.runInContext(component + '\nl(' + JSON.stringify({vacancyId:detail?item.id:''}) + ')', context);
}
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree,...[tree.children].flat(Infinity).flatMap(nodes)];
}
for (const item of [offer,{...offer,id:'another-samokat-offer',employer:' Самокат '}]) {
  for (const ready of [false,true]) for (const detail of [false,true]) {
    const cta = nodes(render(item,{ready,detail})).find(n=>n.className==='button');
    assert.equal(cta.type,'a');
    assert.equal(cta.href,config.affiliateUrl);
    assert.equal(cta.onClick,undefined);
  }
}
const other = {...offer,id:'other',employer:'Another partner'};
assert.match(nodes(render(other)).find(n=>n.className==='button').href,/\/jobs\/samokat-courier\?offer=other$/);
assert.equal(nodes(render(other,{detail:true})).find(n=>n.className==='button').type,'button');
assert.equal(JSON.parse(readFileSync('docs/config.json')).affiliateUrl,config.affiliateUrl);
assert.equal(config.subIdParam,'');
console.log('PASS: 8 Samokat CTA cases, stale URL override, other partner routes, centralized config, no extra parameters.');
