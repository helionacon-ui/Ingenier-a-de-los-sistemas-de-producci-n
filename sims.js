/* Figuras interactivas de Ingeniería de los Sistemas de Producción. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* ---------- helpers Ingeniería de los Sistemas de Producción ---------- */
const NR=(x,d)=>{if(!isFinite(x))return '—';const s=x.toFixed(d===undefined?2:d);return (Math.abs(parseFloat(s))<1e-12?(0).toFixed(d===undefined?2:d):s).replace('.',',');};
const N0=x=>NR(x,0),NM=x=>Math.round(x).toLocaleString('es-ES'),N1=x=>NR(x,1),N2=x=>NR(x,2),N3=x=>NR(x,3),N4=x=>NR(x,4);
function Rbox(a,x,y,w,h,col,r){const g=a.g;r=r||5;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.fillStyle=col;g.fill();}
function Rline(a,x,y,w,h,col,r,lw){const g=a.g;r=r||5;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.strokeStyle=col;g.lineWidth=lw||1.5;g.stroke();}
function alpha(a,v,fn){a.g.save();a.g.globalAlpha=v;fn();a.g.restore();}
function poly(a,pts,col,fill,lw){const g=a.g;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();
 if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=lw||1.5;g.stroke();}}

/* 1 · Flujos del proceso */
SIMS.flujos=el=>build(el,{w:680,h:300,
 selects:[{k:'tipo',l:'Tipo de flujo de material',v:'div',opts:[['dir','Directo — conservación de masa'],['div','Divergente — reducción de masa'],['con','Convergente — unión']]}],
 sliders:[{k:'m',l:'Masa de entrada',v:100,min:20,max:200,step:5,u:'g'},
  {k:'p',l:'Material eliminado o añadido',v:40,min:0,max:90,step:5,u:'%'}],
 draw(a){a.clear();const s=a.st,T=s.tipo;
  const ox=56,cy=140,bw=98,bh=74;
  /* caja del proceso */
  Rline(a,ox+152,cy-bh/2,bw,bh,C.a,6,2);
  a.txt('PROCESO',ox+152+bw/2,cy+4,C.a,13,'center');
  /* entradas */
  const ent = T==='con' ? [['Material 1',-34],['Material 2',0]] : [['Material',-34]];
  const flujos = T==='con' ? [['Material 1',-30],['Material 2',0],['Energía',30]] : [['Material',-30],['Energía',0],['Información',30]];
  flujos.forEach(f=>{const y=cy+f[1];
    a.arrow(ox+62,y,ox+148,y,f[0].indexOf('Material')===0?C.a:C.muted,2);
    a.txt(f[0],ox+58,y+4,f[0].indexOf('Material')===0?C.a:C.muted,11.5,'right');});
  a.txt('(e)',ox+10,cy+50,C.muted,11);
  /* salidas */
  const sal = T==='div' ? [['Material',-30],['Desperdicio',0],['Energía',30]]
            : [['Material',-30],['Energía',0],['Información',30]];
  sal.forEach(f=>{const y=cy+f[1];
    a.arrow(ox+152+bw,y,ox+152+bw+86,y,f[0].indexOf('Material')===0?C.a:(f[0]==='Desperdicio'?C.d:C.muted),2);
    a.txt(f[0],ox+152+bw+92,y+4,f[0].indexOf('Material')===0?C.a:(f[0]==='Desperdicio'?C.d:C.muted),11.5);});
  a.txt('(s)',ox+152+bw+92,cy+50,C.muted,11);
  /* balance de masa */
  const me=s.m;
  let ms1,ms2=0;
  if(T==='dir'){ms1=me;}
  else if(T==='div'){ms1=me*(1-s.p/100);ms2=me*s.p/100;}
  else {ms1=me*(1+s.p/100);}
  const px=56,py=232;
  a.txt('Balance de masa',px,py,C.a,13);
  const ecu = T==='dir' ? 'M(s) = M(e) = '+N0(me)+' g'
    : (T==='div' ? 'M(e) = M(s)₁ + M(s)₂ → '+N0(me)+' = '+N1(ms1)+' + '+N1(ms2)
    : 'M(s) = M(e)₁ + M(e)₂ → '+N1(ms1)+' = '+N0(me)+' + '+N1(ms1-me));
  a.txt(ecu,px,py+24,C.text,13);
  const apro = T==='div' ? (100-s.p) : 100;
  a.txt('Aprovechamiento del material: '+N0(apro)+' %',px,py+46,apro<70?C.d:C.c,12);
  /* barra */
  const bx=404,by=226,bwb=226;
  alpha(a,0.12,()=>Rbox(a,bx,by,bwb,18,C.text,3));
  Rbox(a,bx,by,bwb*apro/100,18,apro<70?C.d:C.c,3);
  a.txt('pieza',bx+6,by+13,C.bg,10.5);
  if(apro<100)a.txt('desperdicio',bx+bwb-6,by+13,C.muted,10.5,'right');
  a.txt(T==='dir'?'forja · extrusión · laminación · estirado':(T==='div'?'fresado · torneado · taladrado · electroerosión':'soldadura · remachado · adhesivos'),bx,by+40,C.muted,11);
  a.html(T==='dir'
   ? 'En un proceso <b>directo</b> la masa se conserva: la pieza sólo cambia de forma. El aprovechamiento es prácticamente total, y por eso un tornillo recalcado gasta mucho menos material que uno torneado.'
   : (T==='div'
   ? 'En un proceso <b>divergente</b> se elimina material: del proceso salen dos flujos, la pieza y la viruta. Sube el porcentaje eliminado y mira el aprovechamiento: con un 40 % de viruta ya se tira casi la mitad del material.<br>Regla que decide: <b>la geometría final debe quedar circunscrita</b> en la inicial.'
   : 'En un proceso <b>convergente</b> entran varios componentes y sale uno: es un ensamblado. La masa final es la suma de las masas de los componentes, más el material de aporte si lo hay.'));
 }});

/* 2 · Regímenes de temperatura */
SIMS.temperatura=el=>build(el,{w:680,h:300,
 selects:[{k:'mat',l:'Material',v:'acero',opts:[['acero','Acero  (Tf = 1538 °C)'],['al','Aluminio  (Tf = 660 °C)'],['cu','Cobre  (Tf = 1085 °C)'],['pb','Plomo  (Tf = 327 °C)'],['ti','Titanio  (Tf = 1668 °C)']]}],
 sliders:[{k:'T',l:'Temperatura de trabajo',v:1100,min:0,max:1700,step:10,u:'°C'}],
 draw(a){a.clear();const s=a.st;
  const TF={acero:1538,al:660,cu:1085,pb:327,ti:1668}[s.mat];
  const TfK=TF+273;
  const Tr=0.3*TfK-273, Trec=0.5*TfK-273;
  const T=s.T;
  let reg,col,desc;
  if(T>TF){reg='FUNDIDO';col=C.d;desc='por encima de la temperatura de fusión';}
  else if(T>=Trec){reg='CALIENTE';col=C.b;desc='recristaliza · sin t. residuales';}
  else if(T>=Tr){reg='TIBIO';col=C.c;desc='esfuerzo medio, acabado aceptable';}
  else {reg='FRÍO';col=C.f;desc='endurece por deformación';}
  /* escala */
  const ox=60,oy=86,W=400,H=34;
  const X=v=>ox+W*Math.max(0,Math.min(1,v/1700));
  const zonas=[[0,Tr,'FRÍO',C.f],[Tr,Trec,'TIBIO',C.c],[Trec,TF,'CALIENTE',C.b],[TF,1700,'fundido',C.d]];
  zonas.forEach(z=>{const x0=X(z[0]),x1=X(z[1]);
    if(x1>x0){alpha(a,reg===z[2]?0.55:0.16,()=>Rbox(a,x0,oy,x1-x0,H,z[3],0));
      if(x1-x0>52)a.txt(z[2],(x0+x1)/2,oy+21,reg===z[2]?C.bg:C.muted,11,'center');}});
  Rline(a,ox,oy,W,H,C.grid,0,1.2);
  /* marcas */
  [[Tr,'0,3·Tf'],[Trec,'0,5·Tf'],[TF,'Tf']].forEach(m=>{
    a.line(X(m[0]),oy-6,X(m[0]),oy+H+6,C.muted,1.4);
    a.txt(N0(m[0])+' °C',X(m[0]),oy-24,C.muted,10.5,'center');
    a.txt(m[1],X(m[0]),oy-10,C.muted,9.5,'center');});
  /* cursor */
  a.line(X(T),oy-16,X(T),oy+H+16,col,2.4);
  a.circ(X(T),oy+H+16,5,col,true);
  a.txt(N0(T)+' °C',X(T),oy+H+36,col,12.5,'center');
  a.txt('0',ox,oy+H+18,C.muted,10,'center');
  a.txt('1700',ox+W,oy+H+18,C.muted,10,'right');
  /* panel */
  const px=492,py=84;
  a.txt('Régimen',px,py,C.muted,11.5);
  a.txt(reg,px,py+26,col,19);
  a.txt(desc,px,py+48,C.muted,10);
  a.txt('Tf = '+N0(TF)+' °C = '+N0(TfK)+' K',px,py+80,C.muted,11);
  a.txt('T restauración  '+N0(Tr)+' °C',px,py+102,C.muted,11);
  a.txt('T recristaliz.  '+N0(Trec)+' °C',px,py+122,C.muted,11);
  /* tabla de consecuencias */
  const tx=60,ty=196;
  const CONS={'FRÍO':[['acabado y tolerancias','buenos',C.c],['fuerza necesaria','alta',C.d],['tensiones residuales','SÍ',C.d],['ductilidad','se pierde',C.d]],
   'TIBIO':[['acabado y tolerancias','aceptables',C.c],['fuerza necesaria','media',C.b],['tensiones residuales','reducidas',C.c],['ductilidad','conservada',C.c]],
   'CALIENTE':[['acabado y tolerancias','malos',C.d],['fuerza necesaria','baja',C.c],['tensiones residuales','NO',C.c],['ductilidad','máxima',C.c]],
   'FUNDIDO':[['—','no es deformación plástica',C.d]]}[reg];
  a.txt('Consecuencias',tx,ty,C.a,13);
  CONS.forEach((c,i)=>{const y=ty+24+i*22;
    a.txt(c[0],tx,y,C.muted,11.5);
    a.txt(c[1],tx+250,y,c[2],12,'right');});
  a.html('Las dos temperaturas se calculan como fracciones de la de fusión <b>en kelvin</b>: la restauración por debajo de <b>0,3·Tf</b> y la recristalización entre <b>0,3 y 0,5·Tf</b>.<br>Prueba el <b>plomo a 20 °C</b>: ya está trabajando <b>en caliente</b> sin calentarlo, y por eso se puede deformar indefinidamente sin endurecerse. Con el aluminio a temperatura ambiente pasa algo parecido: ya supera su temperatura de restauración.');
 }});

/* 3 · Curva tensión-deformación */
SIMS.curva=el=>build(el,{w:680,h:316,
 sliders:[{k:'C',l:'Coeficiente C',v:300,min:100,max:900,step:10,u:'MPa'},
  {k:'n',l:'Exponente n',v:0.37,min:0.05,max:0.6,step:0.01},
  {k:'e',l:'Deformación alcanzada',v:0.2877,min:0.02,max:0.9,step:0.0025}],
 selects:[{k:'ver',l:'Mostrar',v:'ambas',opts:[['ambas','Curva real y nominal'],['real','Sólo la real'],['trab','Trabajo de deformación']]}],
 draw(a){a.clear();const s=a.st;
  const sig=e=>s.C*Math.pow(e,s.n);
  const nom=e=>sig(e)*Math.exp(-e);
  const ox=62,oy=58,W=330,H=196;
  const EM=1.0, SM=Math.max(sig(EM),s.C)*1.05;
  const X=e=>ox+W*e/EM, Y=v=>oy+H-H*v/SM;
  /* rejilla */
  for(let i=0;i<=5;i++){alpha(a,0.3,()=>a.line(ox,oy+H*i/5,ox+W,oy+H*i/5,C.grid,1));
    a.txt(N0(SM*(5-i)/5),ox-6,oy+H*i/5+4,C.muted,9.5,'right');}
  for(let i=0;i<=5;i++){alpha(a,0.3,()=>a.line(ox+W*i/5,oy,ox+W*i/5,oy+H,C.grid,1));
    a.txt(N1(EM*i/5),ox+W*i/5,oy+H+16,C.muted,9.5,'center');}
  a.line(ox,oy+H,ox+W,oy+H,C.muted,1.5); a.line(ox,oy,ox,oy+H,C.muted,1.5);
  a.txt('ε',ox+W+12,oy+H+5,C.muted,12); a.txt('σ (MPa)',ox,oy-14,C.muted,11);
  /* área de trabajo */
  if(s.ver==='trab'){
    const g=a.g;g.save();g.globalAlpha=0.2;g.beginPath();g.moveTo(X(0),Y(0));
    for(let e=0.001;e<=s.e;e+=0.004)g.lineTo(X(e),Y(sig(e)));
    g.lineTo(X(s.e),Y(0));g.closePath();g.fillStyle=C.a;g.fill();g.restore();}
  /* curva real */
  (function(g){g.strokeStyle=C.a;g.lineWidth=2.4;g.beginPath();
    for(let e=0.001;e<=EM;e+=0.004){const x=X(e),y=Y(sig(e));e<0.002?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();})(a.g);
  a.txt('σ − ε  (real)',X(0.72),Y(sig(0.72))-12,C.a,11.5);
  /* curva nominal */
  if(s.ver!=='real'){
    (function(g){g.strokeStyle=C.muted;g.lineWidth=1.8;g.setLineDash([5,4]);g.beginPath();
      for(let e=0.001;e<=EM;e+=0.004){const x=X(e),y=Y(nom(e));e<0.002?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();g.setLineDash([]);})(a.g);
    a.txt('σnom − e',X(0.72),Y(nom(0.72))+20,C.muted,11.5);}
  /* inestabilidad */
  a.line(X(s.n),oy,X(s.n),oy+H,C.d,1.6,[4,3]);
  a.circ(X(s.n),Y(nom(s.n)),5,C.d,true);
  a.txt('ε = n',X(s.n),oy-6,C.d,11,'center');
  a.txt('inestabilidad',X(s.n)+6,Y(nom(s.n))-12,C.d,10);
  /* punto actual */
  a.circ(X(s.e),Y(sig(s.e)),5,C.b,true);
  a.line(X(s.e),Y(sig(s.e)),X(s.e),oy+H,C.b,1.2,[3,3]);
  /* panel */
  const px=428,py=62;
  a.txt('σ = '+N0(s.C)+' ε^'+N2(s.n),px,py,C.a,13.5);
  a.txt('deformación',px,py+30,C.muted,11.5);
  a.txt(N4(s.e),px+212,py+30,C.b,13,'right');
  a.txt('tensión real',px,py+54,C.muted,11.5);
  a.txt(N1(sig(s.e))+' MPa',px+212,py+54,C.a,15,'right');
  a.txt('tensión nominal',px,py+80,C.muted,11.5);
  a.txt(N1(nom(s.e))+' MPa',px+212,py+80,C.muted,13,'right');
  a.txt('inestabilidad en ε = n',px,py+112,C.muted,11.5);
  a.txt(N2(s.n),px+212,py+112,C.d,13,'right');
  const W1=s.C*Math.pow(s.e,s.n+1)/(s.n+1);
  const W2=s.C*Math.pow(s.n,s.n+1)/(s.n+1);
  a.txt('trabajo por m³',px,py+144,C.muted,11.5);
  a.txt(N2(W1)+' MJ/m³',px+212,py+144,C.a,13,'right');
  a.txt('hasta la inestabilidad',px,py+168,C.muted,11.5);
  a.txt(N2(W2)+' MJ/m³',px+212,py+168,C.muted,12.5,'right');
  a.txt('margen consumido: '+N0(100*W1/W2)+' %',px,py+198,W1>W2?C.d:C.c,12);
  a.txt(s.e>s.n?'⚠ más allá de la inestabilidad':'',px,py+220,C.d,11);
  a.html(s.ver==='trab'
   ? 'El <b>trabajo por unidad de volumen</b> es el área bajo la curva real hasta la deformación equivalente: \\\\(W/V=\\\\int_0^{\\\\varepsilon}\\\\sigma\\\\,d\\\\varepsilon=\\\\frac{C\\\\varepsilon^{n+1}}{n+1}\\\\). Multiplicando por el volumen se obtienen los julios; con mm y MPa hay que acordarse del factor 10⁻³.'
   : 'La curva <b>real</b> crece siempre: el material endurece. La <b>nominal</b> tiene un máximo y luego baja, pero el material no se debilita: es la sección la que se reduce.<br>Ese máximo está exactamente en <b>ε = n</b>, el punto de inestabilidad, y por eso el exponente de endurecimiento es la deformación uniforme máxima que admite el material.');
 }});

/* 4 · Von Mises */
SIMS.vonmises=el=>build(el,{w:680,h:330,
 selects:[{k:'caso',l:'Estado',v:'recal',opts:[['recal','Recalcado axisimétrico (σ1=σ2=0)'],['plana','Deformación plana (laminación)'],['libre','Estado general']]}],
 sliders:[{k:'s1',l:'σ₁',v:0,min:-300,max:300,step:5,u:'MPa'},
  {k:'s2',l:'σ₂',v:0,min:-300,max:300,step:5,u:'MPa'},
  {k:'s3',l:'σ₃',v:-189,min:-300,max:300,step:5,u:'MPa'},
  {k:'sy',l:'Límite elástico σy',v:190,min:50,max:400,step:5,u:'MPa'}],
 draw(a){a.clear();const s=a.st;
  let s1=s.s1,s2=s.s2,s3=s.s3;
  if(s.caso==='recal'){s1=0;s2=0;}
  else if(s.caso==='plana'){s1=0;s2=(s1+s3)/2;}
  const se=Math.sqrt(0.5*((s1-s2)**2+(s2-s3)**2+(s3-s1)**2));
  const fluye=se>=s.sy;
  /* cubo */
  const cx=168,cy=152,L=62,d=30;
  const F=[[cx-L/2,cy-L/2],[cx+L/2,cy-L/2],[cx+L/2,cy+L/2],[cx-L/2,cy+L/2]];
  const B=F.map(p=>[p[0]+d,p[1]-d]);
  alpha(a,0.08,()=>poly(a,F,C.a,true));
  poly(a,B,C.grid,false,1.2);
  F.forEach((p,i)=>a.line(p[0],p[1],B[i][0],B[i][1],C.grid,1.2));
  poly(a,F,C.a,false,1.8);
  /* flechas de tensión */
  const fl=(x1,y1,x2,y2,v,lab)=>{
    const col = v>0?C.d:(v<0?C.c:C.grid);
    if(v>0)a.arrow(x1,y1,x2,y2,col,2.2); else if(v<0)a.arrow(x2,y2,x1,y1,col,2.2);
    else a.line(x1,y1,x2,y2,col,1.2,[3,3]);
    a.txt(lab+' '+N0(v),x2,y2,col,11,x2>cx?'left':(x2<cx?'right':'center'));};
  fl(cx+L/2+4,cy,cx+L/2+52,cy,s1,'σ₁');
  fl(cx+d/2,cy-L/2-4,cx+d/2+22,cy-L/2-40,s2,'σ₂');
  fl(cx,cy+L/2+4,cx,cy+L/2+50,s3,'σ₃');
  a.txt('elemento diferencial',cx,cy+L/2+78,C.muted,11,'center');
  /* panel */
  const px=376,py=64;
  a.txt('Criterio de Von Mises',px,py,C.a,13.5);
  a.txt('σe = √( ½[(σ₁−σ₂)²+(σ₂−σ₃)²+(σ₃−σ₁)²] )',px,py+24,C.muted,10.5);
  a.txt('σ₁',px,py+54,C.muted,11.5); a.txt(N0(s1)+' MPa',px+120,py+54,C.text,12,'right');
  a.txt('σ₂',px,py+76,C.muted,11.5); a.txt(N0(s2)+' MPa',px+120,py+76,C.text,12,'right');
  a.txt('σ₃',px,py+98,C.muted,11.5); a.txt(N0(s3)+' MPa',px+120,py+98,C.text,12,'right');
  a.txt('tensión equivalente',px,py+132,C.muted,11.5);
  a.txt(N1(se)+' MPa',px+212,py+132,fluye?C.d:C.c,19,'right');
  /* barra comparativa */
  const bx=px,by=py+152,bw=212;
  alpha(a,0.12,()=>Rbox(a,bx,by,bw,16,C.text,3));
  const mx=Math.max(se,s.sy)*1.15;
  Rbox(a,bx,by,bw*se/mx,16,fluye?C.d:C.c,3);
  a.line(bx+bw*s.sy/mx,by-5,bx+bw*s.sy/mx,by+21,C.b,2);
  a.txt('σy = '+N0(s.sy),bx+bw*s.sy/mx,by+36,C.b,10.5,'center');
  a.txt(fluye?'EL MATERIAL FLUYE':'régimen elástico',px,py+206,fluye?C.d:C.c,14);
  a.txt(fluye?'σe ≥ σy: hay deformación plástica':'σe < σy: no hay deformación permanente',px,py+230,C.muted,11);
  const nota = s.caso==='recal' ? 'σ₁ = σ₂ = 0 → σe = |σ₃|' :
    (s.caso==='plana' ? 'σ₂ = (σ₁+σ₃)/2 → σe = (√3/2)|σ₁−σ₃|' : '');
  a.txt(nota,px,py+250,C.a,11.5);
  a.html(s.caso==='recal'
   ? 'En un <b>recalcado</b> sólo hay fuerza en un eje, así que σ₁ = σ₂ = 0 y la tensión equivalente se reduce a <b>|σ₃|</b>. Es el caso de casi todos los problemas de forja, y conviene comprobarlo en una línea en el examen.'
   : (s.caso==='plana'
   ? 'En <b>deformación plana</b> (laminación de chapa ancha) la tensión intermedia es la media de las otras dos y la equivalente queda <b>(√3/2)·|σ₁−σ₃|</b>. Ese factor √3/2 ≈ 0,866 es el que se olvida y hace que la fuerza salga un 15 % baja.'
   : 'Mueve las tres tensiones. Observa que lo que importa no es su valor absoluto sino sus <b>diferencias</b>: un estado hidrostático (σ₁ = σ₂ = σ₃) da σe = 0 y <b>nunca produce deformación plástica</b>, por grande que sea la presión. Por eso se puede comprimir un sólido a miles de bar sin deformarlo.'));
 }});

/* 5 · Forja */
SIMS.forja=el=>build(el,{w:680,h:330,
 selects:[{k:'geo',l:'Geometría',v:'prisma',opts:[['cil','Cilindro'],['prisma','Prisma de base cuadrada']]}],
 sliders:[{k:'d0',l:'Dimensión inicial de la base',v:20,min:10,max:60,step:1,u:'mm'},
  {k:'h0',l:'Altura inicial',v:45,min:10,max:80,step:1,u:'mm'},
  {k:'red',l:'Reducción de altura',v:25,min:5,max:70,step:1,u:'%'},
  {k:'C',l:'Coeficiente C',v:300,min:100,max:900,step:10,u:'MPa'},
  {k:'n',l:'Exponente n',v:0.37,min:0.05,max:0.6,step:0.01}],
 draw(a){a.clear();const s=a.st,cil=s.geo==='cil';
  const h0=s.h0, hf=h0*(1-s.red/100);
  const df=s.d0*Math.sqrt(h0/hf);
  const e3=Math.log(hf/h0), e1=-e3/2;
  const eeq=Math.sqrt(2/3*(e1*e1+e1*e1+e3*e3));
  const sg=s.C*Math.pow(Math.abs(e3),s.n);
  const Af = cil? Math.PI*df*df/4 : df*df;
  const A0 = cil? Math.PI*s.d0*s.d0/4 : s.d0*s.d0;
  const V = A0*h0;
  const F = sg*Af;
  const snom = sg*Af/A0;
  const W = V*s.C*Math.pow(eeq,s.n+1)/(s.n+1)*1e-3;
  /* dibujo antes/después */
  const esc=1.9, base=230;
  const dib=(cx,d,h,col,lab)=>{
    const w=d*esc, hh=h*esc;
    if(cil){
      alpha(a,0.18,()=>Rbox(a,cx-w/2,base-hh,w,hh,col,2));
      Rline(a,cx-w/2,base-hh,w,hh,col,2,1.8);
      (function(g){g.strokeStyle=col;g.lineWidth=1.2;g.beginPath();g.ellipse(cx,base-hh,w/2,5,0,0,7);g.stroke();})(a.g);
    } else {
      const d2=w*0.3;
      alpha(a,0.18,()=>Rbox(a,cx-w/2,base-hh,w,hh,col,1));
      Rline(a,cx-w/2,base-hh,w,hh,col,1,1.8);
      poly(a,[[cx-w/2,base-hh],[cx-w/2+d2,base-hh-d2],[cx+w/2+d2,base-hh-d2],[cx+w/2,base-hh]],col,false,1.2);
      a.line(cx+w/2,base-hh,cx+w/2+d2,base-hh-d2,col,1.2);
      a.line(cx+w/2,base,cx+w/2+d2,base-d2,col,1.2);
      a.line(cx+w/2+d2,base-d2,cx+w/2+d2,base-hh-d2,col,1.2);
    }
    a.txt(lab,cx,base+20,col,11.5,'center');
    a.txt((cil?'⌀':'')+N1(d)+' × '+N1(h),cx,base+36,C.muted,10.5,'center');};
  a.arrow(176,base-40,212,base-40,C.b,2.4);
  a.txt('F',120,base-s.h0*esc-24,C.b,13,'center');
  a.arrow(120,base-h0*esc-18,120,base-h0*esc-4,C.b,2.2);
  dib(120,s.d0,h0,C.muted,'antes');
  dib(272,df,hf,C.a,'después');
  /* panel */
  const px=372,py=58;
  a.txt('Deformaciones',C.a?px:px,py,C.a,13);
  [['ε₁ = ε₂',N4(e1),C.text],['ε₃',N4(e3),C.text],['Σεᵢ',N4(2*e1+e3),Math.abs(2*e1+e3)<1e-9?C.c:C.d],['ε equivalente',N4(eeq),C.a]].forEach((r,i)=>{
    const y=py+24+i*22; a.txt(r[0],px,y,C.muted,11.5); a.txt(r[1],px+150,y,r[2],12,'right');});
  a.txt('comprobación: |ε₃| = '+N4(Math.abs(e3)),px,py+116,C.c,10.5);
  a.txt('Resultados',px,py+146,C.a,13);
  [['σ real',N1(sg)+' MPa',C.a],['σ nominal',N1(snom)+' MPa',C.muted],['Fuerza',N1(F/1000)+' kN',C.b],['Trabajo',N0(W)+' J',C.b]].forEach((r,i)=>{
    const y=py+170+i*24; a.txt(r[0],px,y,C.muted,11.5); a.txt(r[1],px+214,y,r[2],13,'right');});
  a.txt('con A₀ saldrían '+N1(sg*A0/1000)+' kN: prensa corta',px,py+268,C.d,10.5);
  a.html('Mueve la reducción de altura y observa dos cosas. Primero, que las tres deformaciones <b>siempre suman cero</b>: es la comprobación más barata del problema. Segundo, que la <b>tensión nominal es mayor que la real</b>, porque la sección crece al aplastar — en tracción ocurre justo lo contrario.<br>Abajo a la derecha está la fuerza que saldría usando el área <b>inicial</b>: es el error que deja la prensa corta.');
 }});

/* 6 · Trefilado */
SIMS.trefilado=el=>build(el,{w:680,h:310,
 sliders:[{k:'D0',l:'Diámetro inicial',v:10,min:2,max:30,step:0.5,u:'mm'},
  {k:'Df',l:'Diámetro final',v:6.07,min:1,max:29,step:0.05,u:'mm'},
  {k:'C',l:'Coeficiente C',v:600,min:200,max:1200,step:20,u:'MPa'},
  {k:'n',l:'Exponente n',v:0.25,min:0.05,max:0.5,step:0.01},
  {k:'eta',l:'Rendimiento de la hilera',v:0.8,min:0.3,max:1,step:0.05}],
 draw(a){a.clear();const s=a.st;
  const Df=Math.min(s.Df,s.D0-0.1);
  const eps=2*Math.log(s.D0/Df);
  const r=1-Math.pow(Df/s.D0,2);
  const sR=(1/s.eta)*(s.C/(s.n+1))*Math.pow(eps,s.n+1);
  const sSal=s.C*Math.pow(eps,s.n);
  const emax=s.eta*(s.n+1);
  const Dmin=s.D0*Math.exp(-emax/2);
  const rompe=sR>sSal;
  /* dibujo de la hilera */
  const ox=56,cy=136,esc=3.6;
  const r0=s.D0*esc/2, rf=Df*esc/2;
  const xA=ox, xB=ox+120, xC=ox+166, xD=ox+300;
  alpha(a,0.2,()=>poly(a,[[xA,cy-r0],[xB,cy-r0],[xC,cy-rf],[xD,cy-rf],[xD,cy+rf],[xC,cy+rf],[xB,cy+r0],[xA,cy+r0]],rompe?C.d:C.a,true));
  poly(a,[[xA,cy-r0],[xB,cy-r0],[xC,cy-rf],[xD,cy-rf],[xD,cy+rf],[xC,cy+rf],[xB,cy+r0],[xA,cy+r0]],rompe?C.d:C.a,false,2);
  /* hilera */
  [1,-1].forEach(sg=>{
    const y0=cy+sg*r0, y1=cy+sg*rf;
    poly(a,[[xB,y0],[xC,y1],[xC+18,y1],[xC+18,y0+sg*26],[xB-8,y0+sg*26],[xB-8,y0]],C.b,false,2);
    alpha(a,0.25,()=>poly(a,[[xB,y0],[xC,y1],[xC+18,y1],[xC+18,y0+sg*26],[xB-8,y0+sg*26],[xB-8,y0]],C.b,true));});
  a.txt('hilera',xC+2,cy-r0-34,C.b,11.5,'center');
  a.arrow(xD+6,cy,xD+46,cy,rompe?C.d:C.c,2.6);
  a.txt(rompe?'ROMPE':'tracción',xD+26,cy-16,rompe?C.d:C.c,12,'center');
  a.txt('⌀'+N1(s.D0),xA+6,cy+r0+22,C.muted,11);
  a.txt('⌀'+N2(Df),xD-6,cy+rf+22,C.a,11,'right');
  /* panel */
  const px=438,py=58;
  a.txt('Trefilado',px,py,C.a,13.5);
  [['deformación ε',N4(eps),C.text],['reducción r',N1(100*r)+' %',C.text],
   ['σ de estirado',N0(sR)+' MPa',rompe?C.d:C.a],['σ a la salida',N0(sSal)+' MPa',C.b]].forEach((row,i)=>{
    const y=py+28+i*24; a.txt(row[0],px,y,C.muted,11.5); a.txt(row[1],px+196,y,row[2],12.5,'right');});
  /* barra comparativa */
  const bx=px,by=py+134,bw=196;
  const mx=Math.max(sR,sSal)*1.1;
  a.txt('σ estirado frente a σ fluencia',px,by-10,C.muted,10.5);
  alpha(a,0.12,()=>Rbox(a,bx,by,bw,14,C.text,3));
  Rbox(a,bx,by,bw*sR/mx,14,rompe?C.d:C.c,3);
  a.line(bx+bw*sSal/mx,by-5,bx+bw*sSal/mx,by+19,C.b,2);
  a.txt('límite',bx+bw*sSal/mx,by+34,C.b,10,'center');
  a.txt(rompe?'EL ALAMBRE ROMPE':'pasada válida',px,by+62,rompe?C.d:C.c,14);
  a.txt('ε máx = η(n+1) = '+N3(emax),px,by+88,C.muted,11.5);
  a.txt('⌀ mínimo en una pasada',px,by+110,C.muted,11.5);
  a.txt(N2(Dmin)+' mm',px+196,by+110,C.a,14,'right');
  a.html(rompe
   ? 'La tensión necesaria para estirar supera la de fluencia del alambre a la salida: <b>se rompe nada más salir de la hilera</b>. Hay que reducir menos y encadenar varias pasadas.'
   : 'En trefilado se <b>tira</b> del material, así que la fuerza se transmite por el alambre <b>ya conformado</b>. Ahí está el límite: baja el diámetro final hasta que la barra se ponga roja.<br>Igualando σ<sub>R</sub> y σ<sub>salida</sub> sale <b>ε<sub>máx</sub> = η(n+1)</b>, un resultado que no depende de C. Con η = 0,8 y n = 0,25 vale exactamente 1, y el diámetro mínimo es D₀·e<sup>−0,5</sup>.');
 }});

/* 7 · Selección de proceso */
SIMS.seleccion=el=>build(el,{w:680,h:306,
 selects:[{k:'tipo',l:'Comparación',v:'chapa',opts:[['chapa','Embutición con matriz vs. estirado de chapa'],['tornillo','Recalcado vs. torneado'],['molde','Inyección a presión vs. fundición en arena']]}],
 sliders:[{k:'N',l:'Tamaño de la serie',v:25,min:1,max:20000,step:1}],
 draw(a){a.clear();const s=a.st;
  const DAT={chapa:{A:['Embutición con matriz',300000,200],B:['Estirado de chapa',30000,600]},
   tornillo:{A:['Recalcado + laminado',8000,0.02],B:['Torneado',200,1.50]},
   molde:{A:['Inyección a presión',60000,1.2],B:['Fundición en arena',3000,9]}}[s.tipo];
  const cA=DAT.A[1]+DAT.A[2]*s.N, cB=DAT.B[1]+DAT.B[2]*s.N;
  const Ne=(DAT.A[1]-DAT.B[1])/(DAT.B[2]-DAT.A[2]);
  const gana = cA<cB ? 'A':'B';
  /* gráfica */
  const ox=64,oy=56,W=330,H=182;
  const NMx=Math.max(Ne*2.2, s.N*1.3, 10);
  const CM=Math.max(DAT.A[1]+DAT.A[2]*NMx, DAT.B[1]+DAT.B[2]*NMx)*1.05;
  const X=n=>ox+W*n/NMx, Y=c=>oy+H-H*c/CM;
  for(let i=0;i<=4;i++){alpha(a,0.3,()=>a.line(ox,oy+H*i/4,ox+W,oy+H*i/4,C.grid,1));
    a.txt(N0(CM*(4-i)/4/1000)+' k',ox-6,oy+H*i/4+4,C.muted,9.5,'right');}
  a.line(ox,oy+H,ox+W,oy+H,C.muted,1.5); a.line(ox,oy,ox,oy+H,C.muted,1.5);
  a.txt('unidades',ox+W/2,oy+H+36,C.muted,10.5,'center');
  a.txt('coste total (€)',ox,oy-14,C.muted,11);
  a.txt('0',ox,oy+H+18,C.muted,9.5,'center');
  a.txt(NM(NMx),ox+W,oy+H+18,C.muted,9.5,'right');
  /* rectas */
  a.line(X(0),Y(DAT.A[1]),X(NMx),Y(DAT.A[1]+DAT.A[2]*NMx),C.a,2.4);
  a.line(X(0),Y(DAT.B[1]),X(NMx),Y(DAT.B[1]+DAT.B[2]*NMx),C.b,2.4);
  a.txt(DAT.A[0],X(NMx)-4,Y(DAT.A[1]+DAT.A[2]*NMx)-10,C.a,10.5,'right');
  a.txt(DAT.B[0],X(NMx)-4,Y(DAT.B[1]+DAT.B[2]*NMx)+18,C.b,10.5,'right');
  /* equilibrio */
  if(Ne>0&&Ne<NMx){a.line(X(Ne),oy,X(Ne),oy+H,C.d,1.6,[4,3]);
    a.circ(X(Ne),Y(DAT.A[1]+DAT.A[2]*Ne),5,C.d,true);
    a.txt('equilibrio',X(Ne),oy-4,C.d,10.5,'center');}
  /* cursor */
  if(s.N>NMx*0.02)a.line(X(s.N),oy,X(s.N),oy+H,C.c,1.6,[4,3]);
  a.circ(X(s.N),Y(cA),4,C.a,true); a.circ(X(s.N),Y(cB),4,C.b,true);
  /* panel */
  const px=424,py=58;
  a.txt('Con '+N0(s.N)+' unidades',px,py,C.a,13.5);
  a.txt(DAT.A[0],px,py+28,C.a,11);
  a.txt(NM(cA)+' €',px+216,py+28,gana==='A'?C.c:C.muted,13,'right');
  a.txt(DAT.B[0],px,py+54,C.b,11);
  a.txt(NM(cB)+' €',px+216,py+54,gana==='B'?C.c:C.muted,13,'right');
  a.txt('Elección',px,py+90,C.muted,11.5);
  a.txt(gana==='A'?DAT.A[0]:DAT.B[0],px,py+114,C.c,13.5);
  a.txt('ahorro: '+NM(Math.abs(cA-cB))+' €',px,py+136,C.c,11.5);
  a.txt('Punto de equilibrio',px,py+170,C.muted,11.5);
  a.txt(NM(Ne)+' unidades',px+216,py+170,C.d,14,'right');
  a.txt('por debajo gana el de utillaje barato;',px,py+198,C.muted,10.5);
  a.txt('por encima, el de operación barata.',px,py+216,C.muted,10.5);
  a.html('La geometría casi nunca decide sola: los dos procesos de cada par <b>pueden hacer la pieza</b>. Lo que decide es el <b>tamaño de la serie</b>, porque un utillaje caro se amortiza y uno barato no compensa un coste por pieza alto.<br>Mueve la serie y mira cómo cambia la respuesta. Plantear este cálculo, aunque sea con cifras aproximadas, es lo que distingue una respuesta de ingeniero de una lista de ventajas.');
 }});

/* 8 · Fundición */
SIMS.fundicion=el=>build(el,{w:680,h:310,
 selects:[{k:'proc',l:'Proceso',v:'arena',opts:[['arena','Fundición en arena'],['coq','Coquilla (molde metálico)'],['iny','Inyección a presión'],['cera','Cera perdida']]}],
 sliders:[{k:'maz',l:'Tamaño de la mazarota',v:100,min:40,max:200,step:5,u:'%'},
  {k:'esp',l:'Diferencia de espesores',v:1,min:1,max:4,step:0.25,u:'×'}],
 draw(a){a.clear();const s=a.st;
  const P={arena:{tol:1.0,rug:12,prod:20,cost:1,mat:'cualquiera'},
   coq:{tol:0.4,rug:6,prod:60,cost:3,mat:'media Tf'},
   iny:{tol:0.1,rug:1.6,prod:300,cost:8,mat:'Zn, Al, Mg'},
   cera:{tol:0.08,rug:1.2,prod:4,cost:12,mat:'cualquiera'}}[s.proc];
  /* molde */
  const ox=56,oy=62,W=270,H=168;
  alpha(a,0.1,()=>Rbox(a,ox,oy,W,H,C.muted,4));
  Rline(a,ox,oy,W,H,C.muted,4,1.5);
  a.txt('molde',ox+8,oy+16,C.muted,11);
  /* pieza con dos espesores */
  const e1=26, e2=26*s.esp;
  const py0=oy+84;
  Rbox(a,ox+54,py0,84,e1,C.a,2);
  Rbox(a,ox+138,py0-(e2-e1)/2,74,e2,C.a,2);
  a.txt('e',ox+96,py0+e1/2+4,C.bg,11,'center');
  a.txt(N1(s.esp)+'e',ox+175,py0-(e2-e1)/2+14,C.bg,11,'center');
  /* mazarota */
  const mw=46*s.maz/100, mh=56*s.maz/100;
  Rbox(a,ox+175-mw/2,py0-(e2-e1)/2-mh,mw,mh,C.b,3);
  a.txt('mazarota',ox+175,py0-(e2-e1)/2-mh-10,C.b,10.5,'center');
  /* módulos de enfriamiento: V/A */
  const Mp = (74*e2)/(2*(74+e2));
  const Mm = (mw*mh)/(2*(mw+mh));
  const ok = Mm>Mp;
  const rechupe = !ok;
  if(rechupe){
    a.circ(ox+175,py0+e1/2,8,C.d,true);
    a.txt('rechupe',ox+175,py0+e2/2+34,C.d,10.5,'center');}
  const grad = s.esp>2;
  if(grad){a.txt('⚠ espesores muy distintos',ox+54,oy+H-10,C.d,10.5);}
  /* panel */
  const px=362,py=58;
  a.txt('Solidificación',C.a?px:px,py,C.a,13.5);
  a.txt('módulo de la pieza  V/A',px,py+26,C.muted,11);
  a.txt(N2(Mp)+' mm',px+256,py+26,C.text,12,'right');
  a.txt('módulo de la mazarota',px,py+48,C.muted,11);
  a.txt(N2(Mm)+' mm',px+256,py+48,ok?C.c:C.d,12,'right');
  a.txt(ok?'la mazarota solidifica después ✓':'la mazarota solidifica ANTES: rechupe',px,py+74,ok?C.c:C.d,12);
  a.txt('Proceso elegido',px,py+110,C.a,13);
  [['tolerancia','±'+N2(P.tol)+' mm'],['rugosidad','Ra '+N1(P.rug)+' µm'],
   ['productividad',N0(P.prod)+' piezas/h'],['coste relativo','×'+N0(P.cost)],['materiales',P.mat]].forEach((row,i)=>{
    const y=py+136+i*24; a.txt(row[0],px,y,C.muted,11); a.txt(row[1],px+256,y,C.text,11.5,'right');});
  a.html(rechupe
   ? 'La <b>mazarota es demasiado pequeña</b>: solidifica antes que la pieza y deja de alimentarla, así que la contracción produce un <b>rechupe</b> en la zona de mayor masa. La regla de Chvorinov dice que el tiempo de solidificación crece con el cuadrado de V/A: la mazarota debe tener un módulo <b>mayor</b> que el de la pieza.'
   : (s.esp>2
   ? 'Los espesores son muy distintos: la zona fina solidifica mucho antes que la gruesa y aparecen <b>tensiones y rechupes</b> en la transición. La regla de diseño es <b>espesores uniformes</b>, o una transición gradual.'
   : 'La mazarota tiene módulo suficiente y los espesores son razonablemente uniformes: la pieza solidificará de forma dirigida, de las zonas finas hacia la mazarota. Cambia de proceso y compara las tolerancias: entre la arena y la cera perdida hay un factor <b>doce</b>.'));
 }});

/* 9 · Soldadura */
SIMS.soldadura=el=>build(el,{w:680,h:316,
 selects:[{k:'pol',l:'Polaridad',v:'dir',opts:[['dir','Corriente continua, polaridad directa'],['inv','Corriente continua, polaridad inversa'],['ca','Corriente alterna']]},
  {k:'proc',l:'Proceso',v:'smaw',opts:[['smaw','Electrodo revestido (SMAW)'],['tig','TIG (GTAW)'],['mig','MIG/MAG (GMAW)'],['sub','Arco sumergido']]}],
 sliders:[{k:'I',l:'Intensidad',v:150,min:10,max:500,step:10,u:'A'},
  {k:'V',l:'Tensión del arco',v:25,min:15,max:45,step:1,u:'V'},
  {k:'v',l:'Velocidad de avance',v:4,min:1,max:12,step:0.5,u:'mm/s'}],
 draw(a){a.clear();const s=a.st;
  const ETA={smaw:0.8,tig:0.65,mig:0.85,sub:0.95}[s.proc];
  const Q=ETA*s.V*s.I;
  const HI=Q/s.v/1000;
  const pen = (s.pol==='dir'?1.0:(s.pol==='inv'?0.55:0.78))*Math.sqrt(s.I/150);
  /* piezas */
  const ox=66,cy=188,W=250;
  alpha(a,0.18,()=>Rbox(a,ox,cy,W,46,C.muted,0));
  Rline(a,ox,cy,W,46,C.muted,0,1.5);
  /* baño y penetración */
  const cx=ox+W/2;
  const pd=Math.min(42,16*pen);
  (function(g){g.beginPath();g.ellipse(cx,cy+2,30,pd,0,0,Math.PI);g.fillStyle=C.b;g.globalAlpha=0.45;g.fill();g.globalAlpha=1;
    g.strokeStyle=C.b;g.lineWidth=1.6;g.stroke();})(a.g);
  a.txt('penetración',cx+40,cy+pd,C.b,10.5);
  a.line(cx,cy,cx,cy+pd,C.b,1.2,[3,3]);
  /* electrodo y arco */
  const ey=cy-74;
  Rbox(a,cx-5,ey-52,10,52,C.muted,1);
  a.txt('electrodo',cx-12,ey-58,C.muted,11,'right');
  /* cono del arco */
  (function(g){g.beginPath();g.moveTo(cx,ey);g.lineTo(cx-26,cy);g.lineTo(cx+26,cy);g.closePath();
    g.fillStyle=C.b;g.globalAlpha=0.3;g.fill();g.globalAlpha=1;})(a.g);
  (function(g){g.beginPath();g.moveTo(cx,ey+8);g.lineTo(cx-13,cy);g.lineTo(cx+13,cy);g.closePath();
    g.fillStyle=C.d;g.globalAlpha=0.55;g.fill();g.globalAlpha=1;})(a.g);
  a.txt('plasma',cx+34,ey+34,C.d,10.5);
  a.txt('10 000 – 30 000 °C',cx+34,ey+48,C.muted,9.5);
  a.txt('llama',cx-34,ey+34,C.b,10.5,'right');
  a.txt('no ionizada',cx-34,ey+48,C.muted,9.5,'right');
  /* polaridad */
  const eNeg = s.pol==='dir';
  a.txt(s.pol==='ca'?'~':(eNeg?'−':'+'),cx-18,ey-20,C.a,15,'center');
  a.txt(s.pol==='ca'?'~':(eNeg?'+':'−'),ox+W+16,cy+24,C.a,15,'center');
  a.txt(s.pol==='ca'?'el calor se reparte':(eNeg?'calor en la PIEZA':'calor en el ELECTRODO'),ox,cy+74,eNeg?C.c:(s.pol==='ca'?C.muted:C.b),12);
  /* panel */
  const px=362,py=58;
  a.txt('Aporte térmico',C.a?px:px,py,C.a,13.5);
  [['rendimiento η',N2(ETA)],['potencia  η·V·I',N0(Q)+' W'],
   ['aporte por longitud',N2(HI)+' kJ/mm']].forEach((row,i)=>{
    const y=py+26+i*24; a.txt(row[0],px,y,C.muted,11.5); a.txt(row[1],px+256,y,C.text,12.5,'right');});
  let diag,dcol;
  if(HI<0.4){diag='aporte bajo: riesgo de falta de fusión';dcol=C.d;}
  else if(HI>2.5){diag='aporte alto: zona afectada grande y deformación';dcol=C.d;}
  else {diag='aporte en rango razonable';dcol=C.c;}
  a.txt(diag,px,py+104,dcol,11.5);
  a.txt('Penetración relativa',px,py+136,C.muted,11.5);
  alpha(a,0.12,()=>Rbox(a,px,py+148,256,16,C.text,3));
  Rbox(a,px,py+148,256*Math.min(1,pen/1.6),16,C.b,3);
  a.txt(N2(pen)+' ×',px+256,py+182,C.b,12,'right');
  a.txt('Polaridad',px,py+204,C.muted,11.5);
  a.txt(s.pol==='dir'?'directa: − al electrodo':(s.pol==='inv'?'inversa: + al electrodo':'alterna'),px,py+224,C.a,12);
  a.txt(s.pol==='dir'?'mayor penetración':(s.pol==='inv'?'menor penetración, más deposición':'comportamiento intermedio'),px,py+244,C.muted,11);
  a.html('El arco tiene <b>forma cónica</b>, con el vértice en la punta del electrodo. El <b>plasma</b> está ionizado, conduce y alcanza entre 10 000 y 30 000 °C; la <b>llama</b> lo envuelve, no está ionizada y no conduce.<br>Cambia la polaridad: en <b>directa</b> (negativo al electrodo) el calor se concentra en la pieza y la penetración es mayor. Es la confusión más repetida del tema.');
 }});

/* 10 · CNC */
SIMS.cnc=el=>build(el,{w:680,h:330,
 selects:[{k:'blo',l:'Bloque del programa',v:'4',opts:[['0','N30 — cabecera: unidades y velocidades'],['1','N50/N60 — refrentado'],['2','N80 — ciclo G68 de desbaste'],['3','N110/N120 — perfil: tramo recto'],['4','N130 — arco G2 a derechas'],['5','N140 — arco G3 a izquierdas'],['6','N150-N170 — tramos finales']]}],
 sliders:[{k:'vc',l:'Velocidad de corte',v:200,min:30,max:400,step:10,u:'m/min'},
  {k:'D',l:'Diámetro de trabajo',v:30,min:5,max:80,step:1,u:'mm'}],
 draw(a){a.clear();const s=a.st,b=parseInt(s.blo);
  /* perfil de la pieza, en radio; los arcos se discretizan */
  function arco(r0,z0,r1,z1,rc,zc,R,horario){
    const a0=Math.atan2(r0-rc,z0-zc), a1=Math.atan2(r1-rc,z1-zc);
    let d=a1-a0; if(horario){while(d>0)d-=2*Math.PI;}else{while(d<0)d+=2*Math.PI;}
    const out=[]; const N=16;
    for(let k=1;k<=N;k++){const t=a0+d*k/N; out.push([rc+R*Math.sin(t+Math.PI/2-Math.PI/2),0]);}
    return out;}
  /* puntos del perfil (radio, Z) con los arcos ya discretizados */
  const PTS=[[0,0],[10,0],[10,-22]];
  (function(){ /* G2: centro radio 20, Z -22, R 10 */
    const rc=20,zc=-22,R=10;
    const a0=Math.atan2(10-rc,-22-zc), a1=Math.atan2(15-rc,-30.66-zc);
    let d=a1-a0; while(d<0)d+=2*Math.PI; if(d>Math.PI)d-=2*Math.PI;
    for(let k=1;k<=12;k++){const t=a0+d*k/12; PTS.push([rc+R*Math.sin(t), zc+R*Math.cos(t)]);}
  })();
  (function(){ /* G3: centro radio 5, Z -47.98, R 20 */
    const rc=5,zc=-47.98,R=20;
    const a0=Math.atan2(15-rc,-30.66-zc), a1=Math.atan2(25-rc,-47.98-zc);
    let d=a1-a0; while(d>0)d-=2*Math.PI; if(d<-Math.PI)d+=2*Math.PI;
    for(let k=1;k<=12;k++){const t=a0+d*k/12; PTS.push([rc+R*Math.sin(t), zc+R*Math.cos(t)]);}
  })();
  PTS.push([25,-54],[30,-54],[30,-65]);
  const IDX={3:[1,2],4:[2,14],5:[14,26],6:[26,PTS.length-1]};
  const ox=58,oy=66,esc=2.45;
  const X=z=>ox+(-z)*esc*1.02, Y=r=>oy+88-r*esc;
  /* bruto */
  alpha(a,0.07,()=>Rbox(a,X(0),Y(33),X(-65)-X(0),33*esc,C.muted,0));
  a.line(X(0),oy+88,X(-70),oy+88,C.muted,1.2,[5,4]);
  a.txt('eje',X(-70)-6,oy+80,C.muted,10,'right');
  /* perfil completo */
  (function(g){g.strokeStyle=C.grid;g.lineWidth=2;g.beginPath();
    g.moveTo(X(PTS[0][1]),Y(PTS[0][0]));
    for(let k=1;k<PTS.length;k++)g.lineTo(X(PTS[k][1]),Y(PTS[k][0]));
    g.stroke();})(a.g);
  /* tramo resaltado */
  const SEG=IDX[b];
  if(SEG){(function(g){g.strokeStyle=C.b;g.lineWidth=4;g.lineCap='round';g.beginPath();
    g.moveTo(X(PTS[SEG[0]][1]),Y(PTS[SEG[0]][0]));
    for(let k=SEG[0]+1;k<=SEG[1];k++)g.lineTo(X(PTS[k][1]),Y(PTS[k][0]));
    g.stroke();g.lineCap='butt';})(a.g);}
  if(b===1){alpha(a,0.5,()=>Rbox(a,X(0)-3,Y(33),6,33*esc,C.b,0));a.txt('refrentado',X(0)+10,Y(35),C.b,10.5);}
  if(b===2){alpha(a,0.16,()=>Rbox(a,X(0),Y(33),X(-65)-X(0),33*esc,C.b,0));a.txt('desbaste con G68',X(-32),Y(36),C.b,11,'center');}
  if(b===0){a.txt('cabecera: unidades, cotas, avance y velocidad',X(-32),Y(36),C.b,11,'center');}
  /* cotas, alternadas para que no se solapen */
  [[0,'⌀0',0],[-22,'Z−22',0],[-30.66,'−30,66',1],[-47.98,'−47,98',0],[-65,'Z−65',1]].forEach(c=>{
    a.line(X(c[0]),oy+92,X(c[0]),oy+102+c[2]*14,C.grid,1);
    a.txt(c[1],X(c[0]),oy+116+c[2]*14,C.muted,9,'center');});
  /* diámetros */
  [[10,'⌀20',-11],[15,'⌀30',-26],[25,'⌀50',-51],[30,'⌀60',-60]].forEach(d=>{
    a.txt(d[1],X(d[2]),Y(d[0])-8,C.muted,9,'center');});
  /* código */
  const COD=[
   ['N30 G0 G71 G90 G95 G97','X100 Z100 F0.09 S850 M03 M41','mm · absolutas · mm/rev · rpm constantes'],
   ['N50 G0 X66 Z0','N60 G1 X0 Z0','posicionar y refrentar hasta el centro'],
   ['N80 G68 P0=K0 P1=K0 P5=K0.7','P7=K0.3 P8=K0.3 P13=K110 P14=K170','el ciclo lee los bloques 110 a 170 y desbasta solo'],
   ['N110 G1 X20 Z0','N120 G1 X20 Z-22','tramo recto a ⌀20 — X va en DIÁMETRO'],
   ['N130 G2 X30 Z-30.66 I10 K0','centro: radio 20, Z −22  ·  R = 10','I y K son el centro RESPECTO AL INICIO'],
   ['N140 G3 X50 Z-47.98 I-10 K-17.32','centro: radio 5, Z −47,98  ·  R = 20','G3 = antihorario'],
   ['N150 G1 X50 Z-54 · N160 G1 X60 Z-54','N170 G1 X60 Z-65','tramos finales del perfil']][b];
  const cx2=56,cy2=238;
  a.txt('Bloque',cx2,cy2,C.a,12.5);
  a.txt(COD[0],cx2,cy2+24,C.b,12.5);
  a.txt(COD[1],cx2,cy2+44,C.text,11.5);
  a.txt(COD[2],cx2,cy2+66,C.muted,11);
  /* panel */
  const px=438,py=66;
  const N=1000*s.vc/(Math.PI*s.D);
  a.txt('Velocidad de giro',C.a?px:px,py,C.a,13);
  a.txt('N = 1000·Vc / (π·D)',px,py+22,C.muted,10.5);
  a.txt('Vc',px,py+48,C.muted,11.5); a.txt(N0(s.vc)+' m/min',px+200,py+48,C.text,12,'right');
  a.txt('D',px,py+70,C.muted,11.5); a.txt(N0(s.D)+' mm',px+200,py+70,C.text,12,'right');
  a.txt('N',px,py+96,C.muted,11.5); a.txt(N0(N)+' rpm',px+200,py+96,C.b,16,'right');
  a.txt(N>3000?'⚠ supera el máximo típico del torno':'',px,py+118,C.d,10.5);
  /* G96 vs G97 */
  a.txt('Con G96 (Vc constante)',px,py+150,C.muted,11.5);
  a.txt('las rpm cambian con el diámetro:',px,py+170,C.muted,10.5);
  [[60,''],[30,''],[10,''],[2,'  ← cerca del centro']].forEach((d,i)=>{
    const y=py+192+i*20;
    a.txt('⌀'+d[0],px+10,y,C.muted,10.5);
    a.txt(N0(1000*s.vc/(Math.PI*d[0]))+' rpm'+d[1],px+200,y,d[0]<=2?C.d:C.text,10.5,'right');});
  a.html(b===4||b===5
   ? '<b>I y K son las coordenadas del centro del arco respecto al punto de inicio</b>, y se miden <b>en radio</b> aunque las X se programen en diámetro. La comprobación obligatoria: la distancia del centro al punto inicial debe ser igual que al final. Si no coincide, el control da error de geometría.'
   : (b===0
   ? 'La <b>cabecera</b> fija las unidades (G71 milímetros), el tipo de cotas (G90 absolutas), el tipo de avance (G95 mm/revolución) y el modo de velocidad (G97 rpm constantes). Olvidar <b>G71</b> es el error que destroza la pieza: un X20 pasa a ser 20 pulgadas.'
   : (b===1
   ? 'Al refrentar <b>hasta el centro</b> hay que usar <b>G97</b>: con G96 las revoluciones tenderían a infinito al acercarse a X0. Mira la tabla de la derecha con ⌀2 mm.'
   : (b===2
   ? 'El <b>ciclo G68</b> sustituye una decena de bloques de pasadas de ida y vuelta. P13 y P14 son los <b>números de bloque</b> donde empieza y acaba el perfil que el ciclo debe desbastar, y P7 y P8 las creces que deja para el acabado.'
   : 'En torno la cota <b>X se programa en diámetro</b>: para dejar la pieza a 10 mm de radio se escribe X20. Programar el radio deja la pieza al doble de lo previsto, y es un error que no da aviso: el programa se ejecuta sin problemas.'))));
 }});
  document.querySelectorAll('[data-sim]').forEach(function(el){var k=el.getAttribute('data-sim'); if(SIMS[k]){ try{ SIMS[k](el); }catch(e){ console.error('sim '+k, e); } }});
})();
