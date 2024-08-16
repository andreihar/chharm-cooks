import { useState, useEffect } from 'react';
import { User } from '../models/User';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DbService from '../services/DbService';
import { useNavigate } from 'react-router-dom';

function Display() {
  const [picture, setPicture] = useState('');
  const [social, setSocial] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [country, setCountry] = useState('');

  const { user, isAuthenticated } = useAuth0();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getCountries, getWebsiteName, getIconByWebsite } = useLocalisationHelper();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.sub) {
        DbService.getUserByName(user.sub).then((userInfo) => {
          if (userInfo) {
            setPicture(userInfo.picture ?? '');
            setSocial(userInfo.social ?? '');
            setFirst_name(userInfo.first_name ?? '');
            setLast_name(userInfo.last_name ?? '');
            setBio(userInfo.bio ?? '');
            setOccupation(userInfo.occupation ?? '');
            setCountry(userInfo.country ?? '');
          }
        });
      }
    } else {
      navigate('/');
    }
  }, [isAuthenticated, user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newUser = new User(user!.sub!, picture, social, first_name, last_name, bio, occupation, country, new Date());

    DbService.updateUser(newUser)
      .then(() => {
        alert(t('settings.success'));
      })
      .catch(error => {
        console.error('Error updating user', error);
      });
  };

  return (
    <>
      <Navbar />
      <main className="bg-light py-5">
        <article className="container px-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-4 mb-4">
                <div className="card shadow-sm border-light mb-4">
                  <div className="card-body d-flex flex-column flex-sm-row align-items-center">
                    <img className="rounded-circle mb-4 mb-sm-0" src={picture} alt="Profile picture" style={{ width: '7rem', height: '7rem', objectFit: 'cover' }} />
                    <div className="ms-sm-4">
                      <h3 className="card-title text-dark text-capitalize">{t('settings.picture')}</h3>
                      <input type="text" className="form-control" id="imageUrl" value={picture} onChange={e => setPicture(e.target.value)} placeholder="https://media.istockphoto.com/id/1" aria-label={t('settings.picture')} />
                    </div>
                  </div>
                </div>
                <div className="card shadow-sm border-light mb-4">
                  <div className="card-body">
                    <h3 className="card-title text-dark text-capitalize">{t('settings.social')}</h3>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={getIconByWebsite(social)} size="2x" className="text-primary me-3 text-capitalize" />
                      <div className="flex-grow-1">
                        <span className="d-block text-dark fw-bold">{t('settings.account', { name: getWebsiteName(social) })}</span>
                        <input type="text" className="form-control text-primary" id="imageUrl" value={social} onChange={e => setSocial(e.target.value)} placeholder="www.facebook.com/example" aria-label={t('settings.social')} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-8">
                <div className="card shadow-sm border-light mb-4">
                  <div className="card-body">
                    <h3 className="card-title text-dark text-capitalize">{t('settings.general')}</h3>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="first-name" className="form-label text-dark">{t('settings.first')}</label>
                          <input type="text" className="form-control" id="first-name" name="first_name" placeholder="John" value={first_name} onChange={e => setFirst_name(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="last-name" className="form-label text-dark">{t('settings.last')}</label>
                          <input type="text" className="form-control" id="last-name" name="last_name" placeholder="Doknjas" value={last_name} onChange={e => setLast_name(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="occupation" className="form-label text-dark">{t('settings.occupation')}</label>
                          <input type="text" className="form-control" id="occupation" name="occupation" placeholder="Chess Player" value={occupation} onChange={e => setOccupation(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="country" className="form-label text-dark">{t('settings.country')}</label>
                          <select id="country" className="form-select" value={country} onChange={e => setCountry(e.target.value)}>
                            {getCountries()}
                          </select>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="biography" className="form-label text-dark">{t('profile.biography')}</label>
                          <textarea className="form-control" rows={5} id="biography" name="biography" placeholder="I love chess" value={bio} onChange={e => setBio(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg d-block mx-auto text-capitalize">{t('settings.save')}</button>
          </form>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default Display;
