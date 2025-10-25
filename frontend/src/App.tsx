import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Upgrade } from './pages/Upgrade';
import { Account } from './pages/Account';
import '@mysten/dapp-kit/dist/index.css';

const queryClient = new QueryClient();

const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
};

// Cüzdan seçimi için optimize edilmiş konfigürasyon
const walletConfig = {
  // Mock cüzdanları devre dışı bırak
  enableUnsafeBurner: false,
  // Otomatik bağlantıyı devre dışı bırak - kullanıcı her seferinde seçsin
  autoConnect: false,
  // Her seferinde yeni storage kullan - cache sorunlarını önle
  storageKey: 'forest-wallet-' + Math.random().toString(36).substring(7),
  // Cüzdan değişikliklerini gerçek zamanlı takip et
  features: ['standard:connect', 'standard:events'],
  // Cache'i tamamen devre dışı bırak
  enableAutoConnect: false,
  // Storage'ı tamamen temizle
  storageAdapter: {
    get: () => null,
    set: () => {},
    remove: () => {},
    getAll: () => ({}),
  },
  // Cüzdan seçimi için özel ayarlar
  enableWalletConnection: true,
  // Her seferinde yeni bağlantı
  forceNewConnection: true,
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider {...walletConfig}>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:address" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/upgrade" element={<Upgrade />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </Router>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;

