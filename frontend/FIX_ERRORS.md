# 🔧 TypeScript/JSX Hatalarını Düzeltme

## Sorun
TypeScript JSX hatası veriyor: "Cannot use JSX unless the '--jsx' flag is provided"

## Çözüm: 3 Basit Adım

### 1. VS Code / Cursor'ı Tamamen Kapatın
- Sadece pencereyi değil, **uygulamayı tamamen kapatın**
- Task Manager'den Node.js process'lerini de kapatın

### 2. Yeniden Açın
- VS Code / Cursor'ı tekrar açın
- Forest-web projesini açın

### 3. TypeScript Server'ı Yenileyin
- `Ctrl + Shift + P` (Command Palette)
- **"TypeScript: Restart TS Server"** yazın ve seçin

---

## Alternatif: Terminal'den Test Et

IDE'de hata görseniz bile, terminal'den çalıştırarak test edebilirsiniz:

```bash
cd frontend
npm run dev
```

Eğer tarayıcıda sayfa görünüyorsa, **IDE hatalarını görmezden gelebilirsiniz**. Bunlar TypeScript Language Server'ın cache sorunudur ve runtime'ı etkilemez.

---

## Dev Server Çalıştırma Komutu

```bash
# Terminal açın
cd C:\Users\kocae\OneDrive\Desktop\forest-web\frontend

# Dev server'ı başlatın
npm run dev
```

Ardından: **http://localhost:5173**

---

## Hala Sorun Varsa

Computer'ınızı yeniden başlatın. Bazen VS Code / TypeScript cache'i bu şekilde temizlenir.

