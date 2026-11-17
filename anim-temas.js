/* Ingeniería de los Sistemas de Producción: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 clasificación de los procesos */
M.reg('isp-t1',M.base({title:'Procesos de fabricación: cuatro formas de dar forma',H:580,dur:20,caps:[[5,'<b>Deformación plástica</b>: se fuerza el metal sólido a tomar la forma (forja, laminación, extrusión, chapa). No se pierde material.'],[10,'<b>Fusión</b>: se funde el metal y se vierte en un molde (fundición). Permite formas complejas.'],[15,'<b>Arranque de material</b>: una herramienta quita viruta (torneado, fresado). Da las mejores tolerancias.'],[99,'<b>Unión</b>: se juntan piezas (soldadura, tornillos, adhesivos). La elección depende de forma, material, tolerancias y número de piezas.']]},
 function(D,t){var k=Math.min(3,Math.floor(t/5)),u=(t%5)/5,P=[[160,170,'Deformación',C.f],[480,170,'Fusión',C.hl],[160,390,'Arranque de material',C.m],[480,390,'Unión',C.g]];
  P.forEach(function(p,i){var on=i===k;D.rect(p[0]-140,p[1]-90,280,180,p[3],RG(p[3],on?.1:.03),on?2.6:1.2);D.text(p[2],p[0],p[1]-66,{s:16,a:'center',c:p[3],bold:on});});
  var a=ease(seg(u,0.1,0.7));
  var p=P[0],h=lerp(70,35,k===0?a:1),w=4200/h/ (k===0?1:1);D.rect(p[0]-w/2,p[1]+60-h,w,h,null,RG(C.f,.5));D.rect(p[0]-90,p[1]+60,180,10,null,C.ax);D.rect(p[0]-90,p[1]+50-h,180,10,null,C.ax);
  p=P[1];D.path([[p[0]-60,p[1]+60],[p[0]-60,p[1]+0],[p[0]+60,p[1]+0],[p[0]+60,p[1]+60]],C.ax,2.4);var lv=k===1?a:(k>1?1:0);D.rect(p[0]-58,p[1]+58-56*lv,116,56*lv,null,RG(C.bad,.5));if(k===1&&a<1){D.line(p[0]+20,p[1]-50,p[0]+20,p[1]+58-56*lv,C.bad,6);D.path([[p[0]-10,p[1]-60],[p[0]+50,p[1]-60],[p[0]+40,p[1]-40],[p[0],p[1]-40]],C.ax,2,RG(C.ax,.2));}
  p=P[2];var cut=k===2?a:(k>2?1:0);D.rect(p[0]-80,p[1]-10,160,60,null,RG(C.m,.35));D.rect(p[0]-80+160*(1-cut),p[1]-10,160*cut,20,null,RG(C.bg||'#fff',1));D.path([[p[0]-80+160*(1-cut)-4,p[1]-30],[p[0]-80+160*(1-cut)+14,p[1]-30],[p[0]-80+160*(1-cut)+4,p[1]+10]],C.ax,2,RG(C.ax,.4));
  if(k===2)for(var i=0;i<4;i++)D.dot(p[0]-80+160*(1-cut)+12+i*6,p[1]-20-i*7*a,2.6,C.hl);
  p=P[3];var j=k===3?a:(k<3?0:1);D.rect(p[0]-110,p[1]+10,100,30,null,RG(C.g,.4));D.rect(p[0]+10,p[1]+10,100,30,null,RG(C.g,.4));if(j>0){D.path([[p[0]-10,p[1]+10],[p[0],p[1]+10-12*j],[p[0]+10,p[1]+10]],C.hl,2,RG(C.hl,.7));if(j<1)D.dot(p[0],p[1]-20,6,C.bad);}
  }));


/* T2 tensión de fluencia y temperatura */
M.reg('isp-t2',M.traza({title:'Deformación plástica: el efecto de la temperatura',H:560,dur:16,x0:0,x1:1,ax:{xr:[0,1.05],yr:[0,1.1],xt:[0.3,0.5,1],yt:[0.5,1],xd:1,yd:1,xl:'T/T_{f}',yl:'σ_{f}/σ_{f,amb}'},h:300,
 f:function(x){return x<0.3?1-0.25*x:Math.max(0.02,0.925*Math.exp(-(x-0.3)*4.5));},
 extra:function(D,A){D.rect(A.X(0),A.Y(1.1),A.X(0.3)-A.X(0),A.Y(0)-A.Y(1.1),null,RG(C.f,.08));D.rect(A.X(0.5),A.Y(1.1),A.X(1)-A.X(0.5),A.Y(0)-A.Y(1.1),null,RG(C.bad,.08));
  D.text('en frío',A.X(0.15),A.Y(1.05),{s:14,a:'center',c:C.f});D.text('en caliente',A.X(0.75),A.Y(1.05),{s:14,a:'center',c:C.bad});D.text('templado',A.X(0.4),A.Y(1.05),{s:13,a:'center',c:C.mut});},
 read:function(x){return ['T = '+nf(x,2)+'·T_{fusión} (K)    σ_{f} = '+nf((x<0.3?1-0.25*x:Math.max(0.02,0.925*Math.exp(-(x-0.3)*4.5)))*100,0)+' % del valor a temperatura ambiente',x<0.3?'acritud: el material se endurece al deformarlo':(x>0.5?'recristaliza: sin endurecimiento, fuerzas bajas':'zona intermedia')];},
 caps:[[5,'Por debajo de unas 0,3·T<sub>f</sub> el metal se endurece por deformación (acritud): cada vez cuesta más seguir deformándolo.'],[10,'Por encima de la temperatura de recristalización (0,4–0,5·T<sub>f</sub>) se forman granos nuevos durante la deformación.'],[99,'En caliente la tensión de fluencia cae mucho: hacen falta prensas menores y se admiten grandes deformaciones, a costa de peor acabado y tolerancias.']]}));

/* T3 curva ingenieril y curva real */
var K3=530,n3=0.26;
M.reg('isp-t3',M.base({title:'Tensión y deformación reales frente a ingenieriles',H:580,dur:18,caps:[[6,'En el ensayo de tracción la curva ingenieril divide la fuerza entre el área inicial. Tras el máximo baja, porque la probeta forma un cuello.'],[12,'La tensión real usa el área instantánea: <i>σ = σ<sub>ing</sub>(1 + e)</i>, y la deformación real es <i>ε = ln(1 + e)</i>. La curva real sigue subiendo.'],[99,'En conformado se usa la curva real, ajustada a la ley de Hollomon <i>σ = K·ε<sup>n</sup></i>. El cuello aparece cuando ε = n.']]},
 function(D,t){var e1=seg(t,1,15)*0.5,A=U.axes(D,{xr:[0,0.52],yr:[0,500],xt:[0.1,0.2,0.3,0.4,0.5],yt:[100,200,300,400,500],xd:1,yd:0,xl:'deformación',yl:'σ (MPa)'},{x:80,y:96,w:480,h:300,grid:true});
  var pi=[],pr=[];for(var i=0;i<=200;i++){var e=0.002+e1*i/200,ep=Math.log(1+e),sr=K3*Math.pow(ep,n3),si=sr/(1+e);pi.push([A.X(e),A.Y(si)]);pr.push([A.X(ep),A.Y(sr)]);}D.path(pi,C.g,2.6);D.path(pr,C.m,3);
  var eu=Math.exp(n3)-1;D.line(A.X(eu),A.Y(0),A.X(eu),A.Y(500),C.hl,1.2,[4,4]);D.text('cuello: ε = n',A.X(eu)+6,A.Y(470),{s:14,c:C.hl});D.text('ingenieril',A.X(0.42),A.Y(320),{s:15,c:C.g});D.text('real',A.X(0.47),A.Y(445),{s:15,c:C.m});
  var ep2=Math.log(1+e1);U.readout(D,['e = '+nf(e1,3)+'    ε = ln(1+e) = '+nf(ep2,3),'σ_{real} = '+nf(K3*Math.pow(Math.max(ep2,1e-4),n3),0)+' MPa    σ_{ing} = '+nf(K3*Math.pow(Math.max(ep2,1e-4),n3)/(1+e1),0)+' MPa'],468);}));

/* T4 Von Mises y Tresca */
M.reg('isp-t4',M.base({title:'Criterio de plastificación de Von Mises',H:600,dur:18,caps:[[6,'En tensión plana, Von Mises dice que el material plastifica cuando <i>σ₁² − σ₁σ₂ + σ₂² = σ<sub>y</sub>²</i>: una elipse.'],[12,'Tresca (hexágono) es algo más conservador: usa la máxima tensión tangencial. Coinciden en los ensayos uniaxiales y equibiaxiales.'],[99,'Se carga proporcionalmente desde el origen y se plastifica al tocar la elipse. Con σ₂ = σ₁/2 (deformación plana) hace falta un 15 % más que en tracción simple.']]},
 function(D,t){var cx=W/2,cy=290,S=120,ang=lerp(-0.3,1.4,U.pp(t,18)),d=[Math.cos(ang),Math.sin(ang)];
  D.line(cx-190,cy,cx+190,cy,C.ax,1.4);D.line(cx,cy+170,cx,cy-170,C.ax,1.4);D.text('σ₁',cx+190,cy-8,{s:17,c:C.w,a:'right'});D.text('σ₂',cx+8,cy-160,{s:17,c:C.w});
  var p=[];for(var i=0;i<=200;i++){var a=i/200*2*Math.PI,u=Math.cos(a),v=Math.sin(a),r=1/Math.sqrt(u*u-u*v+v*v);p.push([cx+S*r*u,cy-S*r*v]);}D.path(p,C.m,2.8);
  D.path([[1,0],[1,1],[0,1],[-1,0],[-1,-1],[0,-1],[1,0]].map(function(q){return [cx+S*q[0],cy-S*q[1]];}),C.f,1.8);
  var r=1/Math.sqrt(d[0]*d[0]-d[0]*d[1]+d[1]*d[1]),k=seg((t%6),0.5,4);D.line(cx,cy,cx+S*r*d[0]*1.2,cy-S*r*d[1]*1.2,C.mut,1,[4,4]);var q=Math.min(k*1.1,1)*r;D.arrow(cx,cy,cx+S*q*d[0],cy-S*q*d[1],C.hl,2.6);if(k*1.1>=1)D.dot(cx+S*r*d[0],cy-S*r*d[1],7,C.bad);
  D.text('Von Mises',cx+150,cy-150,{s:15,c:C.m});D.text('Tresca',cx+130,cy+60,{s:15,c:C.f});
  U.readout(D,['σ₂/σ₁ = '+nf(d[1]/d[0],2)+'    plastifica con σ₁ = '+nf(r*d[0],3)+'·σ_{y}'],520);}));

/* T5 recalcado */
M.reg('isp-t5',M.base({title:'Forja: recalcado de un cilindro',H:580,dur:16,caps:[[5,'Al recalcar un cilindro entre estampas planas su altura baja y el diámetro crece: el volumen se conserva, <i>d₀²h₀ = d²h</i>.'],[10,'La fuerza necesaria es <i>F = σ<sub>f</sub>·A·(1 + μd/(3h))</i>: crece con el área y con la relación d/h por el rozamiento con las estampas.'],[99,'Por eso la fuerza se dispara al final de la carrera. El rozamiento también abarrila la pieza (forma de tonel).']]},
 function(D,t){var u=ease(seg(t,1,13)),h0=120,d0=80,h=lerp(h0,40,u),d=d0*Math.sqrt(h0/h),cx=200,base=380,ep=Math.log(h0/h),sf=450*Math.pow(Math.max(ep,0.01),0.2),Am=Math.PI*Math.pow(d/1000,2)/4*1e6,F=sf*Am*(1+0.2*d/(3*h))/1000;
  D.rect(cx-120,base,240,24,C.ax,RG(C.ax,.3),1.6);D.rect(cx-120,base-h-24,240,24,C.ax,RG(C.ax,.3),1.6);D.arrow(cx,base-h-90,cx,base-h-28,C.bad,3);D.text('F',cx+10,base-h-70,{s:18,c:C.bad,bold:true});
  var bul=0.12*u*d;D.path([[cx-d/2,base],[cx-d/2-bul,base-h/2],[cx-d/2,base-h],[cx+d/2,base-h],[cx+d/2+bul,base-h/2],[cx+d/2,base]],C.m,2.4,RG(C.m,.25));
  D.text('h = '+nf(h,0)+' mm',cx+140,base-h/2,{s:16,c:C.w});D.text('d = '+nf(d,0)+' mm',cx,base+50,{s:16,a:'center',c:C.w});
  D.rect(450,140,40,240,C.grid,null,1.2);var fh=Math.min(240,F/9);D.rect(450,380-fh,40,fh,null,RG(C.bad,.6));D.text('F = '+nf(F,0)+' kN',470,130,{s:16,a:'center',c:C.bad,bold:true});
  U.readout(D,['ε = ln(h_{0}/h) = '+nf(ep,2)+'    σ_{f} = '+nf(sf,0)+' MPa    μ = 0,2'],520);}));

/* T6 laminación */
M.reg('isp-t6',M.base({title:'Laminación: la chapa sale más rápida que entra',H:560,dur:16,caps:[[5,'Los rodillos reducen el espesor de h₀ a h<sub>f</sub>. Como el caudal de material se conserva, <i>v₀·h₀ = v<sub>f</sub>·h<sub>f</sub></i>: la chapa se acelera.'],[10,'La superficie de los rodillos va a velocidad constante: a la entrada la chapa es más lenta que el rodillo y a la salida más rápida.'],[99,'En el punto neutro las dos velocidades coinciden. El rozamiento arrastra la chapa hacia dentro antes de ese punto y la frena después.']]},
 function(D,t){var cx=320,cy=240,R=80,h0=60,hf=36,gap=hf,v0=30;D.ring(cx,cy-gap/2-R,R,C.ax,2.4);D.ring(cx,cy+gap/2+R,R,C.ax,2.4);
  var a=t*0.6;[[cy-gap/2-R,1],[cy+gap/2+R,-1]].forEach(function(r){for(var k=0;k<6;k++){var b=a*r[1]+k*Math.PI/3;D.line(cx,r[0],cx+R*0.85*Math.cos(b),r[0]+R*0.85*Math.sin(b),C.mut,1.2);}});
  var top=function(x){var dx=x-cx;if(Math.abs(dx)>R*0.75)return dx<0?h0/2:hf/2;var y=gap/2+R-Math.sqrt(R*R-dx*dx);return dx<0?Math.min(h0/2,y):hf/2;};
  var up=[],dn=[];for(var x=40;x<=600;x+=4){var y=top(x);up.push([x,cy-y]);dn.push([x,cy+y]);}D.path(up.concat(dn.reverse()),C.m,2,RG(C.m,.2));
  for(var k2=0;k2<14;k2++){var s=((t*v0+k2*40)%560),xx=40+s;var hh=top(xx);if(xx>cx){}D.line(xx,cy-hh,xx,cy+hh,C.hl,1.4,null,0.8);}
  D.text('h₀ = 6 mm',60,cy-h0/2-12,{s:15,c:C.w});D.text('h_{f} = 3,6 mm',600,cy-hf/2-12,{s:15,c:C.w,a:'right'});
  U.readout(D,['v_{f} = v_{0}·h_{0}/h_{f} = 1 m/s · 6/3,6 = 1,67 m/s','reducción r = (h_{0} − h_{f})/h_{0} = 40 %'],440);}));

/* T7 doblado y recuperación elástica */
M.reg('isp-t7',M.base({title:'Conformado de chapa: doblado y recuperación elástica',H:560,dur:16,caps:[[5,'Al doblar, la cara exterior se estira y la interior se comprime. En la fibra neutra no hay deformación.'],[10,'Al retirar el punzón, la parte elástica de la deformación se recupera: el ángulo se abre un poco (springback).'],[99,'Para compensarlo se dobla de más (sobredoblado) o se acuña el radio. La recuperación es mayor con más límite elástico y radios grandes.']]},
 function(D,t){var u=ease(seg(t,1,8)),sb=t>9?ease(seg(t,9,11)):0,ang=lerp(0,90,u)-8*sb,cx=W/2,cy=200,L=190,a=ang*Math.PI/360;
  D.path([[cx-200,cy+60],[cx-90,cy+60],[cx,cy+150],[cx+90,cy+60],[cx+200,cy+60]],C.ax,2.4);
  var my=cy+54+u*80,lx=cx-L*Math.cos(a),ly=my-L*Math.sin(a),rx=cx+L*Math.cos(a);D.path([[lx,ly],[cx,my],[rx,ly]],C.m,6);
  var py=my-12-40*sb;D.path([[cx-30,py-90],[cx-30,py-24],[cx,py],[cx+30,py-24],[cx+30,py-90]],C.f,2.4,RG(C.f,.12));D.arrow(cx,py-140,cx,py-96,C.bad,2.6);
  U.readout(D,['ángulo de doblado = '+nf(ang,1)+'°',sb>0?'recuperación elástica: el ángulo se abre '+nf(8*sb,1)+'°':''],440);}));

/* T8 regla de Chvorinov */
M.reg('isp-t8',M.traza({title:'Fundición: tiempo de solidificación (Chvorinov)',H:560,dur:16,x0:0,x1:3.2,ax:{xr:[0,3.4],yr:[0,12],xt:[1,2,3],yt:[3,6,9,12],xd:0,yd:0,xl:'V/A (cm)',yl:'t_{s} (min)'},h:300,f:function(m){return 1.2*m*m;},
 extra:function(D,A){[['placa',0.8],['cubo',1.55],['esfera',1.92]].forEach(function(s){D.dot(A.X(s[1]),A.Y(1.2*s[1]*s[1]),6,C.hl);D.text(s[0],A.X(s[1])-8,A.Y(1.2*s[1]*s[1])-10,{s:14,c:C.hl,a:'right'});});},
 read:function(m){return ['t_{s} = B·(V/A)^{2}    B = 1,2 min/cm²','V/A = '+nf(m,2)+' cm  →  t_{s} = '+nf(1.2*m*m,1)+' min'];},
 caps:[[5,'El calor de la pieza sale a través de su superficie: piezas con mucho volumen y poca superficie tardan más en solidificar.'],[10,'Regla de Chvorinov: <i>t<sub>s</sub> = B·(V/A)<sup>n</sup></i>, con n ≈ 2. Con el mismo volumen, una esfera tarda más que un cubo y mucho más que una placa.'],[99,'Por eso la mazarota debe tener un módulo V/A mayor que la pieza (en la práctica, un 20 % más): solidifica la última y alimenta la contracción.']]}));

/* T9 ciclo térmico de soldadura */
function Tw(t,r){if(t<=0)return 20;return 20+6300/t*Math.exp(-r*r/(4*0.3*t))/2.2;}
M.reg('isp-t9',M.base({title:'Soldadura: ciclos térmicos junto al cordón',H:560,dur:16,caps:[[5,'Al pasar el arco cada punto de la pieza se calienta y luego se enfría: es su ciclo térmico. Cuanto más cerca del cordón, mayor es el pico.'],[10,'La zona fundida supera la temperatura de fusión. Al lado queda la zona afectada térmicamente (ZAT): no funde pero cambia su microestructura.'],[99,'La velocidad de enfriamiento (t<sub>8/5</sub>) decide si en la ZAT se forma martensita frágil. Precalentar o aportar más calor la reduce.']]},
 function(D,t){var x=seg(t,0.5,14)*20,A=U.axes(D,{xr:[0,20],yr:[0,2200],xt:[5,10,15,20],yt:[500,800,1500,2000],xd:0,yd:0,xl:'t (s)',yl:'T (°C)'},{x:80,y:96,w:480,h:300,grid:true});
  D.line(A.X(0),A.Y(1500),A.X(20),A.Y(1500),C.bad,1.2,[5,4]);D.text('fusión',A.X(19.8),A.Y(1500)-6,{s:13,c:C.bad,a:'right'});D.line(A.X(0),A.Y(800),A.X(20),A.Y(800),C.hl,1,[3,4]);D.text('800',A.X(19.8),A.Y(800)-6,{s:12,c:C.hl,a:'right'});D.line(A.X(0),A.Y(500),A.X(20),A.Y(500),C.hl,1,[3,4]);
  [[0.8,C.bad,'r = 0,8 cm (fundida)'],[1.1,C.m,'1,1 cm (ZAT)'],[2,C.f,'2 cm']].forEach(function(r){var off=1.5;U.plotf(D,A,function(s){return s>x?NaN:Tw(s-off,r[0]);},r[1],2.6);var pk=0,pt=0;for(var s=off;s<20;s+=0.05){var v=Tw(s-off,r[0]);if(v>pk){pk=v;pt=s;}}D.text(r[2],A.X(pt)+6,A.Y(pk)-8,{s:14,c:r[1]});});
  U.readout(D,['pico de temperatura decreciente con la distancia al eje del cordón'],468);}));

/* T10 programa CNC */
var PATH=[['G00 X0 Y0',[0,0],0],['G01 X60 Y0 F200',[60,0],1],['G01 X60 Y30',[60,30],1],['G03 X40 Y50 R20',[40,50],2],['G01 X0 Y50',[0,50],1],['G01 X0 Y0',[0,0],1],['M30',[0,0],0]];
M.reg('isp-t10',M.base({title:'Control numérico: el programa mueve la herramienta',H:580,dur:20,caps:[[6,'G00 es un posicionamiento rápido sin mecanizar. G01 es interpolación lineal al avance F (mm/min).'],[13,'G03 traza un arco en sentido antihorario (G02, horario) hasta el punto final con radio R.'],[99,'El control interpola cada movimiento en pequeños incrementos de los ejes. Aquí se contornea una placa con una esquina redondeada.']]},
 function(D,t){var x0=330,y0=420,S=4,u=seg(t,0.5,19)*(PATH.length-1),k=Math.min(PATH.length-2,Math.floor(u)),f=u-k,done=[[x0,y0]];
  D.rect(x0-20,y0-50*S-20,60*S+40,50*S+40,C.grid,RG(C.hl,.06),1);D.line(x0-30,y0,x0+280,y0,C.ax,1);D.line(x0,y0+20,x0,y0-230,C.ax,1);D.text('X',x0+280,y0+18,{s:14,c:C.mut});D.text('Y',x0-14,y0-226,{s:14,c:C.mut});
  function pt(i,ff){var a=PATH[i][1],b=PATH[i+1][1],ty=PATH[i+1][2];if(ty===2){var c=[40,30],a0=Math.atan2(a[1]-c[1],a[0]-c[0]),a1=Math.atan2(b[1]-c[1],b[0]-c[0]),aa=lerp(a0,a1,ff);return [c[0]+20*Math.cos(aa),c[1]+20*Math.sin(aa)];}return [lerp(a[0],b[0],ff),lerp(a[1],b[1],ff)];}
  for(var i=0;i<=k;i++){var steps=PATH[i+1][2]===2?20:1,ff=i<k?1:f;for(var j=1;j<=steps;j++){var q=pt(i,ff*j/steps);done.push([x0+q[0]*S,y0-q[1]*S]);}}
  D.path(done,C.m,3);var c=done[done.length-1];D.ring(c[0],c[1],10,C.bad,2.4);D.dot(c[0],c[1],3,C.bad);
  PATH.forEach(function(p,i){var y=110+i*40,on=i===k+1;if(on)D.rect(30,y-26,240,36,null,RG(C.y,.12));D.text(p[0],40,y,{s:16,c:on?C.y:C.w,mono:true,bold:on});});
  U.readout(D,[['','lineal G01','lineal G01','arco antihorario G03','lineal G01','lineal G01','fin de programa'][k+1]||''],520);}));
M.reg('isp-t10b',M.traza({title:'Control numérico: velocidad de corte y de giro',H:560,dur:16,x0:10,x1:200,ax:{xr:[0,210],yr:[0,4200],xt:[50,100,150,200],yt:[1000,2000,3000,4000],xd:0,yd:0,xl:'D (mm)',yl:'n (rpm)'},h:300,f:function(Dd){return 1000*120/(Math.PI*Dd);},
 extra:function(D,A){D.line(A.X(0),A.Y(3000),A.X(210),A.Y(3000),C.bad,1.4,[5,4]);D.text('n_{máx} del torno',A.X(205),A.Y(3000)-6,{s:13,c:C.bad,a:'right'});},
 read:function(Dd){var n=120000/(Math.PI*Dd);return ['V_{c} = 120 m/min    D = '+nf(Dd,0)+' mm','n = 1000·V_{c}/(π·D) = '+nf(n,0)+' rpm'+(n>3000?'  → limitar a 3000 (G50)':'')];},
 caps:[[5,'El fabricante de la herramienta recomienda una velocidad de corte V<sub>c</sub> (m/min) según el material. El husillo se programa en rpm.'],[10,'Para mantener V<sub>c</sub> constante, <i>n = 1000·V<sub>c</sub>/(πD)</i>: al refrentar hacia el centro el diámetro baja y las rpm se disparan.'],[99,'Por eso con velocidad de corte constante (G96) se limita la velocidad máxima del cabezal (G50).']]}));
})();
