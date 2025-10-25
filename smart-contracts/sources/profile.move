module forest::profile {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::option::{Self, Option};
    use std::string::String;
    use std::vector;
    use sui::event;

    // ==================== Error Constants ====================
    
    /// Sadece profile owner'ı bu işlemi yapabilir
    const E_NOT_OWNER: u64 = 1;
    
    /// Walrus blob ID boş olamaz
    const E_EMPTY_BLOB: u64 = 2;
    
    /// Bağış özelliği devre dışı
    const E_DONATE_DISABLED: u64 = 3;
    
    /// Geçersiz isim formatı
    const E_INVALID_NAME: u64 = 4;
    
    /// Handle zaten kullanımda
    const E_HANDLE_EXISTS: u64 = 5;

    // ==================== Structs ====================
    
    /// Ana profil objesi - her kullanıcıya owned
    public struct Profile has key, store {
        id: UID,
        /// Profil sahibinin adresi
        owner: address,
        /// Sui Name Service (.sui) ismi (optional)
        primary_name: Option<String>,
        /// Walrus storage'daki blob ID (off-chain data: links, bio, theme, images)
        walrus_blob_id: vector<u8>,
        /// Profil görünürlük durumu
        visible: bool,
        /// Bağış özelliği aktif mi?
        donate_enabled: bool,
        /// Özel bağış adresi (yoksa owner'a gider)
        donate_address: Option<address>,
        /// NFT koleksiyonunu göster
        show_nfts: bool,
        /// Cüzdan bakiyesini göster
        show_balance: bool,
        /// Güncelleme sayacı (her güncelleme +1)
        revision: u64,
        /// Oluşturulma zamanı (milliseconds)
        created_ms: u64,
    }

    /// Global registry - shared object
    public struct Registry has key {
        id: UID,
        /// Registry admin'i
        admin: address,
        /// Toplam profil sayısı
        profiles_count: u64,
    }

    // ==================== Events ====================
    
    /// Yeni profil oluşturulduğunda emit edilir
    public struct ProfileCreated has copy, drop {
        profile_id: address,
        owner: address,
        created_ms: u64,
    }

    /// Profil güncellendiğinde emit edilir
    public struct ProfileUpdated has copy, drop {
        profile_id: address,
        owner: address,
        revision: u64,
    }

    /// Profil görünürlüğü değiştiğinde emit edilir
    public struct VisibilityChanged has copy, drop {
        profile_id: address,
        owner: address,
        visible: bool,
    }

    /// Bağış ayarları değiştiğinde emit edilir
    public struct DonateSettingsChanged has copy, drop {
        profile_id: address,
        owner: address,
        donate_enabled: bool,
        donate_address: Option<address>,
    }

    // ==================== Init Function ====================
    
    /// Module deploy edildiğinde otomatik çalışır
    /// Registry'yi shared object olarak oluşturur
    fun init(ctx: &mut TxContext) {
        let registry = Registry {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            profiles_count: 0,
        };
        
        // Registry'yi shared object yap (herkes okuyabilir)
        transfer::share_object(registry);
    }

    // ==================== Entry Functions ====================
    
    /// Yeni profil oluşturur
    /// Registry'deki profil sayısını artırır
    /// ProfileCreated event emit eder
    public entry fun create_profile(
        registry: &mut Registry,
        walrus_blob_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        let created_ms = tx_context::epoch_timestamp_ms(ctx);
        
        // Yeni profil oluştur
        let profile = Profile {
            id: object::new(ctx),
            owner,
            primary_name: option::none(),
            walrus_blob_id,
            visible: true, // Varsayılan: görünür
            donate_enabled: false, // Varsayılan: bağış kapalı
            donate_address: option::none(),
            show_nfts: false, // Varsayılan: NFT'ler gizli
            show_balance: false, // Varsayılan: bakiye gizli
            revision: 0,
            created_ms,
        };
        
        let profile_id = object::id_address(&profile);
        
        // Registry'yi güncelle
        registry.profiles_count = registry.profiles_count + 1;
        
        // Event emit et
        event::emit(ProfileCreated {
            profile_id,
            owner,
            created_ms,
        });
        
        // Profili owner'a transfer et (owned object)
        transfer::transfer(profile, owner);
    }

    /// Walrus blob ID'sini günceller
    /// Revision'ı artırır
    /// Owner kontrolü yapar
    public entry fun set_walrus_blob(
        profile: &mut Profile,
        new_blob_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Owner kontrolü
        assert!(sender == profile.owner, E_NOT_OWNER);
        
        // Blob boş olamaz
        assert!(!vector::is_empty(&new_blob_id), E_EMPTY_BLOB);
        
        // Blob'u güncelle
        profile.walrus_blob_id = new_blob_id;
        
        // Revision'ı artır
        profile.revision = profile.revision + 1;
        
        // Event emit et
        event::emit(ProfileUpdated {
            profile_id: object::id_address(profile),
            owner: profile.owner,
            revision: profile.revision,
        });
    }

    /// Primary name (.sui) ayarlar
    /// Owner kontrolü yapar
    public entry fun set_primary_name(
        profile: &mut Profile,
        name: Option<String>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Owner kontrolü
        assert!(sender == profile.owner, E_NOT_OWNER);
        
        // Name'i güncelle
        profile.primary_name = name;
        
        // Event emit et
        event::emit(ProfileUpdated {
            profile_id: object::id_address(profile),
            owner: profile.owner,
            revision: profile.revision,
        });
    }

    /// Profil görünürlüğünü değiştirir
    /// Owner kontrolü yapar
    public entry fun set_visible(
        profile: &mut Profile,
        visible: bool,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Owner kontrolü
        assert!(sender == profile.owner, E_NOT_OWNER);
        
        // Görünürlüğü güncelle
        profile.visible = visible;
        
        // Event emit et
        event::emit(VisibilityChanged {
            profile_id: object::id_address(profile),
            owner: profile.owner,
            visible,
        });
    }

    /// Bağış ayarlarını değiştirir
    /// Owner kontrolü yapar
    public entry fun set_donate_settings(
        profile: &mut Profile,
        enabled: bool,
        donate_address: Option<address>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Owner kontrolü
        assert!(sender == profile.owner, E_NOT_OWNER);
        
        // Ayarları güncelle
        profile.donate_enabled = enabled;
        profile.donate_address = donate_address;
        
        // Event emit et
        event::emit(DonateSettingsChanged {
            profile_id: object::id_address(profile),
            owner: profile.owner,
            donate_enabled: enabled,
            donate_address,
        });
    }

    /// Widget ayarlarını değiştirir (NFT, Balance gösterme)
    /// Owner kontrolü yapar
    public entry fun set_widgets(
        profile: &mut Profile,
        show_nfts: bool,
        show_balance: bool,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Owner kontrolü
        assert!(sender == profile.owner, E_NOT_OWNER);
        
        // Widget ayarlarını güncelle
        profile.show_nfts = show_nfts;
        profile.show_balance = show_balance;
        
        // Event emit et
        event::emit(ProfileUpdated {
            profile_id: object::id_address(profile),
            owner: profile.owner,
            revision: profile.revision,
        });
    }

    /// Profili tamamen siler
    /// Owner kontrolü yapar
    public entry fun destroy_profile(
        profile: Profile,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Owner kontrolü
        assert!(sender == profile.owner, E_NOT_OWNER);
        
        // Profili yok et
        let Profile {
            id,
            owner: _,
            primary_name: _,
            walrus_blob_id: _,
            visible: _,
            donate_enabled: _,
            donate_address: _,
            show_nfts: _,
            show_balance: _,
            revision: _,
            created_ms: _,
        } = profile;
        
        object::delete(id);
    }

    // ==================== Public Accessor (Getter) Functions ====================
    
    /// Profile owner'ını döner
    public fun owner(profile: &Profile): address {
        profile.owner
    }

    /// Bağış özelliğinin aktif olup olmadığını döner
    public fun donate_enabled(profile: &Profile): bool {
        profile.donate_enabled
    }

    /// Bağış adresini döner (varsa)
    public fun donate_address(profile: &Profile): Option<address> {
        profile.donate_address
    }

    /// Profil görünürlük durumunu döner
    public fun visible(profile: &Profile): bool {
        profile.visible
    }

    /// Primary name'i döner
    public fun primary_name(profile: &Profile): Option<String> {
        profile.primary_name
    }

    /// Walrus blob ID'sini döner
    public fun walrus_blob_id(profile: &Profile): vector<u8> {
        profile.walrus_blob_id
    }

    /// NFT gösterim durumunu döner
    public fun show_nfts(profile: &Profile): bool {
        profile.show_nfts
    }

    /// Bakiye gösterim durumunu döner
    public fun show_balance(profile: &Profile): bool {
        profile.show_balance
    }

    /// Revision numarasını döner
    public fun revision(profile: &Profile): u64 {
        profile.revision
    }

    /// Oluşturulma zamanını döner
    public fun created_ms(profile: &Profile): u64 {
        profile.created_ms
    }

    /// Registry'deki profil sayısını döner
    public fun profiles_count(registry: &Registry): u64 {
        registry.profiles_count
    }

    // ==================== Test-Only Functions ====================
    
    #[test_only]
    /// Test için init fonksiyonunu expose eder
    public fun test_init(ctx: &mut TxContext) {
        init(ctx);
    }
}

