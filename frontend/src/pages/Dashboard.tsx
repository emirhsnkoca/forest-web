import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { forest } from '../forest';
import { Button } from '../components/common/Button';

export function Dashboard() {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const isConnected = !!currentAccount;
  const { mutate: disconnect } = useDisconnectWallet();

  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Local storage'dan profile ID'yi al
        const storedProfileId = localStorage.getItem('forest_profile_id');
        if (!storedProfileId) {
          navigate('/onboarding');
          return;
        }

        // Profile'ı blockchain'den çek - sadece onchain veri
        const profileData = await forest.getProfile(storedProfileId);
        
        if (!profileData) {
          navigate('/onboarding');
          return;
        }

        // Link'leri çek
        const profileLinks = await forest.getProfileLinks(storedProfileId);
        
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
  }, [isConnected, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Profile not found'}</p>
          <Button onClick={() => navigate('/onboarding')}>
            Create Profile
          </Button>
        </div>
      </div>
    );
  }

  const activeLinks = links.filter(link => link.is_active);
  const profileUrl = `${window.location.origin}/profile/${profile.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Forest</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/profile/${profile.id}`)}
              className="text-primary hover:text-primary-dark font-medium"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Manage Links
            </button>
            <button
              onClick={() => disconnect()}
              className="text-gray-600 hover:text-gray-900"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {profile.display_name}!
            </h1>
            <p className="text-gray-600 mb-4">
              Manage your Forest profile and links from here.
            </p>
            {profile.subdomain && (
              <p className="text-sm text-gray-500">
                🌲 Your subdomain: {profile.subdomain}
              </p>
            )}
          </div>

          {/* Profile Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Profile Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Links</span>
                  <span className="font-semibold">{links.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Links</span>
                  <span className="font-semibold text-green-600">{activeLinks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/admin')}
                  fullWidth
                  className="bg-primary text-white hover:bg-primary-dark"
                >
                  Manage Links
                </Button>
                <Button
                  onClick={() => navigate(`/profile/${profile.id}`)}
                  fullWidth
                  variant="secondary"
                >
                  View Public Profile
                </Button>
                <Button
                  onClick={() => navigator.clipboard.writeText(profileUrl)}
                  fullWidth
                  variant="secondary"
                >
                  Copy Profile URL
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Links */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Links</h2>
            {activeLinks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No links yet</p>
                <Button
                  onClick={() => navigate('/admin')}
                  className="bg-primary text-white hover:bg-primary-dark"
                >
                  Add Your First Link
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeLinks.slice(0, 5).map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {link.icon && <span className="text-lg">{link.icon}</span>}
                      <div>
                        <p className="font-medium text-gray-900">{link.title}</p>
                        <p className="text-sm text-gray-500">{link.url}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(link.url, '_blank')}
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      Visit →
                    </button>
                  </div>
                ))}
                {activeLinks.length > 5 && (
                  <div className="text-center pt-4">
                    <Button
                      onClick={() => navigate('/admin')}
                      variant="secondary"
                    >
                      View All Links ({activeLinks.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}