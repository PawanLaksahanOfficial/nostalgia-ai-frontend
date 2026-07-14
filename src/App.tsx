import { useEffect } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { setMobile } from './redux/styleSlice'
import { useRoutes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { Login } from './components/userLogin/Login'
import { ProfilePage } from './pages/ProfilePage'
import { PublicGalleryPage } from './pages/PublicGalleryPage'
import { TimelinePage } from './pages/TimelinePage'
import { PublicProfilePage } from './pages/PublicProfilePage'
import type { RootState } from './redux/store'

function App() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 786px)"});
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const AppRoutes = () => {
    const routes = useRoutes([
      { path: "/", element: <HomePage /> },
      { path: "/signIn", element: <Login /> },
      { path: "/profile", element: isAuthenticated ? <ProfilePage /> : <Login /> },
      { path: "/gallery", element: <PublicGalleryPage /> },
      { path: "/timeline", element: <TimelinePage /> },
      { path: "/users/:userId", element: <PublicProfilePage /> },
    ])
    return routes;
  }

  useEffect(() => {
    dispatch(setMobile(isMobile));
  }, [isMobile, dispatch])

  return (
    <AppRoutes />
  )
}

export default App