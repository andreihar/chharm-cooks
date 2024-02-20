import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faClock, faBowlRice } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DbService from '../services/DbService';

function Display() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe>();
  const [author, setAuthor] = useState<User>();
  const [viewAlsoRecipes, setViewRecipes] = useState<Recipe[]>([]);
  const {authUser, isLogged} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const recipes = await DbService.getRecipes();
      setViewRecipes(recipes.filter(recipe => recipe.rid !== Number(id)).sort(() => Math.random() - 0.5).slice(0, 4));
      const foundRecipe = await DbService.getRecipeById(Number(id));
      const foundAuthor = foundRecipe && await DbService.getUserByName(foundRecipe.username);
      if (foundRecipe && foundAuthor) {
        setRecipe(foundRecipe);
        setAuthor(foundAuthor);
      } else {
        alert ("Error: Recipe or author not found.");
        navigate('/');
        return;
      }
    };
    loadData();
  }, [id]);

  const deleteRecipe = () => {
    if (window.confirm(`Are you sure you want to delete "${recipe!.title}"?`)) {
      DbService.deleteRecipe(Number(id));
      navigate('/');
    }
  }

  if (recipe) {
    const { picture, title, chinTitle, createdOn, timeLastModified, cuisine, ingredients, recipeInstructions, prepTime, cookTime, servings } = recipe;
    return (
    <>
      <Navbar/>
      <div className="p-5 text-center bg-image text-uppercase position-relative" style={{ backgroundImage: `url(${picture})`}}>
        <div className="mask position-absolute top-0 start-0 bottom-0 end-0">
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-white">
              <h1 className="mb-3">{`${title} | ${chinTitle}`}</h1>
              <h4 className="mb-3">{`Authentic ${cuisine} Hokkien dish made at home`}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="angled-div" />
      
      <main className="container">
        <div className="row g-5">
          <div className="col-md-8">
            <article className="blog-post">
              <h2 className="display-5 link-body-emphasis mb-1">Let's make <span className="text-primary">{`${title}`}</span>!</h2>
              <p className="text-dark-emphasis align-items-center d-flex">by:
                <img src={author!.picture} alt="User Picture" width={32} height={32} className="rounded-circle ms-2"/>
                <span className="text-uppercase fs-5 ms-2">{`${author!.username}`}</span>
              </p>
              <hr />
              <div className="d-flex justify-content-between">
                <p className="text-dark-emphasis">
                  Posted: <span className="">{`${createdOn.toLocaleDateString()}`}</span>&nbsp;
                  Updated: <span className="">{`${timeLastModified.toLocaleDateString()}`}</span>
                </p>
                {isLogged && (authUser.username === author!.username) &&
                  <div>
                    <button onClick={deleteRecipe} className="btn btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button>
                    <button onClick={() => navigate('/form/' + id)} className="btn btn-outline-secondary ms-2"><FontAwesomeIcon icon={faPenToSquare} /></button>
                  </div>
                }
              </div>
              <h2>Ingredients</h2>
              <p>{`Embark on a culinary journey with this simple yet sensational ${title}. Gather fresh, quality ingredients that will harmonise in a symphony of flavours. Here's the lineup:`}</p>
              <ul>
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h2>Directions</h2>
              <p>{`Now that your kitchen is adorned with the finest ingredients, let's weave them together into a culinary masterpiece. Follow these straightforward steps to unlock the full potential of each component, creating ${recipe!.title} that tantalises the taste buds:`}</p>
              <ol>
                {recipeInstructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </article>
          </div>
          <div className="col-md-4">
            <div className="position-sticky" style={{ top: "90px" }}>
              <div className="p-4 mb-3 bg-body-tertiary rounded">
                <h4 className="fst-italic">About <span className="text-primary">{`${title}`}</span></h4>
                <p className="mb-0 text-uppercase"><FontAwesomeIcon icon={faClock} /> Time</p>
                <ul className="mb-1">
                  <li><span className="text-uppercase">Prep:</span> <span className="text-dark-emphasis">{`${prepTime} minutes`}</span></li>
                  <li><span className="text-uppercase">Cook:</span> <span className="text-dark-emphasis">{`${cookTime} minutes`}</span></li>
                </ul>
                <p><span className="text-uppercase"><FontAwesomeIcon icon={faBowlRice} /> Servings:</span> <span className="text-dark-emphasis">{`${servings}`}</span></p>
                <p className="mb-0">This Hokkien classic is a flavour journey, balancing savoury and umami notes in every bite. From perfectly cooked proteins to crisp veggies, it tells the storey of Hokkien culinary heritage, enriched by a time-honoured sauce. Savour a taste of tradition and innovation in this delectable dish.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="album mt-5 bg-body-tertiary">
        <div className="container-fluid">
          <div className="row d-flex align-items-stretch">
            {viewAlsoRecipes.map((viewRecipe, index) => (
              <div key={index} className="col-12 col-sm-6 col-lg-3 p-0">
                <Link to={`/recipe/${viewRecipe.rid}`}>
                  <div className="card text-bg-dark h-100 rounded-0 border-0 hover-effect position-relative">
                    <img src={`${viewRecipe.picture}`} className="card-img rounded-0" style={{ height: '13rem', objectFit: 'cover' }} alt="..." />
                    <div className="card-img-overlay text-uppercase">
                      <h5 className="bg-primary card-title position-absolute bottom-0 left-0 py-1 px-2 fs-6 fw-normal" style={{color: 'inherit', transition: 'none'}}>{viewRecipe.title}</h5>
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
}

export default Display
