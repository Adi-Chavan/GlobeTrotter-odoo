import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon,
  PencilIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import Navbar from '../../components/common/Navbar';

const ProfilePage = () => {
  const { user, trips, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});

  const handleSave = () => {
    updateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user || {});
    setIsEditing(false);
  };

  const getUserStats = () => {
    const userTrips = trips.filter(trip => trip.userId === user?.id);
    const completedTrips = userTrips.filter(trip => trip.status === 'completed');
    const upcomingTrips = userTrips.filter(trip => trip.status === 'upcoming');
    
    const countries = [...new Set(userTrips.map(trip => trip.destination?.split(',')[1]?.trim()).filter(Boolean))];
    
    return {
      totalTrips: userTrips.length,
      completedTrips: completedTrips.length,
      upcomingTrips: upcomingTrips.length,
      countriesVisited: countries.length,
      userTrips
    };
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32" />
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white overflow-hidden shadow-lg">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors">
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User Name'}</h1>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Member since {new Date(user?.joinDate || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalTrips}</p>
            <p className="text-gray-600 text-sm">Total Trips</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.completedTrips}</p>
            <p className="text-gray-600 text-sm">Completed</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.upcomingTrips}</p>
            <p className="text-gray-600 text-sm">Upcoming</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.countriesVisited}</p>
            <p className="text-gray-600 text-sm">Countries</p>
          </div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-gray-900">{user?.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{user?.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <p className="text-gray-900">{user?.country || 'Not provided'}</p>
            </div>
          </div>
          
          {user?.bio && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <p className="text-gray-900">{user.bio}</p>
            </div>
          )}
        </motion.div>

        {/* Recent Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Trips</h2>
            <Link to="/trips">
              <Button size="sm">View All Trips</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.userTrips.slice(0, 3).map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 truncate">{trip.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                    trip.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {trip.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2 flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {trip.destination}
                </p>
                
                <p className="text-gray-600 text-sm mb-4 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(trip.startDate).toLocaleDateString()}
                </p>
                
                <Link to={`/trips/${trip.id}`}>
                  <Button size="sm" variant="secondary" className="w-full">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Trip
                  </Button>
                </Link>
              </motion.div>
            ))}
            
            {stats.userTrips.length === 0 && (
              <div className="col-span-full text-center py-8">
                <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
                <p className="text-gray-600 mb-4">Start planning your first adventure!</p>
                <Link to="/trips/create">
                  <Button>Plan Your First Trip</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editedUser.name || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedUser.email || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editedUser.phone || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={editedUser.country || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editedUser.bio || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="secondary" onClick={handleCancel}>
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;