# 🔧 Sorun Giderme - Beyaz Sayfa Sorunu

## Adım 1: Terminal'i Kontrol Edin

Terminal'de dev server çalışıyor mu? Şöyle bir çıktı olmalı:

```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Eğer bu çıktı yoksa:**
1. Terminal'i kapatın
2. Yeni terminal açın  
3. `cd frontend` yapın
4. `npm run dev` çalıştırın

## Adım 2: Tarayıcıyı Hard Refresh Yapın

- **Windows/Linux**: `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

## Adım 3: Developer Console'u Kontrol Edin

Tarayıcıda `F12` basın ve **Console** sekmesine bakın:

### Olası Hatalar ve Çözümleri:

#### Hata: "Failed to fetch dynamically imported module"
**Çözüm:**
```bash
# Terminal'de (frontend klasöründe)
rm -rf node_modules/.vite
npm run dev
```

#### Hata: "Cannot find module" veya Import hatası
**Çözüm:**
```bash
npm install
npm run dev
```

#### Hata: PostCSS/Tailwind hatası
**Çözüm:** Zaten düzeltildi, sayfayı yenileyin.

## Adım 4: Basit Test Sayfası

Eğer hala sorun varsa, test sayfasını deneyin:

`frontend/src/App.tsx` dosyasını geçici olarak şu şekilde değiştirin:

```tsx
import { TestPage } from './pages/TestPage';

function App() {
  return <TestPage />;
}

export default App;
```

Kaydedin ve tarayıcıda mor "✅ React Çalışıyor!" yazısını görmelisiniz.

## Adım 5: Cache Temizleme

Tarayıcı cache'i sorun çıkarıyor olabilir:

1. `F12` açın
2. **Application** veya **Storage** sekmesine gidin
3. **Clear site data** tıklayın
4. Sayfayı yenileyin

## Adım 6: Port Değiştirme

Belki port 5173 başka bir program tarafından kullanılıyordur:

`frontend/vite.config.ts` dosyasında:
```ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Port değiştir
    host: true,
  },
});
```

Sonra `http://localhost:3000` adresini deneyin.

## Adım 7: Yeni Terminal

Bazen terminal durumu bozulabilir:

1. Tüm terminal pencerelerini kapatın
2. VS Code/Cursor'ı kapatın
3. Yeniden açın
4. Yeni terminal açın
5. `cd frontend && npm run dev`

## Acil Durum: Tamamen Yeniden Başlat

```bash
# frontend klasöründe
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

## Hala Çalışmıyorsa

Bana şunları gönderin:
1. Terminal çıktısının screenshot'ı
2. Tarayıcı Console'unun screenshot'ı (F12 > Console)
3. Network sekmesindeki isteklerin screenshot'ı (F12 > Network)



