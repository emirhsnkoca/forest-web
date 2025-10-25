module forest::handle_registry {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::dynamic_field;
    use std::string::String;
    use sui::event;
    use forest::profile::Profile;

    // ==================== Error Constants ====================
    
    /// Handle zaten kullanımda
    const E_HANDLE_EXISTS: u64 = 5;
    
    /// Handle bulunamadı
    const E_HANDLE_NOT_FOUND: u64 = 6;
    
    /// Sadece profil sahibi bu işlemi yapabilir
    const E_NOT_OWNER: u64 = 1;
    
    /// Handle boş olamaz
    const E_EMPTY_HANDLE: u64 = 7;

    // ==================== Structs ====================
    
    /// Global handle registry - shared object
    /// Handle'ları profillere map eder: /u/emirhasan -> Profile address
    public struct HandleRegistry has key {
        id: UID,
        /// Registry admin'i
        admin: address,
        /// Toplam handle sayısı
        handles_count: u64,
    }

    /// Handle'ın tuttuğu değer (dynamic field value)
    public struct HandleValue has store, drop, copy {
        /// Handle'ın işaret ettiği profil adresi
        profile: address,
        /// Handle'ı claim eden kullanıcı
        owner: address,
    }

    // ==================== Events ====================
    
    /// Handle claim edildiğinde emit edilir
    public struct HandleClaimed has copy, drop {
        handle: String,
        profile: address,
        owner: address,
    }

    /// Handle release edildiğinde emit edilir
    public struct HandleReleased has copy, drop {
        handle: String,
        profile: address,
        owner: address,
    }

    // ==================== Init Function ====================
    
    /// Module deploy edildiğinde otomatik çalışır
    /// HandleRegistry'yi shared object olarak oluşturur
    fun init(ctx: &mut TxContext) {
        let registry = HandleRegistry {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            handles_count: 0,
        };
        
        // Registry'yi shared object yap (herkes okuyabilir, yazabilir)
        transfer::share_object(registry);
    }

    // ==================== Entry Functions ====================
    
    /// Handle claim eder (örn: /u/emirhasan)
    /// Handle'ın daha önce claim edilmemiş olması gerekir
    /// Profil sahibi olmalısın
    public entry fun claim(
        registry: &mut HandleRegistry,
        handle: String,
        profile: &Profile,
        ctx: &mut TxContext
    ) {
        use forest::profile;
        use std::string;
        
        let sender = tx_context::sender(ctx);
        
        // Handle boş olamaz
        assert!(!string::is_empty(&handle), E_EMPTY_HANDLE);
        
        // Profil sahibi kontrolü
        assert!(sender == profile::owner(profile), E_NOT_OWNER);
        
        // Handle zaten kullanımda mı kontrol et
        assert!(!dynamic_field::exists_(&registry.id, handle), E_HANDLE_EXISTS);
        
        let profile_addr = object::id_address(profile);
        
        // Handle'ı dynamic field olarak ekle
        dynamic_field::add(&mut registry.id, handle, HandleValue {
            profile: profile_addr,
            owner: sender,
        });
        
        // Counter'ı artır
        registry.handles_count = registry.handles_count + 1;
        
        // Event emit et
        event::emit(HandleClaimed {
            handle,
            profile: profile_addr,
            owner: sender,
        });
    }

    /// Handle'ı release eder (serbest bırakır)
    /// Sadece handle sahibi release edebilir
    public entry fun release(
        registry: &mut HandleRegistry,
        handle: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Handle var mı kontrol et
        assert!(dynamic_field::exists_<String>(&registry.id, handle), E_HANDLE_NOT_FOUND);
        
        // Handle'ın değerini oku
        let handle_value = dynamic_field::borrow<String, HandleValue>(&registry.id, handle);
        
        // Owner kontrolü
        assert!(sender == handle_value.owner, E_NOT_OWNER);
        
        let profile_addr = handle_value.profile;
        
        // Handle'ı sil
        let HandleValue { profile: _, owner: _ } = dynamic_field::remove(&mut registry.id, handle);
        
        // Counter'ı azalt
        registry.handles_count = registry.handles_count - 1;
        
        // Event emit et
        event::emit(HandleReleased {
            handle,
            profile: profile_addr,
            owner: sender,
        });
    }

    // ==================== Public Read Functions ====================
    
    /// Handle'ın kullanımda olup olmadığını kontrol eder
    public fun is_handle_available(registry: &HandleRegistry, handle: String): bool {
        !dynamic_field::exists_<String>(&registry.id, handle)
    }

    /// Handle'a ait profil adresini döner
    /// Handle yoksa abort eder
    public fun get_profile_by_handle(registry: &HandleRegistry, handle: String): address {
        assert!(dynamic_field::exists_<String>(&registry.id, handle), E_HANDLE_NOT_FOUND);
        let handle_value = dynamic_field::borrow<String, HandleValue>(&registry.id, handle);
        handle_value.profile
    }

    /// Toplam handle sayısını döner
    public fun handles_count(registry: &HandleRegistry): u64 {
        registry.handles_count
    }

    /// Registry admin'ini döner
    public fun admin(registry: &HandleRegistry): address {
        registry.admin
    }
}

