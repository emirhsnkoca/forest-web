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
  type: 'social' | 'custom';
  platform?: string;
  title: string;
  url: string;
  isActive: boolean;
}

export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  placeholder: string;
  urlPrefix?: string;
}



