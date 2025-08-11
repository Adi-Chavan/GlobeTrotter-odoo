import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, PhotoIcon, GlobeAltIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import Navbar from '../../components/common/Navbar';

const CreateTripPage = () => {
  const navigate = useNavigate();
  const { createTrip, loading } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverImage: '',
    isPublic: false
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Trip name is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (formData.coverImage && !isValidUrl(formData.coverImage)) {
      errors.coverImage = 'Please enter a valid image URL';
    }
    
    return errors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const newTrip = await createTrip(formData);
      navigate(`/trips/${newTrip.id}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Trip
          </h1>
          <p className="text-gray-600">
            Start planning your next adventure by setting up the basic details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Name */}
            <FormInput
              label="Trip Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., European Summer Adventure"
              error={formErrors.name}
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your trip plans..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <FormInput
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={formErrors.startDate}
                  required
                />
                <CalendarIcon className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <FormInput
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={formErrors.endDate}
                  required
                />
                <CalendarIcon className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-4">
              <div className="relative">
                <FormInput
                  label="Cover Image URL (Optional)"
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  error={formErrors.coverImage}
                />
                <PhotoIcon className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Image Preview */}
              {formData.coverImage && isValidUrl(formData.coverImage) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              )}
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="isPublic" className="flex items-center text-sm font-medium text-gray-700">
                    {formData.isPublic ? (
                      <EyeIcon className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <EyeSlashIcon className="h-4 w-4 mr-2 text-gray-500" />
                    )}
                    Make this trip public
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.isPublic
                      ? 'Other users will be able to view and get inspired by your trip'
                      : 'Only you will be able to see this trip'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center space-x-4 pt-6">
              <Button
                type="submit"
                loading={loading}
                className="flex-1 md:flex-initial"
              >
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                Create Trip
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex-1 md:flex-initial"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            💡 Trip Planning Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Give your trip a memorable name that captures the essence of your adventure</li>
            <li>• Add a cover photo that inspires you - it will be the first thing you see!</li>
            <li>• You can always edit these details later as your plans evolve</li>
            <li>• Making your trip public lets others discover and get inspired by your itinerary</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTripPage;