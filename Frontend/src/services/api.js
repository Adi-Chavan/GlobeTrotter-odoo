// Mock API service with sample data
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Sample data
const sampleTrips = [
  {
    id: '1',
    name: 'European Adventure',
    description: 'A magical journey through historic Europe',
    coverImage: 'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg?auto=compress&cs=tinysrgb&w=800',
    startDate: '2024-06-01',
    endDate: '2024-06-15',
    isPublic: true,
    userId: 'user1',
    destinations: ['Paris', 'Rome', 'Barcelona'],
    totalBudget: 3500,
    stops: [
      {
        id: 'stop1',
        cityName: 'Paris',
        country: 'France',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
        estimatedCost: 1200,
        activities: [
          { id: 'act1', name: 'Eiffel Tower Visit', category: 'Sightseeing', cost: 30, date: '2024-06-02', duration: 2 },
          { id: 'act2', name: 'Louvre Museum', category: 'Culture', cost: 25, date: '2024-06-03', duration: 4 }
        ]
      },
      {
        id: 'stop2',
        cityName: 'Rome',
        country: 'Italy',
        startDate: '2024-06-06',
        endDate: '2024-06-10',
        estimatedCost: 1100,
        activities: [
          { id: 'act3', name: 'Colosseum Tour', category: 'Sightseeing', cost: 45, date: '2024-06-07', duration: 3 },
          { id: 'act4', name: 'Vatican Museums', category: 'Culture', cost: 35, date: '2024-06-08', duration: 5 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Asian Discovery',
    description: 'Exploring the wonders of Asia',
    coverImage: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    startDate: '2024-08-01',
    endDate: '2024-08-20',
    isPublic: true,
    userId: 'user1',
    destinations: ['Tokyo', 'Seoul', 'Bangkok'],
    totalBudget: 4200,
    stops: []
  }
];

const sampleUser = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
};

const sampleExpenses = [
  { id: '1', tripId: '1', type: 'Accommodation', amount: 800, date: '2024-06-01' },
  { id: '2', tripId: '1', type: 'Food', amount: 450, date: '2024-06-02' },
  { id: '3', tripId: '1', type: 'Transportation', amount: 320, date: '2024-06-01' },
  { id: '4', tripId: '1', type: 'Activities', amount: 180, date: '2024-06-03' }
];

// API functions
export const api = {
  // Auth
  async login(email, password) {
    await delay(1000);
    if (email === 'john@example.com' && password === 'password') {
      return { success: true, user: sampleUser, token: 'mock-jwt-token' };
    }
    throw new Error('Invalid credentials');
  },

  async signup(userData) {
    await delay(1000);
    return { 
      success: true, 
      user: { ...sampleUser, ...userData, id: 'new-user-id' }, 
      token: 'mock-jwt-token' 
    };
  },

  async logout() {
    await delay(500);
    return { success: true };
  },

  // Trips
  async getTrips() {
    await delay(800);
    return sampleTrips;
  },

  async getPublicTrips() {
    await delay(800);
    return sampleTrips.filter(trip => trip.isPublic);
  },

  async getTripById(id) {
    await delay(600);
    const trip = sampleTrips.find(trip => trip.id === id);
    if (!trip) throw new Error('Trip not found');
    return trip;
  },

  async createTrip(tripData) {
    await delay(1000);
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      userId: sampleUser.id,
      destinations: [],
      stops: [],
      totalBudget: 0
    };
    sampleTrips.push(newTrip);
    return newTrip;
  },

  async updateTrip(id, updates) {
    await delay(800);
    const tripIndex = sampleTrips.findIndex(trip => trip.id === id);
    if (tripIndex === -1) throw new Error('Trip not found');
    sampleTrips[tripIndex] = { ...sampleTrips[tripIndex], ...updates };
    return sampleTrips[tripIndex];
  },

  async deleteTrip(id) {
    await delay(600);
    const tripIndex = sampleTrips.findIndex(trip => trip.id === id);
    if (tripIndex === -1) throw new Error('Trip not found');
    sampleTrips.splice(tripIndex, 1);
    return { success: true };
  },

  // Stops
  async addStop(tripId, stopData) {
    await delay(600);
    const trip = sampleTrips.find(t => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    const newStop = {
      id: Date.now().toString(),
      ...stopData,
      activities: []
    };
    trip.stops.push(newStop);
    return newStop;
  },

  async updateStop(tripId, stopId, updates) {
    await delay(500);
    const trip = sampleTrips.find(t => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    const stopIndex = trip.stops.findIndex(s => s.id === stopId);
    if (stopIndex === -1) throw new Error('Stop not found');
    trip.stops[stopIndex] = { ...trip.stops[stopIndex], ...updates };
    return trip.stops[stopIndex];
  },

  async deleteStop(tripId, stopId) {
    await delay(500);
    const trip = sampleTrips.find(t => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    trip.stops = trip.stops.filter(s => s.id !== stopId);
    return { success: true };
  },

  // Activities
  async addActivity(tripId, stopId, activityData) {
    await delay(500);
    const trip = sampleTrips.find(t => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    const stop = trip.stops.find(s => s.id === stopId);
    if (!stop) throw new Error('Stop not found');
    const newActivity = {
      id: Date.now().toString(),
      ...activityData
    };
    stop.activities.push(newActivity);
    return newActivity;
  },

  async updateActivity(tripId, stopId, activityId, updates) {
    await delay(400);
    const trip = sampleTrips.find(t => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    const stop = trip.stops.find(s => s.id === stopId);
    if (!stop) throw new Error('Stop not found');
    const activityIndex = stop.activities.findIndex(a => a.id === activityId);
    if (activityIndex === -1) throw new Error('Activity not found');
    stop.activities[activityIndex] = { ...stop.activities[activityIndex], ...updates };
    return stop.activities[activityIndex];
  },

  async deleteActivity(tripId, stopId, activityId) {
    await delay(400);
    const trip = sampleTrips.find(t => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    const stop = trip.stops.find(s => s.id === stopId);
    if (!stop) throw new Error('Stop not found');
    stop.activities = stop.activities.filter(a => a.id !== activityId);
    return { success: true };
  },

  // Expenses
  async getExpenses(tripId) {
    await delay(600);
    return sampleExpenses.filter(expense => expense.tripId === tripId);
  },

  async addExpense(tripId, expenseData) {
    await delay(500);
    const newExpense = {
      id: Date.now().toString(),
      tripId,
      ...expenseData
    };
    sampleExpenses.push(newExpense);
    return newExpense;
  },

  // Profile
  async updateProfile(userData) {
    await delay(800);
    Object.assign(sampleUser, userData);
    return sampleUser;
  },

  async getCurrentUser() {
    await delay(300);
    return sampleUser;
  }
};