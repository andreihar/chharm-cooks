import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Recipe } from '../Recipe';
import { defaultRecipes } from '../DefaultRecipes';
import Navbar from './Navbar';
import Footer from './Footer';

function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {    
    let loadedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    if (!loadedRecipes.length) {
      loadedRecipes = defaultRecipes.map((recipe, index) => ({ ...recipe, id: index }));
      localStorage.setItem('index', JSON.stringify(loadedRecipes.length));
      localStorage.setItem('recipes', JSON.stringify(loadedRecipes));
    }
    setRecipes(loadedRecipes);
  }, []);

  return (
    <>
      <Navbar/>
      <div className="overflow-hidden" style={{ marginTop: "80px" }}>
        <div className="container-fluid col-xxl-8">
          <div className="row flex-lg-nowrap align-items-center g-5">
            <div className="order-lg-1 w-100 d-none d-lg-block">
              <img src="https://asianinspirations.com.au/wp-content/uploads/2020/09/20200901-Malaysian-Cuisine-Kaleidoscope-of-Flavours-00-Feat-Img_1920w.jpg"
                style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)", }} className="d-block" width={900} height={600} />
            </div>
            <div className="col-lg-6 p-lg-5">
              <h1 className="display-4 lh-1 text-body-emphasis">Uncover Hokkien culinary charms at <span className="prim fw-bold">Chhárm</span><span className="prim">Cooks</span></h1>
              <p className="lead my-5">Embark on a culinary journey with <span className="prim fw-bold">Chhárm</span><span className="prim">Cooks</span>, where the heart of Hokkien <span className="prim fw-bold">炒</span><span className="prim">菜</span> <small className="fs-6">(chhá chhài)</small> beats in every recipe. Explore the secrets of culinary artistry and indulge in flavours that charm your palate.</p>
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
          <div className="row">
            {recipes.map((recipe, index) => (
              <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 my-3">
                <Link to={`/recipe/${recipe.id}`}>
                <div className="card h-100">
                  <div className="img-container" style={{ overflow: 'hidden' }}>
                    <img className="card-img-top img-fluid hover-enlarge" style={{ height: "200px", objectFit: "cover" }} src={recipe.picture} alt="Card image" />
                  </div>
                  <div className="card-body">
                    <p className="card-subtitle mb-2 text-body-secondary fs-6 text-uppercase fw-light">{recipe.cuisine}</p>
                    <h5 className="card-title text-uppercase">{recipe.name.split(' | ')[0]}</h5>
                    <h5 className="card-title text-body-secondary">{recipe.name.split(' | ')[1]}</h5>
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
