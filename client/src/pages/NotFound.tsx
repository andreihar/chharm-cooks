import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';

function NotFound() {
  return (
    <>
      <Navbar/>
      <div className="bg-body-tertiary">
        <main className="form-signin d-flex flex-column justify-content-center align-items-center text-center">
          <FontAwesomeIcon icon={faFaceSadTear} size="6x" className="text-primary mb-4"/>
          <h1 className="display-1 mb-4">404</h1>
          <p className="display-6 mb-5">We can't seem to find a page you're looking for</p>
          <Link to='/' className="btn btn-primary py-2 text-uppercase">Back to Home</Link>
        </main>
      </div>
    </>
  )
}

export default NotFound
