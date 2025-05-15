import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import CreateProperty from './pages/CreateProperty';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const { user, loading } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !isAppReady) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E3A8A',
            color: '#fff',
            borderRadius: '0.5rem',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route 
            path="create-property" 
            element={user ? <CreateProperty /> : <Navigate to="/login" />} 
          />
          <Route 
            path="profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;