import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, MapPinIcon, CalendarIcon, CurrencyDollarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import StopCard from '../../components/trip/StopCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/common/FormInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Navbar from '../../components/common/Navbar';
import { format } from 'date-fns';

const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteTrip } = useApp();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showEditStopModal, setShowEditStopModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  // Form states
  const [stopFormData, setStopFormData] = useState({
    cityName: '',
    country: '',
    startDate: '',
    endDate: '',
    estimatedCost: ''
  });
  const [activityFormData, setActivityFormData] = useState({
    name: '',
    category: 'Sightseeing',
    cost: '',
    date: '',
    duration: ''
  });
  
  const [currentStop, setCurrentStop] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentStopId, setCurrentStopId] = useState(null);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const tripData = await api.getTripById(id);
      setTrip(tripData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStop = async () => {
    try {
      const newStop = await api.addStop(id, stopFormData);
      setTrip(prev => ({
        ...prev,
        stops: [...prev.stops, newStop]
      }));
      setShowAddStopModal(false);
      resetStopForm();
    } catch (error) {
      console.error('Failed to add stop:', error);
    }
  };

  const handleEditStop = async () => {
    try {
      const updatedStop = await api.updateStop(id, currentStop.id, stopFormData);
      setTrip(prev => ({
        ...prev,
        stops: prev.stops.map(stop => 
          stop.id === currentStop.id ? updatedStop : stop
        )
      }));
      setShowEditStopModal(false);
      resetStopForm();
    } catch (error) {
      console.error('Failed to update stop:', error);
    }
  };

  const handleDeleteStop = async (stopId) => {
    try {
      await api.deleteStop(id, stopId);
      setTrip(prev => ({
        ...prev,
        stops: prev.stops.filter(stop => stop.id !== stopId)
      }));
    } catch (error) {
      console.error('Failed to delete stop:', error);
    }
  };

  const handleAddActivity = async () => {
    try {
      const newActivity = await api.addActivity(id, currentStopId, activityFormData);
      setTrip(prev => ({
        ...prev,
        stops: prev.stops.map(stop =>
          stop.id === currentStopId
            ? { ...stop, activities: [...stop.activities, newActivity] }
            : stop
        )
      }));
      setShowAddActivityModal(false);
      resetActivityForm();
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  };

  const handleEditActivity = async () => {
    try {
      const updatedActivity = await api.updateActivity(id, currentStopId, currentActivity.id, activityFormData);
      setTrip(prev => ({
        ...prev,
        stops: prev.stops.map(stop =>
          stop.id === currentStopId
            ? {
                ...stop,
                activities: stop.activities.map(activity =>
                  activity.id === currentActivity.id ? updatedActivity : activity
                )
              }
            : stop
        )
      }));
      setShowEditActivityModal(false);
      resetActivityForm();
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      const stopWithActivity = trip.stops.find(stop => 
        stop.activities.some(activity => activity.id === activityId)
      );
      
      if (stopWithActivity) {
        await api.deleteActivity(id, stopWithActivity.id, activityId);
        setTrip(prev => ({
          ...prev,
          stops: prev.stops.map(stop =>
            stop.id === stopWithActivity.id
              ? { ...stop, activities: stop.activities.filter(activity => activity.id !== activityId) }
              : stop
          )
        }));
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  const resetStopForm = () => {
    setStopFormData({
      cityName: '',
      country: '',
      startDate: '',
      endDate: '',
      estimatedCost: ''
    });
    setCurrentStop(null);
  };

  const resetActivityForm = () => {
    setActivityFormData({
      name: '',
      category: 'Sightseeing',
      cost: '',
      date: '',
      duration: ''
    });
    setCurrentActivity(null);
    setCurrentStopId(null);
  };

  const openEditStopModal = (stop) => {
    setCurrentStop(stop);
    setStopFormData({
      cityName: stop.cityName,
      country: stop.country,
      startDate: stop.startDate,
      endDate: stop.endDate,
      estimatedCost: stop.estimatedCost?.toString() || ''
    });
    setShowEditStopModal(true);
  };

  const openAddActivityModal = (stopId) => {
    setCurrentStopId(stopId);
    setShowAddActivityModal(true);
  };

  const openEditActivityModal = (activity) => {
    const stop = trip.stops.find(stop => 
      stop.activities.some(act => act.id === activity.id)
    );
    
    setCurrentStopId(stop.id);
    setCurrentActivity(activity);
    setActivityFormData({
      name: activity.name,
      category: activity.category,
      cost: activity.cost?.toString() || '',
      date: activity.date || '',
      duration: activity.duration?.toString() || ''
    });
    setShowEditActivityModal(true);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
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
            <h1 className="text-2xl font-bold text-red-900 mb-2">Trip Not Found</h1>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 rounded-xl overflow-hidden"
        >
          {/* Cover Image */}
          <div className="h-64 lg:h-80 relative">
            <img
              src={trip.coverImage || 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1200'}
              alt={trip.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Trip Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div className="text-white mb-4 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    {trip.name}
                  </h1>
                  {trip.description && (
                    <p className="text-lg text-gray-200 mb-4 max-w-2xl">
                      {trip.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                    </div>
                    
                    {trip.destinations && trip.destinations.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{trip.destinations.length} destinations</span>
                      </div>
                    )}
                    
                    {trip.totalBudget && (
                      <div className="flex items-center space-x-1">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>${trip.totalBudget.toLocaleString()} budget</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Trip
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="bg-red-600/80 border-red-500/50 text-white hover:bg-red-700/80"
                    onClick={() => setShowDeleteConfirmModal(true)}
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trip Itinerary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
              <Button
                onClick={() => setShowAddStopModal(true)}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Stop</span>
              </Button>
            </div>

            {trip.stops && trip.stops.length > 0 ? (
              <div className="space-y-6">
                {trip.stops.map((stop, index) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StopCard
                      stop={stop}
                      onEditStop={openEditStopModal}
                      onDeleteStop={handleDeleteStop}
                      onAddActivity={openAddActivityModal}
                      onEditActivity={openEditActivityModal}
                      onDeleteActivity={handleDeleteActivity}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-12 text-center"
              >
                <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No stops planned yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Add your first destination to start building your itinerary.
                </p>
                <Button onClick={() => setShowAddStopModal(true)}>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add First Stop
                </Button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trip Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Stops</span>
                  <span className="font-medium">{trip.stops?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Activities</span>
                  <span className="font-medium">
                    {trip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estimated Budget</span>
                  <span className="font-medium">
                    ${trip.stops?.reduce((sum, stop) => sum + (stop.estimatedCost || 0), 0).toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate(`/trips/${id}/budget`)}
                >
                  <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                  Manage Budget
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                >
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                >
                  Share Trip
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Stop Modal */}
      <Modal
        isOpen={showAddStopModal}
        onClose={() => setShowAddStopModal(false)}
        title="Add New Stop"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="City"
              value={stopFormData.cityName}
              onChange={(e) => setStopFormData(prev => ({ ...prev, cityName: e.target.value }))}
              placeholder="Paris"
              required
            />
            <FormInput
              label="Country"
              value={stopFormData.country}
              onChange={(e) => setStopFormData(prev => ({ ...prev, country: e.target.value }))}
              placeholder="France"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              type="date"
              value={stopFormData.startDate}
              onChange={(e) => setStopFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
            <FormInput
              label="End Date"
              type="date"
              value={stopFormData.endDate}
              onChange={(e) => setStopFormData(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>
          <FormInput
            label="Estimated Cost"
            type="number"
            value={stopFormData.estimatedCost}
            onChange={(e) => setStopFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
            placeholder="1000"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddStopModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStop}>
              Add Stop
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Stop Modal */}
      <Modal
        isOpen={showEditStopModal}
        onClose={() => setShowEditStopModal(false)}
        title="Edit Stop"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="City"
              value={stopFormData.cityName}
              onChange={(e) => setStopFormData(prev => ({ ...prev, cityName: e.target.value }))}
              placeholder="Paris"
              required
            />
            <FormInput
              label="Country"
              value={stopFormData.country}
              onChange={(e) => setStopFormData(prev => ({ ...prev, country: e.target.value }))}
              placeholder="France"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              type="date"
              value={stopFormData.startDate}
              onChange={(e) => setStopFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
            <FormInput
              label="End Date"
              type="date"
              value={stopFormData.endDate}
              onChange={(e) => setStopFormData(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>
          <FormInput
            label="Estimated Cost"
            type="number"
            value={stopFormData.estimatedCost}
            onChange={(e) => setStopFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
            placeholder="1000"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowEditStopModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStop}>
              Update Stop
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Activity Modal */}
      <Modal
        isOpen={showAddActivityModal}
        onClose={() => setShowAddActivityModal(false)}
        title="Add New Activity"
      >
        <div className="space-y-4">
          <FormInput
            label="Activity Name"
            value={activityFormData.name}
            onChange={(e) => setActivityFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Eiffel Tower Visit"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={activityFormData.category}
                onChange={(e) => setActivityFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value="Sightseeing">Sightseeing</option>
                <option value="Food">Food</option>
                <option value="Culture">Culture</option>
                <option value="Adventure">Adventure</option>
                <option value="Shopping">Shopping</option>
                <option value="Nightlife">Nightlife</option>
                <option value="Transportation">Transportation</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <FormInput
              label="Cost"
              type="number"
              value={activityFormData.cost}
              onChange={(e) => setActivityFormData(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="50"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Date & Time"
              type="datetime-local"
              value={activityFormData.date}
              onChange={(e) => setActivityFormData(prev => ({ ...prev, date: e.target.value }))}
            />
            <FormInput
              label="Duration (hours)"
              type="number"
              value={activityFormData.duration}
              onChange={(e) => setActivityFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="2"
              step="0.5"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddActivityModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddActivity}>
              Add Activity
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Activity Modal */}
      <Modal
        isOpen={showEditActivityModal}
        onClose={() => setShowEditActivityModal(false)}
        title="Edit Activity"
      >
        <div className="space-y-4">
          <FormInput
            label="Activity Name"
            value={activityFormData.name}
            onChange={(e) => setActivityFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Eiffel Tower Visit"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={activityFormData.category}
                onChange={(e) => setActivityFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value="Sightseeing">Sightseeing</option>
                <option value="Food">Food</option>
                <option value="Culture">Culture</option>
                <option value="Adventure">Adventure</option>
                <option value="Shopping">Shopping</option>
                <option value="Nightlife">Nightlife</option>
                <option value="Transportation">Transportation</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <FormInput
              label="Cost"
              type="number"
              value={activityFormData.cost}
              onChange={(e) => setActivityFormData(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="50"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Date & Time"
              type="datetime-local"
              value={activityFormData.date}
              onChange={(e) => setActivityFormData(prev => ({ ...prev, date: e.target.value }))}
            />
            <FormInput
              label="Duration (hours)"
              type="number"
              value={activityFormData.duration}
              onChange={(e) => setActivityFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="2"
              step="0.5"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowEditActivityModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditActivity}>
              Update Activity
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="Delete Trip"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrashIcon className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure you want to delete this trip?
          </h3>
          <p className="text-gray-600 mb-6">
            This action cannot be undone. All stops, activities, and data will be permanently deleted.
          </p>
          <div className="flex justify-center space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteTrip}>
              Delete Trip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TripDetailPage;