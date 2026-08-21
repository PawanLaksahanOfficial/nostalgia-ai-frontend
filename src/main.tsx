import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { FacebookProvider } from 'react-facebook'
import { ErrorBoundary } from './components/common/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <FacebookProvider appId={import.meta.env.VITE_META_APP_ID}>
            <App />
          </FacebookProvider>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
)
