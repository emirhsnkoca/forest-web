import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { forest } from '../forest';
import { FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaLinkedin, FaGithub } from 'react-icons/fa';

const iconMap: Record<string, any> = {
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  linkedin: FaLinkedin,
  github: FaGithub,
};

export function Profile() {
  const { address } = useParams<{ address: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!address) return;

      try {
        setIsLoading(true);
        setError('');

        // Profile'ı blockchain'den çek
        const profileData = await forest.getProfile(address);
        if (!profileData) {
          setError('Profile not found');
          return;
        }

        // Link'leri çek
        const profileLinks = await forest.getProfileLinks(address);
        
        setProfile(profileData);
        setLinks(profileLinks);
      } catch (err) {
        console.error('Profile yüklenirken hata:', err);
        setError('Profile yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [address]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">This user hasn't created a Forest profile yet.</p>
        </div>
      </div>
    );
  }

  const activeLinks = links.filter(link => link.is_active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {profile.display_name[0].toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.display_name}
            </h1>
            {profile.bio && (
              <p className="text-gray-600 mb-4">{profile.bio}</p>
            )}
            {profile.subdomain && (
              <p className="text-sm text-gray-500 mb-4">🌲 {profile.subdomain}</p>
            )}

            {/* Social Icons */}
            {activeLinks.filter(link => link.type === 'social').length > 0 && (
              <div className="flex justify-center gap-4 mb-6">
                {activeLinks.filter(link => link.type === 'social').map((link: any) => {
                  const Icon = link.platform ? iconMap[link.platform] : null;
                  return Icon ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    >
                      <Icon size={24} />
                    </a>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {activeLinks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No links to display</p>
              </div>
            ) : (
              <>
                {activeLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary hover:shadow-md transition-all text-center font-semibold text-gray-900"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {link.icon && <span className="text-lg">{link.icon}</span>}
                      <span>{link.title}</span>
                    </div>
                  </a>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <a
              href="/"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Create your own Forest profile →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}



