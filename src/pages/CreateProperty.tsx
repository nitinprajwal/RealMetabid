import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Image, MapPin, Youtube, Calendar, DollarSign, Plus, Info, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleMap from '../components/ui/GoogleMap';

const CreateProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photo_url: '',
    square_footage: '',
    year_built: '',
    address: '',
    youtube_url: '',
    amount: '',
    initial_bid: '',
    bid_increment: '',
    bid_end_date: '',
    additional_info: {
      images: [] as string[]
    }
  });
  
  const [saving, setSaving] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const [showMapPreview, setShowMapPreview] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Show map preview when an address is entered
    if (name === 'address' && value.trim()) {
      setShowMapPreview(true);
    } else if (name === 'address' && !value.trim()) {
      setShowMapPreview(false);
    }
  };

  const handleImageAdd = () => {
    if (!imageInput.trim()) return;

    setFormData(prev => ({
      ...prev,
      additional_info: {
        ...prev.additional_info,
        images: [...prev.additional_info.images, imageInput.trim()]
      }
    }));
    setImageInput('');
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_info: {
        ...prev.additional_info,
        images: prev.additional_info.images.filter((_, i) => i !== index)
      }
    }));
  };

  const handleBulkImageAdd = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
    setFormData(prev => ({
      ...prev,
      additional_info: {
        ...prev.additional_info,
        images: [...prev.additional_info.images, ...urls]
      }
    }));
    e.target.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!user) {
        toast.error('You must be logged in to create a property');
        return;
      }
      
      setSaving(true);
      
      // Validate form data
      if (!formData.name || !formData.description || !formData.photo_url || 
          !formData.amount || !formData.initial_bid || !formData.bid_increment || 
          !formData.bid_end_date) {
        toast.error('Please fill in all required fields');
        setSaving(false);
        return;
      }
      
      // Convert numeric fields
      const propertyData = {
        ...formData,
        owner_id: user.id,
        amount: parseFloat(formData.amount),
        initial_bid: parseFloat(formData.initial_bid),
        bid_increment: parseFloat(formData.bid_increment),
        square_footage: formData.square_footage ? parseFloat(formData.square_footage) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        is_active: true
      };
      
      // Insert into database
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select();
        
      if (error) throw error;
      
      toast.success('Property created successfully');
      
      // Navigate to the new property page
      if (data && data[0]) {
        navigate(`/properties/${data[0].id}`);
      } else {
        navigate('/');
      }
      
    } catch (error: any) {
      console.error('Error creating property:', error);
      toast.error(error.message || 'Failed to create property');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
        <p className="text-slate-600">Please log in to create a property</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8">Create New Property Listing</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter property name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input h-32 resize-none"
                    placeholder="Enter property description"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="photo_url" className="block text-sm font-medium text-slate-700 mb-1">
                    Main Photo URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="url"
                      id="photo_url"
                      name="photo_url"
                      value={formData.photo_url}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Enter main photo URL"
                      required
                    />
                  </div>
                </div>

                {/* Additional Images Section */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Images
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        className="input flex-grow"
                        placeholder="Enter image URL"
                      />
                      <button
                        type="button"
                        onClick={handleImageAdd}
                        className="btn btn-secondary"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        Or paste multiple URLs (comma-separated)
                      </label>
                      <textarea
                        className="input"
                        placeholder="url1, url2, url3..."
                        onChange={handleBulkImageAdd}
                        rows={2}
                      />
                    </div>

                    <AnimatePresence>
                      {formData.additional_info.images.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-2 gap-2"
                        >
                          {formData.additional_info.images.map((url, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="relative group"
                            >
                              <img
                                src={url}
                                alt={`Additional ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="border-t border-slate-200 pt-6"
            >
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="square_footage" className="block text-sm font-medium text-slate-700 mb-1">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    id="square_footage"
                    name="square_footage"
                    value={formData.square_footage}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., 2000"
                  />
                </div>
                
                <div>
                  <label htmlFor="year_built" className="block text-sm font-medium text-slate-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    id="year_built"
                    name="year_built"
                    value={formData.year_built}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., 2010"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                    Property Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Enter property address (e.g., 123 Main St, City, State)"
                    />
                  </div>
                  
                  {showMapPreview && formData.address && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <GoogleMap
                        address={formData.address}
                        height="200px"
                        className="rounded-lg"
                      />
                    </motion.div>
                  )}
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="youtube_url" className="block text-sm font-medium text-slate-700 mb-1">
                    YouTube Embed URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Youtube size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="url"
                      id="youtube_url"
                      name="youtube_url"
                      value={formData.youtube_url}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Enter YouTube embed URL"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="border-t border-slate-200 pt-6"
            >
              <h2 className="text-xl font-semibold mb-4">Auction Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
                    Property Value <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Enter property value"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="initial_bid" className="block text-sm font-medium text-slate-700 mb-1">
                    Initial Bid <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="number"
                      id="initial_bid"
                      name="initial_bid"
                      value={formData.initial_bid}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Enter initial bid amount"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bid_increment" className="block text-sm font-medium text-slate-700 mb-1">
                    Bid Increment <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Plus size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="number"
                      id="bid_increment"
                      name="bid_increment"
                      value={formData.bid_increment}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Enter bid increment amount"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bid_end_date" className="block text-sm font-medium text-slate-700 mb-1">
                    Bid End Date & Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="datetime-local"
                      id="bid_end_date"
                      name="bid_end_date"
                      value={formData.bid_end_date}
                      onChange={handleChange}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="border-t border-slate-200 pt-6"
            >
              <div className="bg-amber-50 p-4 rounded-lg mb-6 flex">
                <Info size={20} className="text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  By creating this property listing, you certify that you have the right to list this property for auction and that all information provided is accurate.
                </p>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full py-3"
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Property...
                  </div>
                ) : (
                  'Create Property Listing'
                )}
              </button>
            </motion.div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateProperty;