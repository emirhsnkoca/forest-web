import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Background } from '../components/common/Background';
import Confetti from 'react-confetti';
import { Link } from '../types';
import { 
  FaInstagram, 
  FaWhatsapp, 
  FaTiktok, 
  FaYoutube, 
  FaSpotify, 
  FaFacebook, 
  FaSnapchat, 
  FaPinterest,
  FaThreads,
  FaGlobe,
  FaTelegram
} from 'react-icons/fa6';
import { FaXTwitter } from 'react-icons/fa6';

type Goal = 'creator' | 'business' | 'personal' | null;

interface Platform {
  id: string;
  name: string;
  icon: any;
  color: string;
  placeholder: string;
  urlPrefix?: string;
}

const PLATFORMS: Platform[] = [
  // Row 1
  { id: 'twitter', name: 'X', icon: FaXTwitter, color: '#000000', placeholder: '@username', urlPrefix: 'https://x.com/' },
  { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: '#0088CC', placeholder: '@username', urlPrefix: 'https://t.me/' },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000', placeholder: 'Channel URL', urlPrefix: '' },
  // Row 2
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F', placeholder: '@username', urlPrefix: 'https://instagram.com/' },
  { id: 'website', name: 'Personal Website', icon: FaGlobe, color: '#4A7C25', placeholder: 'URL', urlPrefix: '' },
  { id: 'spotify', name: 'Spotify', icon: FaSpotify, color: '#1DB954', placeholder: 'Artist URL', urlPrefix: '' },
  // Row 3
  { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', placeholder: 'Phone number', urlPrefix: 'https://wa.me/' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: '#1877F2', placeholder: 'Profile URL', urlPrefix: '' },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: '#000000', placeholder: '@username', urlPrefix: 'https://tiktok.com/@' },
  // Row 4
  { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: '#E60023', placeholder: 'Profile URL', urlPrefix: '' },
  { id: 'threads', name: 'Threads', icon: FaThreads, color: '#000000', placeholder: '@username', urlPrefix: 'https://threads.net/@' },
  { id: 'snapchat', name: 'Snapchat', icon: FaSnapchat, color: '#FFFC00', placeholder: '@username', urlPrefix: '' },
];

export function Onboarding() {
  const navigate = useNavigate();
  const { currentAccount } = useAuth();
  const { saveProfile } = useProfile(currentAccount?.address);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [goal, setGoal] = useState<Goal>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformLinks, setPlatformLinks] = useState<Record<string, string>>({});
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Confetti effect on preview step
  useEffect(() => {
    if (currentStep === 5) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // 5 saniye sonra dur
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Window resize için confetti boyutları
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePlatformToggle = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId));
    } else {
      if (selectedPlatforms.length < 5) {
        setSelectedPlatforms([...selectedPlatforms, platformId]);
      }
    }
  };

  const handleNext = () => {
    console.log('handleNext - current step:', currentStep, '-> next:', currentStep + 1);
    setCurrentStep(currentStep + 1);
  };
  const handleBack = () => setCurrentStep(currentStep - 1);
  const handleSkip = () => setCurrentStep(currentStep + 1);

  const handleFinish = () => {
    const links: Link[] = [];

    Object.entries(platformLinks).forEach(([platform, value]) => {
      if (value.trim()) {
        const platformData = PLATFORMS.find(p => p.id === platform);
        const url = platformData?.urlPrefix ? platformData.urlPrefix + value.replace(/^@/, '') : value;
        links.push({
          id: `${platform}-${Date.now()}`,
          type: 'social',
          platform,
          title: platformData?.name || platform,
          url,
          isActive: true,
        });
      }
    });

    saveProfile({
      displayName: displayName || 'Anonymous',
      bio: bio || '',
      profileImage: '',
      links,
    });

    navigate('/admin');
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  // Background type değişiyor her step'te
  const getBackgroundType = (): 'pixel-earth' | 'pixel-water' | 'pixel-grass' | 'plain' => {
    if (currentStep === 1) return 'pixel-earth'; // Goal Selection - Kahverengi toprak pixel
    if (currentStep === 2) return 'pixel-water'; // Platform Selection - Mavi su pixel
    if (currentStep === 3) return 'pixel-grass'; // Add Links - Yeşil çimen pixel
    if (currentStep === 4) return 'pixel-grass'; // Profile Details - Yeşil çimen
    if (currentStep === 5) return 'plain'; // Preview - Sade beyaz
    return 'plain';
  };

  // Debug logging removed - was causing render issues

  return (
    <div className="min-h-screen relative" style={currentStep === 5 ? { backgroundColor: 'white' } : undefined}>
      {/* Dynamic Background - disabled for Step 5 to avoid render issues */}
      {currentStep !== 5 && <Background type={getBackgroundType()} />}

      {/* Confetti Effect - temporarily disabled to test */}
      {false && showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          colors={['#4A7C25', '#6B9F3D', '#7D5A3F', '#2A7F99', '#3BA0C1']}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      {/* Progress Bar - Forest Theme */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-black/10 backdrop-blur-sm z-50 shadow-sm">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Step Indicator */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-primary/20">
          <span className="text-sm font-semibold text-primary">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed top-6 left-0 right-0 px-6 flex justify-between items-center z-40">
        {currentStep > 1 ? (
          <button 
            onClick={handleBack} 
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-earth/20"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-medium text-earth-dark">Back</span>
          </button>
        ) : (
          <div></div>
        )}
        
        {currentStep < 4 ? (
          <button 
            onClick={handleSkip} 
            className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 font-medium text-primary hover:text-primary-dark border border-primary/20"
          >
            Skip
          </button>
        ) : (
          <div></div>
        )}
      </div>

      <div className="container mx-auto px-4 py-16 max-w-2xl relative z-10">
        {/* STEP 1: GOAL SELECTION */}
        {currentStep === 1 && (
          <div className="text-center pt-12 animate-fade-in">
            {/* Forest Icon */}
            <div className="text-7xl mb-6 animate-bounce-slow">🌲</div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.7)' }}>
              Which best describes your goal for using Forest?
            </h1>
            <p className="text-white text-lg mb-16 font-medium drop-shadow-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              This helps us personalize your Web3 experience.
            </p>

            <div className="space-y-4 mb-12">
              <GoalCard
                icon={
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-light to-accent flex items-center justify-center text-white text-4xl shadow-lg">
                    🎨
                  </div>
                }
                title="Creator"
                description="Build my following and explore ways to monetize my audience."
                selected={goal === 'creator'}
                onClick={() => setGoal('creator')}
              />
              <GoalCard
                icon={
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-earth to-earth-dark flex items-center justify-center text-white text-4xl shadow-lg">
                    💼
                  </div>
                }
                title="Business"
                description="Grow my business and reach more customers."
                selected={goal === 'business'}
                onClick={() => setGoal('business')}
              />
              <GoalCard
                icon={
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-dark to-primary-dark flex items-center justify-center text-white text-4xl shadow-lg">
                    👤
                  </div>
                }
                title="Personal"
                description="Share links with my friends and acquaintances."
                selected={goal === 'personal'}
                onClick={() => setGoal('personal')}
              />
            </div>

            <Button 
              onClick={handleNext} 
              disabled={!goal} 
              fullWidth 
              className="max-w-md mx-auto !bg-white !text-primary hover:!bg-white/90 !shadow-xl !py-4 !text-lg !font-bold disabled:!opacity-50 disabled:!cursor-not-allowed"
            >
              Continue to Platforms →
            </Button>
          </div>
        )}
  
        {/* STEP 2: PLATFORM SELECTION */}
        {currentStep === 2 && (
          <div className="text-center pt-12 animate-fade-in">
            <div className="text-6xl mb-6 animate-bounce-slow">🌊</div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.7)' }}>
              Which platforms are you on?
            </h1>
            <p className="text-white text-lg mb-4 font-medium drop-shadow-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              Pick up to five to get started. You can update at any time.
            </p>
            <p className="text-white text-sm mb-12 font-semibold drop-shadow-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              Selected: {selectedPlatforms.length}/5
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-12">
              {PLATFORMS.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  name={platform.name}
                  icon={platform.icon}
                  color={platform.color}
                  selected={selectedPlatforms.includes(platform.id)}
                  disabled={!selectedPlatforms.includes(platform.id) && selectedPlatforms.length >= 5}
                  onClick={() => handlePlatformToggle(platform.id)}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={selectedPlatforms.length === 0}
              fullWidth
              className="max-w-md mx-auto !bg-white !text-primary hover:!bg-white/90 !shadow-xl !py-4 !text-lg !font-bold disabled:!opacity-50 disabled:!cursor-not-allowed"
            >
              Continue to Links →
            </Button>
          </div>
        )}

        {/* STEP 3: ADD LINKS */}
        {currentStep === 3 && (
          <div className="pt-12 animate-fade-in">
            <div className="text-center mb-12">
              <div className="text-6xl mb-6 animate-bounce-slow">🔗</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.7)' }}>
                Add your links
              </h1>
              <p className="text-white text-lg font-medium drop-shadow-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                Complete the fields below to add your content to your new Forest profile.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
                <h3 className="font-semibold text-lg md:text-xl mb-6 text-primary flex items-center gap-2">
                  <span>🌿</span>
                  Your selections
                </h3>
                <div className="space-y-4">
                  {selectedPlatforms.map((platformId) => {
                    const platform = PLATFORMS.find(p => p.id === platformId);
                    if (!platform) return null;
                    const Icon = platform.icon;
                    
                    return (
                      <div key={platformId} className="flex items-center gap-3 animate-slide-up">
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white"
                          style={{ backgroundColor: platform.color }}
                        >
                          <Icon className="text-white text-2xl" />
                        </div>
                        <Input
                          placeholder={platform.placeholder}
                          value={platformLinks[platformId] || ''}
                          onChange={(e) => setPlatformLinks({
                            ...platformLinks,
                            [platformId]: e.target.value
                          })}
                          className="flex-1 !border-2 !border-primary/20 focus:!border-primary"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
                <h3 className="font-semibold text-lg md:text-xl mb-6 text-accent flex items-center gap-2">
                  <span>🌐</span>
                  Additional links
                  <span className="text-xs text-gray-500 font-normal">(optional)</span>
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white">
                    <FaGlobe className="text-white text-2xl" />
                  </div>
                  <Input 
                    placeholder="https://yourwebsite.com" 
                    className="flex-1 !border-2 !border-accent/20 focus:!border-accent" 
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                fullWidth
                className="!bg-white !text-primary hover:!bg-white/90 !shadow-xl !py-4 !text-lg !font-bold"
              >
                Continue to Profile Details →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: PROFILE DETAILS */}
        {currentStep === 4 && (
          <div className="pt-12 animate-fade-in">
            <div className="text-center mb-12">
              <div className="text-6xl mb-6 animate-bounce-slow">✨</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.7)' }}>
                Add profile details
              </h1>
              <p className="text-white text-lg font-medium drop-shadow-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                Personalize your Forest profile with your image, name, and bio.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8">
                {/* Profile Image */}
                <div className="flex justify-center mb-8">
                  <div className="relative group">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/50 transition-transform group-hover:scale-105">
                      {displayName ? (
                        <span className="text-5xl font-bold text-white">
                          {displayName[0].toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-6xl">👤</span>
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-2xl hover:bg-primary-dark transition-all shadow-lg hover:scale-110 ring-4 ring-white">
                      📷
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Display Name *
                    </label>
                    <Input
                      placeholder="Enter your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="!border-2 !border-primary/20 focus:!border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Bio
                    </label>
                    <Textarea
                      placeholder="Tell the world about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      maxLength={160}
                      className="!border-2 !border-primary/20 focus:!border-primary resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        Optional, but recommended
                      </p>
                      <p className={`text-sm font-medium ${
                        bio.length > 150 ? 'text-red-500' : 'text-primary'
                      }`}>
                        {bio.length}/160
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleNext} 
                  fullWidth 
                  className="mt-8 !bg-primary !text-white hover:!bg-primary-dark !shadow-xl !py-4 !text-lg !font-bold"
                >
                  Preview My Profile →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PREVIEW */}
        {currentStep === 5 && (
          <div style={{ paddingTop: '32px', textAlign: 'center', minHeight: '100vh', backgroundColor: 'white' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: '#1F2937' }}>
              Looking good!
            </h1>
            <p style={{ color: '#6B7280', marginBottom: '16px' }}>
              Your Forest profile is off to a great start.
            </p>
            <p style={{ color: '#6B7280', marginBottom: '48px' }}>
              Continue building to make it even better.
            </p>

            <div style={{ maxWidth: '384px', margin: '0 auto 48px' }}>
              <div style={{ backgroundColor: '#F3F4F6', borderRadius: '48px', padding: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '40px', padding: '24px', minHeight: '600px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#D1D5DB', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {displayName ? (
                        <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#4B5563' }}>
                          {displayName[0].toUpperCase()}
                        </span>
                      ) : (
                        <span style={{ fontSize: '48px' }}>👤</span>
                      )}
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#4A7C25', marginBottom: '8px' }}>
                      {displayName || 'Your Name'}
                    </h2>
                    {bio && <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '16px' }}>{bio}</p>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedPlatforms.slice(0, 3).map((platformId) => {
                      const platform = PLATFORMS.find(p => p.id === platformId);
                      if (!platform) return null;
                      
                      return (
                        <div
                          key={platformId}
                          style={{ 
                            padding: '16px', 
                            borderRadius: '12px', 
                            backgroundColor: platform.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
                            {platform.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleFinish}
              style={{
                width: '100%',
                maxWidth: '448px',
                margin: '0 auto',
                display: 'block',
                padding: '12px 24px',
                borderRadius: '9999px',
                fontWeight: '600',
                backgroundColor: '#4A7C25',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Continue building this Linktree
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GoalCard({ icon, title, description, selected, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 md:p-8 rounded-3xl border-3 transition-all duration-300 text-left flex items-center gap-6 transform hover:scale-[1.02] ${
        selected
          ? 'border-primary bg-white shadow-2xl scale-[1.02]'
          : 'border-white/40 bg-white/95 backdrop-blur-sm hover:bg-white hover:border-white/70 shadow-xl'
      }`}
    >
      <div className="flex-shrink-0 animate-scale-in">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className={`font-bold text-xl md:text-2xl mb-2 ${selected ? 'text-primary' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-sm md:text-base ${selected ? 'text-gray-700' : 'text-gray-700'}`}>
          {description}
        </p>
      </div>
      {selected && (
        <div className="flex-shrink-0 text-3xl animate-scale-in">
          ✅
        </div>
      )}
    </button>
  );
}

function PlatformCard({ name, icon: Icon, color, selected, disabled, onClick }: {
  name: string;
  icon: any;
  color: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 transform ${
        selected
          ? 'border-primary-light bg-white shadow-2xl scale-105 ring-4 ring-primary/30'
          : disabled
          ? 'border-white/20 bg-white/5 backdrop-blur-sm opacity-50 cursor-not-allowed'
          : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-primary-light hover:shadow-2xl hover:scale-105 hover:ring-2 hover:ring-primary/40 shadow-lg'
      }`}
    >
      <div className="flex flex-col items-center gap-2 md:gap-3">
        {/* TAM YUVARLAK LOGO */}
        <div 
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl transition-transform ${
            selected ? 'scale-110 ring-4 ring-white/50' : ''
          }`}
          style={{ backgroundColor: disabled ? '#9CA3AF' : color }}
        >
          <Icon className="text-white text-2xl md:text-3xl" />
        </div>
        <p className={`text-xs md:text-sm font-semibold ${
          selected ? 'text-gray-900' : 'text-white drop-shadow-lg'
        }`}>
          {name}
        </p>
        {selected && (
          <div className="absolute top-2 right-2 text-2xl animate-scale-in">
            ✅
          </div>
        )}
      </div>
    </button>
  );
}
