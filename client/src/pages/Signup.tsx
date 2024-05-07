import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../models/User';
import { useAuth0 } from '@auth0/auth0-react';
import { Trans, useTranslation } from 'react-i18next';
import DbService from '../services/DbService';
import countries from '../assets/translations/countries.json';
import Lottie from 'lottie-react';
import socialAnim from '../assets/signup/social.json';
import bioAnim from '../assets/signup/bio.json';

function Signup() {
  const [social, setSocial] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const { isAuthenticated, user } = useAuth0();
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const langIndex = {
    "en": 0,
    "zh": 1,
    "ms": 2
  }[i18n.language] || 0;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user) {
      const { sub, picture, name } = user;
      const [given_name = '', family_name = ''] = name ? name.split(' ') : [];
      const newUser = new User(sub!, picture!, social, given_name!, family_name!, bio, occupation, country, new Date());
      await DbService.updateUser(sub!, newUser);
    }
    navigate('/');
  }

  const nextStep = () => {
    console.log(i18n.language);
    setStep(step + 1);
  };

  const validateForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="container-fluid bg-body-tertiary">
      <section style={{ minHeight: "100vh" }} className="row d-flex align-items-center justify-content-center">
        <div className="col-5 py-2 d-flex flex-column justify-content-center align-items-center bg-white rounded border">
          {step === 1 && (<>
            <Lottie animationData={socialAnim} style={{ maxWidth: '50%' }} />
          </>)}
          {step === 2 && (<>
          </>)}
          {step === 3 && (<>
          </>)}
          {step === 4 && (<>
            <Lottie animationData={bioAnim} style={{ maxWidth: '50%' }} />
          </>)}
          {/* <h2 className="mb-1 fw-normal text-center mb-5">
            <Trans
              i18nKey="signup.welcome"
              components={[
                <br />,
                <span className="text-primary" />
              ]}
            />
          </h2> */}
          <p className="card-subtitle my-1 text-body-secondary fs-6 text-uppercase">
            <Trans
              i18nKey="signup.step"
              components={[<span className="text-primary fw-bold" />]}
              values={{ now: step, total: 5 }} />
          </p>
          {step === 1 && (<>
            <h2 className="mb-1 fw-normal text-center mb-5">
              <Trans
                i18nKey="signup.welcome"
                components={[
                  <br />,
                  <span className="text-primary" />
                ]}
              />
            </h2>
            <p className="fs-5">Something else, a call for action</p>
            <form style={{ minWidth: '330px' }} onSubmit={validateForm}>
              <div className="form-floating mb-4">
                <input type="text" className="form-control" id="social" placeholder="Social" onChange={e => setSocial(e.target.value)} />
                <label htmlFor="social">{t('signup.social')} {t('form.optional')}</label>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 text-uppercase mb-4">{t('signup.next')}</button>
            </form>
          </>)}
          {step === 2 && (<>
            <form style={{ minWidth: '330px' }} onSubmit={validateForm}>
              <div className="form-floating mb-4">
                <select className="form-select" value={country} onChange={e => setCountry(e.target.value)}>
                  {Object.entries(countries).map(([code, names]) => (
                    <option key={code} value={code}>
                      {names[langIndex]}
                    </option>
                  ))}
                </select>
                <label htmlFor="countrySelect">Country</label>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 text-uppercase mb-4">{t('signup.next')}</button>
            </form>
          </>)}
          {step === 3 && (<>
            <form style={{ minWidth: '330px' }} onSubmit={validateForm}>
              <div className="form-floating mb-4">
                <input type="text" className="form-control" id="occupation" placeholder="Occupation" onChange={e => setOccupation(e.target.value)} />
                <label htmlFor="occupation">{t('signup.occupation')} {t('form.optional')}</label>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 text-uppercase mb-4">{t('signup.next')}</button>
            </form>
          </>)}
          {step === 4 && (<>
            <form style={{ minWidth: '330px' }} onSubmit={submit}>
              <div className="form-floating mb-4">
                <textarea className="form-control" id="bio" placeholder="Biography" onChange={e => setBio(e.target.value)} style={{ height: '200px' }}></textarea>
                <label htmlFor="bio">{t('signup.bio')} {t('form.optional')}</label>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 text-uppercase mb-4">{t('signup.finish')}</button>
            </form>
          </>)}
        </div>
      </section>
    </div>
  );
};

export default Signup;