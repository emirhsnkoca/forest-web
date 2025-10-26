// Mock Forest - localStorage tabanlı çalışan versiyon
import { Profile, Link, ProfileCreatedEvent, LinkAddedEvent, LinkDeletedEvent, LinkUpdatedEvent } from './forest';

// Mock data için localStorage key'leri
const PROFILES_KEY = 'forest_mock_profiles';
const LINKS_KEY = 'forest_mock_links';
const NEXT_ID_KEY = 'forest_mock_next_id';

// Mock Forest class for localStorage integration
export class MockForest {
  private profiles: Map<string, Profile> = new Map();
  private links: Map<string, Link[]> = new Map();
  private nextId: number = 1;

  constructor() {
    this.loadFromStorage();
  }

  // localStorage'dan veri yükle
  private loadFromStorage() {
    try {
      const profilesData = localStorage.getItem(PROFILES_KEY);
      const linksData = localStorage.getItem(LINKS_KEY);
      const nextIdData = localStorage.getItem(NEXT_ID_KEY);

      if (profilesData) {
        const profiles = JSON.parse(profilesData);
        this.profiles = new Map(Object.entries(profiles));
      }

      if (linksData) {
        const links = JSON.parse(linksData);
        this.links = new Map(Object.entries(links));
      }

      if (nextIdData) {
        this.nextId = parseInt(nextIdData);
      }
    } catch (error) {
      console.error('Mock Forest: Error loading from storage:', error);
    }
  }

  // localStorage'a veri kaydet
  private saveToStorage() {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(Object.fromEntries(this.profiles)));
      localStorage.setItem(LINKS_KEY, JSON.stringify(Object.fromEntries(this.links)));
      localStorage.setItem(NEXT_ID_KEY, this.nextId.toString());
    } catch (error) {
      console.error('Mock Forest: Error saving to storage:', error);
    }
  }

  // Profil oluştur (mock)
  async createProfileWithDappKit(
    username: string,
    displayName: string,
    bio: string,
    imageUrl: string,
    subdomain: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string; profileId: string }> {
    console.log('🌲 Mock Forest: Creating profile:', { username, displayName, bio, imageUrl, subdomain });

    // Mock transaction digest oluştur
    const digest = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const profileId = `profile_${this.nextId++}`;

    // Profil oluştur
    const profile: Profile = {
      id: profileId,
      owner: 'mock_owner_address', // Gerçek cüzdan adresi yerine mock
      username,
      display_name: displayName,
      bio,
      image_url: imageUrl,
      subdomain,
      link_ids: [],
      next_link_id: 0,
      link_count: 0,
    };

    // Profili kaydet
    this.profiles.set(profileId, profile);
    this.links.set(profileId, []);
    this.saveToStorage();

    console.log('✅ Mock Forest: Profile created successfully:', profile);

    return {
      digest,
      profileId
    };
  }

  // Profil güncelle (mock)
  async updateProfileWithDappKit(
    profileId: string,
    displayName: string,
    bio: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    console.log('🌲 Mock Forest: Updating profile:', profileId);

    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    profile.display_name = displayName;
    profile.bio = bio;
    this.profiles.set(profileId, profile);
    this.saveToStorage();

    return {
      digest: `mock_update_${Date.now()}`
    };
  }

  // Profil resmi güncelle (mock)
  async updateProfileImageWithDappKit(
    profileId: string,
    imageUrl: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    console.log('🌲 Mock Forest: Updating profile image:', profileId);

    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    profile.image_url = imageUrl;
    this.profiles.set(profileId, profile);
    this.saveToStorage();

    return {
      digest: `mock_image_update_${Date.now()}`
    };
  }

  // Subdomain güncelle (mock)
  async updateSubdomainWithDappKit(
    profileId: string,
    subdomain: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    console.log('🌲 Mock Forest: Updating subdomain:', profileId);

    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    profile.subdomain = subdomain;
    this.profiles.set(profileId, profile);
    this.saveToStorage();

    return {
      digest: `mock_subdomain_update_${Date.now()}`
    };
  }

  // Link ekle (mock)
  async addLinkWithDappKit(
    profileId: string,
    title: string,
    url: string,
    icon: string,
    banner: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string; linkId: number }> {
    console.log('🌲 Mock Forest: Adding link:', { profileId, title, url, icon, banner });

    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const linkId = profile.next_link_id++;
    const link: Link = {
      id: linkId,
      title,
      url,
      icon,
      banner,
      is_active: true,
      order: profile.link_count,
    };

    // Link'i kaydet
    const profileLinks = this.links.get(profileId) || [];
    profileLinks.push(link);
    this.links.set(profileId, profileLinks);

    // Profil bilgilerini güncelle
    profile.link_ids.push(linkId);
    profile.link_count++;
    this.profiles.set(profileId, profile);
    this.saveToStorage();

    console.log('✅ Mock Forest: Link added successfully:', link);

    return {
      digest: `mock_link_add_${Date.now()}`,
      linkId
    };
  }

  // Link sil (mock)
  async deleteLinkWithDappKit(
    profileId: string,
    linkId: number,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    console.log('🌲 Mock Forest: Deleting link:', { profileId, linkId });

    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const profileLinks = this.links.get(profileId) || [];
    const updatedLinks = profileLinks.filter(link => link.id !== linkId);
    this.links.set(profileId, updatedLinks);

    // Profil bilgilerini güncelle
    profile.link_ids = profile.link_ids.filter(id => id !== linkId);
    profile.link_count--;
    this.profiles.set(profileId, profile);
    this.saveToStorage();

    console.log('✅ Mock Forest: Link deleted successfully');

    return {
      digest: `mock_link_delete_${Date.now()}`
    };
  }

  // Link güncelle (mock)
  async updateLinkWithDappKit(
    profileId: string,
    linkId: number,
    title: string,
    url: string,
    icon: string,
    banner: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    console.log('🌲 Mock Forest: Updating link:', { profileId, linkId, title, url, icon, banner });

    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const profileLinks = this.links.get(profileId) || [];
    const linkIndex = profileLinks.findIndex(link => link.id === linkId);
    
    if (linkIndex === -1) {
      throw new Error('Link not found');
    }

    profileLinks[linkIndex] = {
      ...profileLinks[linkIndex],
      title,
      url,
      icon,
      banner,
    };

    this.links.set(profileId, profileLinks);
    this.saveToStorage();

    console.log('✅ Mock Forest: Link updated successfully');

    return {
      digest: `mock_link_update_${Date.now()}`
    };
  }

  // Link aktif/pasif yap (mock)
  async toggleLinkWithDappKit(
    profileId: string,
    linkId: number,
    isActive: boolean,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    console.log('🌲 Mock Forest: Toggling link:', { profileId, linkId, isActive });

    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const profileLinks = this.links.get(profileId) || [];
    const linkIndex = profileLinks.findIndex(link => link.id === linkId);
    
    if (linkIndex === -1) {
      throw new Error('Link not found');
    }

    profileLinks[linkIndex].is_active = isActive;
    this.links.set(profileId, profileLinks);
    this.saveToStorage();

    return {
      digest: `mock_link_toggle_${Date.now()}`
    };
  }

  // Link sıralama (mock)
  async reorderLinkWithDappKit(
    profileId: string,
    linkId: number,
    newOrder: number,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    console.log('🌲 Mock Forest: Reordering link:', { profileId, linkId, newOrder });

    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const profileLinks = this.links.get(profileId) || [];
    const linkIndex = profileLinks.findIndex(link => link.id === linkId);
    
    if (linkIndex === -1) {
      throw new Error('Link not found');
    }

    profileLinks[linkIndex].order = newOrder;
    this.links.set(profileId, profileLinks);
    this.saveToStorage();

    return {
      digest: `mock_link_reorder_${Date.now()}`
    };
  }

  // Profil sahibine göre bul (mock)
  async getProfileByOwner(ownerAddress: string): Promise<Profile | null> {
    console.log('🌲 Mock Forest: Searching profile by owner:', ownerAddress);

    // Mock owner address ile eşleşen profili bul
    for (const [profileId, profile] of this.profiles) {
      if (profile.owner === ownerAddress) {
        console.log('✅ Mock Forest: Found profile:', profile);
        return profile;
      }
    }

    console.log('❌ Mock Forest: No profile found for owner:', ownerAddress);
    return null;
  }

  // Profil getir (mock)
  async getProfile(profileId: string): Promise<Profile | null> {
    console.log('🌲 Mock Forest: Fetching profile:', profileId);

    const profile = this.profiles.get(profileId);
    if (profile) {
      console.log('✅ Mock Forest: Profile found:', profile);
      return profile;
    }

    console.log('❌ Mock Forest: Profile not found:', profileId);
    return null;
  }

  // Tek link getir (mock)
  async getLink(profileId: string, linkId: number): Promise<Link | null> {
    console.log('🌲 Mock Forest: Fetching link:', { profileId, linkId });

    const profileLinks = this.links.get(profileId) || [];
    const link = profileLinks.find(l => l.id === linkId);

    if (link) {
      console.log('✅ Mock Forest: Link found:', link);
      return link;
    }

    console.log('❌ Mock Forest: Link not found:', { profileId, linkId });
    return null;
  }

  // Profil linklerini getir (mock)
  async getProfileLinks(profileId: string): Promise<Link[]> {
    console.log('🌲 Mock Forest: Fetching profile links:', profileId);

    const profileLinks = this.links.get(profileId) || [];
    const sortedLinks = profileLinks.sort((a, b) => a.order - b.order);

    console.log('✅ Mock Forest: Found links:', sortedLinks);
    return sortedLinks;
  }

  // Event dinleyiciler (mock - gerçek event'ler yerine callback'ler)
  async listenForProfileCreated(
    callback: (event: ProfileCreatedEvent) => void
  ): Promise<() => void> {
    console.log('🌲 Mock Forest: ProfileCreated listener registered');
    // Mock event listener - gerçek implementasyon gerekirse
    return () => console.log('🌲 Mock Forest: ProfileCreated listener removed');
  }

  async listenForLinkAdded(
    callback: (event: LinkAddedEvent) => void
  ): Promise<() => void> {
    console.log('🌲 Mock Forest: LinkAdded listener registered');
    // Mock event listener - gerçek implementasyon gerekirse
    return () => console.log('🌲 Mock Forest: LinkAdded listener removed');
  }

  async listenForLinkDeleted(
    callback: (event: LinkDeletedEvent) => void
  ): Promise<() => void> {
    console.log('🌲 Mock Forest: LinkDeleted listener registered');
    // Mock event listener - gerçek implementasyon gerekirse
    return () => console.log('🌲 Mock Forest: LinkDeleted listener removed');
  }

  // Utility function - mock keypair
  static generateKeypair(): any {
    return {
      getPublicKey: () => 'mock_public_key',
      getSecretKey: () => 'mock_secret_key'
    };
  }

  // Mock data'yı temizle (test için)
  clearMockData() {
    this.profiles.clear();
    this.links.clear();
    this.nextId = 1;
    localStorage.removeItem(PROFILES_KEY);
    localStorage.removeItem(LINKS_KEY);
    localStorage.removeItem(NEXT_ID_KEY);
    console.log('🧹 Mock Forest: All mock data cleared');
  }

  // Mock data'yı göster (debug için)
  getMockData() {
    return {
      profiles: Object.fromEntries(this.profiles),
      links: Object.fromEntries(this.links),
      nextId: this.nextId
    };
  }
}

// Export a default instance
export const mockForest = new MockForest();
