import { ethers } from 'ethers';

// Check if Metamask is installed
export const isMetaMaskInstalled = (): boolean => {
  const { ethereum } = window as any;
  return Boolean(ethereum && ethereum.isMetaMask);
};

// Connect to Metamask and return provider, signer, and account
export const connectMetaMask = async (): Promise<{
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  account: string;
}> => {
  try {
    // Check if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    const { ethereum } = window as any;
    
    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    // Create ethers provider and signer
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    // Listen for account changes
    ethereum.on('accountsChanged', (newAccounts: string[]) => {
      if (newAccounts.length === 0) {
        // User disconnected their wallet
        window.location.reload();
      } else {
        // User switched accounts
        window.location.reload();
      }
    });

    // Listen for chain changes
    ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    return { provider, signer, account };
  } catch (error: any) {
    console.error('Error connecting to MetaMask:', error);
    throw new Error(error.message || 'Failed to connect to MetaMask');
  }
};

// Get the current account
export const getCurrentAccount = async (): Promise<string | null> => {
  try {
    if (!isMetaMaskInstalled()) {
      return null;
    }

    const { ethereum } = window as any;
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Generate a message for the user to sign
export const generateSignatureMessage = (address: string): string => {
  return `Welcome to Real Estate Bidding Platform!\n\nWallet: ${address}\nSign this message to authenticate with our platform.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;
};

// Sign a message with MetaMask
export const signMessage = async (message: string): Promise<string> => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    const { ethereum } = window as any;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    
    return await signer.signMessage(message);
  } catch (error: any) {
    console.error('Error signing message:', error);
    throw new Error(error.message || 'Failed to sign message');
  }
};