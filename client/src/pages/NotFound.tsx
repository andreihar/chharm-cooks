import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';

function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <div className="bg-body-tertiary">
        <main className="min-height d-flex flex-column justify-content-center align-items-center text-center">
          <FontAwesomeIcon icon={faFaceSadTear} size="6x" className="text-primary mb-4" />
          <h1 className="display-1 mb-4">404</h1>
          <p className="display-6 mb-5">{t('404.message')}</p>
          <Link to='/' className="btn btn-primary py-2 text-uppercase">{t('404.home')}</Link>
        </main>
      </div>
    </>
  );
}

export default NotFound;
