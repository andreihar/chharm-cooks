import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './libs/i18n';
import Home from './pages/Home';
import Form from './pages/Form';
import Display from './pages/Display';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Authors from './pages/Authors';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form/:id?" element={<Form />} />
          <Route path="/recipe/:id" element={<Display />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contributors" element={<Authors />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </I18nextProvider>
    </AuthProvider>
  )
}

export default App
