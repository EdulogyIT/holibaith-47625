import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { HostLayout } from "@/components/layouts/HostLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import ShortStay from "./pages/ShortStay";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Cities from "./pages/Cities";
import PublishProperty from "./pages/PublishProperty";
import EditProperty from "./pages/EditProperty";
import Property from "./pages/Property";
import City from "./pages/City";
import ContactAdvisor from "./pages/ContactAdvisor";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Wishlist from "./pages/Wishlist";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminMessageDetail from "./pages/admin/AdminMessageDetail";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminBlogForm from "./pages/admin/AdminBlogForm";
import AdminBlogView from "./pages/admin/AdminBlogView";
import AdminSettings from "./pages/admin/AdminSettings";
import HostDashboard from "./pages/host/HostDashboard";
import HostOnboarding from "./pages/host/HostOnboarding";
import HostListings from "./pages/host/HostListings";
import HostMessages from "./pages/host/HostMessages";
import HostPayouts from "./pages/host/HostPayouts";
import PropertyCalendar from "@/components/PropertyCalendar";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancel from "./pages/BookingCancel";

import TrendingAreas from "./pages/TrendingAreas";
import FeaturedListingsPage from "./pages/FeaturedListingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/short-stay" element={<ShortStay />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/cities" element={<Cities />} />
              <Route path="/trending-areas" element={<TrendingAreas />} />
              <Route path="/featured-listings" element={<FeaturedListingsPage />} />
              <Route path="/publish-property" element={
                <ProtectedRoute requireAuth>
                  <PublishProperty />
                </ProtectedRoute>
              } />
              <Route path="/edit-property/:id" element={
                <ProtectedRoute requireAuth>
                  <EditProperty />
                </ProtectedRoute>
              } />
              <Route path="/bookings" element={
                <ProtectedRoute requireAuth>
                  <Bookings />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute requireAuth>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={
                <ProtectedRoute requireAuth>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/property/:id" element={<Property />} />
              <Route path="/city/:cityId" element={<City />} />
              <Route path="/contact-advisor" element={<ContactAdvisor />} />
              
              {/* Payment routes */}
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancelled" element={<PaymentCancelled />} />
              <Route path="/booking/success" element={<BookingSuccess />} />
              <Route path="/booking/cancel" element={<BookingCancel />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Host onboarding - requires login but not host role */}
              <Route path="/host/onboarding" element={
                <ProtectedRoute requireAuth>
                  <HostOnboarding />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="profile" element={<AdminProfile />} />
                      <Route path="properties" element={<AdminProperties />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="messages" element={<AdminMessages />} />
                      <Route path="messages/:id" element={<AdminMessageDetail />} />
                      <Route path="blogs" element={<AdminBlogs />} />
                      <Route path="blogs/new" element={<AdminBlogForm />} />
                      <Route path="blogs/edit/:id" element={<AdminBlogForm />} />
                      <Route path="blogs/view/:id" element={<AdminBlogView />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              {/* Host routes */}
              <Route path="/host/*" element={
                <ProtectedRoute requiredRole="host">
                  <HostLayout>
                    <Routes>
                      <Route index element={<HostDashboard />} />
                      <Route path="dashboard" element={<HostDashboard />} />
                      <Route path="calendar" element={<PropertyCalendar />} />
                      <Route path="listings" element={<HostListings />} />
                      <Route path="messages" element={<HostMessages />} />
                      <Route path="payouts" element={<HostPayouts />} />
                    </Routes>
                  </HostLayout>
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
