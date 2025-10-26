import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { forest } from '../forest';
import { FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaLinkedin, FaGithub, FaQrcode } from 'react-icons/fa';
import QRCode from 'qrcode';

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
  const [profileViews, setProfileViews] = useState(0);
  const [linkClicks, setLinkClicks] = useState<Record<number, number>>({});
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!address) return;

      try {
        setIsLoading(true);
        setError('');

        // Profile'ı mock data'dan çek
        const profileData = await forest.getProfile(address);
        if (!profileData) {
          setError('Profile not found');
          return;
        }

        // Link'leri mock data'dan çek
        const profileLinks = await forest.getProfileLinks(address);
        
        setProfile(profileData);
        setLinks(profileLinks);
        
        // Profil görüntüleme sayısını artır
        const viewsKey = `profile_views_${address}`;
        const currentViews = parseInt(localStorage.getItem(viewsKey) || '0') + 1;
        localStorage.setItem(viewsKey, currentViews.toString());
        setProfileViews(currentViews);
        
        // Link tıklama sayılarını yükle
        const clicksKey = `link_clicks_${address}`;
        const savedClicks = JSON.parse(localStorage.getItem(clicksKey) || '{}');
        setLinkClicks(savedClicks);
        
        // QR kod oluştur
        const profileUrl = `${window.location.origin}/profile/${address}`;
        try {
          const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: '#4A7C25',
              light: '#FFFFFF'
            }
          });
          setQrCodeUrl(qrCodeDataUrl);
        } catch (err) {
          console.error('QR kod oluşturulurken hata:', err);
        }
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

  const handleLinkClick = (linkId: number, url: string) => {
    // Link tıklama sayısını artır
    const newClicks = { ...linkClicks, [linkId]: (linkClicks[linkId] || 0) + 1 };
    setLinkClicks(newClicks);
    
    // localStorage'a kaydet
    const clicksKey = `link_clicks_${address}`;
    localStorage.setItem(clicksKey, JSON.stringify(newClicks));
    
    // Link'i yeni sekmede aç
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Profil İstatistikleri */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{profileViews}</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{activeLinks.length}</div>
              <div className="text-sm text-gray-600">Links</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {Object.values(linkClicks).reduce((sum, clicks) => sum + clicks, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Clicks</div>
            </div>
          </div>
        </div>

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

            {/* QR Code Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                <FaQrcode />
                {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
              </button>
            </div>

            {/* QR Code Modal */}
            {showQRCode && qrCodeUrl && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-4">Share Profile</h3>
                    <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Scan to visit {profile.display_name}'s profile
                    </p>
                    <button
                      onClick={() => setShowQRCode(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
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
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id, link.url)}
                    className="block w-full p-4 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-center font-semibold text-gray-900 group"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {link.icon && <span className="text-xl group-hover:scale-110 transition-transform">{link.icon}</span>}
                      <span className="group-hover:text-primary transition-colors">{link.title}</span>
                    </div>
                    {linkClicks[link.id] > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        {linkClicks[link.id]} clicks
                      </div>
                    )}
                  </button>
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



