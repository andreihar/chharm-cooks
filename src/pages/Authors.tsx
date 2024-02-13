import { useState, useEffect } from 'react'
import { Recipe } from '../Recipe';
import { Author } from '../Author';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import Footer from './Footer';

function Authors() {
	const [authors, setAuthors] = useState<Author[]>([]);
	const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {    
    let loadedAuthors = JSON.parse(localStorage.getItem('authors') || '[]');
		let loadedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    setAuthors(loadedAuthors);
		setRecipes(loadedRecipes);
  }, []);

  return (
    <>
      <Navbar/>
			<div className="album py-5">
        <div className="container">
          <h2>Our Top Contributors</h2>
					<div className="row">
					{authors.sort((a, b) => {
						const aRecipes = recipes.filter(recipe => recipe.author === a.name).length;
						const bRecipes = recipes.filter(recipe => recipe.author === b.name).length;
						if (aRecipes === bRecipes)
							return a.name.localeCompare(b.name);
						else
							return bRecipes - aRecipes;
					}).map((author, index) => {
						const authorRecipes = recipes.filter(recipe => recipe.author === author.name);
						const cuisineFrequency = authorRecipes.reduce((acc, recipe) => {
							acc[recipe.cuisine] = (acc[recipe.cuisine] || 0) + 1;
							return acc;
						}, {} as { [key: string]: number });

						let specialtyCuisine = Object.keys(cuisineFrequency).reduce((a, b) => cuisineFrequency[a] > cuisineFrequency[b] ? a : b, '');
						const recipeImage = authorRecipes.filter(recipe => recipe.picture).sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())[0]?.picture;
						
						return (
							<div key={index} className="section-ting col-12 col-sm-6 col-md-4 col-lg-3 my-3">
                <a href={author.social}>
								<div className="card profile-card-3 text-center">
									<div className="background-block">
										<img src={recipeImage} alt="profile-sample1" className="background"/>
									</div>
									<div>
										<img src={author.picture} alt="profile-image" className="profile rounded-circle position-absolute shadow" width={'100px'} height={'100px'}/>
									</div>
									<div className="card-content p-3 position-relative bg-body-tertiary">
										<h3 className="card-title fs-4 mb-2">{author.name}</h3>
										<div><small>{authorRecipes.length} {authorRecipes.length === 1 ? 'Recipe' : 'Recipes'}</small></div>
										<div><small><span className="text-primary fw-bold">{specialtyCuisine}</span> cuisine</small></div>
									</div>
								</div>
                </a>
							</div>
						);
					})}
          </div>
				</div>
			</div>
      <Footer/>
    </>
  )
}

export default Authors
