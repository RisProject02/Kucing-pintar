// ═══════════════════════════════════════════════════════════════
//  HERO DATA  (shared across scenes)
// ═══════════════════════════════════════════════════════════════
const HEROES = {
  Mimi: { emoji:'🐱', color:0x7b2fff, colorHex:'#7b2fff', hoverColor:0x9b4fff, moveSpeed:180, jumpVel:-490, maxEnergy:100, type:'Balanced' },
  Kuro: { emoji:'😼', color:0xe67e22, colorHex:'#e67e22', hoverColor:0xf39c12, moveSpeed:260, jumpVel:-450, maxEnergy:80,  type:'Fast'     },
  Snow: { emoji:'🤍', color:0x2980b9, colorHex:'#2980b9', hoverColor:0x3498db, moveSpeed:130, jumpVel:-530, maxEnergy:120, type:'Tank'     }
};

// ═══════════════════════════════════════════════════════════════
//  SHARED MIXIN
// ═══════════════════════════════════════════════════════════════
const SceneMixin = {
  _drawBg() {
    const W = this.scale.width, H = this.scale.height;
    const bg = this.add.graphics();
    for (let i = 0; i < H; i++) {
      const t = i / H;
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(0x1a0533),
        Phaser.Display.Color.ValueToColor(0x0d2b6b),
        100, Math.round(t * 100)
      );
      bg.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b));
      bg.fillRect(0, i, W, 1);
    }
  },
  _addOrb(x, y, r, color, alpha) {
    this.add.graphics().fillStyle(color, alpha).fillCircle(x, y, r);
  },
  _spawnStars(n) {
    const W = this.scale.width, H = this.scale.height;
    for (let i = 0; i < n; i++) {
      const g = this.add.graphics()
        .fillStyle(0xffffff, Phaser.Math.FloatBetween(0.4, 1))
        .fillCircle(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H), Phaser.Math.FloatBetween(0.8, 2.4));
      this.tweens.add({ targets: g, alpha: 0, duration: Phaser.Math.Between(1000,3200), yoyo:true, repeat:-1, delay:Phaser.Math.Between(0,2500), ease:'Sine.easeInOut' });
    }
  },
  _makeBtn(cx, cy, w, h, label, cn, ch, delay, onClick) {
    const r = h/2, x = cx-w/2, y = cy-h/2;
    const ctr = this.add.container(0,0);
    const shd = this.add.graphics().fillStyle(0x000000,0.30).fillRoundedRect(x+3,y+5,w,h,r);
    const body = this.add.graphics().fillStyle(cn,1).fillRoundedRect(x,y,w,h,r);
    const shin = this.add.graphics().fillStyle(0xffffff,0.13).fillRoundedRect(x+8,y+4,w-16,h/2-4,r-2);
    const txt  = this.add.text(cx,cy,label,{fontSize:'19px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#ffffff',shadow:{offsetX:0,offsetY:2,color:'#00000055',blur:4,fill:true}}).setOrigin(0.5);
    ctr.add([shd,body,shin,txt]);
    const zone = this.add.zone(cx,cy,w,h).setInteractive({useHandCursor:true});
    zone.on('pointerover',  ()=>{ body.clear().fillStyle(ch,1).fillRoundedRect(x,y,w,h,r); this.tweens.add({targets:ctr,scaleX:1.04,scaleY:1.04,duration:100,ease:'Back.Out'}); });
    zone.on('pointerout',   ()=>{ body.clear().fillStyle(cn,1).fillRoundedRect(x,y,w,h,r); this.tweens.add({targets:ctr,scaleX:1,scaleY:1,duration:100,ease:'Back.Out'}); });
    zone.on('pointerdown',  ()=>{ this.tweens.add({targets:ctr,scaleX:0.96,scaleY:0.96,duration:80,yoyo:true,ease:'Quad.Out'}); if(onClick) onClick(); });
    ctr.setAlpha(0);
    this.tweens.add({targets:ctr,alpha:1,duration:350,delay:200+delay,ease:'Quad.Out'});
    return {ctr,body,txt};
  }
};

// ═══════════════════════════════════════════════════════════════
//  MAIN MENU
// ═══════════════════════════════════════════════════════════════
class MainMenuScene extends Phaser.Scene {
  constructor() { super({key:'MainMenu'}); }
  create() {
    Object.assign(this, SceneMixin);
    const W=this.scale.width, H=this.scale.height;
    this._drawBg();
    this._addOrb(W*.12,H*.18,160,0x9b59b6,.18); this._addOrb(W*.88,H*.15,120,0x3498db,.15);
    this._addOrb(W*.50,H*.90,200,0xe74c3c,.10); this._addOrb(W*.07,H*.78,100,0xf39c12,.12);
    this._addOrb(W*.93,H*.72,140,0x1abc9c,.12);
    this._spawnStars(70);

    const pw=480,ph=500, px=W/2-pw/2, py=H/2-ph/2;
    const panel=this.add.graphics();
    panel.fillStyle(0xffffff,.06).fillRoundedRect(px,py,pw,ph,32);
    panel.lineStyle(2,0xffffff,.18).strokeRoundedRect(px,py,pw,ph,32);

    this.add.text(W/2,py+56,'🐱',{fontSize:'54px'}).setOrigin(0.5);
    const title=this.add.text(W/2,py+128,'Kucing Pintar',{fontSize:'46px',fontFamily:'Georgia,serif',fontStyle:'bold',color:'#ffffff',stroke:'#7b2fff',strokeThickness:6,shadow:{offsetX:0,offsetY:4,color:'#7b2fff',blur:20,fill:true}}).setOrigin(0.5);
    this.tweens.add({targets:title,scaleX:1.04,scaleY:1.04,duration:2000,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    this.add.text(W/2,py+178,'Petualangan Strategi',{fontSize:'17px',fontFamily:'Arial,sans-serif',color:'#c9a0ff',letterSpacing:4}).setOrigin(0.5);
    this.add.graphics().lineStyle(1,0xffffff,.2).lineBetween(W/2-160,py+206,W/2+160,py+206);

    const goTo=(key)=>{ this.cameras.main.fadeOut(300,0,0,0); this.cameras.main.once('camerafadeoutcomplete',()=>this.scene.start(key)); };
    const defs=[
      {label:'▶  Mainkan',     cn:0x7b2fff,ch:0x9b4fff, action:()=>goTo('Level1')},
      {label:'🦸  Pilih Hero',  cn:0xc0392b,ch:0xe74c3c, action:()=>goTo('HeroSelect')},
      {label:'ℹ  Tentang Game',cn:0x16a085,ch:0x1abc9c, action:null}
    ];
    const bw=290,bh=52,gap=18,sy=py+236;
    defs.forEach((d,i)=> this._makeBtn(W/2,sy+i*(bh+gap)+bh/2,bw,bh,d.label,d.cn,d.ch,i*80,d.action));
    this.add.text(W-12,H-8,'v1.0',{fontSize:'11px',color:'#ffffff'}).setOrigin(1,1).setAlpha(.25);
    this.cameras.main.fadeIn(400,0,0,0);
  }
}

// ═══════════════════════════════════════════════════════════════
//  HERO SELECT
// ═══════════════════════════════════════════════════════════════
class HeroSelectScene extends Phaser.Scene {
  constructor() { super({key:'HeroSelect'}); }
  _statObjs=[];

  create() {
    Object.assign(this, SceneMixin);
    const W=this.scale.width, H=this.scale.height;
    this._sel=localStorage.getItem('selectedHero')||null;
    this._drawBg();
    this._addOrb(W*.05,H*.10,140,0x9b59b6,.15); this._addOrb(W*.95,H*.12,110,0xe67e22,.14);
    this._addOrb(W*.50,H*.95,180,0x2980b9,.10); this._addOrb(W*.08,H*.80,90,0x1abc9c,.12);
    this._addOrb(W*.92,H*.78,120,0xe74c3c,.11);
    this._spawnStars(50);

    this.add.text(W/2,38,'Pilih Hero',{fontSize:'32px',fontFamily:'Georgia,serif',fontStyle:'bold',color:'#ffffff',stroke:'#7b2fff',strokeThickness:5,shadow:{offsetX:0,offsetY:3,color:'#7b2fff',blur:14,fill:true}}).setOrigin(0.5);
    this.add.text(W/2,72,'Pilih karakter terbaik untuk petualanganmu',{fontSize:'13px',fontFamily:'Arial,sans-serif',color:'#c9a0ff'}).setOrigin(0.5);

    const heroList=[
      {id:'Mimi',emoji:'🐱',type:'Balanced',speed:5,energy:100,maxSpeed:10,maxEnergy:150,color:0x7b2fff,colorHex:'#7b2fff',hoverColor:0x9b4fff,typeColor:'#c9a0ff',typeBg:0x4a0fa8,desc:'Serangan & pertahanan\nyang seimbang'},
      {id:'Kuro',emoji:'😼',type:'Fast',    speed:8,energy:80, maxSpeed:10,maxEnergy:150,color:0xe67e22,colorHex:'#e67e22',hoverColor:0xf39c12,typeColor:'#ffe0a0',typeBg:0x9a5200,desc:'Gerakan super cepat,\nserang & kabur!'},
      {id:'Snow',emoji:'🤍',type:'Tank',   speed:4,energy:120,maxSpeed:10,maxEnergy:150,color:0x2980b9,colorHex:'#2980b9',hoverColor:0x3498db,typeColor:'#a0d8ff',typeBg:0x0a4a7a,desc:'Daya tahan tinggi,\nbertahan & menghancurkan'}
    ];

    const cw=230,ch=360, totalW=cw*3+60, sx=(W-totalW)/2, cy=H/2+14;
    this._cardCtrs=[]; this._cardBorders=[];

    heroList.forEach((h,i)=>{
      const cx=sx+cw/2+i*(cw+30);
      const {ctr,border}=this._buildCard(cx,cy,cw,ch,h,i);
      this._cardCtrs.push(ctr);
      this._cardBorders.push({gfx:border,hero:h,cx,cy,cw,ch});
    });
    if(this._sel){ const idx=heroList.findIndex(h=>h.id===this._sel); if(idx!==-1) this._highlight(idx,heroList[idx]); }

    this._makeBtn(72,H-36,110,40,'← Kembali',0x444466,0x6655aa,0,()=>{
      this.cameras.main.fadeOut(300,0,0,0);
      this.cameras.main.once('camerafadeoutcomplete',()=>this.scene.start('MainMenu'));
    });
    this.cameras.main.fadeIn(400,0,0,0);
  }

  _buildCard(cx,cy,cw,ch,hero,idx){
    const ctr=this.add.container(cx,cy);
    const bg=this.add.graphics(); bg.fillStyle(0xffffff,.07).fillRoundedRect(-cw/2,-ch/2,cw,ch,20); bg.lineStyle(1.5,0xffffff,.12).strokeRoundedRect(-cw/2,-ch/2,cw,ch,20);
    const acc=this.add.graphics(); acc.fillStyle(hero.color,.6).fillRoundedRect(-cw/2,-ch/2,cw,6,{tl:20,tr:20,bl:0,br:0});
    const aBg=this.add.graphics(); aBg.fillStyle(hero.color,.25).fillCircle(0,-ch/2+68,44); aBg.lineStyle(2,hero.color,.6).strokeCircle(0,-ch/2+68,44);
    const av=this.add.text(0,-ch/2+68,hero.emoji,{fontSize:'44px'}).setOrigin(0.5);
    const nm=this.add.text(0,-ch/2+128,hero.id,{fontSize:'22px',fontFamily:'Georgia,serif',fontStyle:'bold',color:'#ffffff',shadow:{offsetX:0,offsetY:2,color:hero.colorHex,blur:8,fill:true}}).setOrigin(0.5);
    const bTmp=this.add.text(0,-ch/2+156,hero.type,{fontSize:'11px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:hero.typeColor,letterSpacing:2}).setOrigin(0.5);
    const bw=bTmp.width+28, bh=bTmp.height+10;
    const badge=this.add.graphics(); badge.fillStyle(hero.typeBg,.9).fillRoundedRect(-bw/2,-ch/2+143,bw,bh,bh/2);
    bTmp.destroy();
    const bl=this.add.text(0,-ch/2+152,hero.type,{fontSize:'11px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:hero.typeColor,letterSpacing:2}).setOrigin(0.5);
    const sy=-ch/2+192;
    this._drawStat(0,sy,'⚡ Speed',hero.speed,hero.maxSpeed,0xf39c12,cw);
    this._drawStat(0,sy+42,'💚 Energy',hero.energy,hero.maxEnergy,0x2ecc71,cw);
    const desc=this.add.text(0,-ch/2+290,hero.desc,{fontSize:'11px',fontFamily:'Arial,sans-serif',color:'#aaaacc',align:'center',lineSpacing:4}).setOrigin(0.5);
    const selBtn=this._cardBtn(0,ch/2-34,160,38,'Pilih!',hero.color,hero.hoverColor,()=>this._selectHero(idx,hero));
    ctr.add([bg,acc,aBg,av,nm,badge,bl,desc]);
    this._statObjs.forEach(o=>ctr.add(o)); this._statObjs=[];
    ctr.add(selBtn);

    const border=this.add.graphics();
    const zone=this.add.zone(cx,cy,cw-10,ch-60).setInteractive({useHandCursor:true});
    zone.on('pointerover',()=>this.tweens.add({targets:ctr,scaleX:1.03,scaleY:1.03,duration:150,ease:'Back.Out'}));
    zone.on('pointerout', ()=>this.tweens.add({targets:ctr,scaleX:1,scaleY:1,duration:150,ease:'Back.Out'}));
    ctr.setAlpha(0); ctr.y+=30;
    this.tweens.add({targets:ctr,alpha:1,y:cy,duration:450,delay:150+idx*120,ease:'Back.Out'});
    return {ctr,border};
  }

  _drawStat(rx,ry,label,val,max,color,cw){
    const bw=cw-60;
    this._statObjs.push(
      this.add.text(rx-bw/2,ry,label,{fontSize:'11px',fontFamily:'Arial,sans-serif',color:'#ccccee'}).setOrigin(0,.5),
      this.add.text(rx+bw/2,ry,String(val),{fontSize:'11px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#ffffff'}).setOrigin(1,.5),
      this.add.graphics().fillStyle(0xffffff,.1).fillRoundedRect(rx-bw/2,ry+14,bw,8,4),
      this.add.graphics().fillStyle(color,.9).fillRoundedRect(rx-bw/2,ry+14,Math.round(bw*(val/max)),8,4)
    );
  }

  _cardBtn(rx,ry,w,h,label,cn,ch,onClick){
    const r=h/2;
    const shd=this.add.graphics().fillStyle(0,0.28).fillRoundedRect(rx-w/2+2,ry-h/2+4,w,h,r);
    const body=this.add.graphics().fillStyle(cn,1).fillRoundedRect(rx-w/2,ry-h/2,w,h,r);
    const shin=this.add.graphics().fillStyle(0xffffff,.15).fillRoundedRect(rx-w/2+6,ry-h/2+3,w-12,h/2-3,r-2);
    const txt=this.add.text(rx,ry,label,{fontSize:'15px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#ffffff'}).setOrigin(0.5);
    const btn=this.add.container(0,0,[shd,body,shin,txt]);
    btn.setInteractive(new Phaser.Geom.Rectangle(rx-w/2,ry-h/2,w,h),Phaser.Geom.Rectangle.Contains);
    btn.on('pointerover',()=>body.clear().fillStyle(ch,1).fillRoundedRect(rx-w/2,ry-h/2,w,h,r));
    btn.on('pointerout', ()=>body.clear().fillStyle(cn,1).fillRoundedRect(rx-w/2,ry-h/2,w,h,r));
    btn.on('pointerdown',()=>{ if(onClick) onClick(); });
    return btn;
  }

  _selectHero(idx,hero){
    this._sel=hero.id; localStorage.setItem('selectedHero',hero.id);
    this._highlight(idx,hero); this._toast(`${hero.emoji} ${hero.id} dipilih!`);
  }

  _highlight(idx,hero){
    this._cardBorders.forEach(b=>b.gfx.clear());
    const {gfx,cx,cy,cw,ch}=this._cardBorders[idx];
    gfx.lineStyle(3,hero.color,1).strokeRoundedRect(cx-cw/2-3,cy-ch/2-3,cw+6,ch+6,22);
    this.tweens.add({targets:gfx,alpha:.4,duration:900,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    this.tweens.add({targets:this._cardCtrs[idx],scaleX:1.06,scaleY:1.06,duration:160,yoyo:true,ease:'Back.Out'});
  }

  _toast(msg){
    const W=this.scale.width,H=this.scale.height;
    if(this._toastCtr) this._toastCtr.destroy();
    const bg=this.add.graphics().fillStyle(0,0.75).fillRoundedRect(W/2-130,H-78,260,42,21);
    const txt=this.add.text(W/2,H-57,msg,{fontSize:'16px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#ffffff'}).setOrigin(0.5);
    this._toastCtr=this.add.container(0,0,[bg,txt]).setAlpha(0);
    this.tweens.add({targets:this._toastCtr,alpha:1,duration:200,ease:'Quad.Out',onComplete:()=>{
      this.tweens.add({targets:this._toastCtr,alpha:0,duration:300,delay:1600,ease:'Quad.In',onComplete:()=>this._toastCtr&&this._toastCtr.destroy()});
    }});
  }
}

// ═══════════════════════════════════════════════════════════════
//  LEVEL 1 — CAT VILLAGE
// ═══════════════════════════════════════════════════════════════
class Level1Scene extends Phaser.Scene {
  constructor() { super({key:'Level1'}); }

  preload() {
    // 1×1 white pixel — foundation for all physics bodies
    const g=this.make.graphics({x:0,y:0,add:false});
    g.fillStyle(0xffffff,1).fillRect(0,0,1,1);
    g.generateTexture('px',1,1); g.destroy();
  }

  create() {
    const W=this.scale.width, H=this.scale.height;
    const WW=2400, WH=600;         // world size
    const GY=556;                  // ground top y

    // ── Hero setup ──────────────────────────────────────────────
    const heroId=localStorage.getItem('selectedHero')||'Mimi';
    this.hero=HEROES[heroId]||HEROES.Mimi;
    this.heroId=heroId;
    this.score=0;
    this.energy=this.hero.maxEnergy;
    this.maxEnergy=this.hero.maxEnergy;
    this.isDead=false;
    this.levelDone=false;
    this._jumpReady=true;

    this.physics.world.setBounds(0,0,WW,WH);

    // ── Sky (camera-fixed gradient) ──────────────────────────────
    const sky=this.add.graphics().setScrollFactor(0);
    for(let i=0;i<H;i++){
      const t=i/H;
      sky.fillStyle(Phaser.Display.Color.GetColor(
        Math.round(Phaser.Math.Linear(110,250,t)),
        Math.round(Phaser.Math.Linear(190,210,t)),
        Math.round(Phaser.Math.Linear(230,170,t))
      ));
      sky.fillRect(0,i,W,1);
    }

    // ── Clouds (slow parallax 0.2) ───────────────────────────────
    this._drawClouds(WW);

    // ── Village decorations (behind platforms) ───────────────────
    this._drawVillage(WW,GY);

    // ── Ground ──────────────────────────────────────────────────
    this.platforms=this.physics.add.staticGroup();

    // Ground visual
    const gfxG=this.add.graphics();
    gfxG.fillStyle(0x4CAF50,1).fillRect(0,GY,WW,12);        // grass top
    gfxG.fillStyle(0x6D4C41,1).fillRect(0,GY+12,WW,44);      // earth
    // Ground body (invisible, full width)
    this.platforms.create(WW/2,GY+28,'px').setDisplaySize(WW,56).setAlpha(0).refreshBody();

    // ── Floating platforms ──────────────────────────────────────
    const platDefs=[
      {x:230, y:455,w:140},{x:430, y:370,w:120},{x:600, y:445,w:110},
      {x:760, y:318,w:130},{x:930, y:430,w:110},{x:1110,y:298,w:140},
      {x:1280,y:400,w:120},{x:1460,y:338,w:150},{x:1640,y:268,w:130},
      {x:1820,y:398,w:120},{x:2000,y:318,w:140},{x:2180,y:420,w:120}
    ];
    const gfxP=this.add.graphics();
    platDefs.forEach(p=>{
      // Visual — wooden plank look
      gfxP.fillStyle(0x8D6E63,1).fillRoundedRect(p.x-p.w/2,p.y,p.w,18,4);
      gfxP.fillStyle(0xA1887F,1).fillRoundedRect(p.x-p.w/2,p.y,p.w,5,{tl:4,tr:4,bl:0,br:0});
      gfxP.lineStyle(1,0x5D4037,.6).strokeRoundedRect(p.x-p.w/2,p.y,p.w,18,4);
      // Body
      this.platforms.create(p.x,p.y+9,'px').setDisplaySize(p.w,18).setAlpha(0).refreshBody();
    });

    // ── Fish collectibles ────────────────────────────────────────
    this.fishGroup=this.physics.add.staticGroup();
    this.fishDisplays=[];
    const fishSpots=[
      // on ground
      {x:150,y:GY-18},{x:350,y:GY-18},{x:540,y:GY-18},
      {x:700,y:GY-18},{x:1000,y:GY-18},{x:1380,y:GY-18},
      {x:1700,y:GY-18},{x:2060,y:GY-18},
      // on platforms
      {x:230,y:428},{x:430,y:343},{x:600,y:418},
      {x:760,y:291},{x:930,y:403},{x:1110,y:271},
      {x:1280,y:373},{x:1460,y:311},{x:1640,y:241},
      {x:1820,y:371},{x:2000,y:291},{x:2180,y:393}
    ];
    fishSpots.forEach(pos=>{
      const body=this.fishGroup.create(pos.x,pos.y,'px').setDisplaySize(28,22).setAlpha(0).refreshBody();
      const emoji=this.add.text(pos.x,pos.y,'🐟',{fontSize:'22px'}).setOrigin(0.5).setDepth(2);
      this.tweens.add({targets:emoji,y:pos.y-6,duration:900+Math.random()*300,yoyo:true,repeat:-1,ease:'Sine.easeInOut',delay:Math.random()*600});
      this.fishDisplays.push({body,emoji,collected:false});
    });

    // ── Finish flag ──────────────────────────────────────────────
    const fx=2340, fy=GY;
    this._drawFlag(fx,fy);
    this.flagZone=this.add.zone(fx,fy-50,60,100).setOrigin(0.5);
    this.physics.add.existing(this.flagZone,true);

    // ── Player ──────────────────────────────────────────────────
    this._buildPlayerTexture();
    this.player=this.physics.add.sprite(80,GY-34,'player_tex');
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(300);
    this.player.setMaxVelocityY(700);
    this.player.setDepth(5);
    // Emoji face on top of player
    this.playerFace=this.add.text(0,0,this.hero.emoji,{fontSize:'26px'}).setOrigin(0.5).setDepth(6);

    // ── Physics ─────────────────────────────────────────────────
    this.physics.add.collider(this.player,this.platforms);
    this.physics.add.overlap(this.player,this.fishGroup,this._collectFish,null,this);
    this.physics.add.overlap(this.player,this.flagZone,this._reachFlag,null,this);

    // ── Camera ──────────────────────────────────────────────────
    this.cameras.main.setBounds(0,0,WW,WH);
    this.cameras.main.startFollow(this.player,true,0.09,0.09);

    // ── Input ───────────────────────────────────────────────────
    this.cursors=this.input.keyboard.createCursorKeys();
    this.wasd=this.input.keyboard.addKeys({
      up:Phaser.Input.Keyboard.KeyCodes.W,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D
    });
    this.spaceKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ── HUD ─────────────────────────────────────────────────────
    this._touch={left:false,right:false,jump:false};
    this._buildHUD(W,H);
    this._buildTouchControls(W,H);

    // ── Energy drain (1 unit/sec) ────────────────────────────────
    this.time.addEvent({delay:1000,callback:()=>{
      if(this.isDead||this.levelDone) return;
      this.energy=Math.max(0,this.energy-1);
      if(this.energy<=0) this._die();
    },loop:true});

    this.cameras.main.fadeIn(500,0,0,0);
  }

  update(){
    if(this.isDead||this.levelDone) return;
    const h=this.hero;
    const onGround=this.player.body.blocked.down;
    const goL=this.cursors.left.isDown  ||this.wasd.left.isDown  ||this._touch.left;
    const goR=this.cursors.right.isDown ||this.wasd.right.isDown ||this._touch.right;
    const doJump=this.cursors.up.isDown ||this.wasd.up.isDown    ||this.spaceKey.isDown||this._touch.jump;

    if(goL){
      this.player.setVelocityX(-h.moveSpeed);
      this.player.setFlipX(true);
    } else if(goR){
      this.player.setVelocityX(h.moveSpeed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(this.player.body.velocity.x * 0.82);
    }

    if(doJump && onGround && this._jumpReady){
      this.player.setVelocityY(h.jumpVel);
      this._jumpReady=false;
      // Squish on jump
      this.tweens.add({targets:this.player,scaleX:0.8,scaleY:1.25,duration:80,yoyo:true,ease:'Quad.Out'});
    }
    if(!doJump) this._jumpReady=true;

    // Sync emoji face
    this.playerFace.setPosition(this.player.x, this.player.y-4);
    this.playerFace.setFlipX(this.player.flipX);

    // HUD update
    this._updateHUD();
  }

  // ── Draw background clouds ────────────────────────────────────
  _drawClouds(WW){
    const cloudDefs=[
      {x:180,y:60,r:28},{x:260,y:55,r:36},{x:350,y:65,r:22},
      {x:700,y:80,r:30},{x:790,y:72,r:42},{x:900,y:82,r:25},
      {x:1200,y:60,r:32},{x:1290,y:54,r:46},{x:1400,y:64,r:28},
      {x:1700,y:75,r:34},{x:1800,y:68,r:44},{x:1900,y:76,r:26},
      {x:2100,y:62,r:30},{x:2200,y:56,r:38}
    ];
    const gCloud=this.add.graphics().setScrollFactor(0.2);
    cloudDefs.forEach(c=>{
      gCloud.fillStyle(0xffffff,0.85).fillCircle(c.x,c.y,c.r);
      gCloud.fillStyle(0xffffff,0.85).fillCircle(c.x+c.r*.6,c.y+4,c.r*.75);
      gCloud.fillStyle(0xffffff,0.85).fillCircle(c.x-c.r*.5,c.y+5,c.r*.65);
    });
  }

  // ── Draw Cat Village decorations ──────────────────────────────
  _drawVillage(WW,GY){
    const g=this.add.graphics().setScrollFactor(1);

    const drawHouse=(x,w,h,wallColor,roofColor)=>{
      // Wall
      g.fillStyle(wallColor,1).fillRect(x-w/2,GY-h,w,h);
      // Roof (triangle using fillTriangle)
      g.fillStyle(roofColor,1).fillTriangle(x-w/2-6,GY-h, x,GY-h-w*.45, x+w/2+6,GY-h);
      // Door
      g.fillStyle(0x5D4037,.8).fillRoundedRect(x-8,GY-30,16,30,{tl:8,tr:8,bl:0,br:0});
      // Window
      g.fillStyle(0xB3E5FC,.9).fillRect(x-w/2+12,GY-h+14,20,20);
      g.lineStyle(2,0x5D4037,.5).strokeRect(x-w/2+12,GY-h+14,20,20);
    };

    const drawTree=(x,h,canopyR,trunkColor,leafColor)=>{
      g.fillStyle(trunkColor,1).fillRect(x-5,GY-h,10,h);
      g.fillStyle(leafColor,1).fillCircle(x,GY-h-canopyR*.4,canopyR);
      g.fillStyle(Phaser.Display.Color.ValueToColor(leafColor).darken(20).color,1).fillCircle(x-canopyR*.3,GY-h-canopyR*.2,canopyR*.7);
      g.fillStyle(Phaser.Display.Color.ValueToColor(leafColor).lighten(15).color,1).fillCircle(x+canopyR*.2,GY-h-canopyR*.5,canopyR*.6);
    };

    // Houses
    drawHouse(130, 80, 90, 0xFFCCBC, 0xE57373);
    drawHouse(330, 70, 80, 0xC8E6C9, 0x66BB6A);
    drawHouse(550, 90, 100,0xB3E5FC, 0x42A5F5);
    drawHouse(830, 75, 85, 0xFFF9C4, 0xFFD54F);
    drawHouse(1150,80, 90, 0xF8BBD9, 0xF06292);
    drawHouse(1450,85, 95, 0xD1C4E9, 0x9575CD);
    drawHouse(1750,70, 80, 0xFFCCBC, 0xFF8A65);
    drawHouse(2050,80, 90, 0xC8E6C9, 0x4CAF50);
    drawHouse(2300,75, 85, 0xB3E5FC, 0x26C6DA);

    // Trees
    drawTree(60,  80,28,0x5D4037,0x388E3C);
    drawTree(200, 70,24,0x6D4C41,0x43A047);
    drawTree(450, 85,30,0x5D4037,0x2E7D32);
    drawTree(680, 75,26,0x6D4C41,0x388E3C);
    drawTree(1000,80,28,0x5D4037,0x4CAF50);
    drawTree(1300,70,24,0x6D4C41,0x388E3C);
    drawTree(1600,85,30,0x5D4037,0x2E7D32);
    drawTree(1900,75,26,0x6D4C41,0x43A047);
    drawTree(2220,80,28,0x5D4037,0x388E3C);
  }

  // ── Draw finish flag ─────────────────────────────────────────
  _drawFlag(fx,fy){
    const g=this.add.graphics().setDepth(4);
    // Base
    g.fillStyle(0xBDBDBD,1).fillRect(fx-14,fy,28,10);
    // Pole
    g.fillStyle(0xE0E0E0,1).fillRect(fx-2,fy-130,4,130);
    // Flag cloth (animated separately)
    g.fillStyle(0xFF5252,1).fillTriangle(fx+2,fy-130, fx+44,fy-112, fx+2,fy-96);
    g.fillStyle(0xFFFFFF,1).fillRect(fx+2,fy-130,4,34);
    // "FINISH" text
    this.add.text(fx,fy-148,'FINISH',{fontSize:'13px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#FF5252',stroke:'#ffffff',strokeThickness:3}).setOrigin(0.5).setDepth(4);
    // Checkered pattern hint
    const check=this.add.graphics().setDepth(4);
    for(let r=0;r<2;r++) for(let c=0;c<3;c++){
      if((r+c)%2===0) check.fillStyle(0x000000,.3).fillRect(fx-10+c*8,fy-2+r*5,8,5);
    }
  }

  // ── Generate player texture ──────────────────────────────────
  _buildPlayerTexture(){
    const g=this.make.graphics({x:0,y:0,add:false});
    const color=this.hero.color;
    // Body circle
    g.fillStyle(color,1).fillCircle(20,20,20);
    // Shine
    g.fillStyle(0xffffff,.25).fillCircle(14,12,8);
    // Shadow
    g.fillStyle(0x000000,.15).fillEllipse(20,36,32,10);
    g.generateTexture('player_tex',40,40);
    g.destroy();
  }

  // ── Build HUD (all setScrollFactor(0)) ───────────────────────
  _buildHUD(W,H){
    const depth=20;
    // Top bar bg
    this._hudBg=this.add.graphics().setScrollFactor(0).setDepth(depth);
    this._hudBg.fillStyle(0x000000,.45).fillRoundedRect(6,6,W-12,46,10);

    // Hero emoji + name
    this._hudFace=this.add.text(20,29,this.hero.emoji,{fontSize:'22px'}).setOrigin(0,.5).setScrollFactor(0).setDepth(depth);
    this._hudName=this.add.text(50,29,this.heroId,{fontSize:'14px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#ffffff'}).setOrigin(0,.5).setScrollFactor(0).setDepth(depth);

    // Energy label
    this.add.text(130,18,'⚡ Energy',{fontSize:'10px',fontFamily:'Arial,sans-serif',color:'#cccccc'}).setScrollFactor(0).setDepth(depth);
    // Energy bar bg
    this._hudEBg=this.add.graphics().setScrollFactor(0).setDepth(depth);
    this._hudEBg.fillStyle(0x333333,1).fillRoundedRect(130,28,160,12,6);
    this._hudEBorder=this.add.graphics().setScrollFactor(0).setDepth(depth);
    this._hudEBorder.lineStyle(1,0xffffff,.35).strokeRoundedRect(130,28,160,12,6);
    // Energy fill (redrawn each frame)
    this._hudEFill=this.add.graphics().setScrollFactor(0).setDepth(depth);

    // Energy number
    this._hudENum=this.add.text(298,29,'',{fontSize:'10px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#ffffff'}).setOrigin(0,.5).setScrollFactor(0).setDepth(depth);

    // Score
    this._hudScore=this.add.text(W-16,29,'🐟 0',{fontSize:'16px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#FFE082'}).setOrigin(1,.5).setScrollFactor(0).setDepth(depth);

    // ── Level label ───────────────────────────────────────────────
    this.add.text(W/2,29,'Level 1 — Desa Kucing',{fontSize:'12px',fontFamily:'Arial,sans-serif',color:'#c9a0ff'}).setOrigin(0.5,.5).setScrollFactor(0).setDepth(depth);
  }

  _updateHUD(){
    const pct=Math.max(0,this.energy/this.maxEnergy);
    const fc=pct>.5?0x2ecc71:pct>.25?0xf39c12:0xe74c3c;
    this._hudEFill.clear().fillStyle(fc,1).fillRoundedRect(130,28,Math.round(160*pct),12,6);
    this._hudENum.setText(String(Math.ceil(this.energy)));
    this._hudScore.setText(`🐟 ${this.score}`);
  }

  // ── Mobile touch controls ────────────────────────────────────
  _buildTouchControls(W,H){
    const depth=20, btnAlpha=0.45;
    const makeBtn=(x,y,r,label,onDown,onUp)=>{
      const bg=this.add.graphics().setScrollFactor(0).setDepth(depth);
      bg.fillStyle(0xffffff,btnAlpha).fillCircle(x,y,r);
      bg.lineStyle(2,0xffffff,.6).strokeCircle(x,y,r);
      const txt=this.add.text(x,y,label,{fontSize:'20px',color:'#ffffff',fontStyle:'bold'}).setOrigin(0.5).setScrollFactor(0).setDepth(depth+1);
      const zone=this.add.zone(x,y,r*2,r*2).setScrollFactor(0).setDepth(depth+2).setInteractive({useHandCursor:true});
      zone.on('pointerdown',()=>{ bg.clear().fillStyle(0xffffff,.7).fillCircle(x,y,r); onDown(); });
      zone.on('pointerup',  ()=>{ bg.clear().fillStyle(0xffffff,btnAlpha).fillCircle(x,y,r); bg.lineStyle(2,0xffffff,.6).strokeCircle(x,y,r); onUp(); });
      zone.on('pointerout', ()=>{ bg.clear().fillStyle(0xffffff,btnAlpha).fillCircle(x,y,r); bg.lineStyle(2,0xffffff,.6).strokeCircle(x,y,r); onUp(); });
    };
    const by=H-52, br=30;
    makeBtn(52,  by,br,'◀',()=>this._touch.left=true, ()=>this._touch.left=false);
    makeBtn(120, by,br,'▶',()=>this._touch.right=true,()=>this._touch.right=false);
    makeBtn(W-60,by,br,'↑',()=>{ this._touch.jump=true; },()=>{ this._touch.jump=false; });
  }

  // ── Collect fish ─────────────────────────────────────────────
  _collectFish(player,fishBody){
    const pair=this.fishDisplays.find(f=>f.body===fishBody&&!f.collected);
    if(!pair) return;
    pair.collected=true;
    pair.emoji.setVisible(false);
    fishBody.destroy();
    this.score+=10;
    this.energy=Math.min(this.maxEnergy,this.energy+5);
    // Pop effect
    const pop=this.add.text(this.player.x,this.player.y-30,'+10',{fontSize:'18px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#FFE082',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(10);
    this.tweens.add({targets:pop,y:pop.y-40,alpha:0,duration:800,ease:'Quad.Out',onComplete:()=>pop.destroy()});
  }

  // ── Reach finish flag ────────────────────────────────────────
  _reachFlag(){
    if(this.levelDone) return;
    this.levelDone=true;
    this.player.setVelocity(0,0);
    this.player.setAcceleration(0,0);
    this._showOverlay(true);
  }

  // ── Player die ───────────────────────────────────────────────
  _die(){
    if(this.isDead) return;
    this.isDead=true;
    this.player.setVelocity(0,-300);
    this.tweens.add({targets:[this.player,this.playerFace],alpha:0,duration:800,delay:400});
    this.time.delayedCall(700,()=>this._showOverlay(false));
  }

  // ── Overlay (win / game over) ────────────────────────────────
  _showOverlay(win){
    const W=this.scale.width, H=this.scale.height, depth=30;
    const g=this.add.graphics().setScrollFactor(0).setDepth(depth);
    g.fillStyle(0x000000,.65).fillRect(0,0,W,H);

    const panW=380, panH=240, px=W/2-panW/2, py=H/2-panH/2;
    g.fillStyle(win?0x1a3a1a:0x3a0a0a,.95).fillRoundedRect(px,py,panW,panH,20);
    g.lineStyle(3,win?0x4CAF50:0xe74c3c,1).strokeRoundedRect(px,py,panW,panH,20);

    this.add.text(W/2,py+52,win?'🏆 Level Selesai!':'💀 Game Over',{fontSize:'30px',fontFamily:'Georgia,serif',fontStyle:'bold',color:win?'#FFD700':'#FF5252',stroke:'#000',strokeThickness:4}).setOrigin(0.5).setScrollFactor(0).setDepth(depth+1);
    this.add.text(W/2,py+96,`Skor: ${this.score}`,{fontSize:'22px',fontFamily:'Arial,sans-serif',color:'#FFE082'}).setOrigin(0.5).setScrollFactor(0).setDepth(depth+1);
    this.add.text(W/2,py+126,`${this.hero.emoji} ${this.heroId}  |  Ikan: ${this.fishDisplays.filter(f=>f.collected).length}/${this.fishDisplays.length}`,{fontSize:'14px',fontFamily:'Arial,sans-serif',color:'#cccccc'}).setOrigin(0.5).setScrollFactor(0).setDepth(depth+1);

    // Buttons
    const btnY=py+panH-46;
    this._overlayBtn(W/2-(win?90:45),btnY,150,40,win?'🔄 Ulang':'🔄 Coba Lagi',0x555577,0x7777aa,depth,()=>{
      this.cameras.main.fadeOut(300,0,0,0);
      this.cameras.main.once('camerafadeoutcomplete',()=>this.scene.restart());
    });
    if(win){
      this._overlayBtn(W/2+90,btnY,150,40,'🏠 Menu',0x336633,0x44aa44,depth,()=>{
        this.cameras.main.fadeOut(300,0,0,0);
        this.cameras.main.once('camerafadeoutcomplete',()=>this.scene.start('MainMenu'));
      });
    } else {
      this._overlayBtn(W/2+90,btnY,150,40,'🏠 Menu',0x663333,0xaa4444,depth,()=>{
        this.cameras.main.fadeOut(300,0,0,0);
        this.cameras.main.once('camerafadeoutcomplete',()=>this.scene.start('MainMenu'));
      });
    }
  }

  _overlayBtn(cx,cy,w,h,label,cn,ch,depth,onClick){
    const r=h/2, x=cx-w/2, y=cy-h/2;
    const g=this.add.graphics().setScrollFactor(0).setDepth(depth+1);
    g.fillStyle(cn,1).fillRoundedRect(x,y,w,h,r);
    const txt=this.add.text(cx,cy,label,{fontSize:'14px',fontFamily:'Arial,sans-serif',fontStyle:'bold',color:'#ffffff'}).setOrigin(0.5).setScrollFactor(0).setDepth(depth+2);
    const zone=this.add.zone(cx,cy,w,h).setScrollFactor(0).setDepth(depth+3).setInteractive({useHandCursor:true});
    zone.on('pointerover',()=>g.clear().fillStyle(ch,1).fillRoundedRect(x,y,w,h,r));
    zone.on('pointerout', ()=>g.clear().fillStyle(cn,1).fillRoundedRect(x,y,w,h,r));
    zone.on('pointerdown',()=>onClick());
  }
}

// ═══════════════════════════════════════════════════════════════
//  GAME CONFIG
// ═══════════════════════════════════════════════════════════════
const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  backgroundColor: '#1a0533',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  },
  scene: [MainMenuScene, HeroSelectScene, Level1Scene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
