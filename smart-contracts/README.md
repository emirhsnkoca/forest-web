# Forest Smart Contracts

Bu klasör, Forest platformunun Sui blockchain üzerinde çalışacak Move smart contract'larını içerecektir.

## Planlanan Contract'lar

### 1. Profile Contract (profile.move)
- Kullanıcı profil bilgilerini onchain olarak saklar
- Profil oluşturma, güncelleme ve silme fonksiyonları
- Sui Name Service entegrasyonu

### 2. Link Contract (link.move)
- Kullanıcıların linklerini onchain olarak yönetir
- Link ekleme, düzenleme, silme ve sıralama
- Link aktif/pasif durumu yönetimi

### 3. Donation Contract (donation.move)
- Kullanıcılara SUI token bağışı gönderme
- Bağış geçmişi ve istatistikler
- Event emission

## Kurulum

```bash
# Sui CLI kurulumu (henüz yapılmadıysa)
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Contract'ları build etme
sui move build

# Contract'ları deploy etme
sui client publish --gas-budget 100000000
```

## Geliştirme Planı

1. **Phase 1 (MVP)**: Offchain veri (LocalStorage)
2. **Phase 2**: Profile contract - Temel profil yönetimi
3. **Phase 3**: Link contract - Link yönetimi
4. **Phase 4**: Donation contract - Bağış sistemi
5. **Phase 5**: NFT showcase - NFT koleksiyon gösterimi
6. **Phase 6**: Analytics - Onchain analytics ve istatistikler

## Notlar

- Şu an MVP aşamasında olduğumuz için contract'lar henüz implement edilmedi
- Veriler şimdilik LocalStorage'da saklanıyor
- İleride tüm veriler onchain olacak



