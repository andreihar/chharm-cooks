import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/Form';
import Display from './pages/Display';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form/:id?" element={<Form />} />
      <Route path="/recipe/:id" element={<Display />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
