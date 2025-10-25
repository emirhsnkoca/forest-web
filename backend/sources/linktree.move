module forest::linktree {
    use sui::event;
    use std::string::String;

    // Profil objesi - kullanıcı bilgilerini tutar
    public struct Profile has key {
        id: UID,
        owner: address,
        display_name: String,
        bio: String,
        image_url: String,
    }

    // Link objesi - kullanıcının linklerini tutar
    public struct Link has key {
        id: UID,
        profile_id: ID,
        title: String,
        url: String,
        is_active: bool,
    }

    // Event'ler - frontend'in dinleyebileceği olaylar
    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        display_name: String,
    }

    public struct LinkAdded has copy, drop {
        link_id: ID,
        profile_id: ID,
        title: String,
        url: String,
    }

    // Profil oluşturma fonksiyonu
    public entry fun create_profile(
        display_name: String,
        bio: String,
        image_url: String,
        ctx: &mut TxContext
    ) {
        let profile = Profile {
            id: sui::object::new(ctx),
            owner: sui::tx_context::sender(ctx),
            display_name,
            bio,
            image_url,
        };

        // Event'i yayınla
        event::emit(ProfileCreated {
            profile_id: sui::object::uid_to_inner(&profile.id),
            owner: sui::tx_context::sender(ctx),
            display_name: profile.display_name,
        });

        // Profili transfer et
        sui::transfer::transfer(profile, sui::tx_context::sender(ctx));
    }

    // Link ekleme fonksiyonu
    public entry fun add_link(
        profile_id: ID,
        title: String,
        url: String,
        is_active: bool,
        ctx: &mut TxContext
    ) {
        let link = Link {
            id: sui::object::new(ctx),
            profile_id,
            title,
            url,
            is_active,
        };

        // Event'i yayınla
        event::emit(LinkAdded {
            link_id: sui::object::uid_to_inner(&link.id),
            profile_id,
            title: link.title,
            url: link.url,
        });

        // Link'i transfer et
        sui::transfer::transfer(link, sui::tx_context::sender(ctx));
    }

    // Getter fonksiyonları - frontend'in veri okuyabilmesi için
    public fun get_owner(profile: &Profile): address {
        profile.owner
    }

    public fun get_display_name(profile: &Profile): String {
        profile.display_name
    }

    public fun get_bio(profile: &Profile): String {
        profile.bio
    }

    public fun get_image_url(profile: &Profile): String {
        profile.image_url
    }

    public fun get_link_title(link: &Link): String {
        link.title
    }

    public fun get_link_url(link: &Link): String {
        link.url
    }

    public fun get_link_is_active(link: &Link): bool {
        link.is_active
    }
}
