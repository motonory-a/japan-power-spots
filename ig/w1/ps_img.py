import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps
W,H=1080,1440
SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-SemiBold.ttc'
SANS='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def make(src,out,title,sub,fx=0.5,fy=0.5,lines=None,credit=None):
    im=ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    s=max(W/im.width,H/im.height); im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
    x=int((im.width-W)*fx); y=int((im.height-H)*fy); im=im.crop((x,y,x+W,y+H))
    g=Image.new('L',(1,H))
    for i in range(H):
        top=1.0 if i<H*0.17 else max(0,(H*0.34-i)/(H*0.17)); bot=max(0,(i-H*0.62)/(H*0.38))
        g.putpixel((0,i),int(238*max(top,bot**1.1)))
    g=g.resize((W,H)); plum=Image.new('RGB',(W,H),(36,20,52)); im=Image.composite(plum,im,g)
    d=ImageDraw.Draw(im); gold=(222,190,130); white=(255,250,244)
    ft=ImageFont.truetype(SERIF,92,index=0); fs=ImageFont.truetype(SANS,36,index=0); ff=ImageFont.truetype(SANS,24,index=0); fl=ImageFont.truetype(SANS,40,index=0)
    d.text((W//2,110),title,font=ft,fill=white,anchor='mt')
    d.text((W//2,236),sub,font=fs,fill=gold,anchor='mt')
    if lines:
        y=H-120-len(lines)*70
        for t in lines:
            d.text((W//2,y),t,font=fl,fill=white,anchor='mt'); y+=70
    d.line((W//2-160,H-62,W//2+160,H-62),fill=gold,width=1)
    d.text((W//2,H-50),'JAPAN POWER SPOT JOURNEY',font=ff,fill=gold,anchor='mt')
    if credit:
        fc=ImageFont.truetype(SANS,18,index=0); d.text((W-20,H-14),credit,font=fc,fill=(200,190,200),anchor='rs')
    im.save(out,quality=90)
