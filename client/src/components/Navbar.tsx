import { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faBowlRice, faCommentDots, faBell } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import DbService from '../services/DbService';
import { User } from '../models/User';

function Navbar() {
  const { logout, loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [notifications, setNotifications] = useState<Array<{ followed: string; rid: number; mode: string; seen: boolean; first_name: string; last_name: string; picture: string; title: string; chin_title: string; }>>([]);
  const [userInfo, setUserInfo] = useState<User>();
  const { i18n, t } = useTranslation();
  const { getAuthorName, getRecipeTitle } = useLocalisationHelper();
  const navigate = useNavigate();

  const links = [
    { path: '/', label: 'navbar.home' },
    { path: '/form', label: 'navbar.addRecipe' },
    { path: '/contributors', label: 'navbar.contributors' }
  ];

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nLang', newLang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nLang');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }

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
          const newUser = new User(sub!, picture!, null, given_name!, family_name!, null, null, null, new Date());
          DbService.login(newUser, token)
            .then(isNewUser => {
              if (isNewUser) {
                navigate('/signup');
                console.log('New user created');
              }
            });
          DbService.getNotifications().then(notifications => setNotifications(notifications));
          if (user.sub) {
            DbService.getUserByName(user.sub).then(user => setUserInfo(user));
          }
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

  const handleNotificationClick = (followed: string, mode: string, rid: number) => {
    DbService.markNotificationAsRead(followed, mode, rid);
    setNotifications(prev => prev.filter(not => not.followed !== followed || not.mode !== mode || not.rid !== rid));
  };

  const handleMarkAllClick = () => {
    for (const notification of notifications) {
      DbService.markNotificationAsRead(notification.followed, notification.mode, notification.rid);
    }
    setNotifications([]);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white p-0 shadow">
      <div className="container-fluid container-lg bg-white" style={{ boxShadow: '0 0.5rem 1rem -10px rgba(0, 0, 0, 0.15)' }}>
        <Link to='/' className="navbar-brand mx-0 mx-5"><img src={logo} alt="ChhármCooks Logo" /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mb-lg-0 mx-auto">
            {links.map((link) => (<li key={link.path} className="nav-item fs-5 me-3"><NavLink to={link.path} className={({ isActive }) => isActive ? "nav-link text-primary" : "nav-link"}>{t(link.label)}</NavLink></li>))}
          </ul>
          <div className='d-flex justify-content-between flex-wrap py-2'>
            <div className={`d-flex ${isAuthenticated && user ? 'order-mobile-last' : ''}`}>
              {(isAuthenticated && user) ? (
                <>
                  <div className="dropdown">
                    <button className="btn btn-secondary position-relative rounded-circle d-flex align-items-center justify-content-center me-3" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ width: '32px', height: '32px' }}>
                      <FontAwesomeIcon icon={faBell} className="text-white" style={{ fontSize: '1rem' }} />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ marginRight: '8px' }}>
                        {notifications.length}
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end py-0" style={{ zIndex: 50, width: '22rem', marginTop: '1rem', overflow: 'visible', textAlign: 'left', backgroundColor: 'white', borderRadius: '0.25rem', boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' }}>
                      <div className="dropdown-header bg-body-secondary text-center text-dark">
                        <h5>{t('navbar.notifications.title')}</h5>
                      </div>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <div className="text-center text-muted py-3">
                            {t('navbar.notifications.empty')}
                          </div>
                        ) : (
                          notifications.map((notification, index) => (
                            <Link key={index} to={`/recipe/${notification.rid}`} onClick={() => handleNotificationClick(notification.followed, notification.mode, notification.rid)} className="dropdown-item d-flex align-items-center border-bottom">
                              <div className="flex-shrink-0 me-2 position-relative">
                                <img className="rounded-circle" src={notification.picture} alt="Notification image" style={{ width: '2.75rem', height: '2.75rem' }} />
                                <div className={`${notification.mode === 'recipe' ? 'bg-primary' : 'bg-info'} position-absolute d-flex align-items-center justify-content-center border border-white rounded-circle end-0 bottom-0`} style={{ width: '1.25rem', height: '1.25rem' }}>
                                  <FontAwesomeIcon icon={notification.mode === 'recipe' ? faBowlRice : faCommentDots} className="text-white" style={{ fontSize: '0.75rem' }} />
                                </div>
                              </div>
                              <div className="pl-3 flex-grow-1" style={{ whiteSpace: 'normal' }}>
                                <div className="text-muted mb-1">
                                  <Trans
                                    i18nKey={notification.mode === 'recipe' ? 'navbar.notifications.recipe' : 'navbar.notifications.comment'}
                                    components={[<span className="fw-bold text-dark" />, <span className="fw-bold text-primary text-capitalize" />]}
                                    values={{ name: getAuthorName(notification), title: getRecipeTitle(notification) }}
                                  />
                                </div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                      <button className="text-center btn btn-secondary w-100 rounded-0" onClick={handleMarkAllClick}>
                        {t('navbar.notifications.readAll')}
                      </button>
                    </div>
                  </div>
                  <div className="dropdown">
                    <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={userInfo?.picture || user.picture} alt="User Picture" width={32} height={32} className="rounded-circle" />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end text-small" style={{}}>
                      <Link to={`/user/${user.sub}`}><button type="button" className="dropdown-item">{t('navbar.profile')}</button></Link>
                      <Link to="/settings"><button type="button" className="dropdown-item">{t('navbar.settings')}</button></Link>
                      <li><button className="dropdown-item" onClick={(e) => logOut(e)}>{t('navbar.signOut')}</button></li>
                    </ul>
                  </div>
                </>
              ) : (
                <div>
                  <button className="btn me-1" onClick={() => loginWithRedirect()}><FontAwesomeIcon className="fs-4 align-middle text-primary" icon={faCircleUser} /> {t('navbar.signIn')}</button>
                </div>
              )}
            </div>
            <div className={`ms-2 ${isAuthenticated && user ? 'order-mobile-first' : ''}`}>
              <select value={i18n.language} onChange={changeLanguage} className="form-select" name="Language">
                <option value="en">EN</option>
                <option value="zh">華語</option>
                <option value="ms">MS</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
