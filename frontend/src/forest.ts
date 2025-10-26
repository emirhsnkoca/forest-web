// Mock Forest - localStorage tabanlı çalışan versiyon
// Gerçek blockchain işlemleri yerine localStorage kullanır

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Sui client instance
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

// Types for our smart contract - Move koduna uygun
export interface Profile {
  id: string;
  owner: string;
  username: string;
  display_name: string;
  bio: string;
  image_url: string;
  subdomain: string;
  link_ids: number[];
  next_link_id: number;
  link_count: number;
}

export interface Link {
  id: number;
  title: string;
  url: string;
  icon: string;
  banner: string;
  is_active: boolean;
  order: number;
}

export interface ProfileCreatedEvent {
  profile_id: string;
  owner: string;
  username: string;
  subdomain: string;
}

export interface ProfileUpdatedEvent {
  profile_id: string;
  display_name: string;
}

export interface ProfileImageUpdatedEvent {
  profile_id: string;
  image_url: string;
}

export interface LinkAddedEvent {
  profile_id: string;
  link_id: number;
  title: string;
  url: string;
}

export interface LinkUpdatedEvent {
  profile_id: string;
  link_id: number;
  title: string;
}

export interface LinkDeletedEvent {
  profile_id: string;
  link_id: number;
}

// Mock data için localStorage key'leri
const PROFILES_KEY = 'forest_mock_profiles';
const LINKS_KEY = 'forest_mock_links';
const NEXT_ID_KEY = 'forest_mock_next_id';

// Mock Forest class for localStorage integration
export class Forest {
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
    _signAndExecuteTransaction?: any
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
    _signAndExecuteTransaction?: any
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
    _signAndExecuteTransaction?: any
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
    _signAndExecuteTransaction?: any
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
    _signAndExecuteTransaction?: any
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
    _signAndExecuteTransaction?: any
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
    _signAndExecuteTransaction?: any
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
    _signAndExecuteTransaction?: any
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
    _signAndExecuteTransaction?: any
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
    for (const [, profile] of this.profiles) {
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
    _callback: (event: ProfileCreatedEvent) => void
  ): Promise<() => void> {
    console.log('🌲 Mock Forest: ProfileCreated listener registered');
    // Mock event listener - gerçek implementasyon gerekirse
    return () => console.log('🌲 Mock Forest: ProfileCreated listener removed');
  }

  async listenForLinkAdded(
    _callback: (event: LinkAddedEvent) => void
  ): Promise<() => void> {
    console.log('🌲 Mock Forest: LinkAdded listener registered');
    // Mock event listener - gerçek implementasyon gerekirse
    return () => console.log('🌲 Mock Forest: LinkAdded listener removed');
  }

  async listenForLinkDeleted(
    _callback: (event: LinkDeletedEvent) => void
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

  // Mock data'yı import et
  importMockData(data: any) {
    try {
      // Profiles'ı import et
      if (data.profiles) {
        this.profiles.clear();
        Object.entries(data.profiles).forEach(([key, profile]: [string, any]) => {
          this.profiles.set(key, profile);
        });
      }

      // Links'leri import et
      if (data.links) {
        this.links.clear();
        Object.entries(data.links).forEach(([key, links]: [string, any]) => {
          this.links.set(key, links);
        });
      }

      // Next ID'yi import et
      if (data.nextId) {
        this.nextId = data.nextId;
      }

      this.saveToStorage();
      console.log('🌲 Mock Forest: Data imported successfully');
    } catch (error) {
      console.error('🌲 Mock Forest: Error importing data:', error);
      throw error;
    }
  }

  // Get profile by username
  async getProfileByUsername(username: string): Promise<any> {
    try {
      console.log('🌲 Mock Forest: Getting profile by username:', username);
      
      // localStorage'dan tüm profilleri çek
      const profilesData = localStorage.getItem('forest_profiles');
      if (profilesData) {
        const profiles = JSON.parse(profilesData);
        
        // Username ile profil ara
        for (const [profileId, profile] of Object.entries(profiles)) {
          if (profile.username === username) {
            console.log('🌲 Mock Forest: Found profile:', profile.displayName);
            return profile;
          }
        }
      }

      // Eğer profil bulunamazsa mock data döndür (development için)
      console.log('🌲 Mock Forest: Profile not found, returning mock data');
      const mockProfile = {
        id: '1',
        walletAddress: '0x1234567890abcdef',
        displayName: username,
        bio: 'NFT collector and digital art enthusiast',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        theme: 'green',
        createdAt: Date.now()
      };

      return mockProfile;
    } catch (error) {
      console.error('🌲 Mock Forest: Error getting profile by username:', error);
      throw error;
    }
  }

  // NFT Functions - Real Sui blockchain integration
  async getNFTsByOwner(ownerAddress: string): Promise<any[]> {
    try {
      console.log('🌲 Forest: Getting NFTs for owner:', ownerAddress);
      
      // Sui blockchain'den tüm owned objects'leri çek
      const ownedObjects = await suiClient.getOwnedObjects({
        owner: ownerAddress,
        options: {
          showContent: true,
          showDisplay: true,
          showType: true,
        }
      });

      console.log('🌲 Forest: Found objects:', ownedObjects.data.length);

      const nfts = [];
      
      for (const obj of ownedObjects.data) {
        try {
          // Object type'ını kontrol et - NFT olup olmadığını belirle
          const objectType = obj.data?.type;
          if (!objectType) continue;

          // NFT olabilecek type'ları kontrol et
          const isNFT = this.isNFTObject(objectType);
          if (!isNFT) continue;

          // Object content'ini al
          const content = obj.data?.content;
          if (!content || !('fields' in content)) continue;

          const fields = content.fields;
          
          // NFT metadata'sını çıkar
          const nft = {
            id: obj.data?.objectId || '',
            name: this.extractNFTName(fields),
            description: this.extractNFTDescription(fields),
            image: this.extractNFTImage(fields),
            collection: this.extractNFTCollection(fields, objectType),
            tokenId: this.extractTokenId(fields),
            contractAddress: objectType.split('::')[0] || '',
            rarity: this.extractRarity(fields),
            attributes: this.extractAttributes(fields)
          };

          nfts.push(nft);
        } catch (error) {
          console.warn('🌲 Forest: Error processing NFT:', error);
          continue;
        }
      }

      // Eğer hiç NFT bulunamazsa mock data döndür (development için)
      if (nfts.length === 0) {
        console.log('🌲 Forest: No NFTs found, returning mock data for development');
        return this.getMockNFTs();
      }

      console.log('🌲 Forest: Returning NFTs:', nfts.length);
      return nfts;
    } catch (error) {
      console.error('🌲 Forest: Error getting NFTs:', error);
      
      // Hata durumunda mock data döndür
      console.log('🌲 Forest: Error occurred, returning mock data');
      return this.getMockNFTs();
    }
  }

  // NFT object type'ını kontrol et
  private isNFTObject(objectType: string): boolean {
    const nftKeywords = ['nft', 'token', 'collectible', 'art', 'image'];
    const typeLower = objectType.toLowerCase();
    
    return nftKeywords.some(keyword => typeLower.includes(keyword)) ||
           typeLower.includes('0x2::nft') ||
           typeLower.includes('0x2::token');
  }

  // NFT name'ini çıkar
  private extractNFTName(fields: any): string {
    return fields.name || 
           fields.title || 
           fields.display_name || 
           fields.token_name || 
           'Unnamed NFT';
  }

  // NFT description'ını çıkar
  private extractNFTDescription(fields: any): string {
    return fields.description || 
           fields.desc || 
           fields.bio || 
           'No description available';
  }

  // NFT image'ını çıkar
  private extractNFTImage(fields: any): string {
    return fields.url || 
           fields.image_url || 
           fields.image || 
           fields.uri || 
           fields.media_url || 
           '';
  }

  // NFT collection'ını çıkar
  private extractNFTCollection(fields: any, objectType: string): string {
    return fields.collection || 
           fields.collection_name || 
           fields.series || 
           objectType.split('::')[1] || 
           'Unknown Collection';
  }

  // Token ID'yi çıkar
  private extractTokenId(fields: any): string {
    return fields.id || 
           fields.token_id || 
           fields.index || 
           fields.number || 
           '';
  }

  // Rarity'yi çıkar
  private extractRarity(fields: any): string {
    return fields.rarity || 
           fields.rank || 
           fields.tier || 
           'Common';
  }

  // Attributes'ları çıkar
  private extractAttributes(fields: any): any[] {
    if (fields.attributes && Array.isArray(fields.attributes)) {
      return fields.attributes;
    }
    
    if (fields.properties && Array.isArray(fields.properties)) {
      return fields.properties;
    }

    if (fields.traits && Array.isArray(fields.traits)) {
      return fields.traits;
    }

    return [];
  }

  // Mock NFT data for development
  private getMockNFTs(): any[] {
    console.log('🌲 Forest: Returning mock NFTs for development');
    return [
      {
        id: '1',
        name: 'Forest Guardian #1',
        description: 'A mystical guardian of the digital forest',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
        collection: 'Forest Guardians',
        tokenId: '1',
        contractAddress: '0x123...abc',
        rarity: 'Rare',
        attributes: [
          { trait_type: 'Background', value: 'Forest' },
          { trait_type: 'Eyes', value: 'Glowing' },
          { trait_type: 'Power', value: '85' }
        ]
      },
      {
        id: '2',
        name: 'Digital Tree #42',
        description: 'A unique digital tree growing in the metaverse',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        collection: 'Digital Nature',
        tokenId: '42',
        contractAddress: '0x456...def',
        rarity: 'Common',
        attributes: [
          { trait_type: 'Type', value: 'Oak' },
          { trait_type: 'Height', value: 'Tall' },
          { trait_type: 'Age', value: 'Ancient' }
        ]
      },
      {
        id: '3',
        name: 'Crypto Wolf #7',
        description: 'A fierce wolf roaming the blockchain wilderness',
        image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop',
        collection: 'Wild Crypto',
        tokenId: '7',
        contractAddress: '0x789...ghi',
        rarity: 'Epic',
        attributes: [
          { trait_type: 'Fur', value: 'Silver' },
          { trait_type: 'Eyes', value: 'Blue' },
          { trait_type: 'Strength', value: '95' }
        ]
      }
    ];
  }

  async getNFTMetadata(nftId: string): Promise<any> {
    try {
      console.log('🌲 Mock Forest: Getting NFT metadata for:', nftId);
      
      // Mock metadata - gerçek implementasyonda IPFS'ten çekilecek
      const mockMetadata = {
        name: 'Forest Guardian #1',
        description: 'A mystical guardian of the digital forest',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
        external_url: 'https://forest-web.com/nft/1',
        attributes: [
          { trait_type: 'Background', value: 'Forest' },
          { trait_type: 'Eyes', value: 'Glowing' },
          { trait_type: 'Power', value: '85' }
        ]
      };

      console.log('🌲 Mock Forest: Returning NFT metadata');
      return mockMetadata;
    } catch (error) {
      console.error('🌲 Mock Forest: Error getting NFT metadata:', error);
      throw error;
    }
  }

  // Donate Functions - Real Sui blockchain integration
  async sendDonation(
    fromAddress: string,
    toAddress: string,
    amount: number,
    signAndExecuteTransaction: any
  ): Promise<any> {
    try {
      console.log('🌲 Forest: Sending donation:', {
        from: fromAddress,
        to: toAddress,
        amount: amount
      });

      // Sui blockchain'de SUI transfer transaction'ı oluştur
      const txb = new Transaction();
      
      // SUI transfer işlemi
      const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(amount * 1_000_000_000)]); // SUI to MIST conversion
      txb.transferObjects([coin], toAddress);

      console.log('🌲 Forest: Transaction created, executing...');

      // Transaction'ı imzala ve gönder
      const result = await signAndExecuteTransaction({
        transaction: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
      },
    });

      console.log('✅ Forest: Donation sent successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Forest: Error sending donation:', error);
      throw error;
    }
  }

  // Mock donate function for development
  async sendDonationMock(
    fromAddress: string,
    toAddress: string,
    amount: number
  ): Promise<any> {
    try {
      console.log('🌲 Mock Forest: Mock donation:', {
        from: fromAddress,
        to: toAddress,
        amount: amount
      });

      // Mock donation data'yı localStorage'a kaydet
      const donationsData = localStorage.getItem('forest_donations') || '[]';
      const donations = JSON.parse(donationsData);
      
      const newDonation = {
        id: Date.now().toString(),
        from: fromAddress,
        to: toAddress,
        amount: amount,
        timestamp: Date.now(),
        status: 'completed'
      };

      donations.push(newDonation);
      localStorage.setItem('forest_donations', JSON.stringify(donations));

      console.log('✅ Mock Forest: Mock donation recorded:', newDonation);
      return newDonation;
    } catch (error) {
      console.error('❌ Mock Forest: Error recording mock donation:', error);
      throw error;
    }
  }
}

// Export a default instance
export const forest = new Forest();