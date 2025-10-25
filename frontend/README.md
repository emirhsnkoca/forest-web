# Forest Frontend

React + TypeScript + Vite tabanlı Forest frontend uygulaması.

## Komutlar

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build

# Build preview
npm run preview
```

## Önemli Dosyalar

- `src/App.tsx` - Ana uygulama component'i ve routing
- `src/main.tsx` - Entry point
- `src/contexts/AuthContext.tsx` - Wallet authentication state yönetimi
- `src/hooks/useProfile.ts` - Profil veri yönetimi hook'u
- `src/hooks/useLocalStorage.ts` - LocalStorage yönetimi

## Component Yapısı

### Pages
- `Landing.tsx` - Ana sayfa
- `Onboarding.tsx` - Profil oluşturma
- `Dashboard.tsx` - Link yönetim paneli
- `Profile.tsx` - Public profil görünümü

### Components
- `components/common/` - Ortak component'ler (Button, Input, Modal, vb.)
- `components/auth/` - Authentication component'leri

## Veri Yönetimi

Şu an veriler LocalStorage'da saklanıyor. Key: `forest_profiles`

Yapı:
```typescript
{
  [walletAddress]: {
    walletAddress: string,
    displayName: string,
    bio: string,
    profileImage: string,
    links: Link[],
    createdAt: number
  }
}
```

## Sui Integration

- `@mysten/dapp-kit` - Wallet bağlantısı ve UI component'leri
- `@mysten/sui` - Sui blockchain SDK
- Network: Testnet (şimdilik)



