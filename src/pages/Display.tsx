import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Recipe } from '../Recipe';
import Navbar from './Navbar';
import Footer from './Footer';

function Display() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe>();
  const [viewAlsoRecipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadedRecipesJSON = localStorage.getItem('recipes');
    let recipes = loadedRecipesJSON ? JSON.parse(loadedRecipesJSON) : [];
    recipes = recipes.map((recipe: any) => {
      recipe.createdOn = new Date(recipe.createdOn);
      recipe.modifiedOn = new Date(recipe.modifiedOn);
      return recipe;
    });
    const foundRecipe = recipes.find((r: Recipe) => r.id === Number(id));
    if (foundRecipe)
      setRecipe(foundRecipe);
    else
      alert ("Error: ID not found in recipes.");
    let selectedRecipes: Recipe[] = [...recipes];
    selectedRecipes = selectedRecipes.filter(recipe => recipe.id !== Number(id));
    selectedRecipes.sort(() => Math.random() - 0.5);
    setRecipes(selectedRecipes.slice(0,4));
  }, [id]);

  if (recipe) {
    const { picture, name, author, createdOn, modifiedOn, cuisine, ingredients, steps } = recipe;
    const dishName = name.split(' | ')[0];
    return (
    <>
      <Navbar/>
      <div className="p-5 text-center bg-image mt-5 text-uppercase position-relative" style={{ backgroundImage: `url(${picture})`}}>
        <div className="mask position-absolute top-0 start-0 bottom-0 end-0">
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-white">
              <h1 className="mb-3">{`${name}`}</h1>
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
              <h2 className="display-5 link-body-emphasis mb-1">Let's make <span className="text-primary">{`${dishName}`}</span>!</h2>
              <p className="text-dark-emphasis">by: <span className="text-uppercase fs-5 ms-2">{`${author}`}</span></p>
              <hr />
              <p className="text-dark-emphasis">
                Posted: <span className="">{`${createdOn.toLocaleDateString()}`}</span>&nbsp;
                Updated: <span className="">{`${modifiedOn.toLocaleDateString()}`}</span>
              </p>
              <h2>Ingredients</h2>
              <p>{`Embark on a culinary journey with this simple yet sensational ${dishName}. Gather fresh, quality ingredients that will harmonise in a symphony of flavours. Here's the lineup:`}</p>
              <ul>
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h2>Directions</h2>
              <p>{`Now that your kitchen is adorned with the finest ingredients, let's weave them together into a culinary masterpiece. Follow these straightforward steps to unlock the full potential of each component, creating ${recipe!.name.split(' | ')[0]} that tantalises the taste buds:`}</p>
              <ol>
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </article>
          </div>
          <div className="col-md-4">
            <div className="position-sticky" style={{ top: "90px" }}>
              <div className="p-4 mb-3 bg-body-tertiary rounded">
                <h4 className="fst-italic">About <span className="text-primary">{`${dishName}`}</span></h4>
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
                <Link to={`/recipe/${viewRecipe.id}`}>
                  <div className="card text-bg-dark h-100 rounded-0 border-0 hover-effect position-relative">
                    <img src={`${viewRecipe.picture}`} className="card-img rounded-0" style={{ height: '13rem', objectFit: 'cover' }} alt="..." />
                    <div className="card-img-overlay text-uppercase">
                      <h5 className="bg-primary card-title position-absolute bottom-0 left-0 py-1 px-2 fs-6 fw-normal">{viewRecipe.name.split(' | ')[0]}</h5>
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
