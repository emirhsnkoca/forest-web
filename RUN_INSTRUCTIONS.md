# 🚨 PROJEYI ÇALIŞTIRMA TALİMATLARI

## ÖNEMLİ: Doğru Klasörden Çalıştırın!

Proje **monorepo** yapısında. Komutları **`frontend` klasöründen** çalıştırmanız gerekiyor.

## Adım Adım Kurulum

### 1. Terminal'i Kapatın (eğer çalışıyorsa)

Eğer dev server çalışıyorsa:
- Terminal'de **Ctrl+C** yapın
- Tüm Node.js process'lerini kapatın

### 2. Frontend Klasörüne Gidin

```bash
cd frontend
```

### 3. Bağımlılıkları Kontrol Edin

```bash
npm install
```

### 4. Dev Server'ı Başlatın

```bash
npm run dev
```

### 5. Tarayıcıda Açın

Şu adresi açın: **http://localhost:5173**

## ❌ YANLIŞ

```bash
# Root klasöründen çalıştırmayın!
C:\Users\kocae\OneDrive\Desktop\forest-web> npm run dev  # HATALI!
```

## ✅ DOĞRU

```bash
# Frontend klasöründen çalıştırın
C:\Users\kocae\OneDrive\Desktop\forest-web> cd frontend
C:\Users\kocae\OneDrive\Desktop\forest-web\frontend> npm run dev  # DOĞRU!
```

## Sorun Giderme

### Hata: "Cannot find package.json"

**Çözüm**: `frontend` klasörüne gidin:
```bash
cd frontend
```

### Hata: PostCSS/Tailwind hatası

Eğer hala Tailwind hatası alıyorsanız:

1. Dev server'ı durdurun (Ctrl+C)
2. Cache'i temizleyin:
```bash
npm run build -- --force
```
3. Tekrar başlatın:
```bash
npm run dev
```

### Hata: Port kullanımda

Eğer 5173 portu kullanımdaysa, Vite otomatik olarak başka bir port kullanacak. Terminal çıktısını kontrol edin.

## Proje Yapısı

```
forest-web/
├── frontend/           ← Buradan çalıştırın!
│   ├── package.json
│   ├── vite.config.ts
│   ├── postcss.config.cjs
│   ├── tailwind.config.cjs
│   └── src/
├── smart-contracts/    (Gelecek)
└── README.md
```

## İlk Kullanım

1. **Landing Page** görünecek
2. **"Sign In"** butonuna tıklayın
3. **Sui Wallet**'ınızı bağlayın (Testnet'te olduğunuzdan emin olun)
4. **Profil oluşturma** sayfasında bilgilerinizi girin
5. **Dashboard**'dan linklerinizi yönetin

## Yardım

Sorun devam ederse:
- Dev server'ı tamamen durdurun
- VS Code/Cursor'ı kapatıp açın
- Terminal'i yenileyin
- `cd frontend` yapıp `npm run dev` çalıştırın

---

**Başarılar! 🌲**



