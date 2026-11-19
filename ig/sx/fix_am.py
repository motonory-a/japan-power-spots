# 2026-11-19 本人の指摘「おみくじと無関係な写真」を受け、内容と合わない朝の豆知識の写真を差し替え
import json
from PIL import Image, ImageDraw, ImageFont
IG='/home/claude/japan-power-spots/ig/'; SRC=IG+'src/'
SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'; SANS='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'; SANSM='/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
NAVY=(24,40,84); GOLD=(190,140,60); VERM=(214,58,40); W,H=1080,1350
def F(p,s): return ImageFont.truetype(p,s,index=0)
def cover(path):
    im=Image.open(path).convert('RGB'); s=max(W/im.width,H/im.height)
    im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS); x=(im.width-W)//2; y=(im.height-H)//2
    return im.crop((x,y,x+W,y+H))
JOBS=[('11-20','fix-am20e','Why the 5-yen coin\nis the favorite offering','JAPAN TRAVEL TIP','Answer in the caption ↓',GOLD),
      ('11-22','fix-am22c','Which power spot\nin Japan suits you?','FREE · 3 STEPS','Link in bio',GOLD),
      ('11-27','fix-am27','Bought an omamori?\nDon’t open it','JAPAN TRAVEL TIP','Answer in the caption ↓',VERM)]
for date,src,head,lab,foot,lc in JOBS:
    j=json.load(open(SRC+src+'.json'))
    im=cover(SRC+src+'.jpg').convert('RGBA'); ov=Image.new('RGBA',(W,H),(0,0,0,0)); od=ImageDraw.Draw(ov)
    od.rounded_rectangle((60,60,W-60,400),radius=36,fill=(255,255,255,222))
    od.rounded_rectangle((W//2-230,H-150,W//2+230,H-70),radius=40,fill=(24,40,84,235))
    im=Image.alpha_composite(im,ov).convert('RGB'); d=ImageDraw.Draw(im)
    d.text((W//2,95),lab,font=F(SANS,30),fill=lc,anchor='mt'); y=150
    for ln in head.split('\n'):
        f=F(SERIF,66)
        while d.textlength(ln,font=f)>900: f=F(SERIF,f.size-2)
        d.text((W//2,y),ln,font=f,fill=NAVY,anchor='mt'); y+=96
    d.text((W//2,H-110),foot,font=F(SANS,34),fill=(255,255,255),anchor='mm')
    a=j['artist'].split(',')[0].strip()[:32]
    if j['license']!='CC0': d.text((W-24,H-20),f"Photo: {a} / {j['license']}",font=F(SANSM,18),fill=(255,255,255),anchor='rs',stroke_width=2,stroke_fill=(40,40,50))
    im.save(IG+f'sx/fix/am-{date}-en.jpg',quality=90); print(date,j['artist'][:30],j['license'])
