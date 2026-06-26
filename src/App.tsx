import { useEffect } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { setMobile } from './redux/styleSlice'
import { useRoutes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import type { RootState } from './redux/store'
import { Login } from './components/userAuthenticate/Login'
import { Register } from './components/userAuthenticate/Register'

function App() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 786px)"});
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const AppRoutes = () => {
    const routes = useRoutes([
      { path: "/", element: <HomePage /> },
      { path: "/signIn", element: <Login /> },
      { path: "/register", element: <Register />},
      { path: "/profile", element: isAuthenticated ? <HomePage /> : <Login /> },
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