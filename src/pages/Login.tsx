import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Author } from '../Author';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

function Login() {
  const {setAuthUser, setIsLogged} = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const navigate = useNavigate();

  function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const authors = JSON.parse(localStorage.getItem('authors') || '[]');
    const author = authors.find((author:Author) => author.name === name.trim());
    if (!author) {
      alert('No existing account found with this name');
      return;
    }
    if (author.password !== password) {
      alert('Incorrect password. Please try again');
      return;
    }
    setAuthUser(author);
    setIsLogged(true);
    navigate('/');
  }

  return (
    <>
    <Navbar/>
    <div className="bg-body-tertiary">
      <main className="form-signin m-auto d-flex align-items-center justify-content-center">
        <form style={{width: '330px'}} onSubmit={submit}>
          <h1 className="mb-1">Sign in</h1>
          <p className="small">Unleash your culinary creativity!</p>
          <div className="form-floating mb-2">
            <input type="text" className="form-control" id="floatingInput" placeholder="Name" onChange={e => setName(e.target.value)} required/>
            <label htmlFor="floatingInput">Name</label>
          </div>
          <div className="form-floating mb-4 position-relative">
            <input type={isPassword ? "text" : "password"} className="form-control" id="floatingPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
            <button type="button" onClick={() => setIsPassword(!isPassword)} className="btn position-absolute top-50 translate-middle-y end-0">
              <FontAwesomeIcon icon={isPassword ? faEye : faEyeSlash} />
            </button>
            <label htmlFor="password">Password</label>
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
