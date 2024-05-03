import { useEffect } from 'react';
import logo from '../assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import DbService from '../services/DbService';
import { User } from '../models/User';

function Navbar() {
  const { logout, loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  useEffect(() => {
    document.documentElement.classList.add('with-navbar');
    return () => {
      document.documentElement.classList.remove('with-navbar');
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      getAccessTokenSilently()
        .then(token => {
          const { sub, picture, name } = user;
          const [given_name = '', family_name = ''] = name ? name.split(' ') : [];
          const newUser = new User(sub!, picture!, '', given_name!, family_name!, '', '', new Date());
          DbService.login(newUser, token)
            .then(isNewUser => {
              if (isNewUser) {
                navigate('/signup');
                console.log('New user created');
              } else {
                console.log('Logged into existing user');
              }
            });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [isAuthenticated, getAccessTokenSilently, user]);

  const logOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    DbService.logout();
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white p-0">
      <div className="container-fluid container-lg bg-white">
        <Link to='/' className="navbar-brand mx-0 mx-5"><img src={logo} alt="ChhármCooks Logo" /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mb-lg-0 mx-auto">
            <li className="nav-item fs-5 me-3"><Link to='/' className="nav-link">{t('navbar.home')}</Link></li>
            <li className="nav-item fs-5 me-3"><Link to='/form' className="nav-link">{t('navbar.addRecipe')}</Link></li>
            <li className="nav-item fs-5"><Link to='/contributors' className="nav-link">{t('navbar.contributors')}</Link></li>
          </ul>
          {(isAuthenticated && user) ?
            <div className="dropdown">
              <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={user.picture} alt="User Picture" width={32} height={32} className="rounded-circle" />
              </a>
              <ul className="dropdown-menu text-small" style={{}}>
                <Link to={`/user/${user.sub}`}><button type="button" className="dropdown-item">{t('navbar.profile')}</button></Link>
                <li><button className="dropdown-item" onClick={(e) => logOut(e)}>{t('navbar.signOut')}</button></li>
              </ul>
            </div>
            :
            <div>
              <button className="btn me-1" onClick={() => loginWithRedirect()}><FontAwesomeIcon className="fs-4 align-middle text-primary" icon={faCircleUser} /> {t('login.signIn')}</button>
              {/* <Link to='/signup'><button type="button" className="btn btn-primary">{t('login.joinNow')}</button></Link> */}
            </div>
          }
          <div className="ms-2">
            <select value={i18n.language} onChange={changeLanguage} className="form-select" name="Language">
              <option value="en">ENG</option>
              <option value="zh">華語</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
