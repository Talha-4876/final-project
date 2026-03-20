import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

/* ================= CONTEXT ================= */
import { CartProvider } from "./context/CartContext";
import { BookingProvider } from "./context/BookingContext";
import { SearchProvider } from "./context/SearchContext";

/* ================= COMPONENTS ================= */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Chatbot from "./components/Chatbot";
import Menu from "./components/Menu";
import Reviews from "./components/Reviews";
import ChefSection from "./components/ChefSection";
import GetInTouch from "./components/GetInTouch";
import ChatSection from "./components/ChatSection";
import DelayedAuthModal from "./components/DelayedAuthModal";
import Services from "./components/Services";
import Work from "./components/Work";
import OpeningHours from "./components/OpeningHours";

/* ================= PAGES ================= */
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Tables from "./pages/Tables";
import TableBooking from "./pages/TableBooking";

import Profile from "./pages/Profile";

/* ================= AUTH ================= */
import Signup from "./components/Signup";

/* ================= NOTIFICATION ================= */
import { Toaster } from "react-hot-toast";

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/signup" replace />;
  return children;
};

/* ================= HOME WRAPPER ================= */
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
      <section id="hero">
        <Hero />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="menu">
        <Menu />
        <section id="book-table" className="mt-10">
          <TableBooking />
        </section>
      </section>

      <section id="services">
        <Services />
      </section>

      <section id="how-we-work">
        <Work />
      </section>

      <section id="opening-hours">
        <OpeningHours />
      </section>

      <Reviews />
      <ChefSection />
      <ChatSection />
      <GetInTouch />
    </>
  );
};

/* ================= APP ================= */
function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalIsForgot, setModalIsForgot] = useState(false);

  const isAdmin = true;

  return (
    <CartProvider>
      <BookingProvider>
        <SearchProvider>
          <Router>
            {/* Navbar */}
            <Navbar
              isAdmin={isAdmin}
              openAuth={() => {
                setModalIsForgot(false);
                setShowModal(true);
              }}
            />

            {/* Routes */}
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomeWrapper />
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
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
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
              <Route
                path="/tables"
                element={
                  <ProtectedRoute>
                    <Tables />
                  </ProtectedRoute>
                }
              />
             
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Auth Modal */}
            <DelayedAuthModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              initialIsForgot={modalIsForgot}
            />
<Chatbot />
            {/* Footer */}
            <Footer />

            

            {/* ✅ Toaster for booking notifications */}
            <Toaster position="top-right" reverseOrder={false} />
          </Router>
        </SearchProvider>
      </BookingProvider>
    </CartProvider>
  );
}

export default App;






