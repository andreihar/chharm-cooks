import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import DbService from '../services/DbService';
import { AxiosError } from 'axios';

function Login() {
  const {setAuthUser, setIsLogged} = useAuth();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const navigate = useNavigate();

  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const user = await DbService.login(username.trim(), password);
      setAuthUser(user);
      setIsLogged(true);
      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        alert(t('login.incorrectPassword'));
      } else {
        alert(t('login.noUsername'));
      }
    }
  }

  return (
    <>
      <Navbar/>
      <div className="bg-body-tertiary">
        <main className="min-height m-auto d-flex align-items-center justify-content-center">
          <form style={{width: '330px'}} onSubmit={submit}>
            <h1 className="mb-1">{t('login.signIn')}</h1>
            <p className="small">{t('login.unleash')}</p>
            <div className="form-floating mb-2">
              <input type="text" className="form-control" id="floatingInput" placeholder="Username" onChange={e => setUsername(e.target.value)} required/>
              <label htmlFor="floatingInput">{t('signup.username')}</label>
            </div>
            <div className="form-floating mb-4 position-relative">
              <input type={isPassword ? "text" : "password"} className="form-control" id="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
              <button type="button" onClick={() => setIsPassword(!isPassword)} className="btn position-absolute top-50 translate-middle-y end-0">
                <FontAwesomeIcon icon={isPassword ? faEye : faEyeSlash} />
              </button>
              <label htmlFor="password">{t('signup.password')}</label>
            </div>
            <button className="btn btn-primary w-100 py-2 text-uppercase mb-4" type="submit">{t('login.signIn')}</button>
            <p className="m-0">
              {t('login.makeAccount')}{" "}
              <Link to='/signup' className="fw-bold px-1">{t('signup.join')}</Link>
            </p>
          </form>
        </main>
      </div>
    </>
  )
}

export default Login
