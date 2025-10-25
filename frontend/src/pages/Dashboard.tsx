import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Link } from '../types';
import { useDisconnectWallet } from '@mysten/dapp-kit';

export function Dashboard() {
  const navigate = useNavigate();
  const { currentAccount, isConnected } = useAuth();
  const { profile, saveProfile } = useProfile(currentAccount?.address);
  const { mutate: disconnect } = useDisconnectWallet();

  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    } else if (!profile) {
      navigate('/onboarding');
    }
  }, [isConnected, profile, navigate]);

  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;

    const newLink: Link = {
      id: `link-${Date.now()}`,
      type: 'custom',
      title: newLinkTitle,
      url: newLinkUrl,
      isActive: true,
    };

    saveProfile({
      ...profile,
      links: [...(profile?.links || []), newLink],
    });

    setNewLinkTitle('');
    setNewLinkUrl('');
    setIsAddLinkModalOpen(false);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setNewLinkTitle(link.title);
    setNewLinkUrl(link.url);
    setIsAddLinkModalOpen(true);
  };

  const handleUpdateLink = () => {
    if (!editingLink || !newLinkTitle.trim() || !newLinkUrl.trim()) return;

    const updatedLinks = profile?.links.map((link) =>
      link.id === editingLink.id
        ? { ...link, title: newLinkTitle, url: newLinkUrl }
        : link
    );

    saveProfile({
      ...profile,
      links: updatedLinks || [],
    });

    setEditingLink(null);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setIsAddLinkModalOpen(false);
  };

  const handleDeleteLink = (linkId: string) => {
    const updatedLinks = profile?.links.filter((link) => link.id !== linkId);
    saveProfile({
      ...profile,
      links: updatedLinks || [],
    });
  };

  const handleToggleLink = (linkId: string) => {
    const updatedLinks = profile?.links.map((link) =>
      link.id === linkId ? { ...link, isActive: !link.isActive } : link
    );
    saveProfile({
      ...profile,
      links: updatedLinks || [],
    });
  };

  const handleCloseModal = () => {
    setIsAddLinkModalOpen(false);
    setEditingLink(null);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  if (!profile) return null;

  const profileUrl = `${window.location.origin}/profile/${currentAccount?.address}`;

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
              onClick={() => navigate(`/profile/${currentAccount?.address}`)}
              className="text-primary hover:text-primary-dark font-medium"
            >
              View Profile
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
          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.displayName[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.displayName}</h2>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Your profile URL:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(profileUrl)}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Your Links</h3>
              <Button onClick={() => setIsAddLinkModalOpen(true)}>+ Add Link</Button>
            </div>

            <div className="space-y-3">
              {profile.links.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No links yet</p>
                  <p className="text-sm">Click "Add Link" to get started</p>
                </div>
              ) : (
                profile.links.map((link) => (
                  <div
                    key={link.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg ${
                      link.isActive ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleLink(link.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        link.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className="text-white">
                        {link.isActive ? '✓' : '○'}
                      </span>
                    </button>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{link.title}</p>
                      <p className="text-sm text-gray-500 truncate">{link.url}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditLink(link)}
                        className="px-3 py-1 text-primary hover:bg-purple-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Link Modal */}
      <Modal
        isOpen={isAddLinkModalOpen}
        onClose={handleCloseModal}
        title={editingLink ? 'Edit Link' : 'Add New Link'}
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="My Website"
            value={newLinkTitle}
            onChange={(e) => setNewLinkTitle(e.target.value)}
          />
          <Input
            label="URL"
            placeholder="https://example.com"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
          />
          <Button
            fullWidth
            onClick={editingLink ? handleUpdateLink : handleAddLink}
          >
            {editingLink ? 'Update Link' : 'Add Link'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}



