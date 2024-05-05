import { useState, useEffect } from 'react';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DbService from '../services/DbService';
import noRecipe from '../assets/noRecipe.png';

function getSpecialtyCuisine(authorRecipes: Recipe[]) {
  const cuisineFrequency = authorRecipes.reduce((acc, recipe) => {
    acc[recipe.cuisine] = (acc[recipe.cuisine] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number; });
  return Object.keys(cuisineFrequency).reduce((a, b) => cuisineFrequency[a] > cuisineFrequency[b] ? a : b, '');
}

function Authors() {
  const { t, i18n } = useTranslation();
  const [authors, setAuthors] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    DbService.getUsers().then(setAuthors);
    DbService.getRecipes().then(setRecipes);
  }, []);

  return (
    <>
      <Navbar />
      <div className="album py-5">
        <div className="container">
          <h2>{t('authors.top')}</h2>
          <div className="row">
            {authors
              .filter(author => recipes.some(recipe => recipe.username === author.username))
              .sort((a, b) => {
                const aFullName = i18n.language === 'zh' ? `${a.last_name} ${a.first_name}` : `${a.first_name} ${a.last_name}`;
                const bFullName = i18n.language === 'zh' ? `${b.last_name} ${b.first_name}` : `${b.first_name} ${b.last_name}`;
                const aRecipes = recipes.filter(recipe => recipe.username === a.username).length;
                const bRecipes = recipes.filter(recipe => recipe.username === b.username).length;
                if (aRecipes === bRecipes)
                  return aFullName.localeCompare(bFullName);
                else
                  return bRecipes - aRecipes;
              }).map((author, index) => {
                const authorRecipes = recipes.filter(recipe => recipe.username === author.username);
                const recipeImage = authorRecipes.filter(recipe => recipe.picture && recipe.picture.startsWith('http')).sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())[0]?.picture || noRecipe;
                return (
                  <div key={index} className="section-ting col-12 col-sm-6 col-md-4 col-lg-3 my-3">
                    <Link to={`/user/${author!.username}`}>
                      <div className="card profile-card text-center">
                        <div className="background-block">
                          <img src={recipeImage} alt="profile-sample1" className="background" />
                        </div>
                        <div>
                          <img src={author.picture} alt="profile-image" className="profile rounded-circle position-absolute shadow" width={'100px'} height={'100px'} />
                        </div>
                        <div className="card-content p-3 position-relative bg-body-tertiary">
                          <h3 className="card-title fs-4 mb-2">{i18n.language === 'zh' ? `${author.last_name} ${author.first_name}` : `${author.first_name} ${author.last_name}`}</h3>
                          <div><small>{authorRecipes.length} {authorRecipes.length === 1 ? t('authors.recipe') : t('home.recipes')}</small></div>
                          <div>
                            <small>
                              <Trans i18nKey="authors.cuisine" values={{ cuisine: getSpecialtyCuisine(authorRecipes) }} />
                            </small>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Authors;
