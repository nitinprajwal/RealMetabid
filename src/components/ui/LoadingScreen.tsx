import { Home } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="h-16 w-16 bg-blue-900 text-white rounded-md flex items-center justify-center mb-6 animate-bounce-slow">
        <Home size={32} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">PropertyBid</h1>
      <p className="text-slate-600 mb-6">Real Estate Bidding Platform</p>
      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-900 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;