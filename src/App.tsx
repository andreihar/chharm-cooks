import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/Form';
import Display from './pages/Display';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form" element={<Form />} />
      <Route path="/recipe/:id" element={<Display />} />
    </Routes>
  )
}

export default App
