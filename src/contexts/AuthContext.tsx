import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentAccount, connectMetaMask, generateSignatureMessage, signMessage } from '../lib/metamask';
import toast from 'react-hot-toast';

// Types
type User = {
  id: string;
  wallet_address: string;
  full_name: string | null;
  email: string | null;
  coins: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { full_name?: string; email?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  refreshUser: async () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if user has connected with MetaMask
        const address = await getCurrentAccount();
        
        if (address) {
          // Get user profile from Supabase
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .eq('wallet_address', address.toLowerCase());
            
          if (profiles && profiles.length > 0) {
            setUser(profiles[0]);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      // Connect to MetaMask
      const { account } = await connectMetaMask();
      const normalizedAddress = account.toLowerCase();
      
      // Check if user exists
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', normalizedAddress);
        
      const existingUser = profiles && profiles.length > 0 ? profiles[0] : null;
      
      // Generate and sign authentication message
      const message = generateSignatureMessage(account);
      const signature = await signMessage(message);
      
      if (!signature) {
        throw new Error('Authentication failed');
      }
      
      if (!existingUser) {
        // Create new user with bonus coins
        const { data: newUser, error: insertError } = await supabase
          .from('profiles')
          .insert({
            wallet_address: normalizedAddress,
            coins: 2000, // Bonus coins for new users
          })
          .select()
          .single();
          
        if (insertError) {
          throw insertError;
        }
        
        setUser(newUser);
        toast.success('Welcome! You received 2000 bonus coins!');
      } else {
        setUser(existingUser);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };
  
  const updateProfile = async (data: { full_name?: string; email?: string }) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        ...data,
      });
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };
  
  const refreshUser = async () => {
    try {
      if (!user) return;
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
        
      if (profiles && profiles.length > 0) {
        setUser(profiles[0]);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        updateProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy context usage
export const useAuth = () => useContext(AuthContext);