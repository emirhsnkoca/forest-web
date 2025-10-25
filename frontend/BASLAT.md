# 🚀 PROJEYI BAŞLATMA

## ADIM 1: Terminal Açın

Windows PowerShell veya Command Prompt'u açın.

## ADIM 2: Frontend Klasörüne Gidin

```bash
cd C:\Users\kocae\OneDrive\Desktop\forest-web\frontend
```

## ADIM 3: Dev Server'ı Başlatın

```bash
npm run dev
```

## ADIM 4: Tarayıcıda Açın

Otomatik açılmazsa: **http://localhost:5173**

---

## ⚠️ Hatalar Görüyorsanız

### 1. TypeScript Hataları
VS Code/Cursor'ı **TAMAMEN KAPATIN ve TEKRAR AÇIN**.

### 2. Port Kullanımda Hatası
```bash
netstat -ano | findstr :5173
taskkill /PID <PID_NUMARASI> /F
```

### 3. Module Bulunamadı Hatası
```bash
npm install
npm run dev
```

---

## ✅ Başarılı Çıktı

Terminal'de şunu görmelisiniz:

```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Ardından tarayıcıda **Forest Landing Page**'i görmelisiniz!

