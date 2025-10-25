import { useState } from 'react';
import { ConnectWalletModal } from '../components/auth/ConnectWalletModal';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleWalletConnected = () => {
    console.log('Wallet bağlandı, onboarding\'e gidiyoruz!');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Forest</span>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Your Web3 Link Hub
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Connect your Sui wallet, showcase your NFTs, and share all your links in one beautiful place.
        </p>
        <Button onClick={() => setIsModalOpen(true)} className="text-lg px-8 py-4">
          Get Started for Free
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Why Choose Forest?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🔗"
            title="All Your Links"
            description="Combine all your social profiles and important links in one place"
          />
          <FeatureCard
            icon="🎨"
            title="Showcase NFTs"
            description="Display your NFT collection directly on your profile"
          />
          <FeatureCard
            icon="💰"
            title="Web3 Native"
            description="Built on Sui blockchain with wallet integration and donations"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-20 bg-white rounded-3xl my-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">About Forest</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Forest is a next-generation link-in-bio platform built for the Web3 era. 
            We combine the simplicity of traditional link tools with powerful blockchain features, 
            allowing creators and businesses to showcase their digital identity in a decentralized way.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Simple Pricing
        </h2>
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-lg border-2 border-primary">
          <h3 className="text-3xl font-bold text-center mb-4">Free</h3>
          <p className="text-center text-gray-600 mb-8">Everything you need to get started</p>
          <ul className="space-y-4 mb-8">
            <PricingFeature text="Unlimited links" />
            <PricingFeature text="Custom profile" />
            <PricingFeature text="NFT showcase" />
            <PricingFeature text="Donation button" />
            <PricingFeature text="Sui wallet integration" />
          </ul>
          <Button fullWidth onClick={() => setIsModalOpen(true)}>
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-gray-600">
        <p>&copy; 2025 Forest. Built on Sui Blockchain.</p>
      </footer>

      <ConnectWalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConnected={handleWalletConnected}
      />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="text-primary text-xl">✓</span>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}




