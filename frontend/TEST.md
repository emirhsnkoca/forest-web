# Test Adımları

## 1. Dev Server'ı Durdurun
Terminal'de **Ctrl+C** yapın

## 2. Dev Server'ı Tekrar Başlatın
```bash
npm run dev
```

## 3. Tarayıcıyı Yenileyin
- `http://localhost:5173` sayfasını **hard refresh** yapın (Ctrl+F5)
- Veya tarayıcının cache'ini temizleyin

## 4. Eğer Hala Sorun Varsa

### Console'u Kontrol Edin
Tarayıcıda F12 basın ve Console sekmesinde hata var mı kontrol edin.

### Build'i Test Edin
```bash
npm run build
npm run preview
```

## Değişiklikler
- `autoConnect` prop'u kaldırıldı (sorun çıkarıyordu)
- Network config sadeleştirildi
- Mainnet çıkarıldı, sadece testnet bırakıldı



