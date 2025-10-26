# Forest Frontend

React + TypeScript + Vite based Forest frontend application.

## Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Build preview
npm run preview
```

## Important Files

- `src/App.tsx` - Main application component and routing
- `src/main.tsx` - Entry point
- `src/contexts/AuthContext.tsx` - Wallet authentication state management
- `src/hooks/useProfile.ts` - Profile data management hook
- `src/hooks/useLocalStorage.ts` - LocalStorage management

## Component Structure

### Pages
- `Landing.tsx` - Home page
- `Onboarding.tsx` - Profile creation
- `Dashboard.tsx` - Link management panel
- `Profile.tsx` - Public profile view

### Components
- `components/common/` - Common components (Button, Input, Modal, etc.)
- `components/auth/` - Authentication components

## Data Management

Currently data is stored in LocalStorage. Key: `forest_profiles`

Structure:
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

- `@mysten/dapp-kit` - Wallet connection and UI components
- `@mysten/sui` - Sui blockchain SDK
- Network: Testnet (for now)



