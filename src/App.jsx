import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Browse from './pages/Browse';
import VehicleDetails from './pages/VehicleDetails';
import SellerLogin from './pages/SellerLogin';
import SellerSignup from './pages/SellerSignup';
import Dashboard from './pages/Dashboard';
import AddVehicle from './pages/AddVehicle';
import About from './pages/About';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';

import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 80px)' }}> {/* Adjusted for header height */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/seller-signup" element={<SellerSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
