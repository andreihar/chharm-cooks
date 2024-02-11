import { useState } from 'react'
import { Link } from 'react-router-dom';

function Signup() {
  const [picture, setPicture] = useState('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg');

  return (
    <>
      <section className="signup">
        <div className="container pt-5 h-100">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <h1 className="mb-1 fw-normal text-center mb-5">Welcome to your<br/><span className="text-primary">Hokkien culinary community</span></h1>  
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xr-1">
              <form style={{width: '330px'}} className="float-end">
                <img src={picture} alt="mdo" width={128} height={128} className="rounded-circle mx-auto d-block mb-3"/>
                <div className="form-floating mb-2">
                  <input type="text" className="form-control" id="name" placeholder="Name" required/>
                  <label htmlFor="name">Name</label>
                </div>
                <div className="form-floating mb-2">
                  <input type="password" className="form-control" id="password" placeholder="Password" required/>
                  <label htmlFor="password">Password</label>
                </div>
                <div className="form-floating mb-2">
                  <input type="text" className="form-control" id="picture" placeholder="Picture" onChange={e => setPicture(e.target.value || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')}/>
                  <label htmlFor="picture">Picture URL (optional)</label>
                </div>
                <div className="form-floating mb-4">
                  <input type="text" className="form-control" id="social" placeholder="Social"/>
                  <label htmlFor="social">Social Link (optional)</label>
                </div>
                <button className="btn btn-primary w-100 py-2 text-uppercase mb-4" type="submit">Join</button>
                <p className="m-0">
                  Already have an account?{" "}
                  <Link to='/login' className="fw-bold px-1">Sign in</Link>
                </p>
              </form>
            </div>
            <div className="col-md-8 col-lg-7 col-xl-6">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image"/>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Signup
