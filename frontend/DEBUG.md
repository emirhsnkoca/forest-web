# 🔍 Beyaz Ekran Debug Adımları

## ŞİMDİ YAPIN:

### 1. Sayfayı Yenileyin
- **Ctrl + F5** (Hard refresh)
- Cache'i temizleyerek yenile

### 2. Browser Console'u Açın
- **F12** tuşuna basın
- **Console** sekmesine geçin

### 3. Ne Görüyorsunuz?

#### Senaryo A: Console'da şunları görüyorsanız
```
🚀 main.tsx yüklendi
📦 Root element: <div id="root"></div>
✅ React render edildi
```
**VE** sayfada **🌲 Forest** logosu varsa:
- ✅ **React çalışıyor!**
- Sorun tam App.tsx'teki Sui provider'larda

#### Senaryo B: Console'da HATA varsa
Hata mesajını kopyalayın ve bana gönderin.

#### Senaryo C: Console'da hiçbir şey yoksa
- Vite server çalışmıyor demektir
- Terminal'e bakın, `npm run dev` çalışıyor mu?

---

## Terminal'de Olması Gereken:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Eğer bu yoksa:
1. Dev server'ı durdurun (Ctrl+C)
2. `npm run dev` tekrar çalıştırın

---

## Test Sonuçları

### ✅ Eğer Basit Versiyon Çalışıyorsa

`frontend/src/main.tsx` dosyasındaki import'u değiştirin:

```tsx
import App from './App.tsx'; // Tam versiyon
// import App from './App.SIMPLE.tsx'; // Test versiyonu
```

Sonra hatayı arayacağız.

### ❌ Eğer Basit Versiyon de Çalışmıyorsa

Sorun daha temel. Vite config veya build sisteminde.

