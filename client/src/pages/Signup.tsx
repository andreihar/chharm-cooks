import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../models/User';
import { useAuth0 } from '@auth0/auth0-react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import DbService from '../services/DbService';
import Lottie from 'lottie-react';
import socialAnim from '../assets/signup/social.json';
import countryAnim from '../assets/signup/country.json';
import occupationAnim from '../assets/signup/occupation.json';
import bioAnim from '../assets/signup/bio.json';
import endAnim from '../assets/signup/end.json';

function Signup() {
  const [social, setSocial] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const { isAuthenticated, user } = useAuth0();
  const { i18n, t } = useTranslation();
  const { getCountries } = useLocalisationHelper();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);


  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user) {
      const { sub, picture, name } = user;
      const [given_name = '', family_name = ''] = name ? name.split(' ') : [];
      const newUser = new User(sub!, picture!, social, given_name!, family_name!, bio, occupation, country, new Date());
      DbService.updateUser(newUser)
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          console.error('Error updating user:', error);
        });
    } else {
      navigate('/');
    }
  }

  const nextStep = () => {
    console.log(i18n.language);
    setStep(step + 1);
  };

  const validateForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    nextStep();
  };

  if (!isAuthenticated) {
    navigate('/');
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nLang');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const animations = [socialAnim, countryAnim, occupationAnim, bioAnim, endAnim];
  const renderForm = () => {
    const commonFormProps = { style: { minWidth: '330px' }, onSubmit: validateForm };
    const renderButton = (label: string) => (
      <button type="submit" className="btn btn-primary w-100 py-2 text-uppercase my-4">{label}</button>
    );

    const renderInputField = () => {
      switch (step) {
        case 1:
          return (
            <><input type="text" className="form-control" id="social" placeholder={t('settings.social')} onChange={e => setSocial(e.target.value)} />
              <label htmlFor="social">{t('settings.social')} {t('form.optional')}</label></>
          );
        case 2:
          return (
            <><select className="form-select" value={country} onChange={e => setCountry(e.target.value)}>{getCountries()}</select>
              <label htmlFor="countrySelect">{t('settings.country')}</label></>
          );
        case 3:
          return (
            <><input type="text" className="form-control" id="occupation" placeholder={t('settings.occupation')} onChange={e => setOccupation(e.target.value)} />
              <label htmlFor="occupation">{t('settings.occupation')} {t('form.optional')}</label></>
          );
        default:
          return (
            <><textarea className="form-control" id="bio" placeholder={t('profile.biography')} onChange={e => setBio(e.target.value)} style={{ height: '200px' }}></textarea>
              <label htmlFor="bio">{t('profile.biography')} {t('form.optional')}</label></>
          );
      }
    };

    if (step === 5) {
      return (
        <form style={{ minWidth: '330px' }} onSubmit={submit}>{renderButton(t('signup.finish'))}</form>
      );
    }

    return (
      <form {...commonFormProps}>
        <div className="form-floating mb-4">{renderInputField()} {renderButton(t('signup.next'))}</div>
      </form>
    );
  };

  return (
    <div className="container-fluid bg-body-tertiary">
      <section style={{ minHeight: "100vh" }} className="row d-flex align-items-center justify-content-center">
        <div className="col-12 col-md-8 col-lg-5 py-2 d-flex flex-column justify-content-center align-items-center bg-white rounded border">
          <Lottie animationData={animations[step - 1]} style={{ maxWidth: '50%' }} />
          <p className="card-subtitle my-1 text-body-secondary fs-6 text-uppercase">
            <Trans i18nKey="signup.step" components={[<span className="text-primary fw-bold" />]} values={{ now: step, total: 5 }} />
          </p>
          <h2 className="mb-1 fw-normal text-center mb-5">
            <Trans i18nKey={`signup.steps.header${step}`} components={[<span className="text-primary" />, <br />]} />
          </h2>
          <p className="fs-5 text-center">{t(`signup.steps.step${step}`)}</p>
          {renderForm()}
        </div>
      </section>
    </div>
  );
};

export default Signup;
