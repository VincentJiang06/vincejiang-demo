"use strict";
(() => {
  const board = document.querySelector("[data-path-board]");
  const modes = [
    "页已缓存。内核从页缓存复制四个字节到调用者的缓冲区，再返回实际读取的字节数。",
    "缓存未命中。文件系统定位数据块，驱动提交设备读取；数据进入页缓存后，再复制到调用者。"
  ];
  function context(canvas,w,h) {
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
    if(!rect.width||!rect.height)return;
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    const c=canvas.getContext("2d");const scale=Math.min(canvas.width/w,canvas.height/h);
    c.setTransform(scale,0,0,scale,(canvas.width-w*scale)/2,(canvas.height-h*scale)/2);
    c.lineCap="round";c.lineJoin="round";return c;
  }
  function route(c,pts,color,dashed=false){
    c.strokeStyle=color;c.lineWidth=2;c.setLineDash(dashed?[4,5]:[]);c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.setLineDash([]);
    const [x,y]=pts.at(-1),[px,py]=pts.at(-2),angle=Math.atan2(y-py,x-px);
    c.beginPath();c.moveTo(x-7*Math.cos(angle-.45),y-7*Math.sin(angle-.45));c.lineTo(x,y);c.lineTo(x-7*Math.cos(angle+.45),y-7*Math.sin(angle+.45));c.stroke();
  }
  function box(c,x,y,w,h,bg,edge){c.fillStyle=bg;c.strokeStyle=edge;c.lineWidth=1.5;c.beginPath();c.roundRect(x,y,w,h,6);c.fill();c.stroke();}
  function type(c,t,x,y,size=14,color="#eff4e9",align="center"){c.fillStyle=color;c.textAlign=align;c.font='600 '+size+'px "PingFang SC",system-ui,sans-serif';c.fillText(t,x,y);}
  function iso(c,x,y,size,fill,edge){const a=size,b=size*.44,d=size*.42;
    const face=(points,color)=>{c.fillStyle=color;c.strokeStyle=edge;c.lineWidth=1.4;c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fill();c.stroke();};
    face([[x-a,y],[x,y+b],[x,y+b+d],[x-a,y+d]],"#407263");face([[x,y+b],[x+a,y],[x+a,y+d],[x,y+b+d]],"#285a4e");face([[x-a,y],[x,y-b],[x+a,y],[x,y+b]],fill);}
  function drawBoard(m){
    const c=context(board,465,240);if(!c)return;
    const hot="#e0ed99",cool="#709b8b",on=m?hot:cool;
    for(let y=8;y<239;y+=16)for(let x=8;x<465;x+=16){c.fillStyle="rgba(190,219,197,.21)";c.fillRect(x,y,1.3,1.3);}
    route(c,[[79,73],[129,73]],hot);
    route(c,[[202,73],[256,73]],hot);
    route(c,[[326,73],[373,73]],hot);
    route(c,[[280,103],[280,140],[227,140],[227,162]],on,!m);
    route(c,[[256,185],[337,185]],on,!m);
    route(c,[[379,158],[379,123],[310,123],[310,101]],on,!m);
    box(c,11,48,68,48,"#234e42",cool);c.strokeStyle=hot;c.lineWidth=1.5;c.strokeRect(25,57,39,25);c.beginPath();c.moveTo(31,64);c.lineTo(36,68);c.lineTo(31,72);c.moveTo(41,74);c.lineTo(48,74);c.stroke();
    box(c,130,48,72,48,"#315c4f",cool);iso(c,166,66,18,"#acce9e","#cddfa7");
    box(c,257,48,69,54,"#c9da99","#dae8bd");for(let i=0;i<6;i++){c.fillStyle=i===3? "#c9da99":"#3e6752";c.strokeStyle="#3e6752";c.fillRect(270+i%3*14,60+Math.floor(i/3)*14,10,9);c.strokeRect(270+i%3*14,60+Math.floor(i/3)*14,10,9);}
    box(c,375,48,80,48,"#2c5648",cool);[0,1,2,3].forEach(i=>{c.fillStyle=hot;c.fillRect(385+i*16,62,11,17);});
    for(const [t,x] of [["应用程序",45],["内核 read",166],["页缓存",291],["用户缓冲区",414]])type(c,t,x,34,14);
    type(c,"调用",105,62,11,"#bfd1bd");type(c,"查找",229,62,11,"#bfd1bd");type(c,"复制",350,62,11,"#bfd1bd");
    box(c,190,163,66,47,"#244a40",on);for(let i=0;i<3;i++){c.fillStyle=on;c.fillRect(200,173+i*9,8,3);c.fillRect(213,173+i*9,28-i*4,3);}
    box(c,338,163,79,47,"#23483e",on);c.strokeStyle=on;c.lineWidth=1.6;c.beginPath();c.ellipse(378,176,17,5,0,0,Math.PI*2);c.moveTo(361,176);c.lineTo(361,190);c.ellipse(378,190,17,5,0,Math.PI,0,true);c.lineTo(395,176);c.stroke();
    type(c,"块映射",223,230,13,on);type(c,"存储设备",378,230,13,on);type(c,"定位与读取",296,176,11,on);
    type(c,"4 B",415,114,12,"#b9cbb7");
  }
  if(board){let mode=0;const tabs=[...document.querySelectorAll("[data-path-mode]")],cap=document.querySelector("#path-caption");
    function update(){drawBoard(mode);cap.textContent=modes[mode];tabs.forEach((a,i)=>a.setAttribute("aria-pressed",String(i===mode)));}
    tabs.forEach((a,i)=>a.onclick=()=>{mode=i;update();});new ResizeObserver(update).observe(board);update();}
  const pictos={
    overview(c){iso(c,39,14,17,"#b6c7a1","#435d4c");iso(c,39,25,17,"#d1d6b5","#435d4c");},
    syscalls(c){box(c,8,10,20,20,"#e9e4c9","#4c6955");box(c,51,10,20,20,"#d4dea6","#4c6955");route(c,[[29,20],[49,20]],"#4c6955");},
    filesystem(c){for(let i=0;i<18;i++){c.fillStyle=i<5?"#8e9f79":"#e0dfbd";c.fillRect(10+i%6*10,5+Math.floor(i/6)*10,8,8);}},
    devices(c){for(let i=2;i>=0;i--){c.fillStyle="#dae1c8";c.strokeStyle="#597364";c.fillRect(18,8+i*7,42,7);c.strokeRect(18,8+i*7,42,7);}},
    cpu(c){for(let i=0;i<6;i++){c.fillStyle=["#658873","#c5cba5","#e3c19a"][i%3];c.fillRect(7+i*11,14,10,13);}},
    memory(c){for(let i=0;i<3;i++){box(c,9,2+i*12,17,9,"#e3d4ae","#75846c");box(c,53,2+i*12,17,9,"#d7e1c4","#75846c");route(c,[[27,6+i*12],[52,6+[2,0,1][i]*12]],"#75846c");}},
    threads(c){route(c,[[8,19],[24,19],[35,7],[69,7]],"#607f69");route(c,[[24,19],[35,31],[69,31]],"#a07958");},
    sync(c){box(c,24,16,32,18,"#c4d4b1","#435d4c");c.strokeStyle="#435d4c";c.lineWidth=3;c.beginPath();c.arc(40,16,9,Math.PI,0);c.stroke();c.fillStyle="#435d4c";c.fillRect(38,22,4,7);}
  };
  const icons=[...document.querySelectorAll("canvas[data-icon]")];function drawIcons(){for(const cv of icons){const c=context(cv,80,38);if(c)pictos[cv.dataset.icon]?.(c);}}
  if(icons.length){new ResizeObserver(drawIcons).observe(icons[0]);drawIcons();}
})();
