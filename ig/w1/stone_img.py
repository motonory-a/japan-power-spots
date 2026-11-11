import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
W,H=1080,1350
SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
SANS='/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
def make(src,out,label,title,sub,fx=0.5,fy=0.5):
    im=ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    s=max(W/im.width,H/im.height); im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
    x=int((im.width-W)*fx); y=int((im.height-H)*fy); im=im.crop((x,y,x+W,y+H))
    # bottom gradient
    g=Image.new('L',(1,H))
    for i in range(H):
        t=(i-H*0.58)/(H*0.42); g.putpixel((0,i),int(235*max(0,min(1,t))**1.3))
    g=g.resize((W,H)); plum=Image.new('RGB',(W,H),(46,24,44)); im=Image.composite(plum,im,g)
    d=ImageDraw.Draw(im)
    gold=(226,190,150); white=(255,250,246)
    f1=ImageFont.truetype(SANS,34,index=0); f2=ImageFont.truetype(SERIF,82,index=0); f3=ImageFont.truetype(SANS,36,index=0); f4=ImageFont.truetype(SANS,26,index=0)
    y0=H-330
    d.text((70,y0),label,font=f1,fill=gold)
    d.line((70,y0+52,170,y0+52),fill=gold,width=3)
    d.text((70,y0+72),title,font=f2,fill=white)
    d.text((70,y0+182),sub,font=f3,fill=(240,228,236))
    d.text((W-70,H-46),'高次元ネゴシエイター アッキー',font=f4,fill=gold,anchor='rs')
    im.save(out,quality=90)
if __name__=='__main__':
    a=sys.argv; make(a[1],a[2],a[3],a[4],a[5],float(a[6]),float(a[7]))
