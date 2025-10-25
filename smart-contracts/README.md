# Forest Smart Contracts

Forest platformunun Sui blockchain üzerinde çalışan Move smart contract'ları.

## 🎯 Mimari Yaklaşım

**Hibrit Model:**
- **On-chain:** Minimal metadata (Profile object, ownership, settings)
- **Off-chain:** Büyük data (Walrus blob → JSON: links, bio, theme, images)
- **Avantaj:** Gas tasarrufu + sınırsız ölçeklenebilirlik

## 📦 Modüller

### 1. profile.move (Ana Modül)
**Profile Struct:**
- 11 field (id, owner, primary_name, walrus_blob_id, visible, donate_enabled, donate_address, show_nfts, show_balance, revision, created_ms)

**8 Entry Function:**
- `create_profile()` → Yeni profil oluştur
- `set_walrus_blob()` → Walrus data güncelle
- `set_primary_name()` → .sui name bağla
- `set_visible()` → Profil görünürlük
- `set_donate_settings()` → Bağış ayarları
- `set_widgets()` → NFT/Balance göster
- `destroy_profile()` → Profil sil

**4 Event:**
- ProfileCreated, ProfileUpdated, VisibilityChanged, DonateSettingsChanged

**Security:**
- Owner validation (`E_NOT_OWNER`)
- Empty blob check (`E_EMPTY_BLOB`)
- Revision tracking

### 2. donation.move
**Logic:**
- `donate_sui()` → Direkt SUI transferi (escrow yok!)
- `donate_enabled` kontrolü
- Custom `donate_address` desteği
- `DonationReceived` event

### 3. handle_registry.move (Optional)
**Handle Sistemi:** `/u/emirhasan` gibi human-readable routes
- `claim()` → Handle rezerve et
- `release()` → Handle bırak
- Dynamic Fields ile handle → profile mapping

## 🚀 Deployment Bilgileri (Testnet)

**Network:** Sui Testnet

**Package ID:** 
```
0x5bba6581ec347831df2f0fef9f45fe65386631d290dbbb35acaf16df2cc56fdd
```

**Shared Objects:**
- **Registry:** `0x1dd7bbef7284067a77e6c80095e42e37cb9a89c11c3c00d43b1ab9092b9c7de0`
- **HandleRegistry:** `0xbeef19fe0d9e9597ca8efde5712a8beb277bc973befdb744991eb71dd6076a0d`

**UpgradeCap:** `0x557aa873df720a3ccb962e78e274b47f37dd5595bbadb95013bb8a19e8e1badd`

**Explorer:** [View on Sui Explorer](https://testnet.suivision.xyz/txblock/E3KwzHHYQLviqLKcJ9uNbnmiL5CqoHSFGGrUqSASCbnM)

**Deployment Tarihi:** 2025-10-25

---

## Kurulum

```bash
# Sui CLI kurulumu (henüz yapılmadıysa)
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Contract'ları build etme
sui move build

# Contract'ları deploy etme
sui client publish --gas-budget 100000000
```

## 📂 Proje Yapısı

```
smart-contracts/
├── Move.toml                      # Package configuration
├── sources/
│   ├── profile.move               # Ana profil modülü
│   ├── donation.move              # Bağış sistemi
│   └── handle_registry.move       # Handle yönetimi (optional)
└── tests/
    ├── profile_tests.move         # Profile testleri
    └── donation_tests.move        # Donation testleri
```

## 📋 Geliştirme Durumu

**✅ Phase 1: Setup & Structure (Tamamlandı)**
- [x] Move.toml oluşturuldu
- [x] Klasör yapısı hazır
- [x] Error constants tanımlandı
- [x] Boş template dosyaları oluşturuldu

**✅ Phase 2: Profile Module (Tamamlandı)**
- [x] Profile struct (11 field)
- [x] Registry struct + init function
- [x] Entry functions (8 adet: create, set_walrus_blob, set_primary_name, set_visible, set_donate_settings, set_widgets, destroy_profile)
- [x] Events (4 adet: ProfileCreated, ProfileUpdated, VisibilityChanged, DonateSettingsChanged)
- [x] Owner validation + security checks
- [x] Public getter functions (10 adet: owner, donate_enabled, donate_address, visible, primary_name, walrus_blob_id, show_nfts, show_balance, revision, created_ms)

**✅ Phase 3: Donation Module (Tamamlandı)**
- [x] donate_sui entry function (direkt SUI transferi)
- [x] DonationReceived event struct
- [x] E_DONATE_DISABLED error handling
- [x] Custom donate_address desteği
- [x] Profile getter functions ile entegrasyon

**✅ Phase 4: Handle Registry Module (Tamamlandı)**
- [x] HandleRegistry struct (admin, handles_count) + init function
- [x] HandleValue struct (profile, owner) - dynamic field value
- [x] claim function (handle claim etme, ownership validation, counter++)
- [x] release function (handle release etme, owner kontrolü, counter--)
- [x] HandleClaimed & HandleReleased events
- [x] Public read functions (is_handle_available, get_profile_by_handle, handles_count, admin)
- [x] Error handling (E_HANDLE_EXISTS, E_HANDLE_NOT_FOUND, E_NOT_OWNER, E_EMPTY_HANDLE)

**✅ Phase 5: Testing (Tamamlandı)**
- [x] profile_tests.move (5 test: create, update, visibility, non-owner, donate_settings)
- [x] donation_tests.move (4 test: enabled, disabled, amount, custom address)

**✅ Phase 6: Deployment (Tamamlandı - Testnet)**
- [x] Sui CLI setup
- [x] Testnet'e publish edildi
- [x] deployment.json oluşturuldu
- [x] Move.toml güncellendi

## 💡 Önemli Notlar

- **Gas Efficiency:** Walrus storage sayesinde büyük datalar off-chain
- **Owned Objects:** Her Profile → kullanıcıya ait (concurrency problem yok)
- **Direct Donations:** Escrow yok, instant transfer
- **Flexible Updates:** Walrus blob sınırsız güncellenebilir



