# 🚀 Quick Start Guide

Forest Web3 Linktree MVP'yi çalıştırmak için bu adımları takip edin.

## Önkoşullar

1. **Node.js 18+** yüklü olmalı
2. **Sui Wallet** tarayıcı eklentisi yüklü olmalı
   - [Chrome/Brave için](https://chrome.google.com/webstore/detail/sui-wallet)
   - Wallet'ınızda biraz test SUI token olmalı (Testnet faucet'ten alabilirsiniz)

## Kurulum

### 1. Projeyi Klonlayın (veya zaten klonladıysanız atlayın)

```bash
git clone <repo-url>
cd forest-web
```

### 2. Frontend Bağımlılıklarını Yükleyin

```bash
cd frontend
npm install
```

### 3. Development Server'ı Başlatın

```bash
npm run dev
```

Bu komut development server'ı başlatacak. Terminal'de şöyle bir çıktı göreceksiniz:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Tarayıcınızda Açın

`http://localhost:5173` adresine gidin.

## İlk Kullanım

1. **Landing Page**: Ana sayfa açılacak
2. **Sign In**: Sağ üstteki "Sign In" butonuna tıklayın
3. **Connect Wallet**: Açılan popup'ta "Connect Wallet" butonuna tıklayın
4. **Sui Wallet**: Sui Wallet eklentisi açılacak, cüzdanınızı bağlayın
5. **Onboarding**: Profil oluşturma sayfası açılacak:
   - İsminizi girin
   - Bio'nuzu yazın (opsiyonel)
   - Sosyal medya linklerinizi ekleyin (opsiyonel)
   - Custom linkler ekleyin (opsiyonel)
   - "Create Profile" butonuna tıklayın
6. **Dashboard**: Link yönetim paneli açılacak
   - Yeni link ekleyebilirsiniz
   - Mevcut linkleri düzenleyebilir veya silebilirsiniz
   - Linkleri aktif/pasif yapabilirsiniz
   - Profil URL'inizi kopyalayıp paylaşabilirsiniz

## Public Profile'ınızı Görüntüleme

Dashboard'da "View Profile" butonuna tıklayın veya profil URL'inizi tarayıcıda açın:
```
http://localhost:5173/profile/<WALLET_ADDRESS>
```

## Production Build

Production için build oluşturmak için:

```bash
cd frontend
npm run build
```

Build dosyaları `frontend/dist/` klasörüne oluşturulacak.

## Sorun Giderme

### Sui Wallet Bağlanamıyor

- Sui Wallet eklentisinin yüklü ve açık olduğundan emin olun
- Wallet'ınızın **Testnet** ağında olduğundan emin olun
- Sayfayı yenileyin ve tekrar deneyin

### Port 5173 Kullanımda

Eğer 5173 portu kullanımdaysa, Vite otomatik olarak başka bir port kullanacaktır. Terminal çıktısına bakın.

### Build Hatası

```bash
# node_modules'u temizleyip yeniden yükleyin
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Yardım

Sorun yaşıyorsanız veya önerileriniz varsa issue açabilirsiniz.

## Sonraki Adımlar

- [ ] NFT showcase özelliğini implement et
- [ ] Donation button ekle
- [ ] ZK Login ekle
- [ ] Sui Name Service entegrasyonu
- [ ] Move smart contract'ları yaz
- [ ] Walrus'a deploy et

---

**İyi kodlamalar! 🌲**



