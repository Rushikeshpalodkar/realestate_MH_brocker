import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Public pages
import GateScreen from './pages/GateScreen';
import ListingsScreen from './pages/ListingsScreen';
import PropertyDetail from './pages/PropertyDetail';
import SuccessScreen from './pages/SuccessScreen';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import MyProperties from './pages/admin/MyProperties';
import AddProperty from './pages/admin/AddProperty';
import EditProperty from './pages/admin/EditProperty';
import InterestedBuyers from './pages/admin/InterestedBuyers';

function App() {
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerName, setBuyerName] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GateScreen setBuyerPhone={setBuyerPhone} setBuyerName={setBuyerName} />} />
        <Route path="/listings" element={<ListingsScreen buyerPhone={buyerPhone} buyerName={buyerName} />} />
        <Route path="/property/:id" element={<PropertyDetail buyerPhone={buyerPhone} buyerName={buyerName} />} />
        <Route path="/success" element={<SuccessScreen buyerName={buyerName} />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/properties" element={<MyProperties />} />
        <Route path="/admin/properties/add" element={<AddProperty />} />
        <Route path="/admin/properties/edit/:id" element={<EditProperty />} />
        <Route path="/admin/buyers" element={<InterestedBuyers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
