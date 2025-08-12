import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/dashboard/Dashboard';
import CreateTripPage from './pages/trips/CreateTripPage';
import TripDetailPage from './pages/trips/TripDetailPage';
import TripListingPage from './pages/trips/TripListingPage';
import BuildItineraryPage from './pages/trips/BuildItineraryPage';
import ItineraryViewPage from './pages/trips/ItineraryViewPage';
import ActivitySearchPage from './pages/trips/ActivitySearchPage';
import SharedTripPage from './pages/trips/SharedTripPage';
import CommunityPage from './pages/CommunityPage';
import CalendarViewPage from './pages/CalendarViewPage';
import AdminPanelPage from './pages/AdminPanelPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
// Components
import NotificationContainer from './components/common/NotificationContainer';
import LoadingSpinner from './components/common/LoadingSpinner';
import BudgetPage from './pages/trips/BudgetPage';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useApp();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public Route Component (redirect to dashboard if authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useApp();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

function AppRoutes() {
  const { user } = useApp();
  
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <LandingPage />
              </motion.div>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <LoginPage />
                </motion.div>
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SignupPage />
                </motion.div>
              </PublicRoute>
            } 
          />

          {/* Shared Trip Route - Public Route */}
          <Route 
            path="/shared/:shareId" 
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <SharedTripPage />
              </motion.div>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Dashboard />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <TripListingPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips/new" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <CreateTripPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips/:id" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <TripDetailPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips/:id/build-itinerary" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <BuildItineraryPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips/:id/itinerary" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ItineraryViewPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips/:id/budget" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <BudgetPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/activities" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ActivitySearchPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <CommunityPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <CalendarViewPage />
                </motion.div>
              </ProtectedRoute>
            } 
          />
          {user?.email === 'admin@globetrotter.com' && (
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <AdminPanelPage />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
          )}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ProfilePage />
                </motion.div>
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <NotFoundPage />
              </motion.div>
            } 
          />
        </Routes>
      </AnimatePresence>
      <NotificationContainer />
    </Router>
  );
}

function App() {
  // Initialize Landbot chatbot
  useEffect(() => {
    let myLandbot;
    
    function initLandbot() {
      if (!myLandbot) {
        const script = document.createElement('script');
        script.type = "module";
        script.async = true;
        script.addEventListener('load', function() {
          if (window.Landbot) {
            myLandbot = new window.Landbot.Livechat({
              configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-3089084-829PBXWULI36VTYY/index.json',
            });
          }
        });
        script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs';
        
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
        } else {
          document.head.appendChild(script);
        }
      }
    }

    // Add event listeners for lazy loading
    const handleMouseOver = () => initLandbot();
    const handleTouchStart = () => initLandbot();

    window.addEventListener('mouseover', handleMouseOver, { once: true });
    window.addEventListener('touchstart', handleTouchStart, { once: true });

    // Cleanup function
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <AppRoutes />
      </div>
    </AppProvider>
  );
}

export default App;