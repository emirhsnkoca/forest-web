import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Button } from './Button';
import { Profile } from '../../forest';

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onUpdate: (displayName: string, bio: string, imageUrl: string, subdomain: string) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileUpdateModal({ 
  isOpen, 
  onClose, 
  profile, 
  onUpdate, 
  isLoading = false 
}: ProfileUpdateModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile değiştiğinde form'u güncelle
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setBio(profile.bio);
      setImageUrl(profile.image_url);
      setSubdomain(profile.subdomain);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setIsSubmitting(true);
      await onUpdate(displayName, bio, imageUrl, subdomain);
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Profile"
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Name */}
        <div>
          <Input
            label="Display Name"
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Bio */}
        <div>
          <Textarea
            label="Bio"
            placeholder="Tell the world about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={160}
            disabled={isSubmitting}
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

        {/* Profile Image */}
        <div>
          <Input
            label="Profile Image URL"
            placeholder="https://example.com/your-image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Add a link to your profile image
          </p>
        </div>

        {/* Subdomain */}
        <div>
          <Input
            label="Subdomain"
            placeholder="username.forest.ee"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Your Forest subdomain (e.g., username.forest.ee)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!displayName.trim() || isSubmitting || isLoading}
            className="flex-1"
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
