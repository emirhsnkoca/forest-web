# Forest Linktree - Smart Contract

Basit ve güçlü on-chain Linktree uygulaması. Kullanıcılar profil oluşturup, link ekleyebilir ve yönetebilir.

## 📦 Deployment Bilgileri (Testnet)

- **Package ID**: `0xd7dc024c79b49d74de64f6cec621d46488934b19f2200c857a24835878e6e5f7`
- **Module**: `forest::linktree`
- **Network**: Sui Testnet
- **Explorer**: [SuiScan](https://suiscan.xyz/testnet/object/0xd7dc024c79b49d74de64f6cec621d46488934b19f2200c857a24835878e6e5f7)

## 🏗️ Yapı

### Profile Objesi
```rust
struct Profile {
    id: UID,
    owner: address,
    display_name: String,    // "John Doe"
    bio: String,            // Kısa açıklama
    avatar_url: String,     // Avatar URL/CID
    theme: String,          // Tema rengi
    links: Table<u64, Link>, // Linkler
    next_link_id: u64,
    link_count: u64,
    created_at: u64,
}
```

### Link Objesi
```rust
struct Link {
    id: u64,
    title: String,          // "My Website"
    url: String,            // "https://..."
    position: u64,          // Sıralama
    visible: bool,          // Görünürlük
}
```

## 🎯 Fonksiyonlar

### 1. Profile İşlemleri
```move
// Yeni profil oluştur
public entry fun create_profile(
    display_name: String,
    bio: String,
    avatar_url: String,
    theme: String,
    ctx: &mut TxContext
)

// Profil güncelle
public entry fun update_profile(
    profile: &mut Profile,
    display_name: String,
    bio: String,
    avatar_url: String,
    theme: String,
    ctx: &mut TxContext
)
```

### 2. Link İşlemleri
```move
// Link ekle
public entry fun add_link(
    profile: &mut Profile,
    title: String,
    url: String,
    position: u64,
    ctx: &mut TxContext
)

// Link güncelle
public entry fun update_link(
    profile: &mut Profile,
    link_id: u64,
    title: String,
    url: String,
    position: u64,
    visible: bool,
    ctx: &mut TxContext
)

// Link sil
public entry fun delete_link(
    profile: &mut Profile,
    link_id: u64,
    ctx: &mut TxContext
)

// Link görünürlüğünü değiştir
public entry fun toggle_link_visibility(
    profile: &mut Profile,
    link_id: u64,
    visible: bool,
    ctx: &mut TxContext
)
```

### 3. Getter Fonksiyonlar
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
// Profil oluşturuldu
public struct ProfileCreated has copy, drop {
    profile_id: address,
    owner: address,
    display_name: String,
}

// Link eklendi
public struct LinkAdded has copy, drop {
    profile_id: address,
    link_id: u64,
    title: String,
    url: String,
}

// Link güncellendi
public struct LinkUpdated has copy, drop {
    profile_id: address,
    link_id: u64,
}

// Link silindi
public struct LinkDeleted has copy, drop {
    profile_id: address,
    link_id: u64,
}
```

## 🔒 Güvenlik

- ✅ **Owner Kontrolü**: Sadece profil sahibi işlem yapabilir
- ✅ **Link Limiti**: Maksimum 100 link
- ✅ **Validasyon**: Link ID kontrolü
- ✅ **On-Chain**: Tüm veriler blockchain'de

## 🚀 Kullanım

### CLI ile Profil Oluşturma
```bash
sui client call \
  --package 0xd7dc024c79b49d74de64f6cec621d46488934b19f2200c857a24835878e6e5f7 \
  --module linktree \
  --function create_profile \
  --args "John Doe" "Web3 Developer" "ipfs://..." "green" \
  --gas-budget 10000000
```

### CLI ile Link Ekleme
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

### Publish (İlk defa)
```bash
# Move.toml'da forest = "0x0" olmalı
sui client publish --gas-budget 100000000
```

### Upgrade
```bash
# Move.toml'da forest = "<PACKAGE_ID>" olmalı
sui client upgrade --upgrade-cap <UPGRADE_CAP_ID> --gas-budget 100000000
```

## 📁 Dosya Yapısı

```
smart-contracts/
├── sources/
│   └── forest.move          # Ana kontrat
├── tests/
│   └── linktree_tests.move  # Unit testler (TODO)
├── Move.toml                # Paket konfigürasyonu
├── deployment.json          # Deployment bilgileri
└── README.md                # Bu dosya
```

## 🎨 Frontend Entegrasyonu

```typescript
import { TransactionBlock } from '@mysten/sui.js/transactions';

// Profil oluştur
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

- [x] Temel profil ve link yönetimi
- [ ] Dynamic fields ile handle sistemi
- [ ] NFT ve bakiye görüntüleme
- [ ] Donation özelliği
- [ ] Analytics ve tıklama istatistikleri
- [ ] Walrus entegrasyonu
- [ ] SuiNS domain desteği

## 📄 Lisans

MIT License

## 🤝 Katkıda Bulunma

PR'lar kabul edilir! Lütfen büyük değişiklikler için önce issue açın.

---

**Built with ❤️ on Sui Blockchain**
