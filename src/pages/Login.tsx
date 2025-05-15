import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, AlertCircle } from 'lucide-react';
import { isMetaMaskInstalled } from '../lib/metamask';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if MetaMask is installed
    setIsMetaMaskAvailable(isMetaMaskInstalled());
  }, []);

  const handleLogin = async () => {
    try {
      setLoginLoading(true);
      setError(null);
      await login();
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setLoginLoading(false);
    }
  };

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-8">
      <div className="w-full bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <div className="h-20 w-20 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-slate-600">
            Sign in with your MetaMask wallet to access the platform and start bidding on properties.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isMetaMaskAvailable ? (
          <button 
            className="btn btn-primary w-full mb-4 py-3 flex items-center justify-center"
            onClick={handleLogin}
            disabled={loginLoading || loading}
          >
            {loginLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connecting...
              </div>
            ) : (
              <>
                <img 
                  src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" 
                  alt="MetaMask" 
                  className="h-5 w-5 mr-2" 
                />
                Connect with MetaMask
              </>
            )}
          </button>
        ) : (
          <button 
            className="btn btn-accent w-full mb-4 py-3"
            onClick={installMetaMask}
          >
            Install MetaMask
          </button>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            New users will receive 2000 coins as a welcome bonus to start bidding on properties.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-slate-50 p-6 rounded-lg w-full">
        <h3 className="text-lg font-semibold mb-3">Why Connect with MetaMask?</h3>
        <ul className="space-y-2">
          <li className="flex">
            <div className="h-5 w-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">1</div>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">Secure Authentication: </span> 
              Your wallet provides cryptographically secure access to the platform.
            </p>
          </li>
          <li className="flex">
            <div className="h-5 w-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">2</div>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">Digital Currency: </span> 
              Use platform coins to bid on and purchase properties.
            </p>
          </li>
          <li className="flex">
            <div className="h-5 w-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">3</div>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">Transparent Transactions: </span> 
              All bids and property transfers are securely recorded.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Login;