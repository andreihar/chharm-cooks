import logo from '../assets/logo.svg'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand fixed-top navbar-light bg-white">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item fs-5"><Link to='/' className="nav-link">Home</Link></li>
            <a className="navbar-brand mx-0 mx-5" href="#">
              <img src={logo} alt="Night Crusade Titans Logo"/>
            </a>
            <li className="nav-item fs-5"><Link to='/form' className="nav-link">Add Recipe</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
