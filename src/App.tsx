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
import { PrivacyPage } from './pages/PrivacyPage'
import type { RootState } from './redux/store'
import { Login } from './components/userAuthenticate/Login'
import { Register } from './components/userAuthenticate/Register'
import { ForgotPassword } from './components/userAuthenticate/ForgotPassword'
import { ResetPassword } from './components/userAuthenticate/ResetPassword'
import { useTheme } from './hooks/useTheme'
import { ToastContainer } from './components/common/ToastContainer'
import { setUser } from './redux/authSlice'
import { getProfile, toUserSummary } from './services/userServices'

function App() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 786px)"});
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  useTheme();

  // Called directly (not from a component declared inside App): a nested component gets a new
  // identity on every App render, which unmounted the whole page on theme toggle, resize or sign-in.
  const routes = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/pricing", element: <PricingPage /> },
    { path: "/privacy", element: <PrivacyPage /> },
    { path: "/signIn", element: isAuthenticated ? <Navigate to="/" replace /> : <Login /> },
    { path: "/register", element: isAuthenticated ? <Navigate to="/" replace /> : <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/profile", element: isAuthenticated ? <ProfilePage /> : <Navigate to="/signIn" replace /> },
    { path: "/videos", element: isAuthenticated ? <VideosPage /> : <Navigate to="/signIn" replace /> },
    { path: "/s/:token", element: <WatchPage /> },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  useEffect(() => {
    dispatch(setMobile(isMobile));
  }, [isMobile, dispatch])

  // Only the token survives a page reload. Restore the signed-in user (name, avatar) from the API.
  useEffect(() => {
    if (!isAuthenticated || user) return;
    let cancelled = false;
    getProfile()
      .then((profile) => {
        if (!cancelled) dispatch(setUser(toUserSummary(profile)));
      })
      .catch(() => {
        // A 401 is handled by the API client (it signs the user out); anything else just
        // leaves the header without a name until the next navigation.
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, dispatch]);

  return (
    <>
      {routes}
      <ToastContainer />
    </>
  )
}

export default App