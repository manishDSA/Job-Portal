import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'
import store from './Redux/store.js'

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { GoogleOAuthProvider } from '@react-oauth/google'

const persistor = persistStore(store);
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "793575434793-hvpea0vk1jjnvv2195shf6ijve3rc6d0.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
      <Toaster />
    </GoogleOAuthProvider>
  </StrictMode>,
)
