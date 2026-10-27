# Tarayıcı ve kalite kontrol raporu — 27 Ekim 2026

## Sonuçlar
- `npm run check:source`: 21 kritik kaynak yolu ve 4 proje girdisi denetlendi; 0 hata.
- `npm run build`: başarılı; ana sayfa, dört vaka sayfası, 404, robots.txt ve sitemap.xml üretildi.
- `npm run check:preview`: 6 statik sayfa; 0 hata.
- `npm run check:dist`: 6 üretilmiş HTML sayfası; 0 bağlantı/anchor hatası.
- `npm run check:release`: yasal yayın kapısı bloklandı; `src/pages/impressum.astro` ve `src/pages/privacy.astro` eksik.

## İçerik ve etkileşim kontrolleri
- About/Background alanında tek Education öğesi altında `MSc Data Analytics — BSBI Berlin` ve `BSc Genetics & Bioengineering — Istanbul Bilgi University` bulunuyor.
- Proje koleksiyonu, ana sayfa kartları, detay sayfaları ve önceki/sonraki gezinme dört projeyi aynı sırada kullanıyor. Walmart dosyası, kartı ve rotası yok.
- Proje başlıkları gerçek vaka rotalarına giden klavye ile erişilebilir bağlantılardır. `:focus-within` kart CTA metnini gösterir; mobil CSS aynı ipucunu hover olmadan açık tutar.
- FutureMe canlı demo bağlantısının yanında üç kurgusal örnek sınırı gösteriliyor. Akış; örnek seçme, varsayıma dayalı aralığı görme ve küçük deney önerisini değerlendirme adımlarını açıklar.
- TFT için depo analiz betiğinin adımlarını açıp inceleten akış eklendi. Depoda doğrulanmış gerçek tahmin grafiği/çıktısı bulunmadığından sahte grafik üretilmedi.
- SQL & AI görseli tezdeki araştırma akışını anlatır; çalışan bir öneri sistemi veya performans sonucu izlenimi vermez.
- `prefers-reduced-motion` için geçişler ve hover hareketleri kaldırılır. Bu noktalar kaynak/CSS/üretilmiş HTML üzerinden statik olarak kontrol edildi.

## Tarayıcı QA sınırı
Hedef repo klonunda Astro sunucusu `0.0.0.0:4323` üzerinde başlatıldı. Chrome eklentisi `localhost:4323` ve sunucunun ilan ettiği yerel ağ adresine bağlanırken zaman aşımına uğradı. Workspace'de Playwright/Puppeteer bağımlılığı bulunmuyor; yeni test bağımlılığı eklenmedi. Eski canlı site ve FutureMe dış bağlantısı tarayıcıda açıldı, fakat yeni yerel Astro sayfasında gerçek klavye veya viewport simülasyonu tamamlanamadı. 360, 390, 768, 1024 ve 1440 px görsel tarayıcı testleri geçti iddiası yok. Kaynak düzeyindeki mobil breakpoint ve odak/reduced-motion kuralları denetlendi; `docs/BROWSER_QA.json` bu ayrımı kaydeder.

## Kaynak verisiyle ilgili açık noktalar
- TFT deposunda sonuç görselleştirmesi yok; mevcut değerlendirme kurulumunun, test kümesi üretiminin ve R² hesabının yeniden üretilebilir doğrulaması tamamlanmadı. Bu nedenle metrik yayımlanmıyor.
- Antidepresan raporu AutoDock Vina skorları içeriyor, ancak yöntem/sınıflandırma tutarsızlıkları nedeniyle sayısal sıralama sunulmuyor. Biyolojik/klinik etki ölçülmüş değil.
- SQL & AI deposunda yüksek lisans tezi ve araştırma açıklaması var; dağıtılmış bir motor veya ölçülmüş performans kanıtı yok.
- FutureMe halka açık demo üç kurgusal örnekle sınırlı; kullanıcı sayısı ve gerçek sonuç metriği doğrulanmadı.

## Tekrar çalıştırma
1. Astro 7'nin desteklediği Node sürümüyle `npm ci`.
2. `npm run check:source`
3. `npm run build`
4. `npm run check:preview`
5. `npm run check:dist`
6. `npm run check:release` — Impressum ve privacy sayfaları gerçek ve onaylı bilgilerle tamamlandıktan sonra.
