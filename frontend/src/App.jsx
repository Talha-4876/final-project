import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

/* CONTEXT */
import CartProvider from "./context/CartContext";
import BookingProvider from "./context/BookingContext";
import { SearchProvider } from "./context/SearchContext";

/* COMPONENTS */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Chatbot from "./components/Chatbot";
import Menu from "./components/Menu";
import Reviews from "./components/Reviews";
import ChefSection from "./components/ChefSection";
import GetInTouch from "./components/GetInTouch";
import Services from "./components/Services";
import Work from "./components/Work";
import OpeningHours from "./components/OpeningHours";

/* PAGES */
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Tables from "./pages/Tables";
import TableBooking from "./pages/TableBooking";
import Profile from "./pages/Profile";
import Signup from "./components/Signup";
import ProductDetail from "./pages/ProductDetail";
import NotificationsPage from "./pages/NotificationsPage";

/* ── NEW: Reservation + Payment pages ── */
import ReservationCheckout from "./pages/ReservationCheckout";
import ReservationSuccess  from "./pages/ReservationSuccess";
import MyReservations      from "./pages/MyReservations";

/* NOTIFICATION */
import { Toaster } from "react-hot-toast";

/* PROTECTED ROUTE */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  if (!token) return <Navigate to="/signup" replace />;
  return children;
};

/* HOME */
const HomeWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [location]);

  return (
    <>
      <Hero />

      <section id="about">
        <About />
      </section>

      <section id="menu">
        <Menu />
      </section>

      <Reviews />
      <ChefSection />
      <Services />
      <Work />
      <OpeningHours />

      {/* TABLE BOOKING */}
      <section id="booking">
        <TableBooking />
      </section>

      {/* CONTACT SECTION */}
      <section id="contact">
        <GetInTouch />
      </section>
    </>
  );
};

/* APP */
function App() {
  return (
    <CartProvider>
      <BookingProvider>
        <SearchProvider>

          <Navbar />

          <Routes>

            <Route path="/signup" element={<Signup />} />

            {/* ── Home ── */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomeWrapper />
                </ProtectedRoute>
              }
            />

            {/* ── Products ── */}
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />

            {/* ── Cart & Delivery Checkout ── */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* ── Tables ── */}
            <Route
              path="/tables"
              element={
                <ProtectedRoute>
                  <Tables />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-table"
              element={
                <ProtectedRoute>
                  <TableBooking />
                </ProtectedRoute>
              }
            />

            {/* ── Profile ── */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/notifications" element={<NotificationsPage />} />


            {/* ── Reservation + Payment (NEW) ── */}
            <Route
              path="/reservation"
              element={
                <ProtectedRoute>
                  <ReservationCheckout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservation-success"
              element={
                <ProtectedRoute>
                  <ReservationSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-reservations"
              element={
                <ProtectedRoute>
                  <MyReservations />
                </ProtectedRoute>
              }
            />

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>

          <Chatbot />
          <Footer />
          <Toaster />

        </SearchProvider>
      </BookingProvider>
    </CartProvider>
  );
}

export default App;
