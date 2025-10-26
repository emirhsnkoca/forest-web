import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forest } from '../forest';
import { Background } from '../components/common/Background';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';

export function Donate() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donateAmount, setDonateAmount] = useState('');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log('🔍 Donate: Component rendered with username:', username);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 Donate: Loading profile for username:', username);

      if (!username) {
        console.log('🔍 Donate: No username provided, showing mock data for testing');
        // Test için mock data göster
        const mockProfile = {
          id: 'test',
          displayName: 'Test User',
          walletAddress: '0x1234567890abcdef',
          bio: 'Test user for donations',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          theme: 'green'
        };
        setProfile(mockProfile);
        return;
      }

      // Profil bilgilerini çek
      const profileData = await forest.getProfileByUsername(username);
      console.log('🔍 Donate: Profile data:', profileData);
      
      if (!profileData) {
        setError('Profile not found');
        return;
      }
      setProfile(profileData);

      console.log('✅ Donate: Profile loaded:', profileData.displayName);
    } catch (err) {
      console.error('❌ Donate: Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDonateClick = () => {
    // Direkt donate modal'ını aç
    setIsDonateModalOpen(true);
  };

  const handleDonateSubmit = async () => {
    const amount = parseFloat(donateAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      console.log('🔍 Donate: Processing donation:', {
        amount: amount,
        to: profile?.walletAddress
      });

      // Mock donation için localStorage'a kaydet
      await forest.sendDonationMock(
        'mock_sender_address',
        profile?.walletAddress || '0x1234567890abcdef',
        amount
      );

      console.log('✅ Donate: Donation sent successfully');
      
      // Modal'ı kapat ve başarı mesajı göster
      setIsDonateModalOpen(false);
      setDonateAmount('');
      setError('');
      
      // Başarı mesajı için geçici olarak error state'i kullan
      setError('Donation sent successfully! 🎉');
      setTimeout(() => setError(''), 3000);

    } catch (err) {
      console.error('❌ Donate: Error sending donation:', err);
      setError('Failed to send donation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setIsDonateModalOpen(false);
    setDonateAmount('');
    setError('');
  };


  if (loading) {
    return (
      <Background type="pixel-green" className="min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading profile...</p>
          </div>
        </div>
      </Background>
    );
  }

  if (error && !profile) {
    return (
      <Background type="pixel-green" className="min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-white text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </Background>
    );
  }

  return (
    <Background type="pixel-green" className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/logos/main/forest-logo.png" 
              alt="Forest Logo" 
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Donate
            </h1>
          </div>
          <p className="text-white text-lg opacity-90">
            Support {profile?.displayName || username}
          </p>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <img
                src={profile.profileImage}
                alt={profile.displayName}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white/20"
              />
              <h2 className="text-2xl font-bold text-white mb-2">{profile.displayName}</h2>
              <p className="text-white/80 mb-4">{profile.bio}</p>
              
              {/* Wallet Address */}
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <p className="text-xs text-white/60 mb-1">Wallet Address</p>
                <p className="text-sm text-white font-mono break-all">
                  {profile.walletAddress}
                </p>
              </div>

              {/* Donate Button */}
              <Button
                onClick={handleDonateClick}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                💰 Send Donation
              </Button>
            </div>
          </div>
        )}

        {/* Error/Success Message */}
        {error && (
          <div className="max-w-md mx-auto mb-4">
            <div className={`px-4 py-3 rounded-lg text-center ${
              error.includes('successfully') 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate(`/${username}`)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm"
          >
            ← Back to Profile
          </button>
        </div>

        {/* Donate Modal */}
        <Modal isOpen={isDonateModalOpen} onClose={handleCloseModal}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Donation</h2>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Support: <span className="font-semibold">{profile?.displayName}</span></p>
            </div>

            <Input
              label="Amount (SUI)"
              type="number"
              placeholder="0.1"
              value={donateAmount}
              onChange={(e) => setDonateAmount(e.target.value)}
              min="0.001"
              step="0.001"
            />

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDonateSubmit}
                disabled={isProcessing || !donateAmount}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Send Donation'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Background>
  );
}
