import { useEffect } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { setMobile } from './redux/styleSlice'
import { Navigate, useRoutes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { PricingPage } from './pages/PricingPage'
import { VideosPage } from './pages/VideosPage'
import { WatchPage } from './pages/WatchPage'
import type { RootState } from './redux/store'
import { Login } from './components/userAuthenticate/Login'
import { Register } from './components/userAuthenticate/Register'
import { ForgotPassword } from './components/userAuthenticate/ForgotPassword'
import { ResetPassword } from './components/userAuthenticate/ResetPassword'
import { useTheme } from './hooks/useTheme'
import { ToastContainer } from './components/common/ToastContainer'

function App() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 786px)"});
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  useTheme();

  const AppRoutes = () => {
    const routes = useRoutes([
      { path: "/", element: <HomePage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/signIn", element: isAuthenticated ? <Navigate to="/" replace /> : <Login /> },
      { path: "/register", element: isAuthenticated ? <Navigate to="/" replace /> : <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/profile", element: isAuthenticated ? <ProfilePage /> : <Navigate to="/signIn" replace /> },
      { path: "/videos", element: isAuthenticated ? <VideosPage /> : <Navigate to="/signIn" replace /> },
      { path: "/s/:token", element: <WatchPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ])
    return routes;
  }

  useEffect(() => {
    dispatch(setMobile(isMobile));
  }, [isMobile, dispatch])

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  )
}

export default App