import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import DbService from '../services/DbService';
import noUser from '../assets/noUser.jpg';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState(noUser);
  const [social, setSocial] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const {setAuthUser, setIsLogged} = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const authors = await DbService.getUsers();
    if (authors.some((author: User) => author.username === username.trim())) {
      alert('This username is already used');
      return;
    }
    const newAuthor = new User(username.trim(), imageUrl.trim() || noUser, social.trim())
    DbService.addUser(newAuthor, password);
    setAuthUser(newAuthor);
    setIsLogged(true);
    navigate('/');
  }

  return (
    <section className="signup">
      <div className="container pt-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <h1 className="mb-1 fw-normal text-center mb-5">{t('signup.welcome.part1')}<br/><span className="text-primary">{t('signup.welcome.part2')}</span></h1>  
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xr-1">
            <form style={{width: '330px'}} className="float-end" onSubmit={submit}>
              <img src={imageUrl} alt="mdo" width={128} height={128} className="rounded-circle mx-auto d-block mb-3"/>
              <div className="form-floating mb-2">
                <input type="text" className="form-control" id="username" placeholder="Name" onChange={e => setUsername(e.target.value)} autoComplete="username" maxLength={50} required/>
                <label htmlFor="username">{t('signup.username')}</label>
              </div>
              <div className="form-floating mb-2 position-relative">
                <input type={isPassword ? "text" : "password"} className="form-control" id="password" placeholder="Password" onChange={e => setPassword(e.target.value)} maxLength={60} required/>
                <button type="button" onClick={() => setIsPassword(!isPassword)} className="btn position-absolute top-50 translate-middle-y end-0">
                  <FontAwesomeIcon icon={isPassword ? faEye : faEyeSlash} />
                </button>
                <label htmlFor="password">{t('signup.password')}</label>
              </div>
              <div className="form-floating mb-2">
                <input type="text" className="form-control" id="picture" placeholder="Picture" onChange={e => setImageUrl(e.target.value || noUser)}/>
                <label htmlFor="picture">{t('form.picture')} {t('form.optional')}</label>
              </div>
              <div className="form-floating mb-4">
                <input type="text" className="form-control" id="social" placeholder="Social" onChange={e => setSocial(e.target.value)}/>
                <label htmlFor="social">{t('signup.social')} {t('form.optional')}</label>
              </div>
              <button className="btn btn-primary w-100 py-2 text-uppercase mb-4" type="submit">{t('signup.join')}</button>
              <p className="m-0">
                {t('signup.haveAccount')}{" "}
                <Link to='/login' className="fw-bold px-1">{t('login.signIn')}</Link>
              </p>
            </form>
          </div>
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img src="https://static.vecteezy.com/system/resources/previews/023/904/864/original/father-and-child-cooking-together-in-the-kitchen-flat-illustration-minimalist-modern-concepts-for-web-page-website-development-mobile-app-vector.jpg" className="img-fluid" alt="Phone image"/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup
