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

  // Profile ID'yi localStorage'a kaydet (blockchain'den gelen profile ID)
  const saveProfileId = (profileId: string) => {
    localStorage.setItem('forest_profile_id', profileId);
  };

  // Profile ID'yi localStorage'dan al
  const getProfileId = (): string | null => {
    return localStorage.getItem('forest_profile_id');
  };

  return { 
    profile, 
    saveProfile, 
    getProfileByAddress, 
    saveProfileId, 
    getProfileId 
  };
}



