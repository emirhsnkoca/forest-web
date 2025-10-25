import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

interface PremiumFeatures {
  unlimitedLinks: boolean;
  customThemes: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  customDomain: boolean;
}

export function Upgrade() {
  const navigate = useNavigate();
  const { currentAccount, isConnected } = useAuth();
  
  const [hasWALLLCoin, setHasWALLLCoin] = useState(false);
  const [hasMonkeyNFT, setHasMonkeyNFT] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');

  const premiumFeatures: PremiumFeatures = {
    unlimitedLinks: true,
    customThemes: true,
    analytics: true,
    prioritySupport: true,
    customDomain: true
  };

  useEffect(() => {
    checkEligibility();
  }, [currentAccount]);

  const checkEligibility = async () => {
    setIsChecking(true);
    
    // Mock wallet check - in real app, this would check actual wallet
    if (currentAccount?.address) {
      // Simulate checking for WALLL coin (10+ dollars worth)
      const mockWALLLBalance = Math.random() > 0.5; // 50% chance
      setHasWALLLCoin(mockWALLLBalance);
      
      // Simulate checking for Monkey NFT
      const mockMonkeyNFT = Math.random() > 0.7; // 30% chance
      setHasMonkeyNFT(mockMonkeyNFT);
    }
    
    setIsChecking(false);
  };

  const handleUpgrade = () => {
    if (hasWALLLCoin || hasMonkeyNFT) {
      // Free upgrade for eligible users
      setSelectedPlan('premium');
      setIsUpgradeModalOpen(true);
    } else {
      // Paid upgrade
      setSelectedPlan('premium');
      setIsUpgradeModalOpen(true);
    }
  };

  const confirmUpgrade = () => {
    // In real app, this would process payment or activate premium
    console.log('Upgrade confirmed:', selectedPlan);
    setIsUpgradeModalOpen(false);
    navigate('/admin');
  };

  const isEligibleForFree = hasWALLLCoin || hasMonkeyNFT;

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🌲</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">Forest</span>
              <p className="text-sm text-gray-600">Web3 Link Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Admin
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-green-800 mb-6 flex items-center justify-center gap-3">
              💰 Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Start for free and scale as you grow. No hidden fees, no surprises.
            </p>
            
            {/* Eligibility Check */}
            {isChecking ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span className="text-green-800 font-medium">Checking your wallet for eligibility...</span>
                </div>
              </div>
            ) : isEligibleForFree ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl">🎉</span>
                  <h3 className="text-2xl font-bold text-green-800">You're eligible for FREE Pro!</h3>
                </div>
                <div className="space-y-2 text-green-700">
                  {hasWALLLCoin && (
                    <p className="flex items-center justify-center gap-2">
                      <span>💰</span>
                      <span>You have WALLL coin (10+ USD value)</span>
                    </p>
                  )}
                  {hasMonkeyNFT && (
                    <p className="flex items-center justify-center gap-2">
                      <span>🐵</span>
                      <span>You own a Monkey NFT</span>
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-800 mb-2">Free</h3>
                <p className="text-gray-600 mb-4">Perfect for getting started</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                <p className="text-gray-500">/forever</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Unlimited links</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Custom profile page</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Basic analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Sui wallet integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Share link</span>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/admin')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
              >
                Get Started
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-800 mb-2">Pro</h3>
                <p className="text-gray-600 mb-4">For creators and businesses</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">$9</div>
                <p className="text-gray-500">/month</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Everything in Free</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>NFT showcase subdomain</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Custom themes</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Remove Forest branding</span>
                </div>
              </div>
              
              <Button
                onClick={handleUpgrade}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
              >
                {isEligibleForFree ? 'Get Free Pro' : 'Coming Soon'}
              </Button>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-800 mb-2">Business</h3>
                <p className="text-gray-600 mb-4">For teams and enterprises</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">$29</div>
                <p className="text-gray-500">/month</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Everything in Pro</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Multiple team members</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>API access</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>White label options</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Dedicated support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Custom integrations</span>
                </div>
              </div>
              
              <Button
                onClick={() => window.open('mailto:contact@forest.ee', '_blank')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
              >
                Contact Us
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-green-800 font-medium">
              All plans include gas-free transactions and decentralized storage on Walrus 🦭
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Confirmation Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title={isEligibleForFree ? "Activate Free Premium" : "Confirm Premium Upgrade"}
        size="large"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🌲</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isEligibleForFree ? 'Free Premium Activated!' : 'Premium Upgrade Confirmed'}
            </h3>
            <p className="text-gray-600">
              {isEligibleForFree 
                ? 'Your premium features are now active. Enjoy unlimited links and all premium benefits!'
                : 'Your premium subscription is now active. You can cancel anytime.'
              }
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">What you get:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Unlimited links (no 5-link limit)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Custom themes and styling</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Advanced analytics dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Priority customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Custom domain support</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={confirmUpgrade}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isEligibleForFree ? 'Activate Now' : 'Complete Payment'}
            </Button>
            <Button
              onClick={() => setIsUpgradeModalOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

