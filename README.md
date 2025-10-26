# 🌲 Forest Web - Decentralized Linktree Platform

A modern, decentralized Linktree alternative built on Sui blockchain. Forest Web allows users to create beautiful profile pages with customizable links, NFT galleries, and Web3 integrations - all while maintaining full ownership of their data on the blockchain.

![Forest Web Banner](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop)

 Features

Core Features
- Decentralized Profiles**: Create and manage profiles directly on Sui blockchain
- Smart Link Management**: Add, edit, delete, and reorder links with drag & drop
- NFT Gallery Integration**: Showcase your NFT collection with dedicated gallery pages
- Responsive Design**: Beautiful, mobile-first design that works on all devices
- Customizable Themes**: Multiple theme options with nature-inspired designs
- Real time Updates**: Live blockchain event listening for instant UI updates

Advanced Features
- Wallet Integration**: Connect with Sui-compatible wallets (Sui Wallet, Phantom, etc.)
- Analytics Dashboard**: Track profile views and link clicks
- Profile Search**: Discover other users' profiles
- Export/Import**: Backup and restore your profile data
- Platform Integration**: Pre-built templates for 12+ social platforms
- Drag & Drop**: Intuitive link reordering with smooth animations

### 🛠️ Developer Features
- Mock Data Mode**: Development mode with localStorage for testing
- Debug Panel**: Built-in debugging tools for developers
- TypeScript**: Full type safety throughout the application
- Tailwind CSS**: Utility-first styling with custom components
- React 18**: Modern React with hooks and concurrent features

## 🏗️ Architecture

### Backend (Smart Contracts)
```
backend/
├── sources/
│   └── linktree.move          # Main smart contract
├── tests/                     # Move unit tests
├── build/                     # Compiled contracts
├── Move.toml                  # Package configuration
└── deployment.json            # Deployment settings
```

### Frontend (React Application)
```
frontend/
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   ├── common/           # Common UI elements
│   │   └── layout/           # Layout components
│   ├── pages/                # Page components
│   │   ├── Landing.tsx       # Homepage
│   │   ├── Onboarding.tsx   # Profile creation
│   │   ├── Admin.tsx         # Link management
│   │   ├── Profile.tsx       # Public profile view
│   │   ├── Dashboard.tsx     # Analytics dashboard
│   │   └── NFTs.tsx          # NFT gallery
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript definitions
│   └── forest.ts             # Blockchain integration layer
├── public/
│   └── logos/                # Brand assets
└── package.json              # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Sui CLI** (latest version)
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/forest-web.git
   cd forest-web
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   sui move build
   sui move test
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Creating Your First Profile

1. **Connect Wallet**: Click "Connect Wallet" and select your Sui wallet
2. **Complete Onboarding**: Fill in your display name, bio, and profile image
3. **Select Platforms**: Choose up to 5 social platforms you want to showcase
4. **Add Links**: Enter your social media handles and website URLs
5. **Customize**: Choose your theme and customize your profile appearance

### Managing Links

1. **Access Admin Panel**: Navigate to `/admin` after connecting your wallet
2. **Add New Links**: Use the "Add" button or "My NFTs" quick-add feature
3. **Edit Links**: Click the three-dots menu on any link to edit or delete
4. **Reorder Links**: Drag and drop links to rearrange them
5. **Preview Changes**: Use the mobile preview to see how your profile looks

### NFT Gallery

1. **Add NFT Link**: Click "My NFTs" in the admin panel
2. **Automatic Setup**: The system creates a `/nfts` link automatically
3. **View Gallery**: Visitors can click the NFT link to see your collection
4. **Customize Display**: NFT cards show metadata, attributes, and rarity

## 🔧 Smart Contract API

### Core Functions

```move
// Profile Management
public entry fun create_profile(
    display_name: String,
    bio: String,
    avatar_url: String,
    theme: String,
    ctx: &mut TxContext
)

public entry fun update_profile(
    profile: &mut Profile,
    display_name: String,
    bio: String,
    avatar_url: String,
    theme: String,
    ctx: &mut TxContext
)

// Link Management
public entry fun add_link(
    profile: &mut Profile,
    title: String,
    url: String,
    position: u64,
    ctx: &mut TxContext
)

public entry fun update_link(
    profile: &mut Profile,
    link_id: u64,
    title: String,
    url: String,
    position: u64,
    visible: bool,
    ctx: &mut TxContext
)

public entry fun delete_link(
    profile: &mut Profile,
    link_id: u64,
    ctx: &mut TxContext
)
```

### Events

```move
public struct ProfileCreated has copy, drop {
    profile_id: address,
    owner: address,
    display_name: String,
}

public struct LinkAdded has copy, drop {
    profile_id: address,
    link_id: u64,
    title: String,
    url: String,
}
```

## 🎨 Frontend Integration

### Basic Usage

```typescript
import { forest } from './forest';

// Create a profile
const result = await forest.createProfileWithDappKit(
  'John Doe',
  'Web3 Developer',
  'https://example.com/avatar.jpg',
  'green',
  signAndExecuteTransaction
);

// Add a link
await forest.addLinkWithDappKit(
  profileId,
  'My Website',
  'https://example.com',
  '🌐',
  '',
  signAndExecuteTransaction
);

// Listen for events
await forest.listenForProfileCreated((event) => {
  console.log('Profile created:', event);
});
```

### Mock Data Mode

For development and testing, Forest Web includes a mock data mode:

```typescript
// Enable mock mode (automatically enabled in development)
const mockData = forest.getMockData();
console.log('Current profiles:', mockData.profiles);

// Clear all mock data
forest.clearMockData();

// Import mock data
forest.importMockData({
  profiles: { /* profile data */ },
  links: { /* link data */ },
  nextId: 1
});
```

## 🎯 Supported Platforms

Forest Web includes pre-built templates for:

- **X (Twitter)** - Social media platform
- **Telegram** - Messaging app
- **YouTube** - Video platform
- **Instagram** - Photo sharing
- **Personal Website** - Custom websites
- **Spotify** - Music streaming
- **WhatsApp** - Messaging
- **Facebook** - Social network
- **TikTok** - Short videos
- **Pinterest** - Visual discovery
- **Threads** - Meta's social platform
- **Snapchat** - Multimedia messaging

## 🔒 Security Features

- **Owner Control**: Only profile owners can modify their profiles
- **Link Validation**: URL validation and sanitization
- **Rate Limiting**: Protection against spam and abuse
- **Wallet Verification**: Cryptographic signature verification
- **Data Integrity**: All data stored immutably on blockchain

## 🚀 Deployment

### Smart Contract Deployment

```bash
# Deploy to Sui testnet
cd backend
sui client publish --gas-budget 100000000

# Update package ID in frontend
# Edit frontend/src/forest.ts with new PACKAGE_ID
```

### Frontend Deployment

```bash
# Build for production
cd frontend
npm run build

# Deploy to your preferred hosting service
# (Vercel, Netlify, GitHub Pages, etc.)
```

## 🧪 Testing

### Smart Contract Tests

```bash
cd backend
sui move test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing

1. **Mock Data Mode**: Test all features without blockchain interaction
2. **Wallet Integration**: Test with real Sui wallets
3. **Cross-browser**: Verify compatibility across browsers
4. **Mobile Testing**: Test responsive design on mobile devices

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📊 Roadmap

### Phase 1 (Current)
- [x] Basic profile creation and management
- [x] Link management with drag & drop
- [x] NFT gallery integration
- [x] Responsive design
- [x] Mock data mode for development

### Phase 2 (Planned)
- [ ] Dynamic fields with handle system
- [ ] Advanced analytics and insights
- [ ] Custom domain support
- [ ] Multi-language support
- [ ] Advanced theming options

### Phase 3 (Future)
- [ ] DeFi portfolio integration
- [ ] Social features (follow, like, share)
- [ ] Mobile app development
- [ ] API for third-party integrations
- [ ] Enterprise features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sui Foundation** for the amazing blockchain platform
- **React Team** for the excellent frontend framework
- **Tailwind CSS** for the utility-first CSS framework
- **React Icons** for the comprehensive icon library
- **Vite** for the fast build tool

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/emirhsnkoca/forest-web)


---

**Built with ❤️ on Sui Blockchain**

*Forest Web - Where your digital identity grows naturally* 🌲