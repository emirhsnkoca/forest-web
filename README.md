# 🌲 Forest - Web3 Link Hub

Modern, blockchain-tabanlı bir Linktree alternatifi. Sui blockchain üzerinde çalışır ve kullanıcıların sosyal medya linklerini, NFT koleksiyonlarını ve bağış butonlarını tek bir yerde toplamasını sağlar.

## 🚀 Özellikler

### Mevcut Özellikler (MVP)
- ✅ Sui Wallet entegrasyonu
- ✅ Özelleştirilebilir profil (isim, bio, profil resmi)
- ✅ Sınırsız link ekleme
- ✅ Sosyal medya linkleri
- ✅ Public profil sayfası
- ✅ Link yönetimi (ekle, düzenle, sil, aktif/pasif)
- ✅ Responsive tasarım
- ✅ Clean, modern UI

### Gelecek Özellikler
- 🔜 ZK Login (Google ile giriş)
- 🔜 Sui Name Service entegrasyonu
- 🔜 NFT koleksiyonu gösterimi
- 🔜 Bağış butonu (SUI ile)
- 🔜 Move smart contract'lar (onchain veri)
- 🔜 Subdomain routing
- 🔜 Analytics ve insights
- 🔜 Custom tema editörü
- 🔜 Walrus storage entegrasyonu

## 🛠️ Teknoloji Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- @mysten/dapp-kit (Sui wallet integration)
- @mysten/sui (Sui blockchain SDK)

**Blockchain:**
- Sui Network (Testnet)
- Move (smart contracts - gelecekte)

**Storage:**
- LocalStorage (MVP)
- Walrus (gelecekte)

## 📁 Proje Yapısı

```
forest-web/
├── frontend/              # React frontend uygulaması
│   ├── src/
│   │   ├── components/   # React component'leri
│   │   ├── pages/        # Page component'leri
│   │   ├── hooks/        # Custom React hooks
│   │   ├── contexts/     # React contexts
│   │   ├── types/        # TypeScript type definitions
│   │   ├── constants/    # Sabitler
│   │   └── utils/        # Yardımcı fonksiyonlar
│   └── ...
├── smart-contracts/       # Move smart contracts (gelecek)
└── README.md
```

## 🚦 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Sui Wallet (Sui Wallet extension)

### Kurulum

1. Repository'yi klonlayın:
```bash
git clone <repo-url>
cd forest-web
```

2. Frontend bağımlılıklarını yükleyin:
```bash
cd frontend
npm install
```

3. Development server'ı başlatın:
```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:5173` adresine gidin

### Build

Production build oluşturmak için:
```bash
cd frontend
npm run build
```

## 📖 Kullanım

1. **Wallet Bağlama**: Landing page'de "Sign In" butonuna tıklayın ve Sui wallet'ınızı bağlayın
2. **Profil Oluşturma**: İsminizi, bio'nuzu ve linklerinizi ekleyin
3. **Link Yönetimi**: Dashboard'dan linklerinizi ekleyin, düzenleyin veya silin
4. **Profil Paylaşımı**: Profil URL'inizi kopyalayıp paylaşın

## 🎯 Geliştirme Planı

### Phase 1: MVP (✅ Tamamlandı)
- Temel frontend
- Wallet connection
- Profil oluşturma
- Link yönetimi
- LocalStorage kullanımı

### Phase 2: Web3 Features (🔄 Devam Ediyor)
- ZK Login
- Sui Name Service
- NFT showcase
- Donation button

### Phase 3: Onchain (📅 Planlandı)
- Move smart contracts
- Onchain profil yönetimi
- Walrus storage

### Phase 4: Advanced Features (📅 Planlandı)
- Analytics
- Custom themes
- Subdomain routing
- QR code generator

## 🤝 Katkıda Bulunma

Bu proje aktif geliştirme aşamasındadır. Katkılarınızı bekliyoruz!

## 📝 Lisans

MIT

## 🔗 Bağlantılar

- [Sui Documentation](https://docs.sui.io/)
- [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet)
- [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit)

---

**Not**: Bu proje MVP aşamasındadır. Bazı özellikler henüz geliştirilme aşamasındadır.



