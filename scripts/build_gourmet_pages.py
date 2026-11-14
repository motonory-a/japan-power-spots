# gourmet.html（日本語）から en/zh/ko/fr/es の gourmet.html を作る
import os, re
root = os.path.join(os.path.dirname(__file__), '..')
src = open(os.path.join(root, 'gourmet.html'), encoding='utf-8').read()
L = {
 'en': ('en', 'Local Food Guide | Dishes of all 47 prefectures in photos | Japan Power Spot Journey', 'From Hokkaido to Okinawa: local dishes, regional specialties and sweets of all 47 prefectures of Japan, with photos and a short note on each.', 'Local Food Guide', 'From Hokkaido to Okinawa, <strong id="g-total">300</strong> dishes.<br>Find the local food to try after visiting a sacred place.', '← Japan Power Spot Journey', 'All dish photos come from Wikimedia Commons. The photographer and license are shown under each photo (tap a photo to open its page).', 'Seasons and opening hours can change. Please check before you go.', 'Japan Power Spot Journey', 'en_US'),
 'zh': ('zh-Hant', '日本在地美食圖鑑｜47都道府縣的名產照片｜日本能量景點之旅', '從北海道到沖繩，用照片介紹日本47都道府縣的在地料理、名產與甜點。', '日本在地美食圖鑑', '從北海道到沖繩，共 <strong id="g-total">300</strong> 道。<br>參拜之後，來嚐嚐當地的美味吧。', '← 日本能量景點之旅', '料理照片皆來自 Wikimedia Commons，攝影者與授權標示在各照片下方。', '產季與店家營業時間可能變動，出發前請先確認。', '日本能量景點之旅', 'zh_TW'),
 'ko': ('ko', '일본 지역 음식 도감｜47개 도도부현의 명물을 사진으로｜일본 파워스폿 여행', '홋카이도부터 오키나와까지, 일본 47개 도도부현의 향토 요리와 명물, 과자를 사진과 함께 소개합니다.', '일본 지역 음식 도감', '홋카이도부터 오키나와까지 <strong id="g-total">300</strong>가지.<br>참배 후에 먹고 싶은 그 지역의 한 접시를 찾아보세요.', '← 일본 파워스폿 여행', '요리 사진은 모두 Wikimedia Commons의 것입니다. 촬영자와 라이선스는 각 사진 아래에 적었습니다.', '제철 시기나 가게 영업시간은 바뀔 수 있어요. 가기 전에 확인해 주세요.', '일본 파워스폿 여행', 'ko_KR'),
 'fr': ('fr', 'Guide de la cuisine locale | Les plats des 47 préfectures en photos', 'De Hokkaido à Okinawa : plats régionaux, spécialités et douceurs des 47 préfectures du Japon, en photos.', 'Guide de la cuisine locale', 'De Hokkaido à Okinawa, <strong id="g-total">300</strong> plats.<br>Le plat local à goûter après la visite d’un lieu sacré.', '← Japan Power Spot Journey', 'Toutes les photos viennent de Wikimedia Commons. L’auteur et la licence sont indiqués sous chaque photo.', 'Les saisons et horaires peuvent changer. Vérifiez avant de partir.', 'Japan Power Spot Journey', 'fr_FR'),
 'es': ('es', 'Guía de comida local | Los platos de las 47 prefecturas en fotos', 'De Hokkaido a Okinawa: platos regionales, especialidades y dulces de las 47 prefecturas de Japón, con fotos.', 'Guía de comida local', 'De Hokkaido a Okinawa, <strong id="g-total">300</strong> platos.<br>El plato local para probar después de visitar un lugar sagrado.', '← Japan Power Spot Journey', 'Todas las fotos son de Wikimedia Commons. El autor y la licencia aparecen bajo cada foto.', 'Las temporadas y horarios pueden cambiar. Compruébalo antes de ir.', 'Japan Power Spot Journey', 'es_ES'),
}
for code, (hl, title, desc, h1, lead, back, f1, f2, site, loc) in L.items():
    s = src
    s = s.replace('<html lang="ja" data-glang="ja" data-spots="./">', f'<html lang="{hl}" data-glang="{code}" data-spots="./">')
    s = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', s)
    s = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', s)
    s = s.replace('https://motonory-a.github.io/japan-power-spots/gourmet.html">\n<link rel="alternate" hreflang="ja"', f'https://motonory-a.github.io/japan-power-spots/{code}/gourmet.html">\n<link rel="alternate" hreflang="ja"', 1)
    s = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{h1}">', s)
    s = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{desc}">', s)
    s = s.replace('<meta property="og:url" content="https://motonory-a.github.io/japan-power-spots/gourmet.html">', f'<meta property="og:url" content="https://motonory-a.github.io/japan-power-spots/{code}/gourmet.html">')
    s = s.replace('content="開運パワースポット巡り">', f'content="{site}">').replace('ja_JP', loc)
    s = s.replace('href="assets/', 'href="../assets/').replace('src="assets/', 'src="../assets/').replace('src="data/', 'src="../data/').replace('href="apple-touch-icon.png"', 'href="../apple-touch-icon.png"')
    langs = '<a href="../gourmet.html" lang="ja">日本語</a>' + ''.join(f'<a href="../{c}/gourmet.html">{n}</a>' for c, n in [('en', 'English'), ('zh', '中文'), ('ko', '한국어'), ('fr', 'FR'), ('es', 'ES')] if c != code)
    s = re.sub(r'<span class="g-langs">.*?</span>', f'<span class="g-langs">{langs}</span>', s)
    s = s.replace('<a href="./">← 開運パワースポット巡り</a>', f'<a href="./">{back}</a>')
    s = s.replace('<h1>ご当地グルメ図鑑</h1>', f'<h1>{h1}</h1>')
    s = re.sub(r'<p class="g-lead">.*?</p>', f'<p class="g-lead">{lead}</p>', s, flags=re.S)
    s = re.sub(r'<footer class="g-foot">.*?</footer>', f'<footer class="g-foot">\n  <p>{f1}</p>\n  <p>{f2}</p>\n  <p><a href="./">{site}</a> · Akki</p>\n</footer>', s, flags=re.S)
    os.makedirs(os.path.join(root, code), exist_ok=True)
    open(os.path.join(root, code, 'gourmet.html'), 'w', encoding='utf-8').write(s)
    print(code, 'ok')
