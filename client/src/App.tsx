import { Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './libs/i18n';
import Home from './pages/Home';
import Form from './pages/Form';
import Display from './pages/Display';
import Authors from './pages/Authors';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form/:id?" element={<Form />} />
          <Route path="/recipe/:id" element={<Display />} />
          <Route path="/contributors" element={<Authors />} />
          <Route path="/user/:username" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </I18nextProvider>
    </HelmetProvider>
  );
}

export default App;
