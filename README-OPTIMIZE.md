This repository contains an asset pipeline used to produce hashed and minified CSS/JS files consumed by Jekyll.

Quick notes:

- Locally build assets:

```bash
# install node if needed, then
npm install
npm run build
```

- The build will produce `dist/css/*.css` and `dist/js/*.js` files and generate `_data/asset_map.yml` mapping original names to hashed paths. If `_data/asset_map.yml` is missing, templates fall back to un-hashed files.

- CI (`.github/workflows/build-assets.yml`) runs `npm install`, `npm run build` and uploads the `dist` folder and `_data/asset_map.yml` as artifacts. To deploy hashed assets automatically, add a CI step to commit `_data/asset_map.yml` back to the repository (careful with Action permissions) or copy generated files into your Pages publish workflow.
Bu repo için performans optimizasyon rehberi

Hızlı başlatma adımları:

1) Görselleri optimize et (lokalde):

```bash
# Gereksinimler (macOS):
brew install imagemagick webp libvips
# ardından
./scripts/optimize-images.sh
```

Çıktılar `images/optimized`, `images/webp`, `images/avif` klasörlerinde olacaktır.

2) CI ile otomatikleştirme önerisi:
- GitHub Actions ile `scripts/optimize-images.sh` çalıştırıp üretilen artefaktları `images/generated` altına koyabilirsiniz.

3) Önemli değişiklikler:
- `_includes/head.html`: CSS preload + noscript yedeği, FontAwesome için preconnect ve defer kullanıldı.
- `_includes/footer.html`: scriptlere `defer` eklendi.
- `_includes/responsive-image.html`: WebP/AVIF fallbacks ile responsive include eklendi.
- `index.html` ve `_includes/header.html`: doğrudan img kullanımı yeni include ile değiştirildi.

4) Sonraki öneriler:
6) Cache ve Compression Rehberi:
 - Tarayıcı önbellekleme ve gzip/brotli sıkıştırma kullanarak performansı artırabilirsiniz.
 - Sunucu yapılandırmalarında uygun cache-control başlıkları ayarlayın.
 - Sıkıştırma için gzip veya brotli kullanarak dosya boyutlarını azaltın.
 - CDN kullanarak içerik dağıtımını hızlandırın.

5) Lokal asset build

```bash
# Node.js (tercihen 18 veya 20) kuruluysa:
npm install
npm run build

Not: Eğer projenizde `package-lock.json` yoksa `npm ci` hata verir; bu durumda `npm install` kullanın.

# Bu komut `dist/` altında minified css ve js üretecek ve `dist/asset-map.json` oluşturacaktır.
```

