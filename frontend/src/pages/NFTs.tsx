import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forest } from '../forest';
import { NFTCard } from '../components/common/NFTCard';
import { Background } from '../components/common/Background';

export function NFTs() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(null);

  console.log('🔍 NFTs: Component rendered with username:', username);

  useEffect(() => {
    loadNFTs();
  }, [username]);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 NFTs: Loading NFTs for username:', username);

      if (!username) {
        console.log('🔍 NFTs: No username provided, showing mock data for testing');
        // Test için mock data göster
        const mockProfile = {
          id: 'test',
          displayName: 'Test User',
          walletAddress: '0x1234567890abcdef',
          bio: 'Test user for NFT display',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          theme: 'green'
        };
        setProfile(mockProfile);
        
        // Mock NFT'leri göster
        const mockNFTs = [
          {
            id: '1',
            name: 'Forest Guardian #1',
            description: 'A mystical guardian of the digital forest',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
            collection: 'Forest Guardians',
            tokenId: '1',
            contractAddress: '0x123...abc',
            rarity: 'Rare',
            attributes: [
              { trait_type: 'Background', value: 'Forest' },
              { trait_type: 'Eyes', value: 'Glowing' },
              { trait_type: 'Power', value: '85' }
            ]
          },
          {
            id: '2',
            name: 'Digital Tree #42',
            description: 'A unique digital tree growing in the metaverse',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
            collection: 'Digital Nature',
            tokenId: '42',
            contractAddress: '0x456...def',
            rarity: 'Common',
            attributes: [
              { trait_type: 'Type', value: 'Oak' },
              { trait_type: 'Height', value: 'Tall' },
              { trait_type: 'Age', value: 'Ancient' }
            ]
          }
        ];
        setNfts(mockNFTs);
        return;
      }

      // Önce profil bilgilerini çek
      const profileData = await forest.getProfileByUsername(username);
      console.log('🔍 NFTs: Profile data:', profileData);
      
      if (!profileData) {
        setError('Profile not found');
        return;
      }
      setProfile(profileData);

      console.log('🔍 NFTs: Wallet address:', profileData.walletAddress);

      // NFT'leri çek
      const nftData = await forest.getNFTsByOwner(profileData.walletAddress);
      console.log('🔍 NFTs: NFT data:', nftData);
      setNfts(nftData);

      console.log('✅ NFTs: Loaded NFTs for user:', username, nftData.length);
    } catch (err) {
      console.error('❌ NFTs: Error loading NFTs:', err);
      setError('Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Background type="pixel-green" className="min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading NFTs...</p>
          </div>
        </div>
      </Background>
    );
  }

  if (error) {
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
              NFTs
            </h1>
          </div>
          <p className="text-white text-lg opacity-90">
            {nfts.length} NFT{nfts.length !== 1 ? 's' : ''} in collection
          </p>
        </div>

        {/* NFT Grid */}
        {nfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-2xl font-bold text-white mb-2">No NFTs Found</h3>
              <p className="text-white opacity-80">
                This user doesn't have any NFTs in their collection yet.
              </p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate(`/${username}`)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm"
          >
            ← Back to Profile
          </button>
        </div>
      </div>
    </Background>
  );
}
