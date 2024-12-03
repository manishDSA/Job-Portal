import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'
import store from './Redux/store.js'

// this is for to make the persist the store when we refesh the page data that'swhy we do 
// it is part of redux toolkit
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
<PersistGate loading={null} persistor={persistor}>

      <App />
</PersistGate>
    </Provider>
    <Toaster />
  </StrictMode>,
)
