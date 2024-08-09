import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { useAuth0 } from '@auth0/auth0-react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';
import DbService from '../services/DbService';

function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [onlyMyRecipes, setOnlyMyRecipes] = useState(false);
  const { user, isAuthenticated } = useAuth0();
  const { t } = useTranslation();
  const { getCuisineName } = useLocalisationHelper();

  useEffect(() => {
    DbService.getRecipes().then(setRecipes);
    const intervalId = setInterval(() => {
      DbService.getRecipes().then(setRecipes);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-height overflow-hidden d-flex w-100">
        <div className="d-flex flex-grow-1 align-items-center justify-content-center p-1" style={{ flex: "1" }}>
          <div className="col-lg-7 col-md-7 col-sm-7">
            <h1 className="display-4 lh-1 text-body-emphasis">
              <Trans
                i18nKey="home.title"
                components={[<b className="text-primary fw-bold" />, <span className="text-primary" />]}
              />
            </h1>
            <p className="lead my-5">
              <Trans
                i18nKey="home.description"
                components={[<b className="text-primary fw-bold" />, <span className="text-primary" />, <small className="fs-6" />]}
              />
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
              <Link to='/form' className="nav-link"><button type="button" className="btn btn-primary btn-lg px-4 fw-bold">{t('navbar.addRecipe')}</button></Link>
              <a href="#recipes" className="ms-md-2"><button type="button" className="btn btn-outline-secondary btn-lg px-4">{t('home.viewRecipes')}</button></a>
            </div>
          </div>
        </div>
        <div className="hero-image position-relative flex-grow-1" style={{ flex: "1" }}>
          <img alt="Home banner" className="position-absolute top-0 bottom-0 start-0 left-0 h-100" src="https://asianinspirations.com.au/wp-content/uploads/2020/09/20200901-Malaysian-Cuisine-Kaleidoscope-of-Flavours-00-Feat-Img_1920w.jpg" />
        </div>
      </div>
      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <h2 id="recipes">{t('home.recipes')}</h2>
          <div className="row justify-content-center my-4">
            <div className="col-md-6">
              <input id="search" type="text" className="form-control border-dark-subtle" placeholder={t('home.search')} onChange={e => setSearchTerm(e.target.value)} />
              {isAuthenticated &&
                <button
                  className={`btn ${onlyMyRecipes ? 'btn-primary' : 'btn-secondary'} me-2 mt-2`}
                  onClick={() => setOnlyMyRecipes(prev => !prev)}>
                  {onlyMyRecipes ? t('home.showAll') : t('home.showMy')}
                </button>
              }
              {[...new Set(recipes.map(recipe => recipe.cuisine))].map(cuisine => (
                <button key={cuisine}
                  className={`btn ${cuisine === selectedCuisine ? 'btn-primary' : 'btn-secondary'} me-2 mt-2`}
                  onClick={() => setSelectedCuisine(prev => prev === cuisine ? '' : cuisine)}>
                  {getCuisineName(cuisine)}
                </button>
              ))}
            </div>
          </div>
          <div className="row">
            {recipes.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) && (!selectedCuisine || item.cuisine === selectedCuisine) && (!onlyMyRecipes || item.username === user!.sub)).map((recipe) => (
              <RecipeCard key={recipe.rid} recipe={recipe} classes={'col-12 col-sm-6 col-md-4 col-lg-3'} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
