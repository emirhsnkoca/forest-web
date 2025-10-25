# Forest Web - Blockchain Linktree Application

A decentralized Linktree-like application built with Sui blockchain and React.

## Project Structure

```
forest-web/
├── backend/                 # Smart contracts (Move)
│   ├── sources/
│   │   └── linktree.move   # Main smart contract
│   ├── tests/              # Move tests
│   ├── build/              # Compiled contracts
│   ├── Move.toml           # Move package configuration
│   └── deployment.json     # Deployment configuration
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── forest.ts       # Blockchain integration layer
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript types
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md
```

## Features

- **Decentralized Profiles**: Create and manage profiles on Sui blockchain
- **Link Management**: Add, edit, and organize links
- **Real-time Events**: Listen to blockchain events for live updates
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- Sui CLI (installed)
- Move CLI (via Sui)

## Installation

### Backend (Smart Contracts)

```bash
cd backend
sui move build
sui move test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Smart Contract Functions

- `create_profile`: Create a new user profile
- `add_link`: Add a link to a profile
- `get_owner`: Get profile owner
- `get_display_name`: Get profile display name
- `get_bio`: Get profile bio
- `get_image_url`: Get profile image URL

## Frontend Integration

The `forest.ts` file provides a clean interface to interact with the smart contract:

```typescript
import { Forest } from './forest';

const forest = new Forest();

// Create a profile
await forest.createProfile(displayName, bio, imageUrl, signer);

// Add a link
await forest.addLink(profileId, title, url, isActive, signer);

// Listen for events
await forest.listenForProfileCreated((event) => {
  console.log('Profile created:', event);
});
```

## Development

1. Deploy the smart contract to Sui testnet
2. Update the `PACKAGE_ID` in `forest.ts`
3. Start the frontend development server
4. Connect your Sui wallet and start using the app

## License

MIT