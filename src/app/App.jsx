import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import PageLoader from "../components/PageLoader.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Services = lazy(() => import("../pages/Services.jsx"));
const Rentals = lazy(() => import("../pages/Rentals.jsx"));
const RentalDetail = lazy(() => import("../pages/RentalDetail.jsx"));
const RentalBooking = lazy(() => import("../pages/RentalBooking.jsx"));
const Imports = lazy(() => import("../pages/Imports.jsx"));
const Financing = lazy(() => import("../pages/Financing.jsx"));
const Listing = lazy(() => import("../pages/Listing.jsx"));
const ServiceDetail = lazy(() => import("../pages/ServiceDetail.jsx"));
const Booking = lazy(() => import("../pages/Booking.jsx"));
const Bookings = lazy(() => import("../pages/Bookings.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const Partner = lazy(() => import("../pages/Partner.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Signup = lazy(() => import("../pages/Signup.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/rentals" element={<Rentals />} />
          <Route path="services/rentals/:rentalId" element={<RentalDetail />} />
          <Route path="services/rentals/:rentalId/book" element={<RentalBooking />} />
          <Route path="services/imports" element={<Imports />} />
          <Route path="services/financing" element={<Financing />} />
          <Route path="services/:serviceType" element={<Listing />} />
          <Route path="services/:serviceType/:serviceId" element={<ServiceDetail />} />
          <Route path="book/:serviceType/:serviceId?" element={<Booking />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="partner"
            element={
              <ProtectedRoute>
                <Partner />
              </ProtectedRoute>
            }
          />
          <Route path="404" element={<NotFound />} />
        </Route>
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
