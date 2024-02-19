import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DbService from '../services/DbService';

function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [onlyMyRecipes, setOnlyMyRecipes] = useState(false);
  const {authUser, isLogged} = useAuth();
  const defaultImg = 'https://images.ctfassets.net/kugm9fp9ib18/3aHPaEUU9HKYSVj1CTng58/d6750b97344c1dc31bdd09312d74ea5b/menu-default-image_220606_web.png';

  useEffect(() => {
    DbService.getRecipes().then(setRecipes);
  }, []);

  return (
    <>
      <Navbar/>
      <div className="overflow-hidden">
        <div className="container-fluid col-xxl-8">
          <div className="row flex-lg-nowrap align-items-center g-5">
            <div className="order-lg-1 w-100 d-none d-lg-block">
              <img src="https://asianinspirations.com.au/wp-content/uploads/2020/09/20200901-Malaysian-Cuisine-Kaleidoscope-of-Flavours-00-Feat-Img_1920w.jpg"
                style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)", }} className="d-block" width={900} height={600} />
            </div>
            <div className="col-lg-6 p-lg-5">
              <h1 className="display-4 lh-1 text-body-emphasis">Uncover Hokkien culinary charms at <span className="text-primary fw-bold">Chhárm</span><span className="text-primary">Cooks</span></h1>
              <p className="lead my-5">Embark on a culinary journey with <span className="text-primary fw-bold">Chhárm</span><span className="text-primary">Cooks</span>, where the heart of Hokkien <span className="text-primary fw-bold">炒</span><span className="text-primary">菜</span> <small className="fs-6">(chhá chhài)</small> beats in every recipe. Explore the secrets of culinary artistry and indulge in flavours that charm your palate.</p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                <Link to='/form' className="nav-link"><button type="button" className="btn btn-primary btn-lg px-4 fw-bold">Add Recipe</button></Link>
                <a href="#recipes" className="ms-md-2"><button type="button" className="btn btn-outline-secondary btn-lg px-4">View Recipes</button></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <h2 id="recipes">Recipes</h2>
          <div className="row justify-content-center my-4">
            <div className="col-md-6">
              <input type="text" className="form-control border-dark-subtle" placeholder="Search" onChange={e => setSearchTerm(e.target.value)} />
              {isLogged &&
                <button 
                  className={`btn ${onlyMyRecipes ? 'btn-primary' : 'btn-secondary'} me-2 mt-2`}
                  onClick={() => setOnlyMyRecipes(prev => !prev)}>
                  {onlyMyRecipes ? 'Show all recipes' : 'Show only my recipes'}
                </button>
              }
              {[...new Set(recipes.map(recipe => recipe.cuisine))].map(cuisine => (
                <button key={cuisine}
                  className={`btn ${cuisine === selectedCuisine ? 'btn-primary' : 'btn-secondary'} me-2 mt-2`}
                  onClick={() => setSelectedCuisine(prev => prev === cuisine ? '' : cuisine)}>
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
          <div className="row">
            {recipes.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) && (!selectedCuisine || item.cuisine === selectedCuisine) && (!onlyMyRecipes || item.username === authUser.username)).map((recipe, index) => (
              <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 my-3">
                <Link to={`/recipe/${recipe.rid}`}>
                  <div className="card h-100">
                    <div className="img-container" style={{ overflow: 'hidden' }}>
                      <img className="card-img-top img-fluid hover-enlarge" style={{ height: "200px", objectFit: "cover" }} src={recipe.picture ? recipe.picture : defaultImg} alt="Card image" />
                    </div>
                    <div className="card-body">
                      <p className="card-subtitle mb-2 text-body-secondary fs-6 text-uppercase fw-light">{recipe.cuisine}</p>
                      <h5 className="card-title text-uppercase">{recipe.title}</h5>
                      <h5 className="text-body-secondary">{recipe.chinTitle}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Home