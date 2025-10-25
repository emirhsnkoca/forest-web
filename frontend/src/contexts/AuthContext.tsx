import { createContext, useContext, ReactNode } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface AuthContextType {
  currentAccount: any;
  isConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Safe destructuring - useCurrentAccount() null dönebilir
  const accountData = useCurrentAccount();
  const currentAccount = accountData?.data || null;
  const isConnected = !!currentAccount;

  return (
    <AuthContext.Provider value={{ currentAccount, isConnected }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}



