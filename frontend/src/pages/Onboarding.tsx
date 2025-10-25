import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
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
  FaSoundcloud,
  FaThreads,
  FaGlobe
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
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F', placeholder: '@username', urlPrefix: 'https://instagram.com/' },
  { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', placeholder: 'Phone number', urlPrefix: 'https://wa.me/' },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: '#000000', placeholder: '@username', urlPrefix: 'https://tiktok.com/@' },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000', placeholder: 'Channel URL', urlPrefix: '' },
  { id: 'website', name: 'Personal Website', icon: FaGlobe, color: '#000000', placeholder: 'URL', urlPrefix: '' },
  { id: 'spotify', name: 'Spotify', icon: FaSpotify, color: '#1DB954', placeholder: 'Artist URL', urlPrefix: '' },
  { id: 'threads', name: 'Threads', icon: FaThreads, color: '#000000', placeholder: '@username', urlPrefix: 'https://threads.net/@' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: '#1877F2', placeholder: 'Profile URL', urlPrefix: '' },
  { id: 'twitter', name: 'X', icon: FaXTwitter, color: '#000000', placeholder: '@username', urlPrefix: 'https://x.com/' },
  { id: 'soundcloud', name: 'SoundCloud', icon: FaSoundcloud, color: '#FF5500', placeholder: 'Profile URL', urlPrefix: '' },
  { id: 'snapchat', name: 'Snapchat', icon: FaSnapchat, color: '#FFFC00', placeholder: '@username', urlPrefix: '' },
  { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: '#E60023', placeholder: 'Profile URL', urlPrefix: '' },
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

  // SORUN BU SATIRLARDI - KALDIRILDI!
  // Wallet bağlı olmadan buraya zaten gelinemez, bu kontrol gereksiz
  // ve timing problemi yaratıyordu

  const handlePlatformToggle = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId));
    } else {
      if (selectedPlatforms.length < 5) {
        setSelectedPlatforms([...selectedPlatforms, platformId]);
      }
    }
  };

  const handleNext = () => setCurrentStep(currentStep + 1);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Navigation */}
      <div className="fixed top-4 left-0 right-0 px-6 flex justify-between items-center z-40">
        {currentStep > 1 && (
          <button onClick={handleBack} className="text-gray-700 hover:text-gray-900 font-medium">
            Back
          </button>
        )}
        <div className="flex-1" />
        {currentStep < 4 && (
          <button onClick={handleSkip} className="text-gray-700 hover:text-gray-900 font-medium">
            Skip
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {/* STEP 1: GOAL SELECTION */}
        {currentStep === 1 && (
          <div className="text-center pt-8">
            <h1 className="text-5xl font-bold mb-4">
              Which best describes your goal for using Linktree?
            </h1>
            <p className="text-gray-500 mb-16">This helps us personalize your experience.</p>

            <div className="space-y-4 mb-12">
              <GoalCard
                icon={<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-purple-600 flex items-center justify-center text-white text-3xl">🎨</div>}
                title="Creator"
                description="Build my following and explore ways to monetize my audience."
                selected={goal === 'creator'}
                onClick={() => setGoal('creator')}
              />
              <GoalCard
                icon={<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl">💼</div>}
                title="Business"
                description="Grow my business and reach more customers."
                selected={goal === 'business'}
                onClick={() => setGoal('business')}
              />
              <GoalCard
                icon={<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-3xl">👤</div>}
                title="Personal"
                description="Share links with my friends and acquaintances."
                selected={goal === 'personal'}
                onClick={() => setGoal('personal')}
              />
            </div>

            <Button onClick={handleNext} disabled={!goal} fullWidth className="max-w-md mx-auto">
              Continue
            </Button>
          </div>
        )}
  
        {/* STEP 2: PLATFORM SELECTION */}
        {currentStep === 2 && (
          <div className="text-center pt-8">
            <h1 className="text-5xl font-bold mb-4">Which platforms are you on?</h1>
            <p className="text-gray-500 mb-16">
              Pick up to five to get started. You can update at any time.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-12">
              {PLATFORMS.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  name={platform.name}
                  icon={platform.icon}
                  color={platform.color}
                  selected={selectedPlatforms.includes(platform.id)}
                  onClick={() => handlePlatformToggle(platform.id)}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={selectedPlatforms.length === 0}
              fullWidth
              className="max-w-md mx-auto"
            >
              Continue
            </Button>
          </div>
        )}

        {/* STEP 3: ADD LINKS */}
        {currentStep === 3 && (
          <div className="pt-8">
            <h1 className="text-5xl font-bold mb-4 text-center">Add your links</h1>
            <p className="text-gray-500 mb-12 text-center">
              Complete the fields below to add your content to your new Linktree.
            </p>

            <div className="max-w-lg mx-auto">
              <h3 className="font-semibold text-lg mb-4">Your selections</h3>
              <div className="space-y-3 mb-8">
                {selectedPlatforms.map((platformId) => {
                  const platform = PLATFORMS.find(p => p.id === platformId);
                  if (!platform) return null;
                  const Icon = platform.icon;
                  
                  return (
                    <div key={platformId} className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: platform.color }}
                      >
                        <Icon className="text-white text-xl" />
                      </div>
                      <Input
                        placeholder={platform.placeholder}
                        value={platformLinks[platformId] || ''}
                        onChange={(e) => setPlatformLinks({
                          ...platformLinks,
                          [platformId]: e.target.value
                        })}
                        className="flex-1"
                      />
                    </div>
                  );
                })}
              </div>

              <h3 className="font-semibold text-lg mb-4">Additional links</h3>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <FaGlobe className="text-gray-600 text-xl" />
                </div>
                <Input placeholder="url" className="flex-1" />
              </div>

              <Button onClick={handleNext} fullWidth>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: PROFILE DETAILS */}
        {currentStep === 4 && (
          <div className="pt-8">
            <h1 className="text-5xl font-bold mb-4 text-center">Add profile details</h1>
            <p className="text-gray-500 mb-12 text-center">
              Add your profile image, name, and bio.
            </p>

            <div className="max-w-lg mx-auto">
              {/* Profile Image */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                    {displayName ? (
                      <span className="text-4xl font-bold text-gray-600">
                        {displayName[0].toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-6xl text-gray-500">👤</span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-xl hover:bg-gray-800 transition-colors">
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <Input
                  label="Display Name"
                  placeholder="samcuu"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />

                <div>
                  <Textarea
                    label="Bio"
                    placeholder=""
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500 text-right mt-1">{bio.length}/160</p>
                </div>
              </div>

              <Button onClick={handleNext} fullWidth className="mt-8">
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: PREVIEW */}
        {currentStep === 5 && (
          <div className="pt-8 text-center">
            <h1 className="text-5xl font-bold mb-4">Looking good!</h1>
            <p className="text-gray-500 mb-4">
              Your Linktree is off to a great start.
            </p>
            <p className="text-gray-500 mb-12">
              Continue building to make it even better.
            </p>

            {/* Phone Mockup */}
            <div className="max-w-sm mx-auto mb-12">
              <div className="bg-gray-100 rounded-[3rem] p-4 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] p-6 min-h-[600px]">
                  {/* Profile Section */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {displayName ? (
                        <span className="text-2xl font-bold text-gray-600">
                          {displayName[0].toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-4xl">👤</span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2">
                      {displayName || 'samcuu'}
                    </h2>
                    {bio && <p className="text-sm text-gray-600 mb-4">{bio}</p>}
                    
                    {/* Social Icons */}
                    {selectedPlatforms.length > 0 && (
                      <div className="flex justify-center gap-3 mb-6">
                        {selectedPlatforms.slice(0, 2).map((platformId) => {
                          const platform = PLATFORMS.find(p => p.id === platformId);
                          if (!platform) return null;
                          const Icon = platform.icon;
                          return (
                            <div
                              key={platformId}
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: platform.color }}
                            >
                              <Icon className="text-white text-lg" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Link Preview */}
                  <div className="space-y-3">
                    {selectedPlatforms.slice(0, 1).map((platformId) => {
                      const platform = PLATFORMS.find(p => p.id === platformId);
                      if (!platform) return null;
                      const Icon = platform.icon;
                      
                      return (
                        <div
                          key={platformId}
                          className="p-4 rounded-xl flex items-center gap-3"
                          style={{ backgroundColor: platform.color }}
                        >
                          <Icon className="text-white text-2xl" />
                          <span className="text-white font-semibold text-lg">
                            {platform.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Menu dots */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleFinish} fullWidth className="max-w-md mx-auto">
              Continue building this Linktree
            </Button>
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
      className={`w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-6 ${
        selected
          ? 'border-primary bg-purple-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      {icon}
      <div className="flex-1">
        <h3 className="font-bold text-xl mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </button>
  );
}

function PlatformCard({ name, icon: Icon, color, selected, onClick }: {
  name: string;
  icon: any;
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 transition-all ${
        selected
          ? 'border-primary bg-purple-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Icon className="text-white text-2xl" />
        </div>
        <p className="text-sm font-semibold text-gray-900">{name}</p>
      </div>
    </button>
  );
}
