from PIL import Image, ImageDraw, ImageFont
import json
IG='/home/claude/japan-power-spots/ig/'; SRC=IG+'src/'
SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'; SANS='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
NAVY=(24,40,84); GOLD=(190,140,60); W,H=1080,1350
def F(p,s): return ImageFont.truetype(p,s,index=0)
def cover(path):
    im=Image.open(path).convert('RGB'); s=max(W/im.width,H/im.height)
    im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS); x=(im.width-W)//2; y=(im.height-H)//2
    return im.crop((x,y,x+W,y+H))
TIPS=[
 ('11-14','cm-fri-kamakura','Shrine or temple?\nHow to tell in 3 seconds',
  "Shrine or temple? Here's the 3-second trick ⛩🛕\n\nLook for a torii gate. If there's a torii, you're at a Shinto shrine. If you see a big incense burner, a pagoda or a Buddha statue, it's a Buddhist temple — like the Great Buddha of Kamakura in this photo.\n\nMany places in Japan have both side by side, so it's worth looking twice.\n\nSave this for your trip 📌"),
 ('11-15','cm-thu-temizuya','Before you pray,\ndo you know this step?',
  "Before you pray at a shrine, stop at the water basin first 💧\n\nIt's called the temizuya. Take the ladle with your right hand and rinse your left hand, then switch and rinse your right hand. Pour a little water into your left palm to rinse your mouth, then rinse your left hand again.\n\nOne rule people often miss: never drink straight from the ladle.\n\nSave this for your trip 📌"),
 ('11-16','cm-sat-fuji5','2 bows, 2 claps…\nthen what?',
  "2 bows, 2 claps… then what? 🙏\n\nAt most shrines in Japan, the basic way to pray is:\n1. Bow deeply twice\n2. Clap twice\n3. Put your hands together and make your wish\n4. Bow once more\n\nA few shrines have their own style (Izumo Taisha, for example, uses four claps), so follow any sign you see.\n\nSave this for your trip 📌"),
 ('11-17','cm-w0-nara','Why do locals avoid\nthe middle of the path?',
  "Why do locals walk on the side of the path? 🚶\n\nAt shrines, the center of the approach path is traditionally said to be the way of the kami (the gods). Many visitors walk a little to the left or right as a sign of respect, and bow lightly when passing through the torii gate.\n\nNobody will scold you, but it's a nice way to visit like a local.\n\nSave this for your trip 📌"),
 ('11-18','cm-sat-fuji3','The souvenir that\nonly comes from temples',
  "The souvenir you can only get at shrines and temples ✍️\n\nIt's called goshuin: a hand-written ink seal that proves your visit. Bring a goshuin-cho (a small accordion-style book, often sold right there) and ask at the shrine office. It usually costs a few hundred yen.\n\nRemember: it's a record of prayer, so visit and pray first, then ask for the seal.\n\nSave this for your trip 📌"),
 ('11-19','cm-w0-arashiyama2','Got bad luck on your\nfortune slip? Do this',
  "Drew bad luck on your omikuji? Don't worry 📜\n\nOmikuji are paper fortunes sold at shrines and temples. If yours says bad luck, many people tie it to the special rack or rope at the shrine, leaving the bad luck behind.\n\nGood fortune? You can keep it in your wallet as a little reminder.\n\nSave this for your trip 📌"),
 ('11-20','cm-w0-nara2','Why the 5-yen coin\nis the favorite offering',
  "Why do so many people offer a 5-yen coin? 🪙\n\nIn Japanese, 5 yen is \"go-en\", which sounds the same as \"go-en\" meaning a fortunate connection or bond. So a 5-yen coin in the offering box is a small wish for good connections — with people, luck and the place itself.\n\nAny amount is fine, but now you know the story.\n\nSave this for your trip 📌"),
 ('11-21','cm-w0-arashiyama','When is the best time\nfor autumn leaves in Kyoto?',
  "When do Kyoto's autumn leaves peak? 🍁\n\nIn a typical year, the colors in Kyoto are at their best from late November to early December. Places like Arashiyama get very busy, so go early in the morning for quieter paths and soft light.\n\nPlanning for next year? Mark late November on your calendar.\n\nSave this for your trip 📌"),
 ('11-22','cm-wed-ginkgo','Which power spot\nin Japan suits you?',
  "Which power spot in Japan suits you? ⛩\n\nWe made a free site to find out. Pick your wish (love, money, health or work), enter your birthday and where you're staying, and you'll get shrines, temples, sacred trees, waterfalls and mountains that match you.\n\nFree. No sign-up.\n\n👉 Link in bio"),
]
TAGS="\n\n#Japan #JapanTravel #JapanTips #PowerSpot #JapaneseShrine #VisitJapan #TravelJapan"
out=[]
for date,src,head,cap in TIPS:
    im=cover(SRC+src+'.jpg').convert('RGBA'); ov=Image.new('RGBA',(W,H),(0,0,0,0)); od=ImageDraw.Draw(ov)
    top=0 if src!='cm-fri-kamakura' else 790
    od.rounded_rectangle((60,60+top,W-60,400+top),radius=36,fill=(255,255,255,222))
    od.rounded_rectangle((W//2-230,H-150,W//2+230,H-70),radius=40,fill=(24,40,84,235))
    im=Image.alpha_composite(im,ov).convert('RGB'); d=ImageDraw.Draw(im)
    d.text((W//2,95+top),'JAPAN TRAVEL TIP' if date!='11-22' else 'FREE · 3 STEPS',font=F(SANS,30),fill=GOLD,anchor='mt')
    y=150+top
    for ln in head.split('\n'):
        f=F(SERIF,66)
        while d.textlength(ln,font=f)>900: f=F(SERIF,f.size-2)
        d.text((W//2,y),ln,font=f,fill=NAVY,anchor='mt'); y+=96
    d.text((W//2,H-110),'Answer in the caption ↓' if date!='11-22' else 'Link in bio',font=F(SANS,34),fill=(255,255,255),anchor='mm')
    fn=f'{IG}sx/am-{date}-en.jpg'; im.save(fn,quality=90)
    j=json.load(open(SRC+src+'.json')); lic=j['license']; art=j.get('artist') or ''
    credit='' if lic=='CC0' else f"\n\n📷 {art} / {lic}, Wikimedia Commons"
    out.append({'date':date,'img':f'am-{date}-en.jpg','text':cap+credit+TAGS,'ai':False})
json.dump(out,open(IG+'sx/am.json','w'),ensure_ascii=False,indent=1)
print(len(out))
