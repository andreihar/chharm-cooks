import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import DbService from '../services/DbService';
import logo from '../assets/logo.svg';

function Footer() {
	const { t } = useTranslation();
	const { logout, loginWithRedirect, user } = useAuth0();

	const logOut = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		DbService.logout();
		logout();
	};

	return (
		<div className="container">
			<footer className="pt-3 mt-5 border-top">
				<div className="row">
					<div className="col-md-4 offset-md-1 mb-3 pe-5">
						<div className="d-flex align-items-center mb-3">
							<img src={logo} alt="ChhármCooks Logo" className="img-fluid me-2" style={{ width: '50px', height: '50px' }} />
							<h3 className="text-primary mb-0"><b className="text-primary fw-bold">Chhárm</b>Cooks</h3>
						</div>
						<p className="text-body-secondary">{t('footer.about')}</p>
					</div>
					<div className="col-6 col-md-3 mb-3">
						<h5>{t('footer.main')}</h5>
						<ul className="nav flex-column">
							<li className="mb-2"><Link to="/" className="nav-link p-0 text-body-secondary">{t('navbar.home')}</Link></li>
							<li className="mb-2"><Link to="/form" className="nav-link p-0 text-body-secondary">{t('navbar.addRecipe')}</Link></li>
							<li className="mb-2"><Link to="/contributors" className="nav-link p-0 text-body-secondary">{t('navbar.contributors')}</Link></li>
						</ul>
					</div>
					<div className="col-6 col-md-3 mb-3">
						<h5>{t('footer.user')}</h5>
						<ul className="nav flex-column">
							{user ? (
								<>
									<li className="mb-2"><Link to={`/user/${user.sub}`} className="nav-link p-0 text-body-secondary">{t('navbar.profile')}</Link></li>
									<li className="mb-2"><Link to="/settings" className="nav-link p-0 text-body-secondary">{t('navbar.settings')}</Link></li>
									<li className="mb-2"><button className="nav-link p-0 text-body-secondary" onClick={(e) => logOut(e)}>{t('navbar.signOut')}</button></li>
								</>
							) : (
								<li className="mb-2"><button className="nav-link p-0 text-body-secondary" onClick={() => loginWithRedirect()}>{t('navbar.signIn')}</button></li>
							)}
						</ul>
					</div>
				</div>

				<div className="d-flex flex-row justify-content-between py-4 mt-4 border-top">
					<p>{`© 2024 Andrei Harbachov. ${t('footer.rights')}.`}</p>
					<ul className="list-unstyled d-flex">
						<li className="ms-3">
							<a className="link-body-emphasis" href="https://www.linkedin.com/in/andreihar/" target="_blank" rel="noopener noreferrer">
								<FontAwesomeIcon icon={faLinkedinIn} fontSize="1.5rem" />
							</a>
						</li>
						<li className="ms-3">
							<a className="link-body-emphasis" href="https://github.com/andreihar/" target="_blank" rel="noopener noreferrer">
								<FontAwesomeIcon icon={faGithub} fontSize="1.5rem" />
							</a>
						</li>
					</ul>
				</div>
			</footer>
		</div>
	);
}

export default Footer;
