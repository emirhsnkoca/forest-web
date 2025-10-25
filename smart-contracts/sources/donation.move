module forest::donation {
    use sui::coin::{Self as coin, Coin};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::{Self as tx_context, TxContext};
    use sui::event;
    use sui::object;
    use std::option;
    use std::vector;
    use forest::profile::Profile;

    // ==================== Error Constants ====================
    
    /// Profilde bağış özelliği devre dışı
    const E_DONATE_DISABLED: u64 = 3;

    // ==================== Events ====================
    
    /// Bir bağış alındığında emit edilir
    public struct DonationReceived has copy, drop {
        /// Bağış yapılan profil adresi
        profile: address,
        /// Bağışı alan kişinin adresi (donate_address veya owner)
        to: address,
        /// Bağışı yapan kişinin adresi
        from: address,
        /// Bağış miktarı (SUI, MIST cinsinden)
        amount: u64,
        /// Transaction digest (opsiyonel, off-chain takip için)
        digest: vector<u8>,
    }

    // ==================== Entry Functions ====================
    
    /// SUI bağışı yapar
    /// Profile'ın donate_enabled özelliği aktif olmalı
    /// Bağış donate_address varsa oraya, yoksa owner'a gider
    public entry fun donate_sui(
        profile: &Profile,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        use forest::profile;
        
        // Bağış özelliği aktif mi kontrol et
        assert!(profile::donate_enabled(profile), E_DONATE_DISABLED);
        
        let sender = tx_context::sender(ctx);
        let amount = coin::value(&payment);
        
        // Recipient'i belirle: donate_address varsa onu kullan, yoksa owner
        let donate_addr = profile::donate_address(profile);
        let recipient = if (option::is_some(&donate_addr)) {
            *option::borrow(&donate_addr)
        } else {
            profile::owner(profile)
        };
        
        // Coin'i recipient'e transfer et (direkt transfer, escrow yok!)
        transfer::public_transfer(payment, recipient);
        
        // Event emit et
        event::emit(DonationReceived {
            profile: object::id_address(profile),
            to: recipient,
            from: sender,
            amount,
            digest: vector::empty(), // Frontend tarafından doldurulabilir
        });
    }
}

