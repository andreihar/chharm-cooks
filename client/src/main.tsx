import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import ScrollToTop from './components/ScrollToTop'
import './style/index.css'
import './style/sass.scss'
import "bootstrap/dist/js/bootstrap.bundle.min";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
        <ScrollToTop />
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
