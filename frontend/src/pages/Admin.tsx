import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Link } from '../types';

interface Web3Link extends Link {
  type: 'wallet' | 'nft' | 'defi' | 'social' | 'custom';
  blockchain?: string;
  contractAddress?: string;
  tokenId?: string;
}

export function Admin() {
  const navigate = useNavigate();
  const { currentAccount, isConnected } = useAuth();
  
  const [activeTab, setActiveTab] = useState('links');
  const [links, setLinks] = useState<Web3Link[]>([]);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Web3Link | null>(null);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    type: 'custom' as const,
    blockchain: '',
    contractAddress: '',
    tokenId: ''
  });

  const [profileSettings, setProfileSettings] = useState({
    displayName: 'samcuu',
    bio: 'Web3 Developer & NFT Collector',
    profileImage: '',
    ensName: '',
    customDomain: 'samcuu.forest.ee'
  });

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    loadMockData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const loadMockData = () => {
    setLinks([
      {
        id: '1',
        type: 'wallet',
        title: 'My Wallet',
        url: 'https://sui.blockscout.com/address/0x123...abc',
        isActive: true,
        blockchain: 'Sui'
      },
      {
        id: '2',
        type: 'nft',
        title: 'NFT Collection',
        url: 'https://opensea.io/collection/my-nfts',
        isActive: true,
        blockchain: 'Ethereum',
        contractAddress: '0x123...def'
      },
      {
        id: '3',
        type: 'defi',
        title: 'DeFi Portfolio',
        url: 'https://defi.llama.fi/portfolio/0x123...abc',
        isActive: true,
        blockchain: 'Ethereum'
      },
      {
        id: '4',
        type: 'social',
        title: 'Twitter',
        url: 'https://twitter.com/samcuu',
        isActive: true
      },
      {
        id: '5',
        type: 'custom',
        title: 'Personal Website',
        url: 'https://samcuu.com',
        isActive: false
      }
    ]);
  };

  const handleAddLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;

    const link: Web3Link = {
      id: `link-${Date.now()}`,
      type: newLink.type,
      title: newLink.title,
      url: newLink.url,
      isActive: true,
      blockchain: newLink.blockchain,
      contractAddress: newLink.contractAddress,
      tokenId: newLink.tokenId
    };

    setLinks([...links, link]);
    setNewLink({ title: '', url: '', type: 'custom', blockchain: '', contractAddress: '', tokenId: '' });
    setIsAddLinkModalOpen(false);
  };

  const handleEditLink = (link: Web3Link) => {
    setEditingLink(link);
    setNewLink({
      title: link.title,
      url: link.url,
      type: link.type,
      blockchain: link.blockchain || '',
      contractAddress: link.contractAddress || '',
      tokenId: link.tokenId || ''
    });
    setIsAddLinkModalOpen(true);
  };

  const handleUpdateLink = () => {
    if (!editingLink) return;

    const updatedLinks = links.map(link =>
      link.id === editingLink.id
        ? { ...link, ...newLink, blockchain: newLink.blockchain, contractAddress: newLink.contractAddress, tokenId: newLink.tokenId }
        : link
    );

    setLinks(updatedLinks);
    setEditingLink(null);
    setNewLink({ title: '', url: '', type: 'custom', blockchain: '', contractAddress: '', tokenId: '' });
    setIsAddLinkModalOpen(false);
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks(links.filter(link => link.id !== linkId));
  };

  const handleToggleLink = (linkId: string) => {
    setLinks(links.map(link =>
      link.id === linkId ? { ...link, isActive: !link.isActive } : link
    ));
  };

  const handleCloseModal = () => {
    setIsAddLinkModalOpen(false);
    setEditingLink(null);
    setNewLink({ title: '', url: '', type: 'custom', blockchain: '', contractAddress: '', tokenId: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gray-800 text-white py-2 px-4 text-center text-sm">
        <span>🌲 Try Forest Pro for free</span>
        <button className="ml-4 bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs font-medium">
          Upgrade
        </button>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🌲</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Forest</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">👤</span>
                </div>
                <span className="font-medium text-gray-900">{profileSettings.displayName}</span>
                <span className="text-gray-400">▼</span>
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {/* User Profile Section */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-lg">👤</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{profileSettings.displayName}</h3>
                        <p className="text-sm text-gray-600">forest.ee/{profileSettings.displayName}</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Free
                      </div>
                    </div>
                  </div>

                  {/* Navigation Options */}
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        setIsAddLinkModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">+</span>
                      </div>
                      <span className="font-medium text-gray-900">Create new Forest</span>
                    </button>

                    <button 
                      onClick={() => {
                        setIsSettingsModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">👤</span>
                      </div>
                      <span className="font-medium text-gray-900">Account</span>
                    </button>

                    <button 
                      onClick={() => {
                        // Handle upgrade
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">⚡</span>
                      </div>
                      <span className="font-medium text-gray-900">Upgrade</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              ⚙️
            </button>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <span className="text-sm text-gray-600">forest.ee/{profileSettings.displayName}</span>
              <button className="text-gray-600 hover:text-gray-900">📤</button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            {/* User Profile */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600">👤</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{profileSettings.displayName}</p>
                <p className="text-sm text-gray-500">▼</p>
              </div>
              <button className="ml-auto text-gray-600 hover:text-gray-900">🔔</button>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">My Forest</h3>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'links' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('links')}
                >
                  Links
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  NFT Gallery
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  DeFi Portfolio
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Analytics
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Audience
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Insights
                </button>
              </div>

            </nav>

            {/* Setup Checklist */}
            <div className="mt-8 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  83%
                </div>
                <span className="text-sm font-medium text-gray-900">Your setup checklist</span>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Connect wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Add profile info</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">○</span>
                  <span>Add your first link</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 p-6">
          <div className="max-w-4xl">
            {/* Profile Header */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">👤</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profileSettings.displayName}</h2>
                  <p className="text-gray-600">{profileSettings.bio}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <span>📱</span>
                  <span>Twitter</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <span>💬</span>
                  <span>Discord</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <span>+</span>
                </button>
              </div>

              <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>📱</span>
                  <span className="font-medium text-purple-900">Put your Forest in your bio</span>
                </div>
                <p className="text-sm text-purple-700">Add forest.ee/{profileSettings.displayName} to your social media bios</p>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setIsAddLinkModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  <span className="mr-2">+</span>
                  Add
                </Button>
                <div className="flex gap-2">
                  <button className="text-sm text-gray-600 hover:text-gray-900">Add collection</button>
                  <span className="text-gray-300">|</span>
                  <button className="text-sm text-gray-600 hover:text-gray-900">View archive</button>
                </div>
              </div>
            </div>

            {/* Links Management */}
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleLink(link.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            link.isActive 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300'
                          }`}
                        >
                          {link.isActive && <span className="text-white text-xs">✓</span>}
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{link.title}</span>
                          {link.type === 'wallet' && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Wallet</span>}
                          {link.type === 'nft' && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">NFT</span>}
                          {link.type === 'defi' && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">DeFi</span>}
                          {link.type === 'social' && <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">Social</span>}
                        </div>
                        <p className="text-sm text-gray-500">{link.url}</p>
                        {link.blockchain && (
                          <p className="text-xs text-gray-400 mt-1">Blockchain: {link.blockchain}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditLink(link)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Forest Footer */}
            <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">🌲</span>
                  </div>
                  <span className="font-medium text-gray-900">Forest footer</span>
                </div>
                <button
                  className={`w-12 h-6 rounded-full border-2 flex items-center justify-center ${
                    true 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {true && <span className="text-white text-xs">✓</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Mobile Preview */}
        <div className="w-80 bg-gray-100 p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-200 h-8 flex items-center justify-center">
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">👤</span>
                </div>
                <h3 className="font-bold text-gray-900">{profileSettings.displayName}</h3>
                <p className="text-sm text-gray-600">{profileSettings.bio}</p>
              </div>
              
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {links.filter(link => link.isActive).map((link) => (
                  <button 
                    key={link.id}
                    className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-3 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {link.type === 'wallet' && <span>💰</span>}
                      {link.type === 'nft' && <span>🖼️</span>}
                      {link.type === 'defi' && <span>📈</span>}
                      {link.type === 'social' && <span>📱</span>}
                      {link.type === 'custom' && <span>🔗</span>}
                      <span className="font-medium text-gray-900">{link.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Link Modal */}
      <Modal
        isOpen={isAddLinkModalOpen}
        onClose={handleCloseModal}
        title={editingLink ? 'Edit Link' : 'Add New Link'}
        size="large"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link Type</label>
            <select
              value={newLink.type}
              onChange={(e) => setNewLink({ ...newLink, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="custom">Custom Link</option>
              <option value="wallet">Wallet</option>
              <option value="nft">NFT Collection</option>
              <option value="defi">DeFi Portfolio</option>
              <option value="social">Social Media</option>
            </select>
          </div>

          <Input
            label="Title"
            placeholder="My Website"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          />

          <Input
            label="URL"
            placeholder="https://example.com"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          />

          {(newLink.type === 'wallet' || newLink.type === 'nft' || newLink.type === 'defi') && (
            <>
              <Input
                label="Blockchain"
                placeholder="Ethereum, Sui, Solana..."
                value={newLink.blockchain}
                onChange={(e) => setNewLink({ ...newLink, blockchain: e.target.value })}
              />
              
              {newLink.type === 'nft' && (
                <>
                  <Input
                    label="Contract Address"
                    placeholder="0x123...abc"
                    value={newLink.contractAddress}
                    onChange={(e) => setNewLink({ ...newLink, contractAddress: e.target.value })}
                  />
                  <Input
                    label="Token ID (Optional)"
                    placeholder="123"
                    value={newLink.tokenId}
                    onChange={(e) => setNewLink({ ...newLink, tokenId: e.target.value })}
                  />
                </>
              )}
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={editingLink ? handleUpdateLink : handleAddLink}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {editingLink ? 'Update Link' : 'Add Link'}
            </Button>
            <Button onClick={handleCloseModal} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
