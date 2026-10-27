# Portföy mimarisi — 10 dakikada anlayacağın rehber

## Sitede üç farklı türde dosya var

1. **`.astro` dosyaları**: Web sayfaları ve tekrar kullanılan parçalar. HTML benzeri kod yazarız; Astro bunlardan tarayıcının anlayacağı HTML üretir.
2. **`.css` dosyası**: Renk, font, boşluk, mobil uyum ve hover davranışı. `src/styles/global.css` bu işi yapar.
3. **`.md` dosyaları**: Projelerin başlıkları, açıklamaları ve vaka incelemeleri. Bunlar Python dosyası değildir; düz metindir.

## FutureMe AI sayfası nasıl ortaya çıkar?

`src/content/projects/futureme-ai.md`

→ `src/content.config.ts` bilgilerin doğru formatta olduğunu denetler.

→ `src/pages/projects/[id].astro` tek bir case study şablonunu kullanır.

→ `src/layouts/BaseLayout.astro` header, footer, meta bilgileri ekler.

→ Astro statik sayfayı oluşturur: `/projects/futureme-ai/`.

**Önemli:** Ziyaretçi Markdown veya Astro dosyalarını görmez. Tarayıcısı sadece üretilen HTML ve CSS'i indirir. Portföy için çalışan Python sunucusu gerekmiyor.

## Yeni projeyi eklemek

Yeni bir Markdown dosyası yaz: `src/content/projects/my-new-project.md`. İçinde `title`, `summary`, `category`, `order`, `featured`, `technologies` ve `scope` gibi alanları doldur. `featured: true` olursa ana sayfada proje kartı oluşur. Bütün proje sayfalarının HTML'ini tek tek yeniden yazmazsın.

## Bileşen nedir?

`Header.astro` üst menüyü, `Hero.astro` giriş ekranını, `ProjectCard.astro` her projeyi gösterir. Bir projeyi diğerinden ayıran şey HTML değil, Markdown içeriğidir.

## GitHub Pages ne yapar?

GitHub kodu tutar. GitHub Actions Astro'nun `build` komutunu çalıştırır. GitHub Pages ortaya çıkan statik HTML/CSS dosyalarını internette yayınlar. Render'daki FutureMe AI backend'i bunlardan ayrı kalır.

## Kurulum (Codex'te yapılacak)

- Node.js 24 LTS veya Astro 7 ile uyumlu Node sürümü yüklenir.
- `npm install` (bağımlılıklar ve `package-lock.json` oluşturulur).
- `npm run dev` (bilgisayarda siteyi açar).
- `npm run build` (yayınlanacak statik dosyaları üretir).
- `npm run check:source` (basit dosya/içerik denetimi).

Bu paket henüz npm kurulumu veya derleme testinden geçmedi. `preview/index.html`, ayrı üretilmiş statik görsel/HTML referansıdır; Astro build çıktısı değildir.

## Neden şimdi yayına çıkmıyoruz?

Eski GitHub Pages sitesi korunmalı, yeni içerik ve e-posta teyit edilmeli, Impressum/gizlilik yükümlülükleri çözülmeli, canlı proje linkleri kontrol edilmeli ve yeni Astro build gerçek bir makinede test edilmeli. Bunlar geçmeden yayın otomasyonu bilinçli olarak kilitlidir.
