import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import SeekerLayout from './layouts/SeekerLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public & Shared Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';
import SearchPG from './pages/public/SearchPG';
import PGDetails from './pages/public/PGDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Messages from './pages/public/Messages';
import ComparePG from './pages/public/ComparePG';
import Notifications from './pages/public/Notifications';
import Unauthorized from './pages/public/Unauthorized';
import NotFound404 from './pages/public/NotFound404';

// Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import Favourites from './pages/seeker/Favourites';
import SeekerSearch from './pages/seeker/SeekerSearch';
import SeekerEnquiries from './pages/seeker/SeekerEnquiries';
import SeekerVisits from './pages/seeker/SeekerVisits';
import SeekerBookings from './pages/seeker/SeekerBookings';
import SeekerBookPage from './pages/seeker/SeekerBookPage';
import ReviewFormPage from './pages/seeker/ReviewFormPage';
import SeekerSavedSearches from './pages/seeker/SeekerSavedSearches';
import SeekerPreferences from './pages/seeker/SeekerPreferences';
import SeekerProfile from './pages/seeker/SeekerProfile';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyPGs from './pages/owner/MyPGs';
import AddEditPG from './pages/owner/AddEditPG';
import OwnerRooms from './pages/owner/OwnerRooms';
import AddEditRoom from './pages/owner/AddEditRoom';
import OwnerBedManager from './pages/owner/OwnerBedManager';
import OwnerBookingRequests from './pages/owner/OwnerBookingRequests';
import OwnerOccupancy from './pages/owner/OwnerOccupancy';
import OwnerAvailability from './pages/owner/OwnerAvailability';
import OwnerVisits from './pages/owner/OwnerVisits';
import OwnerCalendar from './pages/owner/OwnerCalendar';
import OwnerVerification from './pages/owner/OwnerVerification';
import OwnerEnquiries from './pages/owner/OwnerEnquiries';
import OwnerReviews from './pages/owner/OwnerReviews';
import OwnerAnalytics from './pages/owner/OwnerAnalytics';
import OwnerProfile from './pages/owner/OwnerProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPGList from './pages/admin/AdminPGList';
import AdminPending from './pages/admin/AdminPending';
import AdminPGReview from './pages/admin/AdminPGReview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminVerifications from './pages/admin/AdminVerifications';
import AdminReports from './pages/admin/AdminReports';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminVisits from './pages/admin/AdminVisits';
import AdminFacilities from './pages/admin/AdminFacilities';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminActivityLogs from './pages/admin/AdminActivityLogs';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Routes>
        
        {/* Public & Common Authenticated Routes under MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchPG />} />
          <Route path="pg/:id" element={<PGDetails />} />
          <Route path="compare" element={<ComparePG />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages" element={<Messages />} />
          </Route>

          <Route path="*" element={<NotFound404 />} />
        </Route>

        {/* Protected Seeker Portal Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SEEKER']} />}>
          <Route path="/seeker" element={<SeekerLayout />}>
            <Route index element={<SeekerDashboard />} />
            <Route path="dashboard" element={<SeekerDashboard />} />
            <Route path="search" element={<SeekerSearch />} />
            <Route path="favourites" element={<Favourites />} />
            <Route path="saved-searches" element={<SeekerSavedSearches />} />
            <Route path="preferences" element={<SeekerPreferences />} />
            <Route path="enquiries" element={<SeekerEnquiries />} />
            <Route path="visits" element={<SeekerVisits />} />
            <Route path="bookings" element={<SeekerBookings />} />
            <Route path="book/:pgId" element={<SeekerBookPage />} />
            <Route path="reviews/new/:bookingId" element={<ReviewFormPage />} />
            <Route path="profile" element={<SeekerProfile />} />
          </Route>
        </Route>

        {/* Protected Owner Portal Routes */}
        <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="pgs" element={<MyPGs />} />
            <Route path="pgs/add" element={<AddEditPG />} />
            <Route path="pgs/:id/edit" element={<AddEditPG />} />
            <Route path="rooms" element={<OwnerRooms />} />
            <Route path="rooms/new" element={<AddEditRoom />} />
            <Route path="rooms/:id/edit" element={<AddEditRoom />} />
            <Route path="rooms/:roomId/beds" element={<OwnerBedManager />} />
            <Route path="booking-requests" element={<OwnerBookingRequests />} />
            <Route path="occupancy" element={<OwnerOccupancy />} />
            <Route path="availability" element={<OwnerAvailability />} />
            <Route path="visits" element={<OwnerVisits />} />
            <Route path="calendar" element={<OwnerCalendar />} />
            <Route path="verification" element={<OwnerVerification />} />
            <Route path="enquiries" element={<OwnerEnquiries />} />
            <Route path="reviews" element={<OwnerReviews />} />
            <Route path="analytics" element={<OwnerAnalytics />} />
            <Route path="profile" element={<OwnerProfile />} />
          </Route>
        </Route>

        {/* Protected Admin Portal Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetail />} />
            <Route path="pgs" element={<AdminPGList />} />
            <Route path="pgs/pending" element={<AdminPending />} />
            <Route path="pgs/:id" element={<AdminPGReview />} />
            <Route path="verifications" element={<AdminVerifications />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="visits" element={<AdminVisits />} />
            <Route path="facilities" element={<AdminFacilities />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="activity" element={<AdminActivityLogs />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      </ErrorBoundary>
    </AuthProvider>
  );
}
