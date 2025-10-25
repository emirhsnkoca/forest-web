import { useLocalStorage } from './useLocalStorage';
import { UserProfile } from '../types';

export function useProfile(walletAddress: string | undefined) {
  const [profiles, setProfiles] = useLocalStorage<Record<string, UserProfile>>('forest_profiles', {});

  const profile = walletAddress ? profiles[walletAddress] : null;

  const saveProfile = (profileData: Partial<UserProfile>) => {
    if (!walletAddress) return;

    setProfiles((prev) => ({
      ...prev,
      [walletAddress]: {
        ...prev[walletAddress],
        ...profileData,
        walletAddress,
        createdAt: prev[walletAddress]?.createdAt || Date.now(),
      } as UserProfile,
    }));
  };

  const getProfileByAddress = (address: string): UserProfile | null => {
    return profiles[address] || null;
  };

  return { profile, saveProfile, getProfileByAddress };
}



