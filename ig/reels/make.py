# 15-second slideshow reels (1080x1920) from photos, text baked in. Usage: python3 make.py
import os, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont
IG='/home/claude/japan-power-spots/ig/'; OUT=IG+'reels/'
SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'; SANS='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
W,H=1080,1920; PLUM=(36,20,52); GOLD=(226,192,132)
def F(p,s): return ImageFont.truetype(p,s,index=0)
def cover(path,w,h):
    im=Image.open(path).convert('RGB'); s=max(w/im.width,h/im.height)
    im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS); x=(im.width-w)//2; y=(im.height-h)//2
    return im.crop((x,y,x+w,y+h))
def wrapfit(d,line,font,maxw):
    f=font
    while d.textlength(line,font=f)>maxw and f.size>30: f=ImageFont.truetype(f.path,f.size-2,index=0)
    return f
def slide(photo,text,handle,y=None,small=False):
    # photo bigger than frame so ffmpeg can zoom in slowly
    im=cover(photo,int(W*1.12),int(H*1.12)).resize((int(W*1.12),int(H*1.12)))
    can=Image.new('RGB',im.size); can.paste(im)
    d=ImageDraw.Draw(can); lines=text.split('\n')
    cx=can.width//2; yy=y if y is not None else int(can.height*0.30)
    for i,ln in enumerate(lines):
        base=F(SERIF if i==0 else SANS, (92 if not small else 80) if i==0 else 50)
        f=wrapfit(d,ln,base,W-120)
        d.text((cx,yy),ln,font=f,fill=(255,255,255) if i==0 else GOLD,anchor='mt',stroke_width=6 if i==0 else 4,stroke_fill=PLUM)
        yy+=int(f.size*1.35)
    d.text((cx,int(can.height*0.84)),handle,font=F(SANS,34),fill=(255,255,255),anchor='mt',stroke_width=3,stroke_fill=PLUM)
    return can
def reel(name,slides,secs=3.2):
    tmp=OUT+'tmp_'+name+'/'; os.makedirs(tmp,exist_ok=True)
    parts=[]
    for i,im in enumerate(slides):
        p=tmp+f's{i}.jpg'; im.save(p,quality=92)
        v=tmp+f's{i}.mp4'; n=int(secs*30)
        z="min(zoom+0.0009,1.12)" if i%2==0 else "if(eq(on,0),1.12,max(zoom-0.0009,1.0))"
        subprocess.run(['ffmpeg','-y','-loglevel','error','-loop','1','-i',p,'-vf',
          f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps=30,format=yuv420p",
          '-t',str(secs),'-c:v','libx264','-preset','veryfast','-crf','22',v],check=True)
        parts.append(v)
    lst=tmp+'list.txt'; open(lst,'w').write(''.join(f"file '{p}'\n" for p in parts))
    out=OUT+name+'.mp4'
    # silent AAC track: some players reject video-only files
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',lst,'-f','lavfi','-i','anullsrc=r=44100:cl=stereo',
                    '-shortest','-c:v','copy','-c:a','aac','-b:a','64k','-movflags','+faststart',out],check=True)
    shutil.rmtree(tmp); return out

SRC=IG+'src/'; STN=IG+'stones/'
PH=[SRC+'cm-w0-nara.jpg',SRC+'cm-w0-arashiyama.jpg',SRC+'cm-sat-fuji5.jpg']
HOOK=SRC+'cm-mon-tofukuji.jpg'
T={
 'jp':('@japan_psj_jp',['秋に行きたい\n日本のパワースポット3選','① 奈良\n神の使いの鹿が暮らす町','② 京都・嵐山\n紅葉と古い社寺','③ 富士山\n古くから祈られてきた霊山','あなたに合う聖地は？\nプロフィールのリンクで無料診断']),
 'en':('@japan_psj',['3 sacred places\nto see in Japan this autumn','1. Nara\nWhere deer are messengers of the gods','2. Arashiyama, Kyoto\nAutumn leaves and old temples','3. Mt. Fuji\nA holy mountain for centuries','Which one suits you?\nFree finder · link in bio']),
 'zh':('@japan_psj_tw',['秋天必訪\n日本能量景點3選','① 奈良\n鹿是神明使者的城市','② 京都・嵐山\n紅葉與古老寺社','③ 富士山\n自古受人參拜的靈山','哪裡最適合你？\n個人檔案連結免費診斷']),
 'ko':('@japan_psj_kr',['가을에 가고 싶은\n일본 파워스폿 3곳','① 나라\n사슴이 신의 사자인 곳','② 교토 아라시야마\n단풍과 오래된 사찰','③ 후지산\n오래전부터 기도해 온 영산','나에게 맞는 곳은?\n프로필 링크에서 무료 진단']),
 'fr':('@japan_psj_fr',['3 lieux sacrés\nà voir au Japon cet automne','1. Nara\nles cerfs, messagers des dieux','2. Arashiyama, Kyoto\nérables rouges et vieux temples','3. Mont Fuji\nune montagne sacrée depuis des siècles','Lequel est fait pour vous ?\nLien dans la bio']),
 'es':('@japan_psj_es',['3 lugares sagrados\nde Japón este otoño','1. Nara\nlos ciervos, mensajeros de los dioses','2. Arashiyama, Kioto\narces rojos y templos antiguos','3. Monte Fuji\nuna montaña sagrada desde hace siglos','¿Cuál es para ti?\nEnlace en la bio']),
}
if __name__=='__main__':
    for k,(h,tx) in T.items():
        sl=[slide(HOOK,tx[0],h)]+[slide(PH[i],tx[i+1],h) for i in range(3)]+[slide(SRC+'cm-fri-kamakura.jpg',tx[4],h,small=True)]
        print(reel(f'r1-{k}',sl))
    st=['あなたの魂は\nどの石を選ぶ？','透明な水晶\nまっさらな気持ちに','深い青のラピスラズリ\n自分を信じたい日に','金の針のルチル\n前に進みたいときに','魂に合う石は\n魂の系統鑑定（無料）で']
    ph=[STN+'crystal-sea.jpg',STN+'crystal-sky.jpg',STN+'lapis.jpg',STN+'rutile.jpg',STN+'incarose-iris.jpg']
    print(reel('r1-st',[slide(ph[i],st[i],'@nigihayahi03',small=i==4) for i in range(5)]))
