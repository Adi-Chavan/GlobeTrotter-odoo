import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  UserIcon,
  GlobeAltIcon,
  ShareIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import StopCard from '../../components/trip/StopCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Navbar from '../../components/common/Navbar';
import { format } from 'date-fns';

const SharedTripPage = () => {
  const { shareId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shareId) {
      loadSharedTrip();
    }
  }, [shareId]);

  const loadSharedTrip = async () => {
    try {
      setLoading(true);
      console.log('Loading shared trip with shareId:', shareId);
      
      const tripData = await api.getSharedTrip(shareId);
      console.log('Shared trip loaded:', tripData);
      
      setTrip(tripData);
    } catch (error) {
      console.error('Failed to load shared trip:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-900 mb-2">Trip Not Available</h1>
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-red-600 text-sm">
              This trip might have been made private or the link is no longer valid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Shared Trip Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="h-6 w-6" />
              <span className="font-medium">You're viewing a shared trip itinerary</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyShareLink}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Cover Image with Gradient Overlay */}
          <div className="h-80 lg:h-96 relative">
            <img
              src={trip.coverImage || 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1200'}
              alt={trip.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Trip Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    trip.status === 'upcoming' ? 'bg-blue-500' : 
                    trip.status === 'ongoing' ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-500">
                    Shared Trip
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {trip.name}
                </h1>
                
                {trip.description && (
                  <p className="text-xl text-gray-200 mb-6 max-w-3xl leading-relaxed">
                    {trip.description}
                  </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-6 w-6" />
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>
                  
                  {trip.destinations && trip.destinations.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-6 w-6" />
                      <span>{trip.destinations.length} destinations</span>
                    </div>
                  )}
                  
                  {trip.user && (
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-6 w-6" />
                      <span>by {trip.user.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trip Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {trip.stops?.length || 0}
            </div>
            <div className="text-gray-600">Stops</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {trip.stops?.reduce((total, stop) => total + (stop.activities?.length || 0), 0) || 0}
            </div>
            <div className="text-gray-600">Activities</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) || 0}
            </div>
            <div className="text-gray-600">Days</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {trip.totalBudget ? `$${trip.totalBudget.toLocaleString()}` : 'N/A'}
            </div>
            <div className="text-gray-600">Budget</div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Trip Itinerary */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Trip Itinerary</h2>
                <div className="text-sm text-gray-500">
                  Shared by {trip.user?.name || 'Anonymous'}
                </div>
              </div>

              {trip.stops && trip.stops.length > 0 ? (
                <div className="space-y-6">
                  {trip.stops.map((stop, index) => (
                    <motion.div
                      key={stop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <StopCard
                        stop={stop}
                        isReadOnly={true}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-16 text-center"
                >
                  <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">
                    No itinerary details available
                  </h3>
                  <p className="text-gray-600 text-lg">
                    This trip doesn't have any stops planned yet.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Destination</div>
                  <div className="font-medium">{trip.destination || trip.primaryDestination || 'Not specified'}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Duration</div>
                  <div className="font-medium">
                    {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                    trip.status === 'ongoing' ? 'bg-green-100 text-green-800' : 
                    trip.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
                  </span>
                </div>
                
                {trip.totalBudget && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Budget</div>
                    <div className="font-medium text-green-600">${trip.totalBudget.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Share Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Like this trip?</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={copyShareLink}
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share with Friends
                </Button>
                
                <p className="text-sm text-gray-600 text-center">
                  Create your own amazing travel experiences!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedTripPage;
