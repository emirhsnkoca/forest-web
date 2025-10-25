#[test_only]
module forest::profile_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use forest::profile::{Self, Profile, Registry};
    use std::string;

    // ==================== Test Constants ====================
    
    const ADMIN: address = @0xAD;
    const USER1: address = @0x1;
    const USER2: address = @0x2;

    // ==================== Test Functions ====================
    
    /// TODO-21: Test profile creation
    /// Profil oluşturulduğunda owner doğru mu, profiles_count arttı mı kontrol eder
    #[test]
    fun test_create_profile() {
        let mut scenario = ts::begin(ADMIN);
        
        // Init registry
        {
            profile::test_init(ts::ctx(&mut scenario));
        };
        
        // Create profile as USER1
        ts::next_tx(&mut scenario, USER1);
        {
            let mut registry = ts::take_shared<Registry>(&scenario);
            let initial_count = profile::profiles_count(&registry);
            
            let blob_id = b"test_blob_123";
            profile::create_profile(&mut registry, blob_id, ts::ctx(&mut scenario));
            
            // Registry count arttı mı?
            assert!(profile::profiles_count(&registry) == initial_count + 1);
            
            ts::return_shared(registry);
        };
        
        // Profile owner kontrolü
        ts::next_tx(&mut scenario, USER1);
        {
            let profile = ts::take_from_sender<Profile>(&scenario);
            
            // Owner USER1 mi?
            assert!(profile::owner(&profile) == USER1);
            
            // Varsayılan değerler doğru mu?
            assert!(profile::visible(&profile) == true);
            assert!(profile::donate_enabled(&profile) == false);
            assert!(profile::revision(&profile) == 0);
            
            ts::return_to_sender(&scenario, profile);
        };
        
        ts::end(scenario);
    }

    /// TODO-22: Test walrus blob update
    /// Blob güncellendiğinde revision artıyor mu kontrol eder
    #[test]
    fun test_update_walrus_blob() {
        let mut scenario = ts::begin(ADMIN);
        
        // Init & create profile
        {
            profile::test_init(ts::ctx(&mut scenario));
        };
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut registry = ts::take_shared<Registry>(&scenario);
            profile::create_profile(&mut registry, b"blob_v1", ts::ctx(&mut scenario));
            ts::return_shared(registry);
        };
        
        // Update blob
        ts::next_tx(&mut scenario, USER1);
        {
            let mut profile = ts::take_from_sender<Profile>(&scenario);
            let initial_revision = profile::revision(&profile);
            
            profile::set_walrus_blob(&mut profile, b"blob_v2", ts::ctx(&mut scenario));
            
            // Revision arttı mı?
            assert!(profile::revision(&profile) == initial_revision + 1);
            
            ts::return_to_sender(&scenario, profile);
        };
        
        ts::end(scenario);
    }

    /// TODO-23: Test visibility toggle
    /// Görünürlük değişikliği çalışıyor mu kontrol eder
    #[test]
    fun test_visibility_toggle() {
        let mut scenario = ts::begin(ADMIN);
        
        // Setup
        {
            profile::test_init(ts::ctx(&mut scenario));
        };
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut registry = ts::take_shared<Registry>(&scenario);
            profile::create_profile(&mut registry, b"blob", ts::ctx(&mut scenario));
            ts::return_shared(registry);
        };
        
        // Toggle visibility
        ts::next_tx(&mut scenario, USER1);
        {
            let mut profile = ts::take_from_sender<Profile>(&scenario);
            
            // Başlangıçta visible = true
            assert!(profile::visible(&profile) == true);
            
            // False yap
            profile::set_visible(&mut profile, false, ts::ctx(&mut scenario));
            assert!(profile::visible(&profile) == false);
            
            // True yap
            profile::set_visible(&mut profile, true, ts::ctx(&mut scenario));
            assert!(profile::visible(&profile) == true);
            
            ts::return_to_sender(&scenario, profile);
        };
        
        ts::end(scenario);
    }

    /// TODO-24: Test non-owner fails
    /// Owner olmayan birinin güncelleme yapamadığını kontrol eder
    #[test]
    #[expected_failure(abort_code = 1)] // E_NOT_OWNER = 1
    fun test_non_owner_fails() {
        let mut scenario = ts::begin(ADMIN);
        
        // USER1 profil oluşturur
        {
            profile::test_init(ts::ctx(&mut scenario));
        };
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut registry = ts::take_shared<Registry>(&scenario);
            profile::create_profile(&mut registry, b"blob", ts::ctx(&mut scenario));
            ts::return_shared(registry);
        };
        
        // USER2 USER1'in profilini güncellemeye çalışır (FAIL!)
        ts::next_tx(&mut scenario, USER2);
        {
            let mut profile = ts::take_from_address<Profile>(&scenario, USER1);
            
            // Bu abort etmeli: E_NOT_OWNER
            profile::set_visible(&mut profile, false, ts::ctx(&mut scenario));
            
            ts::return_to_address(USER1, profile);
        };
        
        ts::end(scenario);
    }

    /// TODO-25: Test donate settings
    /// Bağış ayarlarının düzgün çalıştığını kontrol eder
    #[test]
    fun test_donate_settings() {
        let mut scenario = ts::begin(ADMIN);
        
        // Setup
        {
            profile::test_init(ts::ctx(&mut scenario));
        };
        
        ts::next_tx(&mut scenario, USER1);
        {
            let mut registry = ts::take_shared<Registry>(&scenario);
            profile::create_profile(&mut registry, b"blob", ts::ctx(&mut scenario));
            ts::return_shared(registry);
        };
        
        // Set donate settings
        ts::next_tx(&mut scenario, USER1);
        {
            let mut profile = ts::take_from_sender<Profile>(&scenario);
            
            // Enable donations with custom address
            profile::set_donate_settings(
                &mut profile, 
                true, 
                std::option::some(@0x999), 
                ts::ctx(&mut scenario)
            );
            
            assert!(profile::donate_enabled(&profile) == true);
            assert!(std::option::is_some(&profile::donate_address(&profile)));
            
            ts::return_to_sender(&scenario, profile);
        };
        
        ts::end(scenario);
    }
}

