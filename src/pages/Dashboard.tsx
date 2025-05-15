import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Wallet, LineChart, Home, Clock, TrendingUp, Building, Gavel, ArrowUp, ArrowDown, PieChart, BarChart2 } from 'lucide-react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [activeBids, setActiveBids] = useState<any[]>([]);
  const [wonAuctions, setWonAuctions] = useState<any[]>([]);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyValues, setPropertyValues] = useState<any[]>([]);
  const [bidDistribution, setBidDistribution] = useState<any>({
    labels: [],
    data: []
  });
  
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Fetch properties owned by user
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      
      setProperties(propertiesData || []);
      
      // Fetch active bids
      const { data: activeBidsData } = await supabase
        .from('bids')
        .select(`
          *,
          properties:property_id(*)
        `)
        .eq('bidder_id', user.id)
        .not('properties.is_active', 'eq', false);
      
      setActiveBids(activeBidsData || []);
      
      // Fetch won auctions
      const { data: wonAuctionsData } = await supabase
        .from('properties')
        .select('*')
        .eq('highest_bidder_id', user.id)
        .eq('is_active', true);
      
      setWonAuctions(wonAuctionsData || []);
      
      // Fetch bid history
      const { data: bidHistoryData } = await supabase
        .from('bids')
        .select(`
          *,
          properties:property_id(name, amount)
        `)
        .eq('bidder_id', user.id)
        .order('created_at', { ascending: false });
      
      setBidHistory(bidHistoryData || []);

      // Process property values for area chart
      const values = (propertiesData || []).map((prop: any) => ({
        name: prop.name,
        value: prop.amount,
        date: new Date(prop.created_at).toLocaleDateString()
      }));
      setPropertyValues(values);

      // Process bid distribution
      const bidsByProperty = (bidHistoryData || []).reduce((acc: any, bid: any) => {
        const propertyName = bid.properties?.name || 'Unknown';
        acc[propertyName] = (acc[propertyName] || 0) + 1;
        return acc;
      }, {});

      setBidDistribution({
        labels: Object.keys(bidsByProperty),
        data: Object.values(bidsByProperty)
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const getBidActivityData = () => {
    const dates = bidHistory
      .map(bid => new Date(bid.created_at).toLocaleDateString())
      .reduce((acc: Record<string, number>, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
    
    const sortedDates = Object.keys(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const last7Days = sortedDates.slice(-7);
    
    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Bid Activity',
          data: last7Days.map(date => dates[date]),
          borderColor: '#1E3A8A',
          backgroundColor: 'rgba(30, 58, 138, 0.1)',
          tension: 0.3,
          fill: true
        },
      ],
    };
  };
  
  const getPropertyValuesData = () => {
    return {
      labels: propertyValues.map(p => p.name),
      datasets: [
        {
          label: 'Property Value',
          data: propertyValues.map(p => p.value),
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: '#D97706',
          borderWidth: 2,
          fill: true
        }
      ]
    };
  };

  const getBidDistributionData = () => {
    return {
      labels: bidDistribution.labels,
      datasets: [
        {
          data: bidDistribution.data,
          backgroundColor: [
            'rgba(30, 58, 138, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderWidth: 0
        }
      ]
    };
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
        <p className="text-slate-600">Please log in to view your dashboard</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Your Balance</h3>
            <div className="h-10 w-10 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(user.coins)}</p>
          <p className="text-sm text-slate-500 mt-1">Available for bidding</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Properties Owned</h3>
            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <Home size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{properties.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total properties</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Active Bids</h3>
            <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Gavel size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeBids.length}</p>
          <p className="text-sm text-slate-500 mt-1">Ongoing auctions</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Won Auctions</h3>
            <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{wonAuctions.length}</p>
          <p className="text-sm text-slate-500 mt-1">Ready for purchase</p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Bid Activity</h2>
            <div className="h-8 w-8 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center">
              <LineChart size={16} />
            </div>
          </div>
          
          {bidHistory.length > 0 ? (
            <div className="h-64">
              <Line 
                data={getBidActivityData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    datalabels: {
                      display: false
                    }
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-500">No bid activity to display</p>
            </div>
          )}
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Property Values</h2>
            <div className="h-8 w-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <BarChart2 size={16} />
            </div>
          </div>
          
          {propertyValues.length > 0 ? (
            <div className="h-64">
              <Bar 
                data={getPropertyValuesData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value as number),
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    datalabels: {
                      color: '#1E3A8A',
                      anchor: 'end',
                      align: 'top',
                      formatter: (value) => formatCurrency(value),
                      font: {
                        weight: 'bold'
                      }
                    }
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-500">No property data to display</p>
            </div>
          )}
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Bid Distribution</h2>
            <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <PieChart size={16} />
            </div>
          </div>
          
          {bidDistribution.labels.length > 0 ? (
            <div className="h-64">
              <Doughnut 
                data={getBidDistributionData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 15
                      }
                    },
                    datalabels: {
                      color: '#fff',
                      font: {
                        weight: 'bold'
                      },
                      formatter: (value, ctx) => {
                        const sum = ctx.dataset.data.reduce((a: any, b: any) => a + b, 0);
                        const percentage = ((value * 100) / sum).toFixed(0) + '%';
                        return percentage;
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-500">No bid distribution data</p>
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link to="/" className="text-sm text-blue-900 hover:underline">View All</Link>
          </div>
          
          {activeBids.length > 0 ? (
            <div className="space-y-4">
              {activeBids.slice(0, 5).map((bid, index) => (
                <motion.div
                  key={bid.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="h-12 w-12 bg-slate-200 rounded-md overflow-hidden mr-4">
                    <img 
                      src={bid.properties?.photo_url} 
                      alt={bid.properties?.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-slate-900 truncate">
                      {bid.properties?.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-slate-500">
                        Your bid: {formatCurrency(bid.amount)}
                      </span>
                      {bid.properties?.highest_bidder_id === user.id ? (
                        <span className="text-green-600 flex items-center">
                          <ArrowUp size={12} className="mr-1" />
                          Highest
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center">
                          <ArrowDown size={12} className="mr-1" />
                          Outbid
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-amber-600">
                    <Clock size={14} className="mr-1" />
                    <span>
                      {new Date(bid.properties?.bid_end_date).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-lg">
              <p className="text-slate-600">No recent activity</p>
              <p className="text-sm text-slate-500 mt-1">
                Start bidding on properties to see your activity here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;