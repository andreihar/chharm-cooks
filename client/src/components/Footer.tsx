import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';

function Footer() {
	const { t } = useTranslation();

	return (
		// <footer className="py-3 my-4">
		// 	<ul className="nav justify-content-center border-bottom pb-3 mb-3">
		// 		<li className="nav-item"><Link to='/' className="nav-link px-2 text-body-secondary">{t('navbar.home')}</Link></li>
		// 		<li className="nav-item"><Link to='/form' className="nav-link px-2 text-body-secondary">{t('navbar.addRecipe')}</Link></li>
		// 		<li className="nav-item"><Link to='/contributors' className="nav-link px-2 text-body-secondary">{t('navbar.contributors')}</Link></li>
		// 	</ul>
		// 	<p className="text-center text-body-secondary">© 2024 Andrei Harbachov</p>
		// </footer>
		// <footer className="text-center text-lg-start text-dark my-4" >
		// 	<section className="d-flex justify-content-between p-4 text-white" style={{ backgroundColor: "#21D192" }}>
		// 		<div className="me-5">
		// 			<span>Get connected with us on social networks:</span>
		// 		</div>
		// 		<div>
		// 			<a href="" className="text-white me-4"><i className="fab fa-facebook-f"></i></a>
		// 			<a href="" className="text-white me-4"><i className="fab fa-twitter"></i></a>
		// 			<a href="" className="text-white me-4"><i className="fab fa-google"></i></a>
		// 			<a href="" className="text-white me-4"><i className="fab fa-instagram"></i></a>
		// 			<a href="" className="text-white me-4"><i className="fab fa-linkedin"></i></a>
		// 			<a href="" className="text-white me-4"><i className="fab fa-github"></i></a>
		// 		</div>
		// 	</section>

		// 	<section className="">
		// 		<div className="container text-center text-md-start mt-5 border-bottom">
		// 			<div className="row mt-3">
		// 				<div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
		// 					<h6 className="text-uppercase fw-bold">Company name</h6>
		// 					<p>Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
		// 				</div>
		// 				<div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
		// 					<h6 className="text-uppercase fw-bold">Products</h6>
		// 					<p><a href="#!" className="text-dark">MDBootstrap</a></p>
		// 					<p><a href="#!" className="text-dark">MDWordPress</a></p>
		// 					<p><a href="#!" className="text-dark">BrandFlow</a></p>
		// 					<p><a href="#!" className="text-dark">Bootstrap Angular</a></p>
		// 				</div>
		// 				<div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
		// 					<h6 className="text-uppercase fw-bold">Useful links</h6>
		// 					<hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px", backgroundColor: "#7c4dff; height: 2px" }} />
		// 					<p><a href="#!" className="text-dark">Your Account</a></p>
		// 					<p><a href="#!" className="text-dark">Become an Affiliate</a></p>
		// 					<p><a href="#!" className="text-dark">Shipping Rates</a></p>
		// 					<p><a href="#!" className="text-dark">Help</a></p>
		// 				</div>
		// 				<div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
		// 					<h6 className="text-uppercase fw-bold">Contact</h6>
		// 					<hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px", backgroundColor: "#7c4dff; height: 2px" }} />
		// 					<p><i className="fas fa-home mr-3"></i> New York, NY 10012, US</p>
		// 					<p><i className="fas fa-envelope mr-3"></i> info@example.com</p>
		// 					<p><i className="fas fa-phone mr-3"></i> + 01 234 567 88</p>
		// 					<p><i className="fas fa-print mr-3"></i> + 01 234 567 89</p>
		// 				</div>
		// 			</div>
		// 		</div>
		// 		<div className="text-center">© 2024 Andrei Harbachov</div>
		// 	</section>
		// </footer>
		<div className="container">
			<footer className="py-5">
				<div className="row">
					<div className="col-6 col-md-2 mb-3">
						<h5>Section</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Home</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Features</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Pricing</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">FAQs</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">About</a></li>
						</ul>
					</div>

					<div className="col-6 col-md-2 mb-3">
						<h5>Section</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Home</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Features</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Pricing</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">FAQs</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">About</a></li>
						</ul>
					</div>

					<div className="col-6 col-md-2 mb-3">
						<h5>Section</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Home</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Features</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Pricing</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">FAQs</a></li>
							<li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">About</a></li>
						</ul>
					</div>

					<div className="col-md-5 offset-md-1 mb-3">
						<form>
							<h5>Subscribe to our newsletter</h5>
							<p>Monthly digest of what's new and exciting from us.</p>
							{/* <div className="d-flex flex-column flex-sm-row w-100 gap-2">
								<label for="newsletter1" className="visually-hidden">Email address</label>
								<input id="newsletter1" type="text" className="form-control" placeholder="Email address">
									<button className="btn btn-primary" type="button">Subscribe</button>
							</div> */}
						</form>
					</div>
				</div>

				<div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
					<p>{`© 2024 Andrei Harbachov. ${t('footer.rights')}.`}</p>
					<ul className="list-unstyled d-flex">
						<li className="ms-3">
							<a className="link-body-emphasis" href="#">
								<FontAwesomeIcon icon={faTwitter} fontSize="1.5rem" />
							</a>
						</li>
						<li className="ms-3">
							<a className="link-body-emphasis" href="#">
								<FontAwesomeIcon icon={faInstagram} fontSize="1.5rem" />
							</a>
						</li>
						<li className="ms-3">
							<a className="link-body-emphasis" href="#">
								<FontAwesomeIcon icon={faFacebook} fontSize="1.5rem" />
							</a>
						</li>
					</ul>
				</div>
			</footer>
		</div>
	);
}

export default Footer;
