import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { SOCIAL_PLATFORMS } from '../constants/platforms';
import { Link } from '../types';

export function Onboarding() {
  const navigate = useNavigate();
  const { currentAccount } = useAuth();
  const { saveProfile } = useProfile(currentAccount?.address);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [customLinks, setCustomLinks] = useState<{ title: string; url: string }[]>([]);

  const handleAddCustomLink = () => {
    setCustomLinks([...customLinks, { title: '', url: '' }]);
  };

  const handleCustomLinkChange = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...customLinks];
    newLinks[index][field] = value;
    setCustomLinks(newLinks);
  };

  const handleRemoveCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const links: Link[] = [];

    // Add social links
    Object.entries(socialLinks).forEach(([platform, value]) => {
      if (value.trim()) {
        const platformData = SOCIAL_PLATFORMS.find(p => p.id === platform);
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

    // Add custom links
    customLinks.forEach((link, index) => {
      if (link.title.trim() && link.url.trim()) {
        links.push({
          id: `custom-${Date.now()}-${index}`,
          type: 'custom',
          title: link.title,
          url: link.url,
          isActive: true,
        });
      }
    });

    saveProfile({
      displayName: displayName || 'Anonymous',
      bio: bio || '',
      profileImage: profileImage || '',
      links,
    });

    navigate('/dashboard');
  };

  if (!currentAccount) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-2">Create Your Profile</h1>
          <p className="text-gray-600 text-center mb-8">
            Set up your Forest profile in just a few steps
          </p>

          <div className="space-y-6">
            {/* Profile Image */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                {displayName ? displayName[0].toUpperCase() : '👤'}
              </div>
              <Input
                type="text"
                placeholder="Profile image URL (optional)"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
            </div>

            {/* Display Name */}
            <Input
              label="Display Name"
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            {/* Bio */}
            <Textarea
              label="Bio"
              placeholder="Tell people about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={160}
            />
            <p className="text-sm text-gray-500 text-right">{bio.length}/160</p>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Social Links</h3>
              <div className="space-y-3">
                {SOCIAL_PLATFORMS.slice(0, 4).map((platform) => (
                  <Input
                    key={platform.id}
                    placeholder={`${platform.name} ${platform.placeholder}`}
                    value={socialLinks[platform.id] || ''}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, [platform.id]: e.target.value })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Custom Links */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Custom Links</h3>
                <button
                  onClick={handleAddCustomLink}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  + Add Link
                </button>
              </div>
              <div className="space-y-3">
                {customLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Title"
                      value={link.title}
                      onChange={(e) => handleCustomLinkChange(index, 'title', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)}
                      className="flex-1"
                    />
                    <button
                      onClick={() => handleRemoveCustomLink(index)}
                      className="text-red-500 hover:text-red-700 px-3"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button fullWidth onClick={handleSubmit}>
              Create Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}



