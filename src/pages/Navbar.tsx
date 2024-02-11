import React, { useEffect } from 'react';
import logo from '../assets/logo.svg'
import { Link } from 'react-router-dom';

function Navbar() {
  useEffect(() => {
    document.documentElement.classList.add('with-navbar');
    return () => {
      document.documentElement.classList.remove('with-navbar');
    };
  }, []);
  
  return (
    // <nav className="navbar navbar-expand fixed-top navbar-light bg-white p-0">
    //   <div className="container-fluid container">
    //     <div className="collapse navbar-collapse" id="navbarNav">
    //       <a className="navbar-brand mx-0 mx-5" href="#">
    //         <img src={logo} alt="Night Crusade Titans Logo"/>
    //       </a>
    //       <ul className="navbar-nav align-items-center mx-auto">
    //         <li className="nav-item fs-5"><Link to='/' className="nav-link">Home</Link></li>
    //         <li className="nav-item fs-5"><Link to='/form' className="nav-link">Add Recipe</Link></li>
    //       </ul>
    //       <div className="dropdown text-end">
    //         <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    //           <img src="https://github.com/mdo.png" alt="mdo" width={32} height={32} className="rounded-circle"/>
    //         </a>
    //         <ul className="dropdown-menu text-small" style={{}}>
    //           <li><a className="dropdown-item" href="#">Sign out</a></li>
    //         </ul>
    //       </div>
    //     </div>
    //   </div>
    // </nav>

<nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white p-0">
  <div className="container-fluid container-lg bg-white">
    {/* <a className="navbar-brand mx-0 mx-5" href="#"><img src={logo} alt="Night Crusade Titans Logo"/></a> */}
    <Link to='/' className="navbar-brand mx-0 mx-5"><img src={logo} alt="Night Crusade Titans Logo"/></Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul className="navbar-nav mb-lg-0 mx-auto">
        <li className="nav-item fs-5 me-3"><Link to='/' className="nav-link">Home</Link></li>
        <li className="nav-item fs-5 me-3"><Link to='/form' className="nav-link">Add Recipe</Link></li>
        <li className="nav-item fs-5"><Link to='/form' className="nav-link">Contributors</Link></li>
      </ul>
      <div>
        <Link to='/signup'><button type="button" className="btn btn-outline-secondary me-2">Join Now</button></Link>
        <Link to='/login'><button type="button" className="btn btn-primary">Sign in</button></Link>
      </div>
      {/* <div className="dropdown">
        <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="mdo" width={32} height={32} className="rounded-circle"/>
        </a>
        <ul className="dropdown-menu text-small" style={{}}>
          <li><a className="dropdown-item" href="#">Sign out</a></li>
        </ul>
      </div> */}

    </div>
  </div>
</nav>

  )
}

export default Navbar
