import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import SupplierDashboard from './components/SupplierDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import PrivateRoute from './components/PrivateRoute';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

const Home = () => {
  const { user } = useContext(AuthContext);

  if (user) {
      if (user.role === 'supplier') {
          return <Navigate to="/supplier-dashboard" />;
      } else {
          return <Navigate to="/customer-dashboard" />;
      }
  } else {
      return <Navigate to="/login" />;
  }
};
const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/supplier-dashboard"
                        element={<PrivateRoute component={SupplierDashboard} />}
                    />
                    <Route
                        path="/customer-dashboard"
                        element={<PrivateRoute component={CustomerDashboard} />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
