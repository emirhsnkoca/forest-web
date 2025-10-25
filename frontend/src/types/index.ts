export interface UserProfile {
  walletAddress: string;
  displayName: string;
  bio: string;
  profileImage: string;
  username: string; // YENİ
  subdomain: string; // YENİ
  links: Link[];
  createdAt: number;
}

export interface Link {
  id: number; // string değil u64
  type: 'social' | 'custom' | 'wallet' | 'nft' | 'defi';
  platform?: string;
  title: string;
  url: string;
  icon: string; // YENİ
  banner: string; // YENİ
  isActive: boolean;
  order: number; // YENİ
  blockchain?: string;
  contractAddress?: string;
  tokenId?: string;
}

export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  placeholder: string;
  urlPrefix?: string;
}



