# v2 design (2026-11-14): photo first, small white cards. Stories 11/13-11/22 for 7 accounts (1080x1920) + English morning tip cards
import re, os, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter
IG='/home/claude/japan-power-spots/ig/'; OUT=IG+'sx/'
SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
SANS='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
SANSM='/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
NAVY=(28,36,64); GOLD=(214,58,40); VERM=(214,58,40); WHITE=(255,255,255); PLUM=(36,20,52)
W,H=1080,1920
def F(p,s): return ImageFont.truetype(p,s,index=0)
def cover(path,w,h,blur=0):
    im=Image.open(path).convert('RGB'); s=max(w/im.width,h/im.height)
    im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
    x=(im.width-w)//2; y=(im.height-h)//2; im=im.crop((x,y,x+w,y+h))
    return im.filter(ImageFilter.GaussianBlur(blur)) if blur else im
EMO=re.compile('[\U0001F000-\U0001FFFF☀-➿️‍⛩]')
def clean(t): return EMO.sub('',t).strip()
def wrap(d,t,f,maxw):
    out=[]
    for para in t.split('\n'):
        sp=' ' in para; toks=para.split(' ') if sp else list(para); line=''
        for tk in toks:
            test=(line+(' ' if sp and line else '')+tk) if line else tk
            if d.textlength(test,font=f)<=maxw: line=test
            else: out.append(line); line=tk
        out.append(line)
    return out
def panel(im,box,alpha=236):
    x0,y0,x1,y1=box
    sh=Image.new('RGBA',im.size,(0,0,0,0)); ImageDraw.Draw(sh).rounded_rectangle((x0,y0+8,x1,y1+8),radius=28,fill=(0,0,0,60))
    sh=sh.filter(ImageFilter.GaussianBlur(14))
    ov=Image.new('RGBA',im.size,(0,0,0,0)); ImageDraw.Draw(ov).rounded_rectangle(box,radius=28,fill=(255,255,255,alpha))
    return Image.alpha_composite(Image.alpha_composite(im.convert('RGBA'),sh),ov).convert('RGB')
def chip(im,cx,y,text,f,fg,alpha=236,padx=34,pady=18):
    d=ImageDraw.Draw(im); w=d.textlength(text,font=f)+padx*2; h=f.size+pady*2
    im=panel(im,(int(cx-w/2),y,int(cx+w/2),y+h),alpha); d=ImageDraw.Draw(im)
    d.text((cx,y+h/2),text,font=f,fill=fg,anchor='mm'); return im,y+h
def block(d,y,t,f,fill,maxw=820,lh=1.32):
    for ln in wrap(d,t,f,maxw):
        d.text((W//2,y),ln,font=f,fill=fill,anchor='mt'); y+=int(f.size*lh)
    return y
def measure(d,t,f,maxw=820,lh=1.32): return len(wrap(d,t,f,maxw))*int(f.size*lh)
def pill(d,y,t,f,bg=GOLD,fg=WHITE):
    w=d.textlength(t,font=f)+80; d.rounded_rectangle((W/2-w/2,y,W/2+w/2,y+f.size+44),radius=(f.size+44)//2,fill=bg)
    d.text((W/2,y+(f.size+44)/2),t,font=f,fill=fg,anchor='mm'); return y+f.size+44
def handle(d,h,y=H-330): d.text((W//2,y),h,font=F(SANSM,28),fill=WHITE,anchor='mt',stroke_width=2,stroke_fill=(40,40,50))

ACC={'jp':('@japan_psj_jp','21:30'),'en':('@japan_psj','22:00'),'zh':('@japan_psj_tw','20:00'),'ko':('@japan_psj_kr','20:30'),
     'fr':('@japan_psj_fr','18:00'),'es':('@japan_psj_es','18:30'),'st':('@nigihayahi03','21:00')}
# tonight titles
def caps(path):
    s=open(path).read(); parts=re.split(r'^=== (\w+) (\w+)\n',s,flags=re.M)[1:]
    return {(parts[i],parts[i+1]):parts[i+2].strip().split('\n')[0] for i in range(0,len(parts),3)}
w0=caps(IG+'w0/posts_w0.txt'); ps=caps(IG+'w1/posts_ps.txt'); st=caps(IG+'w1/posts_st.txt'); pj=caps(IG+'w1/posts_jp.txt'); pe=caps(IG+'w1/posts_es.txt')
DAYS=[('11-13','fri',0),('11-14','sat',0),('11-15','sun',0),('11-16','mon',1),('11-17','tue',1),('11-18','wed',1),('11-19','thu',1),('11-20','fri',1),('11-21','sat',1),('11-22','sun',1)]
def tonight(lang,date):
    day,wk=[(d,w) for dt,d,w in DAYS if dt==date][0]
    if wk==0:
        key={'st':'ja'}.get(lang,lang); t=w0[(day,key)]
        img=IG+('w0/st-w0-%s.jpg'%day if lang=='st' else 'w0/ps-w0-%s.jpg'%day)
    else:
        t={'st':st,'jp':pj,'es':pe}.get(lang,ps)[(day,{'st':'ja'}.get(lang,lang))]
        img=IG+('w1/st-%s.jpg'%day if lang=='st' else ('w1/ps-sun-jp.jpg' if (lang=='jp' and day=='sun') else 'w1/ps-%s.jpg'%day))
    fv=IG+'fv2/'+('st-%s.jpg'%date if lang=='st' else ('ps-%s-jp.jpg'%date if lang=='jp' else 'ps-%s.jpg'%date))
    if os.path.exists(fv): img=fv
    return clean(t),img

T={
 'jp':dict(pre='今夜{t} 公開',preF='続きは今夜の投稿で',
   q=[('今のあなたに必要なのは？','金運','縁結び'),('行くなら、どっち？','山のパワースポット','水辺のパワースポット'),('お参りするなら？','朝の静かな時間','夕暮れどき')],
   qF='あなたに合う場所は、プロフィールのリンクの診断で',
   g=['あなたに合うパワースポット、','3ステップでわかります'],gS='無料・登録不要',gB='プロフィールのリンクから'),
 'en':dict(pre='Coming up today',preF='Watch for it in your feed',
   q=[('What do you need right now?','Money luck','Love & connections'),('Where would you go?','Mountain power spot','Waterside power spot'),('When would you visit?','Quiet early morning','At sunset')],
   qF='Find the place that matches you via the link in bio',
   g=['Find your power spot in Japan','in 3 easy steps'],gS='Free · No sign-up',gB='Link in bio'),
 'zh':dict(pre='今天的貼文預告',preF='記得來看動態',
   q=[('現在的你最需要？','財運','良緣'),('如果要去，選哪個？','山中的能量景點','水邊的能量景點'),('想在什麼時候參拜？','清晨的寧靜時光','黃昏時分')],
   qF='適合你的地方，點個人檔案連結來診斷',
   g=['適合你的能量景點','3個步驟就知道'],gS='免費・免註冊',gB='點個人檔案的連結'),
 'ko':dict(pre='오늘의 게시물 예고',preF='피드에서 확인하세요',
   q=[('지금 나에게 필요한 것은?','재물운','인연'),('간다면 어디로?','산의 파워스폿','물가의 파워스폿'),('참배한다면 언제?','고요한 이른 아침','해 질 녘')],
   qF='나와 맞는 곳은 프로필 링크에서 진단해 보세요',
   g=['나와 맞는 파워스폿,','3단계면 알 수 있어요'],gS='무료 · 가입 불필요',gB='프로필 링크에서'),
 'fr':dict(pre='Aujourd’hui sur le compte',preF='À retrouver dans le fil',
   q=[('De quoi avez-vous besoin ?','Chance financière','Belles rencontres'),('Où iriez-vous ?','Lieu sacré en montagne','Lieu sacré au bord de l’eau'),('Quand iriez-vous ?','Au calme du matin','Au coucher du soleil')],
   qF='Trouvez votre lieu grâce au lien dans la bio',
   g=['Votre lieu sacré au Japon','en 3 étapes'],gS='Gratuit · Sans inscription',gB='Lien dans la bio'),
 'es':dict(pre='Hoy en la cuenta',preF='Búscalo en el feed',
   q=[('¿Qué necesitas ahora?','Suerte con el dinero','Amor y conexiones'),('¿A dónde irías?','Lugar sagrado en la montaña','Lugar sagrado junto al agua'),('¿Cuándo irías?','En la calma de la mañana','Al atardecer')],
   qF='Descubre tu lugar con el enlace en la bio',
   g=['Tu lugar sagrado en Japón','en 3 pasos'],gS='Gratis · Sin registro',gB='Enlace en la bio'),
 'st':dict(pre='今夜{t} 公開',preF='続きは今夜の投稿で',
   g=['生年月日が知っている、','あなたの魂の秘密'],gS='魂の系統鑑定（無料）',gB='プロフィールのリンクから'),
}
SRC=IG+'src/'; STN=IG+'stones/'
QIMG=[(SRC+'cm-w0-nara2.jpg',SRC+'cm-w0-arashiyama2.jpg',None),(SRC+'cm-sat-fuji5.jpg',SRC+'cm-w0-arashiyama.jpg',None),
      (SRC+'cm-w0-nara2.jpg',SRC+'cm-sat-fuji3.jpg','photo B: Moyan Brenn / CC BY 2.0')]
PLAN=[('11-13','pre'),('11-14','q0'),('11-15','pre'),('11-16','guide'),('11-17','pre'),('11-18','q1'),('11-19','pre'),('11-20','guide'),('11-21','pre'),('11-22','q2')]

def s_pre(lang,date,force_guide=False):
    title,img=tonight(lang,date); L=T[lang]; h,t=ACC[lang]
    RAW={'11-13':'cm-w0-nara.jpg','11-14':'cm-w0-arashiyama.jpg','11-15':'cm-w0-chitose.jpg','11-16':'cm-mon-tofukuji.jpg','11-17':'canva-tue-crop.jpg',
         '11-18':'canva-wed-crop.jpg','11-19':'canva-thu-crop.jpg','11-20':'cm-fri-kamakura.jpg','11-21':'cm-sat-fuji5.jpg'}
    SRAW={'11-13':'crystal-tray.jpg','11-15':'rutile.jpg','11-19':'crystal-rosegold.jpg'}
    if lang=='st': bgp=STN+SRAW.get(date,'crystal-sky.jpg')
    else: bgp=SRC+RAW[date] if date in RAW else '/home/claude/japan-power-spots/en/img/hero-autumn-1672.jpg'
    im=cover(bgp,W,H,blur=0)
    d=ImageDraw.Draw(im); hf=F(SANS,32); tf=F(SERIF,50 if lang in('jp','st','zh','ko') else 46); ff=F(SANSM,30)
    hdr=L['pre'].format(t=t)
    ph=44+hf.size+36+30+measure(d,title,tf,800)+24+ff.size*1.4+40
    y0=int(H-300-ph); im=panel(im,(110,y0,W-110,y0+ph)); d=ImageDraw.Draw(im)
    y=pill(d,y0+44,hdr,hf,bg=VERM)+30
    y=block(d,y,title,tf,NAVY,800)+20
    d.text((W//2,y),L['preF']+' ↓' if lang in('jp','st') else L['preF'],font=ff,fill=GOLD,anchor='mt')
    handle(d,h,90); return im
def s_q(lang,i):
    L=T[lang]; h,_=ACC[lang]; q,a,b=L['q'][i]; ia,ib,cr=QIMG[i]
    im=Image.new('RGB',(W,H),(255,255,255)); im.paste(cover(ia,W,H//2-4),(0,0)); im.paste(cover(ib,W,H//2-4),(0,H//2+4))
    qf=F(SERIF,46); of=F(SANS,40); ff=F(SANSM,28)
    # small option chips at the bottom-left of each photo
    for txt,yb,tag in [(a,H//2-150,'A'),(b,H-330,'B')]:
        d=ImageDraw.Draw(im); t2=tag+'  '+txt; w=d.textlength(t2,font=of)+72
        im=panel(im,(60,yb,60+int(w),yb+of.size+40)); d=ImageDraw.Draw(im)
        d.text((96,yb+(of.size+40)/2),tag,font=of,fill=VERM,anchor='lm')
        d.text((96+d.textlength(tag+'  ',font=of),yb+(of.size+40)/2),txt,font=of,fill=NAVY,anchor='lm')
    # question chip on the seam
    im,_=chip(im,W//2,H//2-48,q,qf,NAVY)
    d=ImageDraw.Draw(im)
    im,_=chip(im,W//2,H-200,L['qF'],ff,NAVY,alpha=220,padx=28,pady=14)
    d=ImageDraw.Draw(im)
    if cr: d.text((W-30,H-30),cr,font=F(SANSM,20),fill=WHITE,anchor='rb',stroke_width=2,stroke_fill=(40,40,50))
    handle(d,h,90); return im
def s_guide(lang):
    L=T[lang]; h,_=ACC[lang]
    bgp=STN+'crystal-sea.jpg' if lang=='st' else '/home/claude/japan-power-spots/en/img/hero-autumn-1672.jpg'
    im=cover(bgp,W,H); d=ImageDraw.Draw(im)
    gf=F(SERIF,50 if lang in('jp','st','zh','ko') else 46)
    lines=[]; [lines.extend(wrap(d,g,gf,860)) for g in L['g']]
    ph=44+len(lines)*68+16+40+30+80+40
    y0=H-300-ph
    im=panel(im,(110,y0,W-110,y0+ph)); d=ImageDraw.Draw(im); y=y0+44
    for ln in lines: d.text((W//2,y),ln,font=gf,fill=NAVY,anchor='mt'); y+=68
    y+=16; d.text((W//2,y),L['gS'],font=F(SANS,32),fill=VERM,anchor='mt'); y+=62
    pill(d,y,L['gB'],F(SANS,32),bg=VERM)
    handle(d,h,90); return im
def s_stone_q(kind,date):
    h,t=ACC['st']
    if kind=='quiz':
        photo,q={'11-17':('amethyst.jpg','この紫の石、\n名前わかりますか？'),'11-21':('onyx-gold.jpg','この黒い石、\n名前わかりますか？')}[date]
        foot='答えは今夜21:00の投稿で ↓'
    else:
        photo,q,foot={'11-14':('crystal-sky.jpg','今日つけるなら、\n透明な石？金色の石？','あなたに合う石は「魂の系統鑑定」で'),
                      '11-18':('lapis.jpg','青い石が気になる日って、\nありませんか？','今夜は青い石のお話です ↓'),
                      '11-22':('crystal-wrist.jpg','ブレスレット、\nあなたは左手派？右手派？','答えは今夜21:00の投稿で ↓')}[date]
    im=cover(STN+photo,W,H); d=ImageDraw.Draw(im); qf=F(SERIF,50); ff=F(SANS,30)
    qh=measure(d,q,qf,800); im=panel(im,(110,200,W-110,200+qh+70)); d=ImageDraw.Draw(im); block(d,235,q,qf,NAVY,800)
    fl=wrap(d,foot,ff,800); fh=len(fl)*44+40; yb=H-200
    im=panel(im,(130,yb-fh,W-130,yb)); d=ImageDraw.Draw(im); yy=yb-fh+20
    for ln in fl: d.text((W//2,yy),ln,font=ff,fill=VERM,anchor='mt'); yy+=44
    handle(d,h,90); return im

made=[]
for date,kind in PLAN:
    for lang in ['jp','en','zh','ko','fr','es','st']:
        k=kind
        if date=='11-13' and lang in('fr','es'): k='guide'   # their feed is out before the 19:00 test story
        if lang=='st':
            if date in('11-17','11-21'): im=s_stone_q('quiz',date)
            elif k.startswith('q'): im=s_stone_q('pick',date)
            elif k=='pre': im=s_pre('st',date)
            else: im=s_guide('st')
        elif k=='pre': im=s_pre(lang,date)
        elif k.startswith('q'): im=s_q(lang,int(k[1]))
        else: im=s_guide(lang)
        fn=f'{OUT}v2/story-{date}-{lang}.jpg'; im.save(fn,quality=90); made.append(fn)
print(len(made))
