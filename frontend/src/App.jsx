import TrackingBusPage from './pages/trackingBusPage'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path='/' element={<TrackingBusPage />} />
    </Routes>
  )
}

export default App
