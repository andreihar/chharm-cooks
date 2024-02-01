import logo from '../assets/logo.svg'
import { Link } from 'react-router-dom';

function Footer() {
	return (
		<footer className="py-3 my-4">
			<ul className="nav justify-content-center border-bottom pb-3 mb-3">
				<li className="nav-item"><Link to='/' className="nav-link px-2 text-body-secondary">Home</Link></li>
				<li className="nav-item"><Link to='/form' className="nav-link px-2 text-body-secondary">New Recipe</Link></li>
			</ul>
			<p className="text-center text-body-secondary">© 2023 Andrei Harbachov</p>
		</footer>
	)
}

export default Footer
