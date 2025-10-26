# Forest Linktree - Smart Contract

Simple and powerful on-chain Linktree application. Users can create profiles, add and manage links.

## 📦 Deployment Information (Testnet)

- **Package ID**: `0xd7dc024c79b49d74de64f6cec621d46488934b19f2200c857a24835878e6e5f7`
- **Module**: `forest::linktree`
- **Network**: Sui Testnet
- **Explorer**: [SuiScan](https://suiscan.xyz/testnet/object/0xd7dc024c79b49d74de64f6cec621d46488934b19f2200c857a24835878e6e5f7)

## 🏗️ Structure

### Profile Object
```rust
struct Profile {
    id: UID,
    owner: address,
    display_name: String,    // "John Doe"
    bio: String,            // Short description
    avatar_url: String,     // Avatar URL/CID
    theme: String,          // Theme color
    links: Table<u64, Link>, // Links
    next_link_id: u64,
    link_count: u64,
    created_at: u64,
}
```

### Link Object
```rust
struct Link {
    id: u64,
    title: String,          // "My Website"
    url: String,            // "https://..."
    position: u64,          // Ordering
    visible: bool,          // Visibility
}
```

## 🎯 Functions

### 1. Profile Operations
```move
// Create new profile
public entry fun create_profile(
    display_name: String,
    bio: String,
    avatar_url: String,
    theme: String,
    ctx: &mut TxContext
)

// Update profile
public entry fun update_profile(
    profile: &mut Profile,
    display_name: String,
    bio: String,
    avatar_url: String,
    theme: String,
    ctx: &mut TxContext
)
```

### 2. Link Operations
```move
// Add link
public entry fun add_link(
    profile: &mut Profile,
    title: String,
    url: String,
    position: u64,
    ctx: &mut TxContext
)

// Update link
public entry fun update_link(
    profile: &mut Profile,
    link_id: u64,
    title: String,
    url: String,
    position: u64,
    visible: bool,
    ctx: &mut TxContext
)

// Delete link
public entry fun delete_link(
    profile: &mut Profile,
    link_id: u64,
    ctx: &mut TxContext
)

// Toggle link visibility
public entry fun toggle_link_visibility(
    profile: &mut Profile,
    link_id: u64,
    visible: bool,
    ctx: &mut TxContext
)
```

### 3. Getter Functions
```move
public fun get_owner(profile: &Profile): address
public fun get_display_name(profile: &Profile): String
public fun get_bio(profile: &Profile): String
public fun get_avatar_url(profile: &Profile): String
public fun get_theme(profile: &Profile): String
public fun get_link_count(profile: &Profile): u64
public fun get_created_at(profile: &Profile): u64
```

## 📊 Events

```move
// Profile created
public struct ProfileCreated has copy, drop {
    profile_id: address,
    owner: address,
    display_name: String,
}

// Link added
public struct LinkAdded has copy, drop {
    profile_id: address,
    link_id: u64,
    title: String,
    url: String,
}

// Link updated
public struct LinkUpdated has copy, drop {
    profile_id: address,
    link_id: u64,
}

// Link deleted
public struct LinkDeleted has copy, drop {
    profile_id: address,
    link_id: u64,
}
```

## 🔒 Security

- ✅ **Owner Control**: Only profile owner can perform operations
- ✅ **Link Limit**: Maximum 100 links
- ✅ **Validation**: Link ID validation
- ✅ **On-Chain**: All data stored on blockchain

## 🚀 Usage

### Create Profile via CLI
```bash
sui client call \
  --package 0xd7dc024c79b49d74de64f6cec621d46488934b19f2200c857a24835878e6e5f7 \
  --module linktree \
  --function create_profile \
  --args "John Doe" "Web3 Developer" "ipfs://..." "green" \
  --gas-budget 10000000
```

### Add Link via CLI
```bash
sui client call \
  --package 0xd7dc024c79b49d74de64f6cec621d46488934b19f2200c857a24835878e6e5f7 \
  --module linktree \
  --function add_link \
  --args <PROFILE_ID> "My Website" "https://example.com" 0 \
  --gas-budget 10000000
```

## 🛠️ Development

### Build
```bash
cd smart-contracts
sui move build
```

### Test
```bash
sui move test
```

### Publish (First time)
```bash
# Move.toml should have forest = "0x0"
sui client publish --gas-budget 100000000
```

### Upgrade
```bash
# Move.toml should have forest = "<PACKAGE_ID>"
sui client upgrade --upgrade-cap <UPGRADE_CAP_ID> --gas-budget 100000000
```

## 📁 File Structure

```
smart-contracts/
├── sources/
│   └── forest.move          # Main contract
├── tests/
│   └── linktree_tests.move  # Unit tests (TODO)
├── Move.toml                # Package configuration
├── deployment.json          # Deployment information
└── README.md                # This file
```

## 🎨 Frontend Integration

```typescript
import { TransactionBlock } from '@mysten/sui.js/transactions';

// Create profile
const tx = new TransactionBlock();
tx.moveCall({
  target: `${PACKAGE_ID}::linktree::create_profile`,
  arguments: [
    tx.pure('John Doe'),
    tx.pure('Web3 Developer'),
    tx.pure('ipfs://avatar'),
    tx.pure('green')
  ],
});
await signAndExecuteTransactionBlock({ transactionBlock: tx });
```

## 🗺️ Roadmap

- [x] Basic profile and link management
- [ ] Dynamic fields with handle system
- [ ] NFT and balance display
- [ ] Donation feature
- [ ] Analytics and click statistics
- [ ] Walrus integration
- [ ] SuiNS domain support

## 📄 License

MIT License

## 🤝 Contributing

PRs are welcome! Please open an issue for major changes.

---

**Built with ❤️ on Sui Blockchain**
