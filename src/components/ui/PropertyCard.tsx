import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  amount: number;
  currentBid: number | null;
  initialBid: number;
  bidEndDate: string;
  squareFootage?: number;
  yearBuilt?: number;
}

const PropertyCard = ({
  id,
  name,
  description,
  photoUrl,
  amount,
  currentBid,
  initialBid,
  bidEndDate,
  squareFootage,
  yearBuilt
}: PropertyCardProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const bidEndsAt = new Date(bidEndDate);
  const bidEnded = bidEndsAt < new Date();

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate time left for bidding
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = bidEndsAt.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('Bidding ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [bidEndDate]);

  return (
    <div className="card group hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img 
          src={photoUrl} 
          alt={name} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-sm font-semibold truncate">{formatCurrency(amount)}</p>
        </div>
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${bidEnded ? 'bg-slate-800 text-white' : 'bg-amber-500 text-white'}`}>
            {bidEnded ? 'Auction Ended' : timeLeft}
          </div>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg mb-1 truncate">{name}</h3>
        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-3">
          {squareFootage && (
            <div>
              <span className="block">Square Ft</span>
              <span className="font-medium text-slate-700">{squareFootage}</span>
            </div>
          )}
          {yearBuilt && (
            <div>
              <span className="block">Year Built</span>
              <span className="font-medium text-slate-700">{yearBuilt}</span>
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs text-slate-500">Current Bid</p>
              <p className="font-semibold text-blue-900">
                {currentBid ? formatCurrency(currentBid) : formatCurrency(initialBid)}
              </p>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="text-slate-400 mr-1" />
              <span className="text-xs text-slate-500">
                {new Date(bidEndDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <Link 
            to={`/properties/${id}`}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            View Property
            <ArrowUpRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;