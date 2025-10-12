import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#dc3545' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white fw-bold" to="/">
          Bank App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
                style={{
                  backgroundColor: 'white',
                  color: '#dc3545',
                  borderRadius: '5px',
                  padding: '8px 16px',
                  marginRight: '10px',
                  fontWeight: location.pathname === '/' ? 'bold' : 'normal'
                }}
              >
                Transfer Money
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                to="/profile"
                style={{
                  backgroundColor: 'white',
                  color: '#dc3545',
                  borderRadius: '5px',
                  padding: '8px 16px',
                  fontWeight: location.pathname === '/profile' ? 'bold' : 'normal'
                }}
              >
                My Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
