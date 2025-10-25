import { SocialPlatform } from '../types';

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'FaInstagram',
    placeholder: '@username',
    urlPrefix: 'https://instagram.com/',
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: 'FaTwitter',
    placeholder: '@username',
    urlPrefix: 'https://twitter.com/',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'FaYoutube',
    placeholder: 'Channel URL',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'FaTiktok',
    placeholder: '@username',
    urlPrefix: 'https://tiktok.com/@',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'FaLinkedin',
    placeholder: 'Profile URL',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'FaGithub',
    placeholder: 'username',
    urlPrefix: 'https://github.com/',
  },
];



