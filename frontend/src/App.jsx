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
import ChatSection from "./components/ChatSection";
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
      <section id="about"><About /></section>
      <section id="menu"><Menu /></section>
      <Reviews />
      <ChefSection />
      <Services />
      <Work />
      <OpeningHours />
      <ChatSection />
      <GetInTouch />
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

            <Route path="/" element={
              <ProtectedRoute>
                <HomeWrapper />
              </ProtectedRoute>
            } />

            <Route path="/product/:id" element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            } />

            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
            <Route path="/book-table" element={<ProtectedRoute><TableBooking /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

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