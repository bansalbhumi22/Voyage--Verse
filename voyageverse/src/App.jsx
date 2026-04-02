import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import LandingPage from './pages/LandingPage/LandingPage'
import Dashboard from './pages/Dashboard/Dashboard'
import DestinationDetailsPage from './pages/DestinationDetailsPage/DestinationDetailsPage'
import GalleryPage from './pages/GalleryPage/GalleryPage'
import WishlistPage from './pages/WishlistPage/WishlistPage'
import ReviewPage from './pages/ReviewPage/ReviewPage'
import SignInPage from './pages/SignInPage/SignInPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { isSignedIn } = useAuth()
  return isSignedIn ? children : <Navigate to="/signin" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/destinations" element={<DestinationDetailsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
