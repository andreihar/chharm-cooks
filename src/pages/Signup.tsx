import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Signup() {
  return (
    <>
      <Navbar/>
      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-8 col-lg-7 col-xl-6">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image"/>
            </div>
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form style={{width: '330px'}}>
          <h1 className="mb-1">Sign in</h1>
          <p className="small">Unleash your culinary creativity!</p>
          <div className="form-floating mb-2">
            <input type="text" className="form-control" id="floatingInput" placeholder="Name" required/>
            <label htmlFor="floatingInput">Name</label>
          </div>
          <div className="form-floating mb-4">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required/>
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button className="btn btn-primary w-100 py-2 text-uppercase mb-4" type="submit">Sign in</button>
          <p className="m-0">
            Don't have an account?{" "}
            <Link to='/signup' className="fw-bold px-1">Join now</Link>
          </p>
        </form>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </>
  )
}

export default Signup
