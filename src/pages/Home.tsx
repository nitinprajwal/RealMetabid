import { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import PropertyCard from '../components/ui/PropertyCard';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Home = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        // Check Supabase connection first
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          throw new Error('Unable to connect to Supabase. Please check your connection.');
        }
        await fetchProperties();
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setLoading(false);
      }
    };

    initializeAndFetch();
  }, [sortOrder]);
  
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_active', true);
        
      // Apply sorting
      if (sortOrder === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortOrder === 'ending_soon') {
        query = query.order('bid_end_date', { ascending: true });
      } else if (sortOrder === 'price_high') {
        query = query.order('amount', { ascending: false });
      } else if (sortOrder === 'price_low') {
        query = query.order('amount', { ascending: true });
      }
      
      const { data, error: supabaseError } = await query;
      
      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }
      
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter properties based on search term
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    property.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <button 
          onClick={() => fetchProperties()} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-xl h-80 bg-blue-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
          <img 
            src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg" 
            alt="Real Estate" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl">
              Find and Bid on Your Dream Property
            </h1>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Discover exclusive real estate opportunities and place secure bids with our blockchain-powered platform
            </p>
            <div className="w-full max-w-xl relative">
              <input
                type="text"
                placeholder="Search for properties..."
                className="w-full py-3 px-5 pr-12 rounded-full border-0 focus:ring-2 focus:ring-amber-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold mb-2 sm:mb-0">Available Properties</h2>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <button 
              className="flex items-center text-sm text-slate-700 hover:text-blue-900 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} className="mr-1" />
              Filters
            </button>
            
            <div className="relative">
              <button
                className="flex items-center text-sm text-slate-700 hover:text-blue-900 transition-colors"
                onClick={() => document.getElementById('sort-dropdown')?.classList.toggle('hidden')}
              >
                <ArrowUpDown size={18} className="mr-1" />
                Sort by: {sortOrder.replace('_', ' ')}
              </button>
              
              <div 
                id="sort-dropdown" 
                className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-1 z-10 hidden border border-slate-200"
              >
                <button 
                  className={`w-full text-left px-4 py-2 text-sm ${sortOrder === 'newest' ? 'text-blue-900 font-medium' : 'text-slate-700'} hover:bg-slate-100`}
                  onClick={() => {
                    setSortOrder('newest');
                    document.getElementById('sort-dropdown')?.classList.add('hidden');
                  }}
                >
                  Newest
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 text-sm ${sortOrder === 'ending_soon' ? 'text-blue-900 font-medium' : 'text-slate-700'} hover:bg-slate-100`}
                  onClick={() => {
                    setSortOrder('ending_soon');
                    document.getElementById('sort-dropdown')?.classList.add('hidden');
                  }}
                >
                  Ending Soon
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 text-sm ${sortOrder === 'price_high' ? 'text-blue-900 font-medium' : 'text-slate-700'} hover:bg-slate-100`}
                  onClick={() => {
                    setSortOrder('price_high');
                    document.getElementById('sort-dropdown')?.classList.add('hidden');
                  }}
                >
                  Price (High to Low)
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 text-sm ${sortOrder === 'price_low' ? 'text-blue-900 font-medium' : 'text-slate-700'} hover:bg-slate-100`}
                  onClick={() => {
                    setSortOrder('price_low');
                    document.getElementById('sort-dropdown')?.classList.add('hidden');
                  }}
                >
                  Price (Low to High)
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-slate-50 p-4 rounded-lg mb-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Filter controls would go here */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="input text-sm" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="input text-sm" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Square Footage
                </label>
                <input 
                  type="number" 
                  placeholder="Minimum sq ft" 
                  className="input text-sm" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Year Built
                </label>
                <input 
                  type="number" 
                  placeholder="Year built after" 
                  className="input text-sm" 
                />
              </div>
              
              <div className="flex items-end">
                <button className="btn btn-primary w-full">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="property-grid">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                id={property.id}
                name={property.name}
                description={property.description}
                photoUrl={property.photo_url}
                amount={property.amount}
                currentBid={property.highest_bid}
                initialBid={property.initial_bid}
                bidEndDate={property.bid_end_date}
                squareFootage={property.square_footage}
                yearBuilt={property.year_built}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-slate-800 mb-2">No properties found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;