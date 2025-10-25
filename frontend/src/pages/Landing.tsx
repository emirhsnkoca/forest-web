import React, { useState } from 'react';
import { ConnectWalletModal } from '../components/auth/ConnectWalletModal';
import { Button } from '../components/common/Button';
import { Background } from '../components/common/Background';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaImage, FaHeart, FaLink } from 'react-icons/fa';

export function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleWalletConnected = () => {
    console.log('Wallet bağlandı, onboarding\'e gidiyoruz!');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={() => setIsModalOpen(true)} />

      {/* Hero Section with Pixel Green Background */}
      <Background type="pixel-green" className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-darker mb-6 animate-fade-in">
            Grow Your Digital Forest 🌲
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in animate-delay-100">
            The Web3 link-in-bio platform built on Sui blockchain.
            <br />
            Share your links, showcase NFTs, and accept donations—all in one place.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-primary hover:bg-primary-dark text-white font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-200"
          >
            🚀 Get Started for Free
          </Button>
          
          {/* Video Placeholder / Future Integration */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-primary/20 animate-slide-up animate-delay-300">
              <div className="aspect-video bg-gradient-to-br from-primary-light to-accent rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🎬 Product Demo Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </Background>

      {/* About Section with Features */}
      <section id="about" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-darker mb-6">
              Why Choose Forest? 🌳
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Forest is the next-generation link-in-bio platform built for the Web3 era. 
              We combine simplicity with powerful blockchain features.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <FeatureCard
              icon={<FaLink className="text-4xl" />}
              title="All Your Links"
              description="Combine all your social profiles, websites, and important links in one beautiful place"
              color="primary"
            />
            <FeatureCard
              icon={<FaImage className="text-4xl" />}
              title="Showcase NFTs"
              description="Display your NFT collection on a custom subdomain and let the world see your digital assets"
              color="accent"
            />
            <FeatureCard
              icon={<FaWallet className="text-4xl" />}
              title="Web3 Native"
              description="Built on Sui blockchain with seamless wallet integration and Sui Name Service support"
              color="secondary"
            />
            <FeatureCard
              icon={<FaHeart className="text-4xl" />}
              title="Accept Donations"
              description="Enable direct SUI donations from your supporters with zero platform fees"
              color="primary"
            />
          </div>

          {/* About Text Section */}
          <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-12 border-2 border-primary/10">
            <h3 className="text-3xl font-bold text-center text-primary-darker mb-6">
              Decentralized. Powerful. Yours.
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">
              Forest empowers creators, businesses, and individuals to build their digital presence on the blockchain. 
              Your profile, your data, your control—stored on Walrus, powered by Sui.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              No middlemen, no ads, no limits. Just a beautiful platform that grows with you. 🌱➡️🌲
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-darker mb-6">
              Simple, Transparent Pricing 💰
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start for free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <PricingCard
              name="Free"
              price="$0"
              period="/forever"
              description="Perfect for getting started"
              features={[
                'Unlimited links',
                'Custom profile page',
                'Basic analytics',
                'Sui wallet integration',
                'Share link'
              ]}
              buttonText="Get Started"
              onButtonClick={() => setIsModalOpen(true)}
              highlighted={false}
            />

            {/* Pro Tier */}
            <PricingCard
              name="Pro"
              price="$9"
              period="/month"
              description="For creators and businesses"
              features={[
                'Everything in Free',
                'NFT showcase subdomain',
                'Advanced analytics',
                'Custom themes',
                'Priority support',
                'Remove Forest branding'
              ]}
              buttonText="Coming Soon"
              onButtonClick={() => {}}
              highlighted={true}
              badge="Most Popular"
            />

            {/* Business Tier */}
            <PricingCard
              name="Business"
              price="$29"
              period="/month"
              description="For teams and enterprises"
              features={[
                'Everything in Pro',
                'Multiple team members',
                'API access',
                'White label options',
                'Dedicated support',
                'Custom integrations'
              ]}
              buttonText="Contact Us"
              onButtonClick={() => {}}
              highlighted={false}
            />
          </div>

          <p className="text-center text-gray-600 mt-12 text-lg">
            All plans include <span className="font-bold text-primary">gas-free transactions</span> and <span className="font-bold text-primary">decentralized storage</span> on Walrus 🌊
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <ConnectWalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConnected={handleWalletConnected}
      />
    </div>
  );
}

// ==================== Feature Card Component ====================
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    primary: 'text-primary border-primary/20 hover:border-primary/40',
    secondary: 'text-secondary border-secondary/20 hover:border-secondary/40',
    accent: 'text-accent border-accent/20 hover:border-accent/40',
  };

  return (
    <div className={`bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 ${colorClasses[color]}`}>
      <div className={`mb-4 ${colorClasses[color]}`}>{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// ==================== Pricing Card Component ====================
interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  onButtonClick: () => void;
  highlighted?: boolean;
  badge?: string;
}

function PricingCard({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  buttonText, 
  onButtonClick, 
  highlighted = false,
  badge 
}: PricingCardProps) {
  return (
    <div className={`bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 ${
      highlighted ? 'border-4 border-primary ring-4 ring-primary/10 scale-105' : 'border-2 border-gray-200'
    } relative`}>
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
          {badge}
        </div>
      )}
      
      <h3 className="text-3xl font-bold text-center mb-2 text-primary-darker">{name}</h3>
      <p className="text-center text-gray-600 mb-6">{description}</p>
      
      <div className="text-center mb-8">
        <span className="text-5xl font-bold text-primary-darker">{price}</span>
        <span className="text-gray-600 text-lg">{period}</span>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-primary text-xl font-bold flex-shrink-0">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        fullWidth 
        onClick={onButtonClick}
        className={highlighted 
          ? 'bg-primary hover:bg-primary-dark text-white font-bold py-3' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3'
        }
      >
        {buttonText}
      </Button>
    </div>
  );
}




