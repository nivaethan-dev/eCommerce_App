import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProductListingPage from './components/ProductListingPage';
import OrderDetailsPage from './components/OrderDetailsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/" element={<ProductListingPage />} />
        <Route path="/order/:orderId" element={<OrderDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
