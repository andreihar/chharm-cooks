import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import DbService from '../services/DbService';
import noUser from '../assets/noUser.jpg';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState(noUser);
  const [social, setSocial] = useState('');
  const [forename, setForename] = useState('');
  const [surname, setSurname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  // const { isAuthenticated, user } = useAuth0();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // const authors = await DbService.getUsers();
    // if (authors.some((author: User) => author.username === username.trim())) {
    //   alert('This username is already used');
    //   return;
    // }
    // // const newAuthor = new User(username.trim(), email.trim(), imageUrl.trim() || noUser, social.trim(), forename.trim(), surname.trim(), bio.trim(), occupation.trim(), new Date());
    // const newUser = new User(sub!, picture!, '', given_name!, family_name!, '', '', new Date());
    // await DbService.addUser(newAuthor);
    navigate('/');
  }

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    nextStep();
  };

  const preventSpaces = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <div className="container-fluid">
      <section style={{ minHeight: "100vh" }} className="row d-flex align-items-center justify-content-center h-100">
        <div className={`col-md-${step === 1 ? '6' : '9'} d-flex flex-column justify-content-center align-items-center`}>
          <h2 className="mb-1 fw-normal text-center mb-5">{t('signup.welcome.part1')}<br /><span className="text-primary">{t('signup.welcome.part2')}</span></h2>
          {step === 1 && (<>
            <form style={{ minWidth: '330px' }} onSubmit={validateForm}>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="username" placeholder="Name" onChange={e => setUsername(e.target.value)} onKeyDown={preventSpaces} autoComplete="username" maxLength={50} required />
                <label htmlFor="username">{t('signup.username')}</label>
              </div>
              <div className="form-floating mb-3">
                <input type="email" className="form-control" id="email" placeholder="Email" onChange={e => setEmail(e.target.value)} onKeyDown={preventSpaces} autoComplete="email" required />
                <label htmlFor="email">{t('signup.email')}</label>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 text-uppercase mb-4">{t('signup.join')}</button>
              <p className="m-0 align-center">
                {t('signup.haveAccount')}{" "}
                <Link to='/login' className="fw-bold px-1">{t('login.signIn')}</Link>
              </p>
            </form>
          </>)}
          {step === 2 && (<>
            <form style={{ minWidth: '330px' }} onSubmit={validateForm}>
              <img src={imageUrl} alt="mdo" width={128} height={128} className="rounded-circle mx-auto d-block mb-5" />
              <div className="d-flex justify-content-between">
                <div className="form-floating mb-5 flex-fill me-3">
                  <input type="text" className="form-control" id="forename" placeholder="Forename" onChange={e => setForename(e.target.value)} autoComplete="forename" required />
                  <label htmlFor="forename">{t('signup.forename')}</label>
                </div>
                <div className="form-floating mb-5 flex-fill ms-3">
                  <input type="text" className="form-control" id="surname" placeholder="Surname" onChange={e => setSurname(e.target.value)} autoComplete="surname" required />
                  <label htmlFor="surname">{t('signup.surname')}</label>
                </div>
              </div>
              <div className="form-floating mb-5">
                <input type="text" className="form-control" id="picture" placeholder="Picture" onChange={e => setImageUrl(e.target.value || noUser)} />
                <label htmlFor="picture">{t('form.picture')} {t('form.optional')}</label>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 text-uppercase mb-4">{t('signup.join')}</button>
            </form>
          </>)}
          {step === 3 && (<>
            <form style={{ minWidth: '330px' }} onSubmit={validateForm}>
              <div className="form-floating mb-4">
                <input type="text" className="form-control" id="social" placeholder="Social" onChange={e => setSocial(e.target.value)} />
                <label htmlFor="social">{t('signup.social')} {t('form.optional')}</label>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 text-uppercase mb-4">{t('signup.join')}</button>
            </form>
          </>)}
          {step === 4 && (<>
            <form style={{ minWidth: '330px' }} onSubmit={submit}>
              <div className="form-floating mb-4">
                <input type="text" className="form-control" id="occupation" placeholder="Occupation" onChange={e => setOccupation(e.target.value)} />
                <label htmlFor="occupation">{t('signup.occupation')} {t('form.optional')}</label>
              </div>
              <div className="form-floating mb-4">
                <textarea className="form-control" id="bio" placeholder="Biography" onChange={e => setBio(e.target.value)} style={{ height: '200px' }}></textarea>
                <label htmlFor="bio">{t('signup.bio')} {t('form.optional')}</label>
              </div>
              <button className="btn btn-primary w-100 py-2 text-uppercase mb-4" type="submit">{t('signup.join')}</button>
            </form>
          </>)}
        </div>
        {step === 1 && (
          <div className="col-md-6" style={{ backgroundImage: `url(https://st2.depositphotos.com/5510056/9566/i/950/depositphotos_95669288-stock-photo-traditional-chinese-food.jpg)`, minHeight: '100vh' }}>
          </div>
        )}
      </section>
    </div>
  );
}

export default Signup;