export interface UserProfile {
  walletAddress: string;
  displayName: string;
  bio: string;
  profileImage: string;
  links: Link[];
  createdAt: number;
}

export interface Link {
  id: string;
  type: 'social' | 'custom' | 'wallet' | 'nft' | 'defi';
  platform?: string;
  title: string;
  url: string;
  isActive: boolean;
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



