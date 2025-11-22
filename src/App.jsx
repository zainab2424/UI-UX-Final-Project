import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Home from './pages/Home'
import Track from './pages/Track'
import Rewards from './pages/Rewards'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<Track />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App

