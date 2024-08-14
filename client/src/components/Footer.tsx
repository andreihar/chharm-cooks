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

	const NavSection: React.FC<{ title: string; links: { to: string; text: string; isButton?: boolean; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; }[]; }> = ({ title, links }) => (
		<div className="col-6 col-md-3 mb-3">
			<h5>{title}</h5>
			<ul className="nav flex-column">
				{links.map((link, index) => (
					<li key={index} className="mb-2">
						{link.isButton ? (
							<button className="nav-link p-0 text-body-secondary" onClick={link.onClick?.bind(null)}>{link.text}</button>
						) : (
							<Link to={link.to} className="nav-link p-0 text-body-secondary">{link.text}</Link>
						)}
					</li>
				))}
			</ul>
		</div>
	);

	return (
		<>
			<div className="bg-primary py-2">
				<div className="container d-flex justify-content-between align-items-center">
					<p className="mb-0 fw-bold">{t('footer.social')}</p>
					<ul className="list-unstyled d-flex my-3">
						<li>
							<a className="nav-link" href="https://www.linkedin.com/in/andreihar/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
								<FontAwesomeIcon icon={faLinkedinIn} fontSize="1.5rem" />
							</a>
						</li>
						<li className="ms-3">
							<a className="nav-link" href="https://github.com/andreihar/" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
								<FontAwesomeIcon icon={faGithub} fontSize="1.5rem" />
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="container">
				<footer className="pt-3 mt-5">
					<div className="row">
						<div className="col-md-4 offset-md-1 mb-3 pe-5">
							<div className="d-flex align-items-center mb-3">
								<img src={logo} alt="ChhármCooks Logo" className="img-fluid me-2" style={{ width: '50px', height: '50px' }} />
								<h3 className="text-primary mb-0"><b className="text-primary fw-bold">Chhárm</b>Cooks</h3>
							</div>
							<p className="text-body-secondary">{t('footer.about')}</p>
						</div>
						<NavSection title={t('footer.main')} links={[{ to: '/', text: t('navbar.home') }, { to: '/form', text: t('navbar.addRecipe') }, { to: '/contributors', text: t('navbar.contributors') }]} />
						<NavSection title={t('footer.user')} links={(user ? [
							{ to: `/user/${user?.sub}`, text: t('navbar.profile'), isButton: false },
							{ to: '/settings', text: t('navbar.settings'), isButton: false },
							{ to: '#', text: t('navbar.signOut'), isButton: true, onClick: logOut }
						] : [{ to: '#', text: t('navbar.signIn'), isButton: true, onClick: (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); loginWithRedirect(); } }])} />
					</div>
					<div className="d-flex flex-row justify-content-center pt-3 border-top">
						<p>{`© 2024 Andrei Harbachov. ${t('footer.rights')}.`}</p>
					</div>
				</footer>
			</div>
		</>
	);
}

export default Footer;
