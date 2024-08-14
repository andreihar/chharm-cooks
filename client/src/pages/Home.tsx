import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { useAuth0 } from '@auth0/auth0-react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';

function Home() {
  const [recipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [onlyMyRecipes, setOnlyMyRecipes] = useState(false);
  const { user, isAuthenticated } = useAuth0();
  const { t } = useTranslation();
  const { getCuisineName } = useLocalisationHelper();


  // Cuisine thing
  const handleCuisineClick = (cuisine: string) => {
    if (selectedCuisine === cuisine) {
      setSelectedCuisine(cuisine.includes('-') ? cuisine.split('-')[0] : '');
    } else {
      setSelectedCuisine(cuisine);
    }
  };

  const filteredRecipes = recipes.filter(item => {
    const matchesSearchTerm = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine
      ? item.cuisine === selectedCuisine || item.cuisine.startsWith(`${selectedCuisine.split('-')[0]}-`)
      : true;
    const matchesUser = onlyMyRecipes ? item.username === user!.sub : true;
    return matchesSearchTerm && matchesCuisine && matchesUser;
  });
  const topLevelCuisines = [...new Set(recipes.map(recipe => recipe.cuisine.split('-')[0]))];

  return (
    <>
      <Helmet>
        <title>{`${t('navbar.home')} | ChhármCooks`}</title>
        <meta name="description" content={t('footer.about')} />
      </Helmet>
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
        <div className="position-relative flex-grow-1 d-none d-lg-block" style={{ flex: "1" }}>
          <img alt="Home banner" className="position-absolute top-0 bottom-0 start-0 left-0 h-100" style={{ objectFit: 'cover', clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)' }} src="https://asianinspirations.com.au/wp-content/uploads/2020/09/20200901-Malaysian-Cuisine-Kaleidoscope-of-Flavours-00-Feat-Img_1920w.jpg" />
        </div>
      </div>
      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <h2 id="recipes">{t('home.recipes')}</h2>
          <div className="row justify-content-center my-4">
            <div className="col-md-6">
              <input id="search" type="text" className="form-control border-dark-subtle" placeholder={t('home.search')} onChange={e => setSearchTerm(e.target.value)} />
              {isAuthenticated && (
                <button className={`btn ${onlyMyRecipes ? 'btn-primary' : 'btn-secondary'} me-2 mt-2`} onClick={() => setOnlyMyRecipes(prev => !prev)}>
                  {onlyMyRecipes ? t('home.showAll') : t('home.showMy')}
                </button>
              )}
              {topLevelCuisines.map(countryCode => (
                <button key={countryCode} className={`btn ${countryCode === selectedCuisine.split('-')[0] ? 'btn-primary' : 'btn-secondary'} me-2 mt-2`} onClick={() => handleCuisineClick(countryCode)}>
                  {getCuisineName(countryCode)}
                </button>
              ))}
              {selectedCuisine && (
                <div>
                  {recipes
                    .map(recipe => recipe.cuisine)
                    .filter(cuisine => cuisine.startsWith(`${selectedCuisine.split('-')[0]}-`))
                    .map(subCuisine => (
                      <button key={subCuisine} className={`btn btn-sm ${subCuisine === selectedCuisine ? 'btn-primary' : 'btn-secondary'} me-2 mt-2`} onClick={() => handleCuisineClick(subCuisine)}>
                        {getCuisineName(subCuisine)}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="row">
            {filteredRecipes.map(recipe => (
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
