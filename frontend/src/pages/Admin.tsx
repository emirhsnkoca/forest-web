  import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Link } from '../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Web3Link extends Link {
  type: 'wallet' | 'nft' | 'defi' | 'social' | 'custom';
  blockchain?: string;
  contractAddress?: string;
  tokenId?: string;
  platform?: string;
}

export function Admin() {
  const navigate = useNavigate();
  const { } = useAuth();
  
  const [activeTab, setActiveTab] = useState('links');
  const [links, setLinks] = useState<Web3Link[]>([]);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Web3Link | null>(null);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    type: 'custom' as 'wallet' | 'nft' | 'defi' | 'social' | 'custom',
    blockchain: '',
    contractAddress: '',
    tokenId: ''
  });

  const [profileSettings] = useState({
    displayName: 'samcuu',
    bio: 'Web3 Developer & NFT Collector',
    profileImage: '',
    ensName: '',
    customDomain: 'samcuu.forest.ee'
  });

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Ultra-optimized Drag & Drop sensors for maximum performance
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 12, // Increased distance for better performance
        delay: 100, // Small delay to prevent accidental drags
        tolerance: 5, // Tolerance for better UX
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
// ... loadMockData içeriği aynı
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
// ... handleAddLink içeriği aynı
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
// ... handleEditLink içeriği aynı
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
// ... handleUpdateLink içeriği aynı
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

  // Optimized drag end handler with useCallback
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  // Memoized link IDs for better performance
  const linkIds = useMemo(() => links.map(link => link.id), [links]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 text-center text-sm shadow-sm">
        <span>🌲 Try Forest Pro for free</span>
        <button 
          type="button"
          onClick={() => window.location.href = '/upgrade'}
          className="ml-4 bg-white text-green-600 hover:bg-green-50 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-150 hover:scale-105"
        >
          Upgrade
        </button>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">🌲</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Forest</span>
            </div>
            <div className="relative user-dropdown">
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
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999]">
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
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200 shadow-sm">
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
                      type="button" // Buton olarak işaretlendi
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer" // cursor-pointer eklendi
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">+</span>
                      </div>
                      <span className="font-medium text-gray-900">Create new Forest</span>
                    </button>

                    <button 
                      onClick={() => {
                        console.log('Account button clicked');
                        navigate('/account');
                        setIsUserDropdownOpen(false);
                      }}
                      type="button" // Buton olarak işaretlendi
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer" // cursor-pointer eklendi
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">👤</span>
                      </div>
                      <span className="font-medium text-gray-900">Account</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        window.location.href = '/upgrade'; // Yönlendirme buraya eklendi
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer" // cursor-pointer eklendi
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
                  type="button"
                >
                  Links
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
              

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span>📱</span>
                  <span className="font-medium text-green-900">Put your Forest in your bio</span>
                </div>
                <p className="text-sm text-green-700">Add forest.ee/{profileSettings.displayName} to your social media bios</p>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setIsAddLinkModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all duration-200 hover:scale-105"
                >
                  <span className="mr-2">+</span>
                  Add
                </Button>
              </div>
            </div>

            {/* Links Management */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={linkIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {links.map((link) => (
                    <SortableLink
                      key={link.id}
                      link={link}
                      onEdit={handleEditLink}
                      onDelete={handleDeleteLink}
                      onToggle={handleToggleLink}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Forest Footer */}
            <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs">🌲</span>
                  </div>
                  <span className="font-medium text-gray-900">Forest footer</span>
                </div>
                <button
                  className={`w-12 h-6 rounded-full border-2 flex items-center justify-center shadow-sm ${
                    true 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-500' 
                      : 'border-gray-300'
                  }`}
                  type="button"
                >
                  {true && <span className="text-white text-xs">✓</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Modern Mobile Preview */}
        <div className="w-80 bg-gray-50 p-4">
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl shadow-2xl overflow-hidden max-w-sm mx-auto">
            {/* Phone Status Bar */}
            <div className="bg-black h-6 flex items-center justify-between px-4 text-white text-xs">
              <span>9:42</span>
              <div className="flex items-center">
                {/* Battery Icon */}
                <div className="relative">
                  <div className="w-6 h-3 border border-white rounded-sm bg-transparent"></div>
                  <div className="absolute -right-0.5 top-0.5 w-0.5 h-2 bg-white rounded-r-sm"></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="bg-gradient-to-t from-green-600 to-green-200 p-6">
              {/* Top Menu Icon */}
              <div className="flex justify-start mb-6">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">*</span>
                </div>
              </div>
              
              {/* Profile Section */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                  <span className="text-gray-600 text-2xl">👤</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">@{profileSettings.displayName}</h2>
                <p className="text-sm text-gray-600">{profileSettings.bio}</p>
              </div>
              
              {/* Links Section */}
              <div className="space-y-2 mb-4">
                {links.filter(link => link.isActive).map((link) => (
                  <button 
                    key={link.id}
                    onClick={() => window.open(link.url, '_blank')}
                    className="w-full bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-2xl p-3 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                        link.type === 'wallet' ? 'bg-green-100' :
                        link.type === 'nft' ? 'bg-emerald-100' :
                        link.type === 'defi' ? 'bg-lime-100' :
                        link.type === 'social' ? 'bg-teal-100' :
                        'bg-gray-100'
                      }`}>
                        {link.type === 'wallet' && <span className="text-green-600 text-sm">💰</span>}
                        {link.type === 'nft' && <span className="text-emerald-600 text-sm">🖼️</span>}
                        {link.type === 'defi' && <span className="text-lime-600 text-sm">📈</span>}
                        {link.type === 'social' && <span className="text-teal-600 text-sm">📱</span>}
                        {link.type === 'custom' && <span className="text-gray-600 text-sm">🔗</span>}
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
              {/* Footer Links */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

          {(['wallet', 'nft', 'defi'] as const).includes(newLink.type as any) && (
            <>
              <Input
                label="Blockchain"
                placeholder="Ethereum, Sui, Solana..."
                value={newLink.blockchain}
                onChange={(e) => setNewLink({ ...newLink, blockchain: e.target.value })}
              />
              
              {(newLink.type as any) === 'nft' && (
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
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm transition-all duration-200 hover:scale-105"
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

// Optimized Sortable Link Component with React.memo
const SortableLink = React.memo(({ link, onEdit, onDelete, onToggle }: {
  link: Web3Link;
  onEdit: (link: Web3Link) => void;
  onDelete: (linkId: string) => void;
  onToggle: (linkId: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition, // Disable transition while dragging
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1000 : 'auto', // Higher z-index while dragging
  }), [transform, transition, isDragging]);

  const handleEdit = useCallback(() => onEdit(link), [onEdit, link]);
  const handleDelete = useCallback(() => onDelete(link.id), [onDelete, link.id]);
  const handleToggle = useCallback(() => onToggle(link.id), [onToggle, link.id]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-200 ease-out transform hover:-translate-y-1 hover:scale-[1.02]"
    >
      {/* Drag Handle - Enhanced for better UX */}
      <div className="flex items-center p-3 pb-0">
        <div 
          {...attributes}
          {...listeners}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-500 cursor-move transition-all duration-150 hover:bg-green-50 rounded-lg group border border-transparent hover:border-green-200"
        >
          <div className="flex flex-col gap-1">
            <div className="w-1.5 h-1.5 bg-current rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full group-hover:scale-110 transition-transform"></div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Header with Platform Icon and Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
            link.type === 'wallet' ? 'bg-green-100 border border-green-200' :
            link.type === 'nft' ? 'bg-emerald-100 border border-emerald-200' :
            link.type === 'defi' ? 'bg-lime-100 border border-lime-200' :
            link.type === 'social' ? 'bg-teal-100 border border-teal-200' :
            'bg-gray-100 border border-gray-200'
          }`}>
            {link.type === 'wallet' && <span className="text-green-600 text-lg">💰</span>}
            {link.type === 'nft' && <span className="text-emerald-600 text-lg">🖼️</span>}
            {link.type === 'defi' && <span className="text-lime-600 text-lg">📈</span>}
            {link.type === 'social' && <span className="text-teal-600 text-lg">📱</span>}
            {link.type === 'custom' && <span className="text-gray-600 text-lg">🔗</span>}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-lg">{link.title}</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                link.type === 'wallet' ? 'bg-green-100 text-green-700 border border-green-200' :
                link.type === 'nft' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                link.type === 'defi' ? 'bg-lime-100 text-lime-700 border border-lime-200' :
                link.type === 'social' ? 'bg-teal-100 text-teal-700 border border-teal-200' :
                'bg-gray-100 text-gray-700 border border-gray-200'
              }`}>
                {link.type === 'wallet' ? 'Wallet' :
                 link.type === 'nft' ? 'NFT' :
                 link.type === 'defi' ? 'DeFi' :
                 link.type === 'social' ? 'Social' : 'Custom'}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{link.url}</p>
            {link.blockchain && (
              <p className="text-xs text-gray-400 mt-1">Blockchain: {link.blockchain}</p>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Analytics */}
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-sm">📊</span>
              <span className="text-xs">0 clicks</span>
            </div>
            
            {/* Share Button */}
            <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 hover:bg-green-50 px-2 py-1 rounded-md transition-all duration-150">
              <span className="text-sm">📤</span>
              <span className="text-xs">Share</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Active</span>
              <button
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${
                  link.isActive ? 'bg-green-500 shadow-sm' : 'bg-gray-300'
                }`}
                type="button"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    link.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <button 
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-150 hover:scale-110"
                type="button"
                title="Edit"
              >
                <span className="text-sm">✏️</span>
              </button>
              <button 
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 hover:scale-110"
                type="button"
                title="Delete"
              >
                <span className="text-sm">🗑️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});