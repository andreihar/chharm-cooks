import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import DbService from '../services/DbService';
import noRecipe from '../assets/noRecipe.png';
import { Trans, useTranslation } from 'react-i18next';

const UserCard = ({ user, classes }: { user: User; classes: string; }) => {
  const { t } = useTranslation();
  const { getCuisineName, getAuthorName } = useLocalisationHelper();
  const [authorRecipes, setAuthorRecipes] = useState<Recipe[]>([]);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);

  useEffect(() => {
    const fetchRecipes = () => {
      Promise.all([DbService.getFollowers(user.username), DbService.getFollowing(user.username), DbService.getRecipesByUsername(user.username),])
        .then(([followers, following, recipes]) => {
          setFollowers(followers.length);
          setFollowing(following.length);
          setAuthorRecipes(recipes);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
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
    <div className={`section-ting ${classes} my-3`}>
      <Link to={`/user/${user.username}`}>
        <div className="card profile-card text-center">
          <div className="background-block">
            <img src={recipeImage} alt="profile-sample1" className="background" />
          </div>
          <div>
            <img src={user.picture} alt="profile-image" className="profile rounded-circle position-absolute shadow" width={100} height={100} />
          </div>
          <div className="card-content p-3 position-relative bg-body-tertiary">
            <h3 className="card-title fs-4 mb-2">{getAuthorName(user)}</h3>
            <div className="d-flex justify-content-center align-items-center text-center py-1" style={{ gap: '2rem' }}>
              {[{ count: authorRecipes.length, label: t('home.recipes') }, { count: followers, label: t('profile.followers') }, { count: following, label: t('profile.following') }].map((item) => (
                <div key={item.label} style={{ width: '100px' }}>
                  <h5 className="mb-1">{item.count}</h5>
                  <small className="mb-0">{item.label}</small>
                </div>
              ))}
            </div>
            <div className="py-2">
              <Trans
                i18nKey="authors.cuisine"
                components={[<span className="text-primary fw-bold" />]}
                values={{ cuisine: getCuisineName(getSpecialtyCuisine(authorRecipes)) }} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
