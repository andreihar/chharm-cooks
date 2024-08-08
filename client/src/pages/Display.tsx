import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faClock, faBowlRice, faStar, faComments, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faNoStar } from '@fortawesome/free-regular-svg-icons';
import { useAuth0 } from '@auth0/auth0-react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DbService from '../services/DbService';

function Display() {
  const { id } = useParams<{ id: string; }>();
  const [recipe, setRecipe] = useState<Recipe>();
  const [author, setAuthor] = useState<User>();
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<{ value: number; count: number; }>({ value: 0, count: 0 });
  const [viewAlsoRecipes, setViewRecipes] = useState<Recipe[]>([]);
  const [commentsData, setCommentsData] = useState<{ comments: Array<{ user: string; comment: string; timestamp: string; }>; totalCount: number; }>({ comments: [], totalCount: 0 });
  const [activeScale, setActiveScale] = useState(1);
  const { user, isAuthenticated } = useAuth0();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getCuisineName, getAuthorName } = useLocalisationHelper();

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const recipes = await DbService.getRecipes();
      setViewRecipes(recipes.filter(recipe => recipe.rid !== Number(id)).sort(() => Math.random() - 0.5).slice(0, 4));
      const foundRecipe = await DbService.getRecipeById(Number(id));
      const foundAuthor = foundRecipe && await DbService.getUserByName(foundRecipe.username);
      if (foundRecipe && foundAuthor) {
        setRecipe(foundRecipe);
        setAuthor(foundAuthor);
        if (isAuthenticated) {
          const rating = await DbService.getUserRatingForRecipe(Number(id));
          setUserRating(rating !== null ? rating : 0);
        }
        const averageRating = await DbService.getAverageRatingForRecipe(Number(id));
        setAverageRating({ value: averageRating.averageRating, count: averageRating.ratingCount });
        setCommentsData(await DbService.getCommentsForRecipe(Number(id)));
      } else {
        alert(t('display.error'));
        navigate('/');
        return;
      }
    };
    loadData();
  }, [id, isAuthenticated]);

  const deleteRecipe = () => {
    if (window.confirm(t('display.delete', { dish: recipe!.title }))) {
      DbService.deleteRecipe(Number(id));
      navigate('/');
    }
  };

  const scaleQuantity = (quantity: string) => {
    const match = quantity.match(/^(\d+\/\d+|\d+\s\d+\/\d+|\d+)(.*)$/);
    if (!match) return quantity;
    const [_, numericPart, unit] = match;
    let scaledQuantity;
    if (numericPart.includes('/')) {
      const [whole, fraction] = numericPart.split(' ');
      const [numerator, denominator] = fraction ? fraction.split('/') : numericPart.split('/');
      scaledQuantity = ((whole ? parseInt(whole) : 0) + parseInt(numerator) / parseInt(denominator)) * activeScale;
    } else {
      scaledQuantity = parseFloat(numericPart) * activeScale;
    }
    return `${Number.isInteger(scaledQuantity) ? scaledQuantity : toFraction(scaledQuantity)} ${unit.trim()}`;
  };

  const toFraction = (decimal: number) => {
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = decimal;
    while (Math.abs(decimal - h1 / k1) > decimal * 1.0E-6) {
      const a = Math.floor(b);
      [h1, h2] = [a * h1 + h2, h1];
      [k1, k2] = [a * k1 + k2, k1];
      b = 1 / (b - a);
    }
    return `${h1}/${k1}`;
  };

  if (recipe) {
    const { picture, title, chin_title, created_on, time_last_modified, cuisine, ingredients, recipe_instructions, prep_time, cook_time, servings } = recipe;
    return (
      <>
        <Navbar />
        <div className="p-5 text-center bg-image text-uppercase position-relative" style={{ backgroundImage: `url(${picture})` }}>
          <div className="mask position-absolute top-0 start-0 bottom-0 end-0">
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="text-white">
                <h1 className="mb-3">
                  {i18n.language === 'zh' ? `${chin_title} | ${title}` : `${title} | ${chin_title}`}
                </h1>
                <h4 className="mb-3">
                  <Trans i18nKey="display.authentic" values={{ cuisine: getCuisineName(cuisine) }} />
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="angled-div" />

        <main className="container">
          <div className="row g-5">
            <div className="col-md-8 recipe-content">
              <article className="blog-post">
                <h2 className="display-5 link-body-emphasis mb-1">
                  <Trans
                    i18nKey="display.letsMake"
                    components={[<span className="text-primary text-capitalize" />]}
                    values={{ dish: i18n.language === 'zh' ? chin_title : title }}
                  />
                </h2>
                <div className="text-dark-emphasis align-items-center d-flex justify-content-between">
                  <div>
                    <Link to={`/user/${author!.username}`} className="text-dark-emphasis align-items-center d-flex">
                      {t('display.by')}
                      <img src={author!.picture} alt="User Picture" width={32} height={32} className="rounded-circle ms-2" />
                      <span className="text-uppercase fs-5 ms-2">{getAuthorName(author!)}</span>
                    </Link>
                  </div>
                  {isAuthenticated && user && (user.sub === author!.username) &&
                    <div>
                      <button onClick={deleteRecipe} className="btn btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button>
                      <button onClick={() => navigate('/form/' + id)} className="btn btn-outline-secondary ms-2"><FontAwesomeIcon icon={faPenToSquare} /></button>
                    </div>
                  }
                </div>
                <hr />
                <div className="d-flex justify-content-between text-dark-emphasis mb-4">
                  <div className="d-flex align-items-center me-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-1" />
                    <span>{t('display.posted')} {`${created_on.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}`}</span>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-1" />
                    <span>{t('display.updated')} {`${time_last_modified.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}`}</span>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <FontAwesomeIcon icon={faComments} className="text-primary me-1" />
                    <span>{commentsData.totalCount}</span>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <FontAwesomeIcon icon={faStar} className=" text-warning me-1" />
                    <span>{averageRating.value} / {averageRating.count} reviews</span>
                  </div>
                  {isAuthenticated && user &&
                    <div className="mb-3">
                      {[...Array(5)].map((_, i) => {
                        const newRating = i + 1;
                        return (
                          <FontAwesomeIcon
                            key={i}
                            icon={newRating <= (hoverRating ?? userRating) ? faStar : faNoStar}
                            className="text-warning mr-1"
                            onClick={async () => {
                              await DbService.rateRecipe(Number(id), newRating);
                              setUserRating(newRating);
                            }}
                            onMouseEnter={() => setHoverRating(newRating)}
                            onMouseLeave={() => setHoverRating(null)}
                          />
                        );
                      })}
                    </div>
                  }
                </div>
                <h2>{t('form.ingredients')}</h2>
                <p>
                  <Trans i18nKey="display.ingredientDesc" values={{ dish: i18n.language === 'zh' ? chin_title : title }} />
                </p>
                <ul>
                  {ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.name} {ingredient.quantity}
                    </li>
                  ))}
                </ul>
                <h2>{t('form.directions')}</h2>
                <p>
                  <Trans i18nKey="display.stepsDesc" values={{ dish: i18n.language === 'zh' ? chin_title : title }} />
                </p>
                <ol>
                  {recipe_instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
                <div className="card border-primary border-5 bg-primary col-lg-12 col-xl-9 mx-auto">
                  <div className="card-header text-center text-white bg-primary">
                    <img src={picture} alt={title} className="rounded-circle" style={{ width: '150px', height: '150px' }} />
                    <h2 className="text-capitalize mt-2">{i18n.language === 'zh' ? chin_title : title}</h2>
                    <hr />
                    <div>
                      {[...Array(5)].map((_, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={index < averageRating.value ? faStar : faNoStar}
                          className="text-white mr-1"
                        />
                      ))}
                      <p className="small">{`${averageRating.value} from ${averageRating.count} reviews`}</p>
                    </div>
                    <div className="d-flex justify-content-around">
                      <div className="col-4">
                        <strong><FontAwesomeIcon icon={faClock} className="text-white" /> {t('display.prep')}</strong>
                        <p>{prep_time} {t('display.mins')}</p>
                      </div>
                      <div className="col-4">
                        <strong><FontAwesomeIcon icon={faClock} className="text-white" /> {t('display.cook')}</strong>
                        <p>{cook_time} {t('display.mins')}</p>
                      </div>
                      <div className="col-4">
                        <strong><FontAwesomeIcon icon={faBowlRice} className="text-white" /> {t('display.serves')}</strong>
                        <p>{t('display.servings', { count: servings, quantity: scaleQuantity(String(servings)) })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-body fs-5 bg-white">
                    <div className="d-flex mb-2">
                      <h2>{t('form.ingredients')}</h2>
                      <div className="d-flex ms-auto gap-2">
                        <button className={`btn btn-outline-secondary btn-sm ${activeScale === 0.5 ? 'active' : ''}`} onClick={() => setActiveScale(0.5)}>1/2x</button>
                        <button className={`btn btn-outline-secondary btn-sm ${activeScale === 1 ? 'active' : ''}`} onClick={() => setActiveScale(1)}>1x</button>
                        <button className={`btn btn-outline-secondary btn-sm ${activeScale === 2 ? 'active' : ''}`} onClick={() => setActiveScale(2)}>2x</button>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>
                        <Trans i18nKey="display.ingredientDesc" values={{ dish: i18n.language === 'zh' ? chin_title : title }} />
                      </p>
                    </div>
                    <ul className="list-unstyled">
                      {ingredients.map((ingredient, index) => (
                        <li key={index} className="d-flex align-items-center">
                          <input type="checkbox" className="me-2" id={`ingredient-${index}`} style={{ accentColor: 'gray' }} />
                          <label htmlFor={`ingredient-${index}`} className="ingredient-label" style={{ cursor: 'pointer' }}>
                            {scaleQuantity(ingredient.quantity)} <span className="fw-bold">{ingredient.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    <hr />
                    <h2>{t('form.directions')}</h2>
                    <p>
                      <Trans i18nKey="display.stepsDesc" values={{ dish: i18n.language === 'zh' ? chin_title : title }} />
                    </p>
                    <ol>
                      {recipe_instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </article>
            </div>
            <div className="col-md-4">
              <div className="position-sticky" style={{ top: "90px" }}>
                <div className="p-4 mb-3 bg-body-tertiary rounded">
                  <h4 className="fst-italic">{t('display.about')}<span className="text-primary">{i18n.language === 'zh' ? `${chin_title}` : `${title}`}</span></h4>
                  <p className="mb-2"><FontAwesomeIcon icon={faClock} className="text-primary" /> <span className="text-uppercase">{t('display.prep')}</span> <span className="text-dark-emphasis">{`${prep_time} `}{t('display.mins')}</span> <span className="ms-1 text-uppercase">{t('display.cook')}</span> <span className="text-dark-emphasis">{`${cook_time} `}{t('display.mins')}</span></p>
                  <p><span className="text-uppercase"><FontAwesomeIcon icon={faBowlRice} className="text-primary" /> {t('display.serves')}</span> <span className="text-dark-emphasis">{`${servings} ${servings > 1 ? t('display.people') : t('display.person')}`}</span></p>
                  <p className="mb-0">{t('display.aboutText')}</p>
                </div>
              </div>
            </div>
          </div>
          <section>
            <div className="container my-5 py-5">
              <div className="row d-flex justify-content-center">
                <div className="col-md-12 col-lg-10 col-xl-8">
                  <div>
                    <div className="p-4">
                      <h4 className="text-center mb-4 pb-2">Nested comments section</h4>
                      <div className="d-flex flex-start mb-4">
                        <img className="rounded-circle shadow-sm me-3" src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp" alt="avatar" width="65" height="65" />
                        <div className="flex-grow-1 flex-shrink-1">
                          <p className="mb-1 text-uppercase fw-bold">
                            Maria Smantha <span className="ms-2 small">{[...Array(5)].map((_, index) => (<FontAwesomeIcon key={index} icon={index < averageRating.value ? faStar : faNoStar} className="text-warning mr-1" />))}</span>
                          </p>
                          <p className="small">October 16, 2020</p>
                          <p className="mb-0">
                            It is a long established fact that a reader will be distracted by the readable content of a page.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
                        <h5 className="bg-primary card-title position-absolute bottom-0 left-0 py-1 px-2 fs-6 fw-normal" style={{ color: 'inherit', transition: 'none' }}>{i18n.language === 'zh' ? `${viewRecipe.chin_title}` : `${viewRecipe.title}`}</h5>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default Display;
