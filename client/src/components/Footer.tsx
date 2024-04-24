import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="py-3 my-4">
			<ul className="nav justify-content-center border-bottom pb-3 mb-3">
				<li className="nav-item"><Link to='/' className="nav-link px-2 text-body-secondary">{t('navbar.home')}</Link></li>
				<li className="nav-item"><Link to='/form' className="nav-link px-2 text-body-secondary">{t('navbar.addRecipe')}</Link></li>
				<li className="nav-item"><Link to='/contributors' className="nav-link px-2 text-body-secondary">{t('navbar.contributors')}</Link></li>
			</ul>
			<p className="text-center text-body-secondary">© 2024 Andrei Harbachov</p>
		</footer>
	);
}

export default Footer;
