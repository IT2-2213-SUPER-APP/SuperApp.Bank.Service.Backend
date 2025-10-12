import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Transfer from './pages/Transfer';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Transfer />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
