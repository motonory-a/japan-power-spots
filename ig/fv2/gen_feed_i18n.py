# 各言語アカウントのフィード画像を、その言語の見出しで作る（2026-11-16 本人の指摘で追加）
#   以前は tw/kr/fr/es も英語の画像（ps-日付.jpg）を共用していた → 母国語の見出しにする
#   出力：ps-日付-zh.jpg / -ko.jpg / -fr.jpg / -es.jpg
#   フォント：Noto CJK の ttc は index 0=日本語 1=韓国語 2=簡体字 3=繁体字。台湾向けは繁体字の字形にする
import gen_feed as G
from PIL import ImageFont
IDX = {'zh': 3, 'ko': 1, 'fr': 0, 'es': 0}
S = G.S
def cc(a, l): return f'Photo: {a} / {l}' if a else f'Photo: Wikimedia Commons / {l}'

DAYS = {
 '11-16': (S+'cm-mon-tofukuji.jpg', dict(fy=0.4), cc('', 'CC BY-SA 4.0'), {
   'zh': ('能量景點・京都', '東福寺', '京都首屈一指的賞楓名所'),
   'ko': ('파워스폿 · 교토', '도후쿠지  東福寺', '교토를 대표하는 단풍 명소'),
   'fr': ('LIEU SACRÉ · KYOTO', 'Tōfuku-ji  東福寺', 'Le célèbre automne de Kyoto'),
   'es': ('LUGAR SAGRADO · KIOTO', 'Tōfuku-ji  東福寺', 'El famoso otoño de Kioto')}),
 '11-17': (S+'canva-tue.jpg', dict(fy=0.4, crop=(0, 0, 1080, 1040)), None, {
   'zh': ('秋天的味道', '烤地瓜  焼き芋', '天氣一冷就想吃的日本街頭美食'),
   'ko': ('가을의 맛', '야키이모', '일본 가을의 길거리 음식'),
   'fr': ('SAVEUR D’AUTOMNE', 'Yaki-imo  焼き芋', 'La patate douce grillée de l’automne'),
   'es': ('SABOR DE OTOÑO', 'Yaki-imo  焼き芋', 'El boniato asado del otoño japonés')}),
 '11-18': (S+'canva-wed.jpg', dict(fy=0.5, crop=(0, 250, 1080, 1360)), None, {
   'zh': ('能量景點・東京', '明治神宮外苑銀杏大道', '只在這個季節的金黃色景致'),
   'ko': ('파워스폿 · 도쿄', '진구가이엔 은행나무길', '지금만 볼 수 있는 황금빛 풍경'),
   'fr': ('LIEU SACRÉ · TOKYO', 'L’allée des ginkgos', 'La saison dorée de Tokyo'),
   'es': ('LUGAR SAGRADO · TOKIO', 'La avenida de los ginkgos', 'La temporada dorada de Tokio')}),
 '11-20': (S+'cm-fri-kamakura.jpg', dict(fy=0.55), cc('Dirk Beyer', 'CC BY-SA 3.0'), {
   'zh': ('能量景點・鎌倉', '鎌倉', '從東京出發約1小時的秋日古都'),
   'ko': ('파워스폿 · 가마쿠라', '가마쿠라  鎌倉', '도쿄에서 약 1시간, 가을의 옛 도시'),
   'fr': ('LIEU SACRÉ · KAMAKURA', 'Kamakura  鎌倉', 'À 1 h de Tokyo · temples d’automne'),
   'es': ('LUGAR SAGRADO · KAMAKURA', 'Kamakura  鎌倉', 'A una hora de Tokio · templos de otoño')}),
 '11-21': (S+'cm-sat-fuji5.jpg', dict(fy=0.5), cc('lumoplank', 'CC0'), {
   'zh': ('能量景點・富士山', '富士山與紅葉', '只有11月才看得到的紅白絕景'),
   'ko': ('파워스폿 · 후지산', '후지산과 단풍', '11월에만 볼 수 있는 붉은빛과 흰빛'),
   'fr': ('LIEU SACRÉ · MONT FUJI', 'Le Fuji et les érables', '富士山 · Les couleurs de novembre'),
   'es': ('LUGAR SAGRADO · MONTE FUJI', 'El Fuji y los arces', '富士山 · Los colores de noviembre')}),
}
STEPS = {  # 11-19 参拝の作法
 'zh': ('參拜的基本禮儀', '神社的參拜方法', ['在鳥居前鞠躬一次', '在手水舍洗手、漱口', '投香油錢，搖響鈴鐺', '二拜、二拍手，許願後再一拜']),
 'ko': ('신사 참배 매너', '신사에서 참배하는 방법', ['도리이 앞에서 한 번 인사', '데미즈야에서 손과 입을 헹구기', '새전을 넣고 방울 울리기', '두 번 절, 두 번 박수, 기도, 한 번 절']),
 'fr': ('SAVOIR-VIVRE', 'Prier dans un sanctuaire', ['Saluer une fois devant le torii', 'Se purifier au temizuya', 'Offrir une pièce, sonner la cloche', '2 saluts, 2 claps, prier, 1 salut']),
 'es': ('MODALES EN EL SANTUARIO', 'Cómo rezar en un santuario', ['Reverencia ante el torii', 'Purifícate en el temizuya', 'Echa una moneda y toca la campana', '2 reverencias, 2 palmadas, reza, 1 reverencia']),
}
PROMO = {  # 11-22 サイトの紹介
 'zh': ('免費・免註冊', '找到屬於你的能量景點', '依你的心願和生日來推薦', ['戀愛', '財運', '健康', '事業'], '點個人檔案的連結'),
 'ko': ('무료 · 가입 불필요', '나에게 맞는 파워스폿은?', '소원과 생년월일로 골라 드려요', ['연애', '금전', '건강', '일'], '프로필 링크에서'),
 'fr': ('GRATUIT · SANS INSCRIPTION', 'Trouvez votre lieu sacré', 'Selon votre vœu et votre date de naissance', ['Amour', 'Argent', 'Santé', 'Travail'], 'Lien dans la bio'),
 'es': ('GRATIS · SIN REGISTRO', 'Encuentra tu lugar sagrado', 'Según tu deseo y tu fecha de nacimiento', ['Amor', 'Dinero', 'Salud', 'Trabajo'], 'Enlace en la bio'),
}

if __name__ == '__main__':
    import sys
    only = sys.argv[1:] or ['zh', 'ko', 'fr', 'es']
    for lang in only:
        G.F = (lambda i: (lambda p, s: ImageFont.truetype(p, s, index=i)))(IDX[lang])
        for date, (src, kw, cr, T) in DAYS.items():
            G.card(f'ps-{date}-{lang}.jpg', src, *T[lang], credit=cr, **kw)
        lab, t, items = STEPS[lang]
        G.steps(f'ps-11-19-{lang}.jpg', S+'canva-thu.jpg', lab, t, items, crop=(0, 0, 1080, 680))
        lab, t, sub, chips, cta = PROMO[lang]
        G.promo(f'ps-11-22-{lang}.jpg', S+'cm-sat-fuji3.jpg', lab, t, sub, chips, cta, credit=cc('Moyan Brenn', 'CC BY 2.0'), fy=0.5)
        print(lang, 'ok')
