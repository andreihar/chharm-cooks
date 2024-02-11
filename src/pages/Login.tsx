import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Login() {
  return (
    <>
    <Navbar/>
    <div className="bg-body-tertiary">
      <main className="form-signin m-auto d-flex align-items-center justify-content-center">
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
      </main>
      </div>
    </>
  )
}

export default Login
