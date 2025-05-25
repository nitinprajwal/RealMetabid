import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Wallet, LineChart, Home, Clock, TrendingUp, Gavel, ArrowUp, ArrowDown, PieChart, BarChart2, Target, MapPin, DollarSign, Activity, Award, Calendar } from 'lucide-react';
import { Line, Bar, Pie, Doughnut, Radar, Scatter, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
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
  RadialLinearScale,
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
  
  // Enhanced analytics data
  const [marketTrends, setMarketTrends] = useState<any>([]);
  const [roiAnalysis, setRoiAnalysis] = useState<any>([]);
  const [propertyTypes, setPropertyTypes] = useState<any>({});
  const [monthlyRevenue, setMonthlyRevenue] = useState<any>([]);
  const [bidSuccessRate, setBidSuccessRate] = useState<any>({});
  const [geographicData, setGeographicData] = useState<any>([]);
  const [priceRanges, setPriceRanges] = useState<any>({});
  const [activityHeatmap, setActivityHeatmap] = useState<any>([]);
  
  // Advanced analytics data
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({});
  const [portfolioGrowth, setPortfolioGrowth] = useState<any>([]);
  const [marketSentiment, setMarketSentiment] = useState<any>([]);
  const [investmentHeatmap, setInvestmentHeatmap] = useState<any>([]);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<any>([]);
  const [riskAssessment, setRiskAssessment] = useState<any>({});
  const [competitorAnalysis, setCompetitorAnalysis] = useState<any>([]);
  const [seasonalTrends, setSeasonalTrends] = useState<any>([]);
  
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

      // Generate enhanced analytics data (mock data for demonstration)
      generateEnhancedAnalytics();
      generateAdvancedAnalytics();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEnhancedAnalytics = () => {
    // Market Trends - 12 months of data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const marketData = months.map((month, index) => ({
      month,
      averagePrice: 450000 + (Math.sin(index / 2) * 50000) + (Math.random() * 30000),
      totalSales: 15 + Math.floor(Math.random() * 20),
      priceGrowth: -5 + (Math.random() * 15)
    }));
    setMarketTrends(marketData);

    // ROI Analysis
    const roiData = [
      { property: 'Sunset Villa', invested: 320000, currentValue: 385000, roi: 20.3 },
      { property: 'Ocean View', invested: 280000, currentValue: 315000, roi: 12.5 },
      { property: 'Mountain Lodge', invested: 420000, currentValue: 485000, roi: 15.5 },
      { property: 'City Loft', invested: 250000, currentValue: 275000, roi: 10.0 },
      { property: 'Garden Estate', invested: 380000, currentValue: 425000, roi: 11.8 }
    ];
    setRoiAnalysis(roiData);

    // Property Types Distribution
    setPropertyTypes({
      residential: 45,
      commercial: 25,
      industrial: 15,
      land: 10,
      luxury: 5
    });

    // Monthly Revenue (last 12 months)
    const revenueData = months.map((month, index) => ({
      month,
      revenue: 25000 + (Math.sin(index / 3) * 15000) + (Math.random() * 10000),
      profit: 15000 + (Math.sin(index / 3) * 8000) + (Math.random() * 5000)
    }));
    setMonthlyRevenue(revenueData);

    // Bid Success Rate
    setBidSuccessRate({
      successful: 68,
      failed: 32,
      totalBids: 156,
      winRate: 68
    });

    // Geographic Distribution
    const geoData = [
      { city: 'New York', properties: 25, avgPrice: 650000 },
      { city: 'Los Angeles', properties: 18, avgPrice: 580000 },
      { city: 'Chicago', properties: 15, avgPrice: 420000 },
      { city: 'Miami', properties: 12, avgPrice: 485000 },
      { city: 'Seattle', properties: 8, avgPrice: 520000 }
    ];
    setGeographicData(geoData);

    // Price Ranges
    setPriceRanges({
      under300k: 20,
      range300to500k: 35,
      range500to750k: 25,
      range750kto1m: 15,
      over1m: 5
    });

    // Activity Heatmap (hours of the day)
    const activityData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: Math.floor(Math.random() * 50) + 10,
      bids: Math.floor(Math.random() * 20) + 5
    }));
    setActivityHeatmap(activityData);
  };
  
  const generateAdvancedAnalytics = () => {
    // Performance Metrics (Radar Chart)
    setPerformanceMetrics({
      labels: ['ROI', 'Liquidity', 'Growth', 'Risk Management', 'Market Timing', 'Diversification'],
      datasets: [
        {
          label: 'Current Performance',
          data: [85, 72, 90, 78, 82, 88],
          backgroundColor: 'rgba(30, 58, 138, 0.2)',
          borderColor: '#1E3A8A',
          borderWidth: 2,
          pointBackgroundColor: '#1E3A8A',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#1E3A8A'
        },
        {
          label: 'Market Average',
          data: [70, 65, 75, 68, 72, 70],
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          borderColor: '#F59E0B',
          borderWidth: 2,
          pointBackgroundColor: '#F59E0B',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#F59E0B'
        }
      ]
    });

    // Portfolio Growth Timeline (24 months)
    const growthMonths = Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (23 - i));
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    });
    
    const portfolioGrowthData = growthMonths.map((month, index) => {
      const baseValue = 100000;
      const growth = Math.pow(1.12, index / 12); // 12% annual growth
      const volatility = 1 + (Math.sin(index / 3) * 0.1) + (Math.random() - 0.5) * 0.15;
      return {
        month,
        portfolioValue: baseValue * growth * volatility,
        benchmark: baseValue * Math.pow(1.08, index / 12), // 8% benchmark
        cashFlow: 2000 + (Math.random() * 3000)
      };
    });
    setPortfolioGrowth(portfolioGrowthData);

    // Market Sentiment Analysis
    const sentimentData = [
      { category: 'Residential', sentiment: 75, confidence: 88, trend: 'bullish' },
      { category: 'Commercial', sentiment: 68, confidence: 82, trend: 'neutral' },
      { category: 'Industrial', sentiment: 82, confidence: 75, trend: 'bullish' },
      { category: 'Luxury', sentiment: 65, confidence: 90, trend: 'bearish' },
      { category: 'Investment', sentiment: 78, confidence: 85, trend: 'bullish' }
    ];
    setMarketSentiment(sentimentData);

    // Investment Heatmap (Risk vs Return)
    const heatmapData = [
      { x: 8.5, y: 15.2, size: 25, label: 'Residential A' },
      { x: 12.1, y: 18.7, size: 35, label: 'Commercial B' },
      { x: 6.8, y: 12.4, size: 20, label: 'Industrial C' },
      { x: 15.3, y: 22.1, size: 45, label: 'Luxury D' },
      { x: 9.7, y: 16.8, size: 30, label: 'Mixed Use E' },
      { x: 11.2, y: 14.5, size: 28, label: 'Retail F' },
      { x: 7.9, y: 19.3, size: 32, label: 'Office G' },
      { x: 13.6, y: 25.7, size: 38, label: 'Development H' }
    ];
    setInvestmentHeatmap(heatmapData);

    // Predictive Analytics (Next 12 months)
    const futureMonths = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i + 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    });
    
    const predictiveData = futureMonths.map((month, index) => ({
      month,
      predicted: 485000 + (index * 15000) + (Math.sin(index / 2) * 25000),
      optimistic: 485000 + (index * 20000) + (Math.sin(index / 2) * 35000),
      pessimistic: 485000 + (index * 8000) + (Math.sin(index / 2) * 15000),
      confidence: 95 - (index * 2)
    }));
    setPredictiveAnalytics(predictiveData);

    // Risk Assessment
    setRiskAssessment({
      overall: 'Medium',
      score: 72,
      factors: {
        market: { risk: 'Low', score: 25 },
        liquidity: { risk: 'Medium', score: 45 },
        concentration: { risk: 'High', score: 75 },
        leverage: { risk: 'Low', score: 20 },
        timing: { risk: 'Medium', score: 55 }
      }
    });

    // Competitor Analysis
    const competitorData = [
      { name: 'PropertyTech Inc', marketShare: 24, growth: 15.2, efficiency: 88 },
      { name: 'RealEstate Pro', marketShare: 18, growth: 12.7, efficiency: 82 },
      { name: 'InvestCorp', marketShare: 16, growth: 8.9, efficiency: 75 },
      { name: 'Your Portfolio', marketShare: 14, growth: 18.5, efficiency: 92 },
      { name: 'AssetMgmt Ltd', marketShare: 12, growth: 10.3, efficiency: 78 }
    ];
    setCompetitorAnalysis(competitorData);

    // Seasonal Trends
    const seasonalData = [
      { season: 'Spring', avgPrice: 520000, volume: 145, appreciation: 12.5 },
      { season: 'Summer', avgPrice: 545000, volume: 168, appreciation: 15.2 },
      { season: 'Fall', avgPrice: 510000, volume: 134, appreciation: 8.7 },
      { season: 'Winter', avgPrice: 485000, volume: 98, appreciation: 5.3 }
    ];
    setSeasonalTrends(seasonalData);
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

  // Enhanced chart data functions
  const getMarketTrendsData = () => {
    return {
      labels: marketTrends.map((item: any) => item.month),
      datasets: [
        {
          label: 'Average Price',
          data: marketTrends.map((item: any) => item.averagePrice),
          borderColor: '#1E3A8A',
          backgroundColor: 'rgba(30, 58, 138, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Price Growth %',
          data: marketTrends.map((item: any) => item.priceGrowth * 10000), // Scale for visibility
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: false
        }
      ]
    };
  };

  const getRoiAnalysisData = () => {
    return {
      labels: roiAnalysis.map((item: any) => item.property),
      datasets: [
        {
          label: 'Invested',
          data: roiAnalysis.map((item: any) => item.invested),
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: '#DC2626',
          borderWidth: 1
        },
        {
          label: 'Current Value',
          data: roiAnalysis.map((item: any) => item.currentValue),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: '#059669',
          borderWidth: 1
        }
      ]
    };
  };

  const getPropertyTypesData = () => {
    return {
      labels: ['Residential', 'Commercial', 'Industrial', 'Land', 'Luxury'],
      datasets: [
        {
          data: [
            propertyTypes.residential || 0,
            propertyTypes.commercial || 0,
            propertyTypes.industrial || 0,
            propertyTypes.land || 0,
            propertyTypes.luxury || 0
          ],
          backgroundColor: [
            '#1E3A8A',
            '#F59E0B',
            '#10B981',
            '#EF4444',
            '#8B5CF6'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };
  };

  const getMonthlyRevenueData = () => {
    return {
      labels: monthlyRevenue.map((item: any) => item.month),
      datasets: [
        {
          label: 'Revenue',
          data: monthlyRevenue.map((item: any) => item.revenue),
          backgroundColor: 'rgba(139, 92, 246, 0.6)',
          borderColor: '#8B5CF6',
          borderWidth: 2
        },
        {
          label: 'Profit',
          data: monthlyRevenue.map((item: any) => item.profit),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: '#10B981',
          borderWidth: 2
        }
      ]
    };
  };

  const getBidSuccessData = () => {
    return {
      labels: ['Successful', 'Failed'],
      datasets: [
        {
          data: [bidSuccessRate.successful || 0, bidSuccessRate.failed || 0],
          backgroundColor: ['#10B981', '#EF4444'],
          borderWidth: 0,
          cutout: '70%'
        }
      ]
    };
  };

  const getGeographicData = () => {
    return {
      labels: geographicData.map((item: any) => item.city),
      datasets: [
        {
          label: 'Properties Count',
          data: geographicData.map((item: any) => item.properties),
          backgroundColor: 'rgba(245, 158, 11, 0.7)',
          borderColor: '#F59E0B',
          borderWidth: 1
        },
        {
          label: 'Avg Price (in $100K)',
          data: geographicData.map((item: any) => item.avgPrice / 100000), // Scale down for better visualization
          backgroundColor: 'rgba(30, 58, 138, 0.7)',
          borderColor: '#1E3A8A',
          borderWidth: 1
        }
      ]
    };
  };

  const getPriceRangeData = () => {
    return {
      labels: ['Under $300K', '$300K-$500K', '$500K-$750K', '$750K-$1M', 'Over $1M'],
      datasets: [
        {
          data: [
            priceRanges.under300k || 0,
            priceRanges.range300to500k || 0,
            priceRanges.range500to750k || 0,
            priceRanges.range750kto1m || 0,
            priceRanges.over1m || 0
          ],
          backgroundColor: [
            '#EF4444',
            '#F59E0B',
            '#10B981',
            '#1E3A8A',
            '#8B5CF6'
          ],
          borderWidth: 0
        }
      ]
    };
  };

  const getActivityHeatmapData = () => {
    return {
      labels: activityHeatmap.map((item: any) => `${item.hour}:00`),
      datasets: [
        {
          label: 'Platform Activity',
          data: activityHeatmap.map((item: any) => item.activity),
          backgroundColor: 'rgba(30, 58, 138, 0.6)',
          borderColor: '#1E3A8A',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Bid Activity',
          data: activityHeatmap.map((item: any) => item.bids),
          backgroundColor: 'rgba(245, 158, 11, 0.6)',
          borderColor: '#F59E0B',
          tension: 0.4,
          fill: false
        }
      ]
    };
  };

  // Advanced chart data functions
  const getPerformanceMetricsData = () => {
    return performanceMetrics;
  };

  const getPortfolioGrowthData = () => {
    return {
      labels: portfolioGrowth.map((item: any) => item.month),
      datasets: [
        {
          label: 'Portfolio Value',
          data: portfolioGrowth.map((item: any) => item.portfolioValue),
          borderColor: '#1E3A8A',
          backgroundColor: 'rgba(30, 58, 138, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Market Benchmark',
          data: portfolioGrowth.map((item: any) => item.benchmark),
          borderColor: '#DC2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          tension: 0.4,
          fill: false,
          borderDash: [5, 5]
        },
        {
          label: 'Cash Flow',
          data: portfolioGrowth.map((item: any) => item.cashFlow),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: false,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const getMarketSentimentData = () => {
    return {
      labels: marketSentiment.map((item: any) => item.category),
      datasets: [
        {
          label: 'Sentiment Score',
          data: marketSentiment.map((item: any) => item.sentiment),
          backgroundColor: marketSentiment.map((item: any) => 
            item.trend === 'bullish' ? 'rgba(16, 185, 129, 0.8)' :
            item.trend === 'bearish' ? 'rgba(239, 68, 68, 0.8)' :
            'rgba(245, 158, 11, 0.8)'
          ),
          borderColor: '#fff',
          borderWidth: 2
        }
      ]
    };
  };

  const getInvestmentHeatmapData = () => {
    return {
      datasets: [
        {
          label: 'Investment Opportunities',
          data: investmentHeatmap.map((item: any) => ({
            x: item.x,
            y: item.y,
            r: item.size / 2
          })),
          backgroundColor: 'rgba(30, 58, 138, 0.6)',
          borderColor: '#1E3A8A',
          borderWidth: 2
        }
      ]
    };
  };

  const getPredictiveAnalyticsData = () => {
    return {
      labels: predictiveAnalytics.map((item: any) => item.month),
      datasets: [
        {
          label: 'Predicted Value',
          data: predictiveAnalytics.map((item: any) => item.predicted),
          borderColor: '#1E3A8A',
          backgroundColor: 'rgba(30, 58, 138, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Optimistic Scenario',
          data: predictiveAnalytics.map((item: any) => item.optimistic),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: false,
          borderDash: [3, 3]
        },
        {
          label: 'Pessimistic Scenario',
          data: predictiveAnalytics.map((item: any) => item.pessimistic),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: false,
          borderDash: [3, 3]
        }
      ]
    };
  };

  const getRiskAssessmentData = () => {
    const factors = Object.values(riskAssessment.factors || {});
    return {
      labels: ['Market Risk', 'Liquidity Risk', 'Concentration Risk', 'Leverage Risk', 'Timing Risk'],
      datasets: [
        {
          data: factors.map((factor: any) => factor?.score || 0),
          backgroundColor: factors.map((factor: any) => {
            const score = factor?.score || 0;
            if (score < 30) return '#10B981'; // Low risk - green
            if (score < 60) return '#F59E0B'; // Medium risk - yellow
            return '#EF4444'; // High risk - red
          }),
          borderWidth: 0
        }
      ]
    };
  };

  const getCompetitorAnalysisData = () => {
    return {
      labels: competitorAnalysis.map((item: any) => item.name),
      datasets: [
        {
          label: 'Market Share (%)',
          data: competitorAnalysis.map((item: any) => item.marketShare),
          backgroundColor: 'rgba(30, 58, 138, 0.6)',
          borderColor: '#1E3A8A',
          borderWidth: 1
        },
        {
          label: 'Growth Rate (%)',
          data: competitorAnalysis.map((item: any) => item.growth),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: '#10B981',
          borderWidth: 1
        },
        {
          label: 'Efficiency Score',
          data: competitorAnalysis.map((item: any) => item.efficiency),
          backgroundColor: 'rgba(245, 158, 11, 0.6)',
          borderColor: '#F59E0B',
          borderWidth: 1
        }
      ]
    };
  };

  const getSeasonalTrendsData = () => {
    return {
      labels: seasonalTrends.map((item: any) => item.season),
      datasets: [
        {
          label: 'Average Price',
          data: seasonalTrends.map((item: any) => item.avgPrice),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)', // Spring - Green
            'rgba(245, 158, 11, 0.8)',  // Summer - Orange
            'rgba(239, 68, 68, 0.8)',   // Fall - Red
            'rgba(30, 58, 138, 0.8)'    // Winter - Blue
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
      <h1 className="text-3xl font-bold mb-8">Real Estate Analytics Dashboard</h1>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Your Balance</h3>
            <div className="h-10 w-10 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(user?.coins || 125000)}</p>
          <p className="text-sm text-slate-500 mt-1">Available for bidding</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Portfolio Value</h3>
            <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(1485000)}</p>
          <div className="flex items-center mt-1">
            <ArrowUp size={14} className="text-green-500 mr-1" />
            <span className="text-sm text-green-500">+12.5% this month</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Active Properties</h3>
            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <Home size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{properties.length || 8}</p>
          <p className="text-sm text-slate-500 mt-1">Total properties</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Success Rate</h3>
            <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <Target size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{bidSuccessRate.winRate || 68}%</p>
          <p className="text-sm text-slate-500 mt-1">Bid win rate</p>
        </motion.div>
      </div>

      {/* Market Trends & ROI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Market Trends</h2>
            <div className="h-8 w-8 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center">
              <LineChart size={16} />
            </div>
          </div>
          <div className="h-80">
            <Line 
              data={getMarketTrendsData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Month'
                    }
                  },
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Average Price ($)'
                    },
                    ticks: {
                      callback: (value) => formatCurrency(value as number),
                    },
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Sales Volume'
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  datalabels: {
                    display: false
                  }
                },
              }}
            />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">ROI Analysis</h2>
            <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <BarChart2 size={16} />
            </div>
          </div>
          <div className="h-80">
            <Bar 
              data={getRoiAnalysisData()} 
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
                    position: 'top',
                  },
                  datalabels: {
                    display: false
                  }
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Property Distribution & Monthly Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Property Types</h2>
            <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <PieChart size={16} />
            </div>
          </div>
          <div className="h-80">
            <Pie 
              data={getPropertyTypesData()}
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
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Monthly Revenue</h2>
            <div className="h-8 w-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="h-80">
            <Bar 
              data={getMonthlyRevenueData()} 
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
                    position: 'top',
                  },
                  datalabels: {
                    display: false
                  }
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Bid Success Rate, Geographic Distribution & Price Range */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Bid Success Rate</h2>
            <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div className="h-64">
            <Doughnut 
              data={getBidSuccessData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  datalabels: {
                    color: '#fff',
                    font: {
                      weight: 'bold',
                      size: 16
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
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-green-600">{bidSuccessRate.winRate || 68}%</p>
            <p className="text-sm text-slate-500">Success Rate</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Geographic Distribution</h2>
            <div className="h-8 w-8 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center">
              <MapPin size={16} />
            </div>
          </div>
          <div className="h-64">
            <Bar 
              data={getGeographicData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Properties'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Avg Price ($)'
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                    ticks: {
                      callback: (value) => formatCurrency(value as number),
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  datalabels: {
                    display: false
                  }
                },
              }}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Price Range Analysis</h2>
            <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <BarChart2 size={16} />
            </div>
          </div>
          <div className="h-64">
            <Doughnut 
              data={getPriceRangeData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 10,
                      padding: 10,
                      font: {
                        size: 11
                      }
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
        </motion.div>
      </div>

      {/* Activity Heatmap & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">24-Hour Activity Heatmap</h2>
            <div className="h-8 w-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <Activity size={16} />
            </div>
          </div>
          <div className="h-80">
            <Line 
              data={getActivityHeatmapData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Activity Count'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Hour of Day'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  datalabels: {
                    display: false
                  }
                },
                elements: {
                  point: {
                    radius: 3,
                    hoverRadius: 6
                  }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link to="/" className="text-sm text-blue-900 hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {/* Mock Recent Activity Data */}
            {[
              { type: 'bid', property: 'Sunset Villa', amount: 385000, time: '2 hours ago', status: 'winning' },
              { type: 'sale', property: 'Ocean View Condo', amount: 295000, time: '4 hours ago', status: 'completed' },
              { type: 'bid', property: 'Mountain Lodge', amount: 420000, time: '1 day ago', status: 'outbid' },
              { type: 'listing', property: 'City Loft', amount: 275000, time: '2 days ago', status: 'active' },
              { type: 'bid', property: 'Garden Estate', amount: 315000, time: '3 days ago', status: 'winning' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                  activity.type === 'bid' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {activity.type === 'bid' ? <Gavel size={16} /> :
                   activity.type === 'sale' ? <DollarSign size={16} /> :
                   <Home size={16} />}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-slate-900 truncate">
                    {activity.property}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-slate-500">
                      {formatCurrency(activity.amount)}
                    </span>
                    <span className={`flex items-center ${
                      activity.status === 'winning' || activity.status === 'completed' ? 'text-green-600' :
                      activity.status === 'outbid' ? 'text-red-500' :
                      'text-amber-600'
                    }`}>
                      {activity.status === 'winning' && <ArrowUp size={12} className="mr-1" />}
                      {activity.status === 'outbid' && <ArrowDown size={12} className="mr-1" />}
                      {activity.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <Clock size={14} className="mr-1" />
                  <span>{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI-Powered Insights & Summary */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-900 to-indigo-800 rounded-xl shadow-xl p-8 text-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">AI-Powered Portfolio Insights</h2>
          <div className="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Activity size={24} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <TrendingUp size={20} className="mr-2 text-green-300" />
              <h3 className="font-semibold">Market Opportunity</h3>
            </div>
            <p className="text-2xl font-bold text-green-300">High</p>
            <p className="text-sm opacity-80">Industrial properties showing 15%+ growth potential</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Target size={20} className="mr-2 text-blue-300" />
              <h3 className="font-semibold">Optimization Score</h3>
            </div>
            <p className="text-2xl font-bold text-blue-300">84/100</p>
            <p className="text-sm opacity-80">Portfolio is well-diversified across markets</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Award size={20} className="mr-2 text-yellow-300" />
              <h3 className="font-semibold">Performance Rank</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-300">Top 5%</p>
            <p className="text-sm opacity-80">Outperforming 95% of similar portfolios</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Activity size={20} className="mr-2 text-purple-300" />
              <h3 className="font-semibold">Market Timing</h3>
            </div>
            <p className="text-2xl font-bold text-purple-300">Excellent</p>
            <p className="text-sm opacity-80">Current market conditions favor your strategy</p>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4">Weekly AI Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-sm">Consider increasing allocation to industrial properties by 5-8% based on current market trends.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-sm">Monitor luxury property segment - showing signs of cooling with 3% price correction expected.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-sm">Excellent timing for West Coast markets - sentiment analysis shows 72% bullish indicators.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Advanced Analytics Section */}
      
      {/* Performance Metrics & Portfolio Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Performance Metrics</h2>
            <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <Target size={16} />
            </div>
          </div>
          <div className="h-80">
            <Radar 
              data={getPerformanceMetricsData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  datalabels: {
                    display: false
                  }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      stepSize: 20
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">A+</p>
              <p className="text-xs text-slate-500">Overall Grade</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">84</p>
              <p className="text-xs text-slate-500">Performance Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">#3</p>
              <p className="text-xs text-slate-500">Market Rank</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Portfolio Growth (24 Months)</h2>
            <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="h-80">
            <Line 
              data={getPortfolioGrowthData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Time Period'
                    }
                  },
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Portfolio Value ($)'
                    },
                    ticks: {
                      callback: (value) => formatCurrency(value as number),
                    },
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Cash Flow ($)'
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                    ticks: {
                      callback: (value) => formatCurrency(value as number),
                    },
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  datalabels: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Market Sentiment & Investment Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Market Sentiment Analysis</h2>
            <div className="h-8 w-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              <Activity size={16} />
            </div>
          </div>
          <div className="h-80">
            <PolarArea 
              data={getMarketSentimentData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  datalabels: {
                    color: '#fff',
                    font: {
                      weight: 'bold'
                    },
                    formatter: (value) => value + '%'
                  }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
              <span className="text-slate-600">Bullish</span>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
              <span className="text-slate-600">Neutral</span>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
              <span className="text-slate-600">Bearish</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Risk vs Return Analysis</h2>
            <div className="h-8 w-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <Target size={16} />
            </div>
          </div>
          <div className="h-80">
            <Scatter 
              data={getInvestmentHeatmapData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Risk Level (%)'
                    },
                    min: 0,
                    max: 20
                  },
                  y: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Expected Return (%)'
                    },
                    min: 0,
                    max: 30
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  datalabels: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const dataIndex = context.dataIndex;
                        const item = investmentHeatmap[dataIndex];
                        return `${item?.label}: Risk ${context.parsed.x}%, Return ${context.parsed.y}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">Bubble size represents investment amount</p>
          </div>
        </motion.div>
      </div>

      {/* Predictive Analytics & Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Predictive Analytics (12 Months)</h2>
            <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <LineChart size={16} />
            </div>
          </div>
          <div className="h-80">
            <Line 
              data={getPredictiveAnalyticsData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    title: {
                      display: true,
                      text: 'Predicted Value ($)'
                    },
                    ticks: {
                      callback: (value) => formatCurrency(value as number),
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  datalabels: {
                    display: false
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">{formatCurrency(620000)}</p>
              <p className="text-xs text-slate-500">12M Prediction</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">91%</p>
              <p className="text-xs text-slate-500">Confidence</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-600">+28%</p>
              <p className="text-xs text-slate-500">Expected Growth</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Risk Assessment</h2>
            <div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
              <Activity size={16} />
            </div>
          </div>
          <div className="h-64">
            <Doughnut 
              data={getRiskAssessmentData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 10,
                      padding: 15,
                      font: {
                        size: 11
                      }
                    }
                  },
                  datalabels: {
                    color: '#fff',
                    font: {
                      weight: 'bold',
                      size: 12
                    },
                    formatter: (value) => value
                  }
                }
              }}
            />
          </div>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-orange-600">{riskAssessment.overall || 'Medium'}</p>
            <p className="text-sm text-slate-500">Overall Risk Level</p>
            <p className="text-lg font-semibold text-slate-700 mt-2">{riskAssessment.score || 72}/100</p>
          </div>
        </motion.div>
      </div>

      {/* Competitor Analysis & Seasonal Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Competitor Analysis</h2>
            <div className="h-8 w-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
              <BarChart2 size={16} />
            </div>
          </div>
          <div className="h-80">
            <Bar 
              data={getCompetitorAnalysisData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Performance Metrics'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  datalabels: {
                    display: false
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Your Portfolio</strong> ranks 4th in market share but leads in growth rate and efficiency!
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Seasonal Market Trends</h2>
            <div className="h-8 w-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="h-80">
            <PolarArea 
              data={getSeasonalTrendsData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  datalabels: {
                    color: '#fff',
                    font: {
                      weight: 'bold'
                    },
                    formatter: (value) => formatCurrency(value)
                  }
                },
                scales: {
                  r: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              <strong>Summer</strong> shows highest prices and volume
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;