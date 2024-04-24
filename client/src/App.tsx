import { Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './libs/i18n';
import Home from './pages/Home';
import Form from './pages/Form';
import Display from './pages/Display';
import Authors from './pages/Authors';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form/:id?" element={<Form />} />
        <Route path="/recipe/:id" element={<Display />} />
        <Route path="/contributors" element={<Authors />} />
        <Route path="/user/:username" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </I18nextProvider>
  );
}

export default App;
