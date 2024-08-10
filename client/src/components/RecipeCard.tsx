import { Link } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import i18n from '../libs/i18n';
import noRecipe from '../assets/noRecipe.png';
import DbService from '../services/DbService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faNoStar } from '@fortawesome/free-regular-svg-icons';
import { useState, useEffect } from 'react';

const RecipeCard = ({ recipe, classes }: { recipe: Recipe; classes: string; }) => {
  const { getCuisineName, getRecipeTitle } = useLocalisationHelper();
  const [averageRating, setAverageRating] = useState({ averageRating: 0, ratingCount: 0 });

  useEffect(() => {
    const fetchAverageRating = () => {
      DbService.getAverageRatingForRecipe(recipe.rid)
        .then((rating) => {
          setAverageRating(rating);
        })
        .catch((error) => {
          console.error('Error fetching average rating:', error);
        });
    };
    fetchAverageRating();
  }, [recipe]);

  return (
    <div className={`${classes} my-3`}>
      <Link to={`/recipe/${recipe.rid}`}>
        <div className="card h-100">
          <div className="img-container" style={{ overflow: 'hidden' }}>
            <img className="card-img-top img-fluid hover-enlarge" style={{ height: '200px', objectFit: 'cover', transition: 'transform .3s ease-in-out' }} src={recipe.picture ? recipe.picture : noRecipe} alt="Card image" loading="lazy" />
          </div>
          <div className="card-body">
            <div className="d-flex card-subtitle justify-content-between align-items-center text-body-secondary fs-6 text-uppercase fw-light">
              <p className="mb-2">{getCuisineName(recipe.cuisine)}</p>
              <div>
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon key={index} icon={index < Math.floor(averageRating.averageRating) ? faStar : faNoStar} className="text-warning mr-1" />
                ))}
                {` (${averageRating.ratingCount})`}
              </div>
            </div>
            <h5 className="card-title text-uppercase">{getRecipeTitle(recipe)}</h5>
            <h5 className="text-body-secondary">{i18n.language === 'zh' ? `${recipe.title}` : `${recipe.chin_title}`}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
