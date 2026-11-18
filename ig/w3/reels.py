# w3 リール（水曜12/2＝鬼怒川で過ごす1日、土曜12/5＝12月に行きたい3か所、全7アカウント）
# 鬼怒川のリールは、アッキーさん撮影の写真と、橋からの動画（kinugawa-bridge-pan.mp4）を縦に切り出した部分で作る。
# 言語ごとに写真の順番・組み合わせ・動画の区間を変えて、同じ動画にならないようにする。
import sys, os, json, subprocess, shutil
sys.path.insert(0, '/home/claude/japan-power-spots/ig/reels'); sys.path.insert(0, '/home/claude/japan-power-spots/ig/w3')
from PIL import Image, ImageDraw, ImageFont
import make as M
import content as C
from build import credit_cap, HANDLE, REEL_T, BRAND
OUT = '/home/claude/japan-power-spots/ig/w3/out/'; M.OUT = OUT
VID = '/home/claude/japan-power-spots/ig/own/kinugawa-bridge-pan.mp4'
IDX = {'zh': 3, 'ko': 1}
P = C.PHOTO; O = C.O; OW = C.OW; STN = '/home/claude/japan-power-spots/ig/stones/'
W, H, SECS = 1080, 1920, 3.2
# 動画の区間（開始秒, 縦に切り出す左端x）
V = {0: (0.0, 850), 6: (6.0, 760), 12: (12.6, 900), 22: (22.0, 820)}
M1, M2, ST_, YU, MS = OW + 'momiji1c.jpg', OW + 'momiji2c.jpg', O + 'kinugawa-sakuranamiki-stone.jpg', O + 'kinugawa-yuba-soba.jpg', O + 'kinugawa-momiji-street.jpg'
KSEQ = {  # hook, ①紅葉の通り, ②渓谷（動画）, ③湯波そば, 案内
 'en': [M1, MS, ('v', 0), YU, OW + 'vid-16.jpg'],
 'zh': [('v', 22), M2, ('v', 6), YU, MS],
 'ko': [MS, M1, ('v', 22), YU, ('v', 12)],
 'fr': [OW + 'vid-2.jpg', M2, ('v', 22), YU, ('v', 12)],
 'es': [('v', 6), MS, ('v', 22), YU, M1],
 'jp': [M2, MS, ('v', 6), YU, M1],
}
KT = {
 'jp': ['鬼怒川で過ごす\n晩秋の1日', '① 温泉街の\n紅葉の通りを歩く', '② 橋の上から\n鬼怒川の渓谷を眺める', '③ お昼は\n日光名物の湯波そば', '次のお休みの行き先は\nプロフィールのリンクから'],
 'en': ['One day in\nKinugawa Onsen', '1. Walk under red maples\nin the hot spring town', '2. Look down at the gorge\nfrom the bridge', '3. Lunch: yuba soba,\na Nikko specialty', 'Plan your trip\nLink in bio'],
 'zh': ['在鬼怒川\n度過晚秋的一天', '① 漫步溫泉街的\n紅葉小路', '② 站在橋上\n俯瞰鬼怒川溪谷', '③ 午餐來一碗\n日光名產湯波蕎麥麵', '規劃你的旅程\n個人檔案連結'],
 'ko': ['기누가와에서 보내는\n늦가을 하루', '① 온천 마을의\n단풍길 걷기', '② 다리 위에서\n계곡 내려다보기', '③ 점심은\n닛코 명물 유바 소바', '여행 계획은\n프로필 링크에서'],
 'fr': ['Une journée\nà Kinugawa Onsen', '1. Flâner sous les érables\nde la ville thermale', '2. Admirer les gorges\ndepuis le pont', '3. Déjeuner : soba au yuba,\nspécialité de Nikkō', 'Préparez votre voyage\nLien dans la bio'],
 'es': ['Un día en\nKinugawa Onsen', '1. Pasear bajo los arces\ndel pueblo termal', '2. Mirar el desfiladero\ndesde el puente', '3. Soba con yuba,\nespecialidad de Nikko', 'Planea tu viaje\nEnlace en la bio'],
}
KCAP = {
 'en': "One day in Kinugawa Onsen 🍁 Red maples in the hot spring town, the gorge from the bridge, and yuba soba for lunch. Photos and video taken this autumn by our guide " + C.AKKI + ".\n\nKinugawa Onsen is about 2 hours from Asakusa by Tobu limited express.\n\nPlan your trip 👉 link in bio\n\n#Kinugawa #Nikko #japantravel",
 'zh': "在鬼怒川度過晚秋的一天🍁 溫泉街的紅葉、從橋上看到的溪谷，午餐是湯波蕎麥麵。照片和影片都是我們的嚮導 " + C.AKKI + " 今年秋天拍的。\n\n從淺草搭東武特急約2小時就能到鬼怒川溫泉。\n\n規劃你的旅程 👉 個人檔案連結\n\n#鬼怒川溫泉 #日光 #日本旅遊",
 'ko': "기누가와에서 보내는 늦가을 하루🍁 온천 마을의 단풍, 다리 위에서 본 계곡, 점심은 유바 소바. 사진과 영상은 저희 가이드 " + C.AKKI + "가 올가을에 찍었어요.\n\n기누가와 온천은 아사쿠사에서 도부 특급으로 약 2시간.\n\n여행 계획하기 👉 프로필 링크\n\n#기누가와온천 #닛코 #일본여행",
 'fr': "Une journée à Kinugawa Onsen 🍁 Les érables de la ville thermale, les gorges vues du pont et un bol de soba au yuba. Photos et vidéo prises cet automne par notre guide " + C.AKKI + ".\n\nKinugawa Onsen est à environ 2 heures d'Asakusa en express Tobu.\n\nPréparez votre voyage 👉 lien dans la bio\n\n#Kinugawa #Nikko #voyagejapon",
 'es': "Un día en Kinugawa Onsen 🍁 Los arces del pueblo termal, el desfiladero desde el puente y soba con yuba para comer. Fotos y vídeo de este otoño de nuestro guía " + C.AKKI + ".\n\nKinugawa Onsen está a unas 2 horas de Asakusa en el expreso de Tobu.\n\nPlanea tu viaje 👉 enlace en la bio\n\n#Kinugawa #Nikko #viajarajapon",
 'jp': "鬼怒川で過ごす、晩秋の1日🍁 温泉街の紅葉、橋の上から見た渓谷、お昼は日光名物の湯波そば。写真と動画は、今年の秋にアッキーが撮ったものです。\n\n鬼怒川温泉へは、浅草から東武特急で約2時間。\n\n次のお休みの行き先は、プロフィールのリンクから探せます⛩\n" + C.JP_GUIDE + "\n\n#鬼怒川温泉 #日光 #パワースポット",
}
R2 = {
 'jp': ['12月に行きたい\nパワースポット3選', '① 埼玉・秩父神社\n毎年12月2・3日は秩父夜祭', '② 山梨・新倉富士浅間神社\n冬は富士山が見える日が多い', '③ 埼玉・川越氷川神社\n池袋から約30分の小江戸', 'あなたに合う聖地は？\nプロフィールのリンクで無料診断'],
 'en': ['3 sacred places\nfor December in Japan', '1. Chichibu, Saitama\nNight festival every Dec 2–3', '2. Arakurayama, Mt. Fuji\nWinter: the best Fuji views', '3. Kawagoe, Saitama\n“Little Edo”, 30 min from Ikebukuro', 'Which one suits you?\nFree finder · link in bio'],
 'zh': ['12月想去的\n日本能量景點3選', '① 埼玉・秩父\n每年12月2・3日秩父夜祭', '② 富士山・新倉山\n冬天最常看見富士山', '③ 埼玉・川越\n從池袋約30分鐘的小江戶', '哪裡最適合你？\n個人檔案連結免費診斷'],
 'ko': ['12월에 가고 싶은\n일본 파워스폿 3곳', '① 사이타마 지치부\n매년 12월 2~3일 요마쓰리', '② 후지산 아라쿠라야마\n겨울에 잘 보이는 후지산', '③ 사이타마 가와고에\n이케부쿠로에서 30분, 작은 에도', '나에게 맞는 곳은?\n프로필 링크에서 무료 진단'],
 'fr': ['3 lieux sacrés\npour décembre au Japon', '1. Chichibu, Saitama\nfête de nuit les 2 et 3 déc.', '2. Arakurayama, mont Fuji\nen hiver, le Fuji se voit mieux', '3. Kawagoe, Saitama\nla « petite Edo » près de Tokyo', 'Lequel est fait pour vous ?\nLien dans la bio'],
 'es': ['3 lugares sagrados\npara diciembre en Japón', '1. Chichibu, Saitama\nfiesta nocturna el 2 y 3 de dic.', '2. Arakurayama, monte Fuji\nen invierno el Fuji se ve mejor', '3. Kawagoe, Saitama\nel «pequeño Edo» cerca de Tokio', '¿Cuál es para ti?\nEnlace en la bio'],
}
CAP2 = {
 'en': '3 sacred places for December in Japan ⛩ Chichibu, Arakurayama by Mt. Fuji, and Kawagoe. Which one would you visit first?\n\nFind your power spot 👉 link in bio\n\n#japantravel #winterinjapan #powerspot',
 'zh': '12月想去的日本能量景點3選⛩ 秩父、富士山的新倉山、川越，你最想先去哪裡？\n\n找到適合你的能量景點 👉 個人檔案連結\n\n#日本旅遊 #日本冬天 #能量景點',
 'ko': '12월에 가고 싶은 일본 파워스폿 3곳⛩ 지치부, 후지산 아라쿠라야마, 가와고에. 어디부터 가고 싶나요?\n\n나에게 맞는 파워스폿 👉 프로필 링크\n\n#일본여행 #일본겨울 #파워스폿',
 'fr': '3 lieux sacrés pour décembre au Japon ⛩ Chichibu, Arakurayama face au Fuji et Kawagoe. Lequel visiteriez-vous en premier ?\n\nTrouvez votre lieu sacré 👉 lien dans la bio\n\n#voyagejapon #hiveraujapon #japon',
 'es': '3 lugares sagrados para diciembre en Japón ⛩ Chichibu, Arakurayama frente al Fuji y Kawagoe. ¿Cuál visitarías primero?\n\nEncuentra tu lugar sagrado 👉 enlace en la bio\n\n#viajarajapon #inviernoenjapon #japon',
 'jp': '12月に行きたいパワースポット3選⛩ 秩父神社、新倉富士浅間神社、川越氷川神社。あなたはどこから行きますか？\n\nあなたに合う聖地は、プロフィールのリンクから無料で診断できます⛩\n' + C.JP_GUIDE + '\n\n#パワースポット #冬の旅 #開運',
}
ST1 = ['長い時間が\nつくった石たち', '① アンバー（琥珀）\n木の樹脂が化石になった石', '② ガーデンクォーツ\n水晶の中の小さな庭', '③ 隕石\n宇宙で生まれた模様', 'あなたに合う石は\n魂の系統鑑定（無料）で']
ST2 = ['天然石、\nこんなときどうする？', '① 割れた・欠けたら\nまず「ありがとう」', '② お風呂のときは\nはずしたほうが長持ち', '③ 運動のときも\nはずしておくと安心', '魂の系統鑑定（無料）は\nプロフィールのリンクから']
STC1 = '長い時間がつくった石たち。\n木の樹脂が化石になったアンバー、水晶の中に小さな庭が広がるガーデンクォーツ、そして宇宙で生まれた模様をもつ隕石。あなたは、どの石に惹かれますか？\n\nあなたに合う石は、魂の系統鑑定（無料）で。プロフィールのリンクからどうぞ。\n\n#天然石 #パワーストーン #魂の系統鑑定'
STC2 = '天然石、こんなときどうする？\n割れたり欠けたりしたら、まずは「ありがとう」。お風呂や運動のときは、はずしておくと長持ちします。\n\n魂の系統鑑定（無料）はプロフィールのリンクから。\n\n#天然石 #天然石のお手入れ #魂の系統鑑定'

def font_for(lang):
    i = IDX.get(lang, 0); M.F = lambda p, s: ImageFont.truetype(p, s, index=i)
    def wf(d, line, font, maxw):
        f = font
        while d.textlength(line, font=f) > maxw and f.size > 30: f = ImageFont.truetype(f.path, f.size - 2, index=i)
        return f
    M.wrapfit = wf

def overlay(text, handle, small=False):
    """make.slide と同じ文字の見た目を、透明な1080x1920に描く（動画の上に重ねる）"""
    can = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(can)
    yy = int(H * 0.30)
    for i, ln in enumerate(text.split('\n')):
        base = M.F(M.SERIF if i == 0 else M.SANS, (92 if not small else 80) if i == 0 else 50)
        f = M.wrapfit(d, ln, base, W - 120)
        d.text((W // 2, yy), ln, font=f, fill=(255, 255, 255) if i == 0 else M.GOLD, anchor='mt', stroke_width=6 if i == 0 else 4, stroke_fill=M.PLUM)
        yy += int(f.size * 1.35)
    d.text((W // 2, int(H * 0.84)), handle, font=M.F(M.SANS, 34), fill=(255, 255, 255), anchor='mt', stroke_width=3, stroke_fill=M.PLUM)
    return can

def build_reel(name, items):
    """items: [('img', PIL画像) | ('vid', 区間キー, overlay画像)]"""
    tmp = OUT + 'tmp_' + name + '/'; os.makedirs(tmp, exist_ok=True); parts = []
    for i, it in enumerate(items):
        v = tmp + f's{i}.mp4'; n = int(SECS * 30)
        if it[0] == 'img':
            p = tmp + f's{i}.jpg'; it[1].save(p, quality=92)
            z = "min(zoom+0.0009,1.12)" if i % 2 == 0 else "if(eq(on,0),1.12,max(zoom-0.0009,1.0))"
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-i', p, '-vf',
                            f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps=30,format=yuv420p",
                            '-t', str(SECS), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', v], check=True)
        else:
            st, x = V[it[1]]; ov = tmp + f'o{i}.png'; it[2].save(ov)
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(st), '-t', str(SECS), '-i', VID, '-i', ov, '-filter_complex',
                            f"[0:v]crop=608:1080:{x}:0,scale={W}:{H},fps=30,setsar=1[b];[b][1:v]overlay=0:0,format=yuv420p",
                            '-an', '-frames:v', str(n), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', v], check=True)
        parts.append(v)
    lst = tmp + 'list.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    out = OUT + name + '.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
                    '-shortest', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', out], check=True)
    shutil.rmtree(tmp); return out

def credits(paths):
    seen = []
    for p in paths:
        c = credit_cap(p).strip()
        if c and c not in seen: seen.append(c)
    return ('\n\n' + '\n'.join(seen)) if seen else ''

out = []
if __name__ == '__main__':
    for lang in C.LANGS:
        font_for(lang); h = HANDLE[lang]; items = []
        for k, (a, t) in enumerate(zip(KSEQ[lang], KT[lang])):
            if isinstance(a, tuple): items.append(('vid', a[1], overlay(t, h, small=(k == 4))))
            else: items.append(('img', M.slide(a, t, h, small=(k == 4))))
        build_reel(f'r3a-{lang}', items)
        out.append({'lang': lang, 'brand': BRAND[lang], 'date': '12-02', 'time': REEL_T[lang], 'type': 'REEL', 'file': f'r3a-{lang}.mp4', 'text': KCAP[lang]})
        s2 = [P['thu'][lang], P['mon'][lang], P['wed'][lang], P['fri'][lang], P['sun'][lang]]
        build_reel(f'r3b-{lang}', [('img', M.slide(p, t, h, small=(k == 4))) for k, (p, t) in enumerate(zip(s2, R2[lang]))])
        cap = CAP2[lang]; cr = credits(s2)
        out.append({'lang': lang, 'brand': BRAND[lang], 'date': '12-05', 'time': REEL_T[lang], 'type': 'REEL', 'file': f'r3b-{lang}.mp4', 'text': cap + cr})
        print(lang, 'ok', flush=True)
    font_for('jp')
    a = [STN + 'lib/' + f for f in ['IMG_9819.jpg', 'IMG_9863.jpg', 'IMG_9888.jpg', 'IMG_9834.jpg', 'IMG_9826.jpg']]
    build_reel('r3a-st', [('img', M.slide(p, t, HANDLE['st'], small=(k == 4))) for k, (p, t) in enumerate(zip(a, ST1))])
    b = [STN + 'lib/' + f for f in ['IMG_9846.jpg', 'IMG_9831.jpg', 'IMG_9905.jpg', 'IMG_9841.jpg', 'IMG_9883.jpg']]
    build_reel('r3b-st', [('img', M.slide(p, t, HANDLE['st'], small=(k == 4))) for k, (p, t) in enumerate(zip(b, ST2))])
    out += [{'lang': 'st', 'brand': BRAND['st'], 'date': '12-02', 'time': REEL_T['st'], 'type': 'REEL', 'file': 'r3a-st.mp4', 'text': STC1},
            {'lang': 'st', 'brand': BRAND['st'], 'date': '12-05', 'time': REEL_T['st'], 'type': 'REEL', 'file': 'r3b-st.mp4', 'text': STC2}]
    json.dump(out, open('/home/claude/japan-power-spots/ig/w3/reels.json', 'w'), ensure_ascii=False, indent=1)
    print(len(out))
