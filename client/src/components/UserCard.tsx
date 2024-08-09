import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import DbService from '../services/DbService';
import noRecipe from '../assets/noRecipe.png';
import { Trans, useTranslation } from 'react-i18next';

const UserCard = ({ user }: { user: User; }) => {
  const { t } = useTranslation();
  const { getCuisineName, getAuthorName } = useLocalisationHelper();
  const [authorRecipes, setAuthorRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = () => {
      DbService.getRecipesByUsername(user.username)
        .then((recipes) => {
          setAuthorRecipes(recipes);
        })
        .catch((error) => {
          console.error('Error fetching recipes:', error);
        });
    };
    fetchRecipes();
  }, [user.username]);

  function getSpecialtyCuisine(authorRecipes: Recipe[]) {
    const cuisineFrequency = authorRecipes.reduce((acc, recipe) => {
      acc[recipe.cuisine] = (acc[recipe.cuisine] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number; });
    return Object.keys(cuisineFrequency).reduce((a, b) => cuisineFrequency[a] > cuisineFrequency[b] ? a : b, '');
  }

  const recipeImage = authorRecipes.filter(recipe => recipe.picture && recipe.picture.startsWith('http')).sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())[0]?.picture || noRecipe;

  return (
    <div className="section-ting col-12 col-sm-6 col-md-4 col-lg-3 my-3">
      <Link to={`/user/${user.username}`}>
        <div className="card profile-card text-center">
          <div className="background-block">
            <img src={recipeImage} alt="profile-sample1" className="background" />
          </div>
          <div>
            <img src={user.picture} alt="profile-image" className="profile rounded-circle position-absolute shadow" width={'100px'} height={'100px'} />
          </div>
          <div className="card-content p-3 position-relative bg-body-tertiary">
            <h3 className="card-title fs-4 mb-2">{getAuthorName(user)}</h3>
            <div><small>{authorRecipes.length} {authorRecipes.length === 1 ? t('form.recipe') : t('home.recipes')}</small></div>
            <div>
              <small>
                <Trans
                  i18nKey="authors.cuisine"
                  components={[<span className="text-primary fw-bold" />]}
                  values={{ cuisine: getCuisineName(getSpecialtyCuisine(authorRecipes)) }} />
              </small>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
