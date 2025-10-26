import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { forest } from '../forest';

interface Web3Link {
  id: number;
  profile_id: string;
  type: 'wallet' | 'nft' | 'defi' | 'social' | 'custom';
  title: string;
  url: string;
  icon: string;
  banner: string;
  is_active: boolean;
  order: number;
  blockchain?: string;
  contractAddress?: string;
  tokenId?: string;
  platform?: string;
}

export function Admin() {
  const navigate = useNavigate();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [activeTab, setActiveTab] = useState('links');
  const [links, setLinks] = useState<Web3Link[]>([]);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Web3Link | null>(null);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: '',
    banner: '',
    type: 'custom' as 'wallet' | 'nft' | 'defi' | 'social' | 'custom',
    blockchain: '',
    contractAddress: '',
    tokenId: ''
  });

  const [profileSettings, setProfileSettings] = useState({
    displayName: '',
    bio: '',
    profileImage: '',
    ensName: '',
    customDomain: ''
  });

  const [profileId, setProfileId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadProfileData();
  }, []);

  // Profil verilerini akıllı kontraktan yükle
  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const storedProfileId = localStorage.getItem('forest_profile_id');
      console.log('🔍 Admin: Stored Profile ID:', storedProfileId);
      
      if (!storedProfileId) {
        setError('Profil bulunamadı. Lütfen önce profil oluşturun.');
        return;
      }

      setProfileId(storedProfileId);
      
      let profileData = await forest.getProfile(storedProfileId);
      console.log('🔍 Admin: Profile data received:', profileData);
      
      if (!profileData && storedProfileId.startsWith('temp_')) {
        console.log('🔍 Admin: Using localStorage data for temporary ID:', storedProfileId);
        const userData = localStorage.getItem('forest_user_data');
        if (userData) {
          const parsedData = JSON.parse(userData);
          profileData = {
            id: storedProfileId,
            owner: '',
            username: parsedData.username || 'user',
            display_name: parsedData.displayName || 'Anonymous',
            bio: parsedData.bio || '',
            image_url: parsedData.imageUrl || '',
            subdomain: parsedData.subdomain || 'user.forest.ee',
            link_ids: [],
            next_link_id: 0,
            link_count: 0,
          };
        } else {
          profileData = {
            id: storedProfileId,
            owner: '',
            username: 'user',
            display_name: 'Anonymous',
            bio: '',
            image_url: '',
            subdomain: 'user.forest.ee',
            link_ids: [],
            next_link_id: 0,
            link_count: 0,
          };
        }
      }
      
      if (!profileData) {
        console.error('❌ Admin: Profile not found on blockchain for ID:', storedProfileId);
        setError('Profil blockchain\'de bulunamadı. Lütfen önce profil oluşturun.');
        return;
      }
      
      const profileLinks = await forest.getProfileLinks(storedProfileId);
      
      const web3Links: Web3Link[] = profileLinks.map(link => ({
        id: link.id,
        profile_id: storedProfileId,
        type: 'custom',
        title: link.title,
        url: link.url,
        icon: link.icon,
        banner: link.banner,
        is_active: link.is_active,
        order: link.order,
      }));
      
      setLinks(web3Links);
      setProfileSettings({
        displayName: profileData.display_name,
        bio: profileData.bio,
        profileImage: profileData.image_url,
        ensName: '',
        customDomain: profileData.subdomain || `${profileData.username}.forest.ee`
      });
      
      console.log('✅ Admin: Profile data loaded successfully:', {
        displayName: profileData.display_name,
        bio: profileData.bio,
        imageUrl: profileData.image_url,
        subdomain: profileData.subdomain,
        linkCount: web3Links.length
      });
      
    } catch (err) {
      console.error('Profil verileri yüklenirken hata:', err);
      setError('Profil verileri yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Link ekleme fonksiyonu - akıllı kontraktla
  const handleAddLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      setError('Lütfen başlık ve URL alanlarını doldurun.');
      return;
    }
    if (!profileId) {
      setError('Profil ID bulunamadı.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      console.log('🔍 Admin: Adding new link:', {
        profileId,
        title: newLink.title,
        url: newLink.url,
        icon: newLink.icon || '🔗',
        banner: newLink.banner || ''
      });

      const result = await forest.addLinkWithDappKit(
        profileId,
        newLink.title,
        newLink.url,
        newLink.icon || '🔗',
        newLink.banner || '',
        signAndExecuteTransaction
      );

      console.log('✅ Admin: Link added successfully:', result);

      if (result.linkId !== undefined) {
        await loadProfileData();
        setNewLink({ title: '', url: '', icon: '', banner: '', type: 'custom', blockchain: '', contractAddress: '', tokenId: '' });
        setIsAddLinkModalOpen(false);
        console.log('✅ Admin: Link added and UI updated');
      }
    } catch (err) {
      console.error('❌ Admin: Link eklenirken hata:', err);
      const errorMessage = err instanceof Error ? err.message : 'Link eklenirken bir hata oluştu.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddLinkModalOpen(false);
    setEditingLink(null);
    setNewLink({ title: '', url: '', icon: '', banner: '', type: 'custom', blockchain: '', contractAddress: '', tokenId: '' });
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Top Banner */}
      <div className="bg-gray-800 text-white py-3 px-6 flex justify-between items-center">
        <span className="text-sm">Try Pro for free — our most popular plan for content creators and businesses.</span>
        <button 
          type="button"
          onClick={() => window.location.href = '/upgrade'}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Upgrade
        </button>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-amber-100 border-r border-amber-200 flex flex-col min-h-screen">
          {/* User Profile Section */}
          <div className="p-4 border-b border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center overflow-hidden">
                {profileSettings.profileImage ? (
                  <img 
                    src={profileSettings.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-amber-700">👤</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">{profileSettings.displayName}</h3>
                <p className="text-xs text-gray-500">▼</p>
              </div>
              <button className="text-gray-600 hover:text-gray-900">🔔</button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 p-4">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">My Forest</h3>
              <button 
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'links' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-amber-50'
                }`}
                onClick={() => setActiveTab('links')}
                type="button"
              >
                Links
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50"
                type="button"
              >
                Shop
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50"
                type="button"
              >
                Design
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50"
                type="button"
              >
                Earn
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50"
                type="button"
              >
                Audience
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50"
                type="button"
              >
                Insights
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tools</h3>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50"
                type="button"
              >
                Social planner
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50"
                type="button"
              >
                Instagram auto-reply
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50"
                type="button"
              >
                Link shortener
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50"
                type="button"
              >
                Post ideas
              </button>
            </div>
          </div>

          {/* Setup Checklist */}
          <div className="p-4 border-t border-amber-200">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  33%
                </div>
                <span className="text-sm font-medium text-gray-900">Your setup checklist</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">2 of 6 complete</p>
              <button className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                Finish setup
              </button>
            </div>
          </div>

          {/* Help Icons */}
          <div className="p-4 border-t border-amber-200">
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-gray-700">❓</button>
              <button className="text-gray-500 hover:text-gray-700">⚙️</button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Links</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <span>✨</span>
                  <span className="text-sm font-medium">Enhance</span>
                </button>
                <button className="text-gray-600 hover:text-gray-900">⚙️</button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">⚠️</span>
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-blue-800 font-medium">İşlem yapılıyor...</span>
                </div>
              </div>
            )}

            {/* Profile Section */}
            <div className="bg-amber-50 rounded-lg p-6 mb-6 border border-amber-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileSettings.profileImage ? (
                    <img 
                      src={profileSettings.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-amber-700 text-2xl">👤</span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {profileSettings.displayName || 'Yükleniyor...'}
                  </h2>
                  <p className="text-gray-600">
                    {profileSettings.bio || 'Add bio'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg">📷</span>
                    <span className="text-lg">+</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => setIsAddLinkModalOpen(true)}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-medium shadow-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  <span className="mr-2">+</span>
                  {isLoading ? 'Yükleniyor...' : 'Add'}
                </Button>
              </div>

              <div className="flex gap-4 mt-4">
                <Button 
                  variant="outline"
                  className="px-4 py-2 rounded-lg font-medium border-amber-300 text-gray-700 hover:bg-amber-100"
                >
                  <span className="mr-2">📁</span>
                  Add collection
                </Button>
                <Button 
                  variant="outline"
                  className="px-4 py-2 rounded-lg font-medium border-amber-300 text-gray-700 hover:bg-amber-100 ml-auto"
                >
                  View archive &gt;
                </Button>
              </div>
            </div>

            {/* Links Section */}
            <div className="space-y-3">
              {links.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No links yet</p>
                  <Button
                    onClick={() => setIsAddLinkModalOpen(true)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Add Your First Link
                  </Button>
                </div>
              ) : (
                links.map((link) => (
                  <div
                    key={link.id}
                    className="bg-amber-50 rounded-lg p-4 border border-amber-200 hover:border-green-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{link.icon || '🔗'}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{link.title}</h3>
                            <button className="text-gray-400 hover:text-gray-600">✏️</button>
                          </div>
                          <p className="text-sm text-gray-500">{link.url}</p>
                          {link.url === 'http://emirkc_' && (
                            <div className="bg-red-100 border border-red-200 rounded p-2 mt-2">
                              <p className="text-red-800 text-xs">Please enter a valid URL</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <span>📊</span>
                          <span>📤</span>
                          <span>⭐</span>
                          <span>🔒</span>
                          <span>0 clicks</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">📤</button>
                        <button 
                          className={`w-12 h-6 rounded-full border-2 flex items-center justify-center ${
                            link.is_active 
                              ? 'bg-green-500 border-green-500' 
                              : 'bg-gray-300 border-gray-300'
                          }`}
                          type="button"
                        >
                          {link.is_active && <span className="text-white text-xs">✓</span>}
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Forest Footer Card */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Forest footer</h3>
                    <p className="text-sm text-gray-500">Forest*</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="w-12 h-6 rounded-full border-2 flex items-center justify-center bg-green-500 border-green-500"
                      type="button"
                    >
                      <span className="text-white text-xs">✓</span>
                    </button>
                    <span className="text-green-600">⚡</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Mobile Preview Panel */}
        <div className="w-80 bg-amber-50 border-l border-amber-200 p-4">
          <div className="flex flex-col items-center">
            {/* Profile URL */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">forest.ee/{profileSettings.displayName}</span>
              <button className="text-gray-600 hover:text-gray-900">📤</button>
            </div>

            {/* Stylish Phone Frame */}
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-64 h-[500px] bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl">
                {/* Phone Screen */}
                <div className="w-full h-full bg-gradient-to-b from-green-400 to-green-600 rounded-[2rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-black bg-opacity-20 flex items-center justify-between px-4 text-white text-xs">
                    <span>9:42</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-6 h-3 border border-white rounded-sm">
                        <div className="w-4 h-2 bg-white rounded-sm m-0.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-8 p-6 h-full flex flex-col">
                    {/* Top Icon */}
                    <div className="flex justify-start mb-6">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">*</span>
                      </div>
                    </div>

                    {/* Profile Section */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg overflow-hidden">
                        {profileSettings.profileImage ? (
                          <img 
                            src={profileSettings.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-2xl">👤</span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-white mb-1">@{profileSettings.displayName}</h2>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-white">📷</span>
                      </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex-1 space-y-2 mb-4">
                      {links.filter(link => link.is_active).map((link) => (
                        <button 
                          key={link.id}
                          onClick={() => window.open(link.url, '_blank')}
                          className="w-full bg-white bg-opacity-90 hover:bg-opacity-100 border border-white border-opacity-20 rounded-2xl p-3 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 text-sm">{link.icon || '🔗'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors truncate">
                                {link.title}
                              </h3>
                              <p className="text-xs text-gray-500 truncate">{link.url}</p>
                            </div>
                            <div className="text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Call to Action Button */}
                    <div className="mt-auto">
                      <button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                        Forest'te {profileSettings.displayName} ile katılın
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Shadow */}
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-[2.5rem] -z-10 transform translate-y-2"></div>
            </div>

            {/* Footer Links */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">Report • Privacy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Link Modal */}
      <Modal
        isOpen={isAddLinkModalOpen}
        onClose={handleCloseModal}
        title="Add New Link"
        size="large"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link Type</label>
            <select
              value={newLink.type}
              onChange={(e) => setNewLink({ ...newLink, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

          <Input
            label="Icon"
            placeholder="📸 or https://example.com/icon.png"
            value={newLink.icon}
            onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
          />

          <Input
            label="Banner"
            placeholder="https://example.com/banner.jpg"
            value={newLink.banner}
            onChange={(e) => setNewLink({ ...newLink, banner: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddLink}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'İşleniyor...' : 'Add Link'}
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