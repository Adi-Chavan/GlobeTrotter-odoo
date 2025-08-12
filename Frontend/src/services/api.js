// Real API service for GlobeTrotter backend
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  return handleResponse(response);
};

// API functions
export const api = {
  // Auth
  async login(email, password) {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(userData) {
    return makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async logout() {
    return makeRequest('/auth/logout', {
      method: 'POST',
    });
  },

  async getCurrentUser() {
    return makeRequest('/auth/me');
  },

  // Trips
  async getTrips() {
    console.log('API getTrips called - fetching from backend');
    return makeRequest('/trips');
  },

  async getPublicTrips() {
    return makeRequest('/trips/public');
  },

  async getTripById(id) {
    console.log('API getTripById called with ID:', id);
    return makeRequest(`/trips/${id}`);
  },

  async createTrip(tripData) {
    console.log('API createTrip called with data:', tripData);
    return makeRequest('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  },

  async updateTrip(id, updates) {
    return makeRequest(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteTrip(id) {
    return makeRequest(`/trips/${id}`, {
      method: 'DELETE',
    });
  },

  // Sharing functionality
  async generateShareLink(id) {
    console.log('API generateShareLink called with ID:', id);
    return makeRequest(`/trips/${id}/share`, {
      method: 'POST',
    });
  },

  async getSharedTrip(shareId) {
    console.log('API getSharedTrip called with shareId:', shareId);
    return makeRequest(`/trips/shared/${shareId}`);
  },

  async toggleTripVisibility(id, isPublic) {
    return makeRequest(`/trips/${id}/visibility`, {
      method: 'PUT',
      body: JSON.stringify({ isPublic }),
    });
  },

  // Stops
  async addStop(tripId, stopData) {
    console.log('API addStop called:', { tripId, stopData });
    return makeRequest('/stops', {
      method: 'POST',
      body: JSON.stringify({
        ...stopData,
        trip: tripId
      }),
    });
  },

  async updateStop(tripId, stopId, updates) {
    return makeRequest(`/stops/${stopId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updates,
        trip: tripId
      }),
    });
  },

  async deleteStop(tripId, stopId) {
    return makeRequest(`/stops/${stopId}`, {
      method: 'DELETE',
    });
  },

  // Activities
  async addActivity(tripId, stopId, activityData) {
    console.log('API addActivity called:', { tripId, stopId, activityData });
    return makeRequest('/activities', {
      method: 'POST',
      body: JSON.stringify({
        ...activityData,
        stop: stopId
      }),
    });
  },

  async updateActivity(tripId, stopId, activityId, updates) {
    return makeRequest(`/activities/${activityId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updates,
        stop: stopId
      }),
    });
  },

  async deleteActivity(tripId, stopId, activityId) {
    return makeRequest(`/activities/${activityId}`, {
      method: 'DELETE',
    });
  },

  // Cities
  async searchCities(searchTerm, country = null) {
    const params = new URLSearchParams({ search: searchTerm });
    if (country) params.append('country', country);
    return makeRequest(`/cities?${params}`);
  },

  async createCity(cityData) {
    return makeRequest('/cities', {
      method: 'POST',
      body: JSON.stringify(cityData),
    });
  },

  // Profile
  async updateProfile(userData) {
    return makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Mock Recommendations (until we implement real recommendation service)
  async getWeatherRecommendations(destination, startDate, endDate) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      temperature: Math.floor(Math.random() * 15) + 15,
      condition: ['Sunny', 'Partly Cloudy', 'Rainy', 'Clear', 'Cloudy'][Math.floor(Math.random() * 5)],
      humidity: Math.floor(Math.random() * 30) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      recommendation: this.getWeatherRecommendationText(destination),
      forecast: this.generateWeatherForecast(startDate, endDate)
    };
  },

  getWeatherRecommendationText(destination) {
    const tips = [
      'Perfect weather for outdoor activities!',
      'Great time to explore the city on foot',
      'Ideal conditions for sightseeing',
      'Perfect for both indoor and outdoor activities',
      'Great weather for photography and tours'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  },

  generateWeatherForecast(startDate, endDate) {
    const forecast = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      forecast.push({
        date: d.toISOString().split('T')[0],
        temperature: Math.floor(Math.random() * 15) + 15,
        condition: ['Sunny', 'Partly Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 4)]
      });
    }
    return forecast.slice(0, 7); // Limit to 7 days
  },

  async getHotelRecommendations(destination) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const hotelTypes = ['Grand Hotel', 'Resort', 'Boutique Hotel', 'Business Hotel', 'Budget Inn'];
    const amenities = [
      ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
      ['WiFi', 'Breakfast', 'Parking', 'Room Service'],
      ['WiFi', 'Restaurant', 'Bar', 'Concierge'],
      ['WiFi', 'Breakfast', 'Gym', 'Business Center'],
      ['WiFi', 'Breakfast']
    ];

    return hotelTypes.map((type, index) => ({
      id: index + 1,
      name: `${destination} ${type}`,
      rating: 3.5 + Math.random() * 1.5,
      price: Math.floor(Math.random() * 200) + 50,
      amenities: amenities[index] || amenities[0],
      distance: `${(Math.random() * 3).toFixed(1)}km from city center`,
      image: `https://images.pexels.com/photos/566073${index + 1}/pexels-photo-566073${index + 1}.jpeg?auto=compress&cs=tinysrgb&w=400`
    }));
  },

  async getTransportRecommendations(destination) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: 1,
        route: `Airport ↔ ${destination} Center`,
        type: 'Airport Express',
        frequency: 'Every 15 minutes',
        price: '$5-8',
        duration: '25-35 minutes',
        description: 'Direct connection from airport to city center'
      },
      {
        id: 2,
        route: `${destination} City Bus`,
        type: 'Public Bus',
        frequency: 'Every 10-20 minutes',
        price: '$2-3',
        duration: '15-30 minutes',
        description: 'Comprehensive city coverage with multiple routes'
      },
      {
        id: 3,
        route: `${destination} Metro/Subway`,
        type: 'Metro',
        frequency: 'Every 5-10 minutes',
        price: '$3-5',
        duration: '10-25 minutes',
        description: 'Fast underground transport system'
      },
      {
        id: 4,
        route: `${destination} Tourist Bus`,
        type: 'Hop-on Hop-off',
        frequency: 'Every 30 minutes',
        price: '$15-25',
        duration: '2-3 hours full route',
        description: 'Sightseeing bus with tourist attractions'
      }
    ];
  },

  async getActivityRecommendations(destination) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const categories = ['Sightseeing', 'Culture', 'Food & Drink', 'Adventure', 'Entertainment', 'Shopping'];
    const activities = [
      'Walking Tour', 'Museum Visit', 'Food Experience', 'Adventure Park', 'Live Show', 'Market Tour',
      'Historical Tour', 'Art Gallery', 'Cooking Class', 'Hiking Trail', 'Concert', 'Shopping District',
      'Architecture Tour', 'Cultural Site', 'Wine Tasting', 'Water Sports', 'Theater', 'Local Crafts',
      'Landmark Visit', 'Traditional Performance', 'Street Food Tour', 'Outdoor Activity', 'Music Venue', 'Souvenir Shopping'
    ];

    return activities.slice(0, 8).map((activity, index) => ({
      id: index + 1,
      name: `${destination} ${activity}`,
      category: categories[index % categories.length],
      duration: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 3) + 2} hours`,
      price: `$${Math.floor(Math.random() * 80) + 10}`,
      rating: 3.5 + Math.random() * 1.5,
      description: this.getActivityDescription(activity),
      image: `https://images.pexels.com/photos/171740${index + 1}/pexels-photo-171740${index + 1}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      highlights: this.getActivityHighlights(activity)
    }));
  },

  getActivityDescription(activity) {
    const descriptions = {
      'Walking Tour': 'Explore the historic landmarks and hidden gems with expert local guides',
      'Museum Visit': 'Discover the rich history and culture through carefully curated exhibitions',
      'Food Experience': 'Taste authentic local cuisine with expert guides and local recommendations',
      'Adventure Park': 'Thrilling outdoor activities and adventures for all skill levels',
      'Live Show': 'Experience the local entertainment scene with traditional and modern performances',
      'Market Tour': 'Immerse yourself in local life and discover unique products and foods'
    };
    return descriptions[activity] || 'Discover the unique charm and character of this amazing experience';
  },

  getActivityHighlights(activity) {
    const highlights = {
      'Walking Tour': ['Expert local guide', 'Historic landmarks', 'Hidden gems', 'Photo opportunities'],
      'Museum Visit': ['World-class exhibits', 'Audio guide included', 'Historical artifacts', 'Educational experience'],
      'Food Experience': ['Local cuisine', 'Multiple tastings', 'Cultural insights', 'Recipe sharing'],
      'Adventure Park': ['Multiple activities', 'Safety equipment', 'All skill levels', 'Group activities'],
      'Live Show': ['Cultural performance', 'Traditional music', 'Interactive experience', 'Local artists'],
      'Market Tour': ['Local products', 'Food sampling', 'Cultural exchange', 'Shopping opportunities']
    };
    return highlights[activity] || ['Unique experience', 'Expert guidance', 'Cultural insights', 'Memorable moments'];
  },

  // Budget and Expenses
  async getExpenses(tripId) {
    console.log('API getExpenses called with tripId:', tripId);
    return makeRequest(`/budget/${tripId}/expenses`);
  },

  async addExpense(tripId, expenseData) {
    console.log('API addExpense called with tripId:', tripId, 'data:', expenseData);
    return makeRequest(`/budget/${tripId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  },

  async updateExpense(tripId, expenseId, updates) {
    console.log('API updateExpense called with tripId:', tripId, 'expenseId:', expenseId);
    return makeRequest(`/budget/${tripId}/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteExpense(tripId, expenseId) {
    console.log('API deleteExpense called with tripId:', tripId, 'expenseId:', expenseId);
    return makeRequest(`/budget/${tripId}/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  },

  async getBudgetSummary(tripId) {
    console.log('API getBudgetSummary called with tripId:', tripId);
    return makeRequest(`/budget/${tripId}/summary`);
  }
};