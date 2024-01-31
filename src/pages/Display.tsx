import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { Recipe } from '../Recipe';

function Display() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe>();

  useEffect(() => {
    const loadedRecipesJSON = localStorage.getItem('recipes');
    const recipes = loadedRecipesJSON ? JSON.parse(loadedRecipesJSON) : [];
    const foundRecipe = recipes.find((r: Recipe) => r.id === Number(id));
    if (foundRecipe)
      setRecipe(foundRecipe);
    else
      alert ("Error: ID not found in recipes.");
  }, [id]);

  if (recipe) {
    const { picture, name, cuisine, ingredients, steps } = recipe;
    const dishName = name.split(' | ')[0];
    return (
    <>
      <Navbar/>
      <div className="p-5 text-center bg-image mt-5" style={{ backgroundImage: `url(${picture})`}}>
        <div className="mask">
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
              <h2 className="display-5 link-body-emphasis mb-1">Let's make <span className="prim">{`${dishName}`}</span>!</h2>
              <hr />
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
                <h4 className="fst-italic">About <span className="prim">{`${dishName}`}</span></h4>
                <p className="mb-0">This Hokkien classic is a flavour journey, balancing savoury and umami notes in every bite. From perfectly cooked proteins to crisp veggies, it tells the storey of Hokkien culinary heritage, enriched by a time-honoured sauce. Savour a taste of tradition and innovation in this delectable dish.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
  }
}

export default Display
