import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Clock, MapPin, Home, Calendar, DollarSign, User, ArrowRight, Plus, Minus, Info, Share2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import GoogleMap from '../components/ui/GoogleMap';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [bidding, setBidding] = useState(false);
  const [paying, setPaying] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [showBids, setShowBids] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    fetchPropertyDetails();
    fetchBids();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);
  
  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      
      if (!id) return;
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setProperty(data);
      
      // Set initial bid amount
      if (data.highest_bid) {
        setBidAmount(data.highest_bid + data.bid_increment);
      } else {
        setBidAmount(data.initial_bid);
      }
      
      // Start countdown timer
      updateTimeLeft(data.bid_end_date);
      timerRef.current = setInterval(() => updateTimeLeft(data.bid_end_date), 1000);
      
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Error loading property details');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchBids = async () => {
    try {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          profiles:bidder_id(full_name, email, wallet_address)
        `)
        .eq('property_id', id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };
  
  const updateTimeLeft = (endDate: string) => {
    const now = new Date();
    const bidEndDate = new Date(endDate);
    const difference = bidEndDate.getTime() - now.getTime();
    
    if (difference <= 0) {
      setTimeLeft('Bidding ended');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    if (days > 0) {
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else if (hours > 0) {
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeLeft(`${minutes}m ${seconds}s`);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const handleBidIncrement = () => {
    setBidAmount(prev => prev + (property?.bid_increment || 0));
  };
  
  const handleBidDecrement = () => {
    const minBid = property?.highest_bid 
      ? property.highest_bid + property.bid_increment 
      : property?.initial_bid;
      
    if (bidAmount > minBid) {
      setBidAmount(prev => prev - (property?.bid_increment || 0));
    }
  };
  
  const placeBid = async () => {
    try {
      if (!user || !property || !id) {
        toast.error('You must be logged in to place a bid');
        return;
      }
      
      setBidding(true);
      
      // Check if bid is high enough
      const minBid = property.highest_bid 
        ? property.highest_bid + property.bid_increment 
        : property.initial_bid;
        
      if (bidAmount < minBid) {
        toast.error(`Bid must be at least ${formatCurrency(minBid)}`);
        return;
      }
      
      // Check if auction has ended
      const bidEndDate = new Date(property.bid_end_date);
      if (bidEndDate < new Date()) {
        toast.error('This auction has ended');
        return;
      }
      
      // Create new bid
      const { error: bidError } = await supabase
        .from('bids')
        .insert({
          property_id: id,
          bidder_id: user.id,
          amount: bidAmount,
        });
        
      if (bidError) throw bidError;
      
      // Update property with new highest bid
      const { error: propertyError } = await supabase
        .from('properties')
        .update({
          highest_bid: bidAmount,
          highest_bidder_id: user.id,
        })
        .eq('id', id);
        
      if (propertyError) throw propertyError;
      
      toast.success('Bid placed successfully!');
      
      // Refresh property data and bids
      fetchPropertyDetails();
      fetchBids();
      
    } catch (error: any) {
      console.error('Error placing bid:', error);
      toast.error(error.message || 'Failed to place bid');
    } finally {
      setBidding(false);
    }
  };
  
  const makePayment = async () => {
    try {
      if (!user || !property || !id) {
        toast.error('You must be logged in to make a payment');
        return;
      }
      
      setPaying(true);
      
      // Check if user has enough coins
      if (user.coins < property.amount) {
        toast.error('You don\'t have enough coins to purchase this property');
        return;
      }
      
      // Check if user is the highest bidder
      if (property.highest_bidder_id !== user.id) {
        toast.error('Only the highest bidder can purchase the property');
        return;
      }
      
      // Deduct coins from user
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          coins: user.coins - property.amount,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Update property with new owner
      const { error: propertyError } = await supabase
        .from('properties')
        .update({
          owner_id: user.id,
          is_active: false,
        })
        .eq('id', id);
        
      if (propertyError) throw propertyError;
      
      toast.success('Payment successful! You are now the owner of this property');
      
      // Refresh user data
      refreshUser();
      
      // Refresh property data
      fetchPropertyDetails();
      
    } catch (error: any) {
      console.error('Error making payment:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setPaying(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
        <p className="text-slate-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Browse Properties
        </button>
      </div>
    );
  }
  
  const isBidEnded = new Date(property.bid_end_date) < new Date();
  const isHighestBidder = user?.id === property.highest_bidder_id;
  const canPurchase = isBidEnded && isHighestBidder && property.is_active;
  const isPropertyOwner = user?.id === property.owner_id;
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Property details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Property image */}
            <div className="relative h-80 overflow-hidden">
              <img 
                src={property.photo_url} 
                alt={property.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Share2 size={20} className="text-slate-800" />
                </button>
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart size={20} className="text-slate-800" />
                </button>
              </div>
            </div>
            
            {/* Property title and details tabs */}
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">{property.name}</h1>
                <div className="flex items-center">
                  <MapPin size={18} className="text-amber-500 mr-1" />
                  <span className="text-slate-600">123 Property St, City, State</span>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-slate-200 mb-6">
                <button 
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    showDetails ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => {
                    setShowDetails(true);
                    setShowBids(false);
                  }}
                >
                  Details
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    showBids ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => {
                    setShowDetails(false);
                    setShowBids(true);
                  }}
                >
                  Bid History ({bids.length})
                </button>
              </div>
              
              {/* Tab content */}
              {showDetails && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                  <p className="text-slate-700 mb-6">{property.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {property.square_footage && (
                      <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                        <Home size={20} className="text-blue-900 mb-1" />
                        <span className="text-sm text-slate-500">Square Ft</span>
                        <span className="font-semibold">{property.square_footage}</span>
                      </div>
                    )}
                    {property.year_built && (
                      <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                        <Calendar size={20} className="text-blue-900 mb-1" />
                        <span className="text-sm text-slate-500">Year Built</span>
                        <span className="font-semibold">{property.year_built}</span>
                      </div>
                    )}
                    <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                      <DollarSign size={20} className="text-blue-900 mb-1" />
                      <span className="text-sm text-slate-500">Value</span>
                      <span className="font-semibold">{formatCurrency(property.amount)}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                      <User size={20} className="text-blue-900 mb-1" />
                      <span className="text-sm text-slate-500">Owner</span>
                      <span className="font-semibold truncate w-full text-center">
                        {isPropertyOwner ? 'You' : 'Seller'}
                      </span>
                    </div>
                  </div>
                  
                  {property.address && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Location</h3>
                      <GoogleMap 
                        address={property.address}
                        height="240px"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                  
                  {property.youtube_url && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Property Video</h3>
                      <div className="h-60 bg-slate-200 rounded-lg">
                        <iframe 
                          src={property.youtube_url} 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0, borderRadius: '0.5rem' }} 
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {showBids && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">Bid History</h2>
                  
                  {bids.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                      <Info size={24} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-slate-600">No bids have been placed yet</p>
                      <p className="text-sm text-slate-500">Be the first to bid on this property</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bids.map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mr-3">
                              <User size={18} />
                            </div>
                            <div>
                              <p className="font-medium">
                                {bid.profiles?.full_name || 'Anonymous Bidder'}
                                {bid.bidder_id === user?.id && ' (You)'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(bid.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-blue-900">
                            {formatCurrency(bid.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Bidding info */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Auction Details</h3>
                <div 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isBidEnded ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isBidEnded ? 'Auction Ended' : 'Ongoing'}
                </div>
              </div>
              
              {!isBidEnded && (
                <div className="flex items-center mb-6">
                  <Clock size={18} className="text-amber-500 mr-2" />
                  <span className="text-slate-700">
                    Ends in: <span className="font-semibold">{timeLeft}</span>
                  </span>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Initial Bid:</span>
                  <span className="font-semibold">{formatCurrency(property.initial_bid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Highest Bid:</span>
                  <span className="font-semibold text-blue-900">
                    {property.highest_bid 
                      ? formatCurrency(property.highest_bid) 
                      : formatCurrency(property.initial_bid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Minimum Bid Increment:</span>
                  <span className="font-semibold">{formatCurrency(property.bid_increment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Bid End Date:</span>
                  <span className="font-semibold">
                    {new Date(property.bid_end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {!isPropertyOwner && !canPurchase && !isBidEnded && (
                <div className="border-t border-slate-200 pt-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Your Bid Amount
                    </label>
                    <div className="flex">
                      <button 
                        className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 rounded-l-md"
                        onClick={handleBidDecrement}
                      >
                        <Minus size={18} />
                      </button>
                      <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="flex-grow border-y border-slate-300 px-3 py-2 text-center"
                      />
                      <button 
                        className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 rounded-r-md"
                        onClick={handleBidIncrement}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-primary w-full py-3"
                    onClick={placeBid}
                    disabled={bidding || !user}
                  >
                    {bidding ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : user ? (
                      'Place Bid'
                    ) : (
                      <div className="flex items-center justify-center" onClick={() => navigate('/login')}>
                        Connect Wallet to Bid
                        <ArrowRight size={16} className="ml-1" />
                      </div>
                    )}
                  </button>
                  
                  {!user && (
                    <p className="text-xs text-center mt-2 text-slate-500">
                      You must connect your wallet to place a bid
                    </p>
                  )}
                </div>
              )}
              
              {canPurchase && (
                <div className="border-t border-slate-200 pt-6">
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="text-green-800 font-medium">
                      Congratulations! You are the highest bidder for this property.
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Complete your purchase to claim ownership.
                    </p>
                  </div>
                  
                  <button 
                    className="btn btn-accent w-full py-3"
                    onClick={makePayment}
                    disabled={paying}
                  >
                    {paying ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay ${formatCurrency(property.amount)}`
                    )}
                  </button>
                  
                  <p className="text-xs text-center mt-2 text-slate-500">
                    Your balance: {formatCurrency(user?.coins || 0)}
                  </p>
                </div>
              )}
              
              {isPropertyOwner && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    You own this property
                  </p>
                </div>
              )}
              
              {isBidEnded && !canPurchase && !isPropertyOwner && (
                <div className="border-t border-slate-200 pt-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-800 font-medium text-center">
                      This auction has ended
                    </p>
                    {property.highest_bidder_id && (
                      <p className="text-sm text-slate-600 text-center mt-1">
                        {isHighestBidder 
                          ? 'You were the highest bidder!'
                          : 'The property has been awarded to the highest bidder.'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Need Help?</h3>
              <p className="text-slate-600 mb-4">
                Have questions about this property or the bidding process? Our team is here to help.
              </p>
              <button className="btn btn-secondary w-full">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;