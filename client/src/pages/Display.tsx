import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faClock, faBowlRice, faStar, faComments, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faNoStar } from '@fortawesome/free-regular-svg-icons';
import { useAuth0 } from '@auth0/auth0-react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import parse, { DOMNode, domToReact, Element } from 'html-react-parser';
import { Helmet } from 'react-helmet-async';
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
  const [commentsData, setCommentsData] = useState<{ comments: Array<Comment>; totalCount: number; }>({ comments: [], totalCount: 0 });
  const [userComment, setUserComment] = useState<Comment>(new Comment('', '', '', '', '', '', 0));
  const [newUserComment, setNewUserComment] = useState<string>('');
  const [activeScale, setActiveScale] = useState(1);
  const { user, isAuthenticated } = useAuth0();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getCuisineName, getAuthorName, getRecipeTitle } = useLocalisationHelper();

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const loadData = () => {
      setUserComment(new Comment('', '', '', '', '', '', 0));
      setNewUserComment('');
      Promise.all([DbService.getRecipes(), DbService.getRecipeById(Number(id)), DbService.getAverageRatingForRecipe(Number(id)), DbService.getCommentsForRecipe(Number(id))])
        .then(([recipes, foundRecipe, averageRating, comments]) => {
          setViewRecipes(recipes.filter(recipe => recipe.rid !== Number(id)).sort(() => Math.random() - 0.5).slice(0, 4));
          if (!foundRecipe) {
            console.log('Recipe not found');
            alert(t('display.error'));
            navigate('/');
          }
          // Load Authenticated user data
          if (isAuthenticated && user) {
            const userCommentIndex = comments.comments.findIndex(comment => comment.username === user.sub);
            if (userCommentIndex !== -1) {
              const userComment = comments.comments.splice(userCommentIndex, 1)[0];
              setUserComment(userComment);
              setNewUserComment(userComment.comment);
            }
            DbService.getUserRatingForRecipe(Number(id)).then((rating) => {
              setUserRating(rating !== null ? rating : 0);
            });
          }
          setCommentsData(comments);
          return DbService.getUserByName(foundRecipe.username)
            .then((foundAuthor) => {
              if (!foundAuthor) {
                alert(t('display.error'));
                navigate('/');
              }
              setRecipe(foundRecipe);
              setAuthor(foundAuthor);
              setAverageRating({ value: averageRating.averageRating, count: averageRating.ratingCount });
            });
        })
        .catch(() => {
          alert(t('display.error'));
          navigate('/');
        });
    };
    loadData();
  }, [id, isAuthenticated, t, navigate, user]);

  const deleteRecipe = () => {
    if (window.confirm(t('display.delete', { dish: recipe!.title }))) {
      DbService.deleteRecipe(Number(id));
      navigate('/');
    }
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    DbService.addComment(Number(id), newUserComment)
      .then(() => {
        alert(t('display.comment.success'));
        setUserComment({ ...userComment, comment: newUserComment, time_last_modified: new Date().toISOString(), rating: userRating });
      })
      .catch(error => {
        console.error('Error posting comment:', error);
      });
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

  const BlogContent: React.FC<{ content: string; }> = ({ content }) => {
    const options = {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element) {
          switch (domNode.name) {
            case 'p': return <p className="fs-5 my-4">{domToReact(domNode.children as DOMNode[], options)}</p>;
            case 'img': return <img className="img-fluid w-75 mx-auto d-block" {...domNode.attribs} />;
          }
        }
      },
    };
    return <div className="my-5">{parse(content, options)}</div>;
  };

  if (recipe) {
    const { picture, title, chin_title, created_on, time_last_modified, cuisine, ingredients, recipe_instructions, prep_time, cook_time, servings, content } = recipe;
    return (
      <>
        <Helmet>
          <title>{`${i18n.language === 'zh' ? chin_title : title} | ChhármCooks`}</title>
          <meta name="description" content={content ? content.slice(0, 150) : `${title} classic is a flavour journey, balancing savoury and umami notes in every bite. From perfectly cooked proteins to crisp veggies, it tells the story of Hokkien culinary heritage.`} />
          <meta name="keywords" content={`recipe, ${title}, ${chin_title}, ${getCuisineName(cuisine)}, ChhármCooks`} />
          <meta name="author" content={getAuthorName(author!)} />
          <meta property="og:title" content={`${title} | ${chin_title} - ChhármCooks`} />
          <meta property="og:description" content={content.slice(0, 150)} />
          <meta property="og:image" content={picture} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={window.location.href} />
        </Helmet>
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
                    values={{ dish: getRecipeTitle(recipe) }}
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
                    <span>{t('display.posted')} {`${created_on.toLocaleString(i18n.language, { dateStyle: 'short', timeStyle: 'short' })}`}</span>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-1" />
                    <span>{t('display.updated')} {`${time_last_modified.toLocaleString(i18n.language, { dateStyle: 'short', timeStyle: 'short' })}`}</span>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <FontAwesomeIcon icon={faComments} className="text-primary me-1" />
                    <span>{commentsData.totalCount}</span>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <FontAwesomeIcon icon={faStar} className=" text-warning me-1" />
                    <span>{averageRating.value} / {t('display.reviews', { count: averageRating.count })}</span>
                  </div>
                </div>
                <BlogContent content={content} />
                <div className="card border-primary border-5 bg-primary col-lg-12 col-xl-9 mx-auto">
                  <div className="card-header text-center text-white bg-primary">
                    <img src={picture} alt={title} className="rounded-circle" style={{ width: '150px', height: '150px' }} />
                    <h2 className="text-capitalize mt-2">{getRecipeTitle(recipe)}</h2>
                    <hr />
                    <div>
                      {[...Array(5)].map((_, index) => (
                        <FontAwesomeIcon key={index} icon={index < Math.floor(averageRating.value) ? faStar : faNoStar} className="text-white mr-1" />
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
                  <div className="card-body bg-white">
                    <div className="d-flex mb-2">
                      <h2>{t('form.ingredients')}</h2>
                      <div className="d-flex ms-auto gap-2">
                        {[0.5, 1, 2].map(scale => (<button key={scale} className={`btn btn-outline-secondary btn-sm ${activeScale === scale ? 'active' : ''}`} onClick={() => setActiveScale(scale)}>{scale}x</button>))}
                      </div>
                    </div>
                    <ul className="list-unstyled">
                      {ingredients.map((ingredient, index) => (
                        <li key={index} className="d-flex align-items-center my-1">
                          <input type="checkbox" className="me-2" id={`ingredient-${index}`} style={{ accentColor: 'gray' }} />
                          <label htmlFor={`ingredient-${index}`} className="ingredient-label" style={{ cursor: 'pointer' }}>
                            {scaleQuantity(ingredient.quantity)} <span className="fw-bold">{ingredient.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    <hr />
                    <h2>{t('form.directions')}</h2>
                    <ol>
                      {recipe_instructions.map((step, index) => (<li key={index}>{step}</li>))}
                    </ol>
                  </div>
                </div>
                <section>
                  <div className="container mt-3">
                    {isAuthenticated && user &&
                      <div className="row d-flex py-4 justify-content-center bg-body-tertiary rounded">
                        <div className="">
                          <div className="">
                            <div className="d-flex flex-column align-items-center">
                              <h4 className="card-title mb-2">{t('display.comment.share')}</h4>
                              <div className="mb-3 d-flex justify-content-center">
                                {[...Array(5)].map((_, i) => {
                                  const newRating = i + 1;
                                  return (
                                    <FontAwesomeIcon key={i} icon={newRating <= (hoverRating ?? userRating) ? faStar : faNoStar} className="text-warning mr-1"
                                      onClick={() => {
                                        DbService.rateRecipe(Number(id), newRating)
                                          .then(() => {
                                            setUserRating(newRating);
                                            setUserComment({ ...userComment, rating: newRating });
                                          })
                                          .catch(() => {
                                            alert(t('display.error'));
                                          });
                                      }}
                                      onMouseEnter={() => setHoverRating(newRating)} onMouseLeave={() => setHoverRating(null)}
                                    />
                                  );
                                })}
                              </div>
                              <form className="w-100 d-flex flex-column align-items-center" onSubmit={handleCommentSubmit}>
                                <div className="form-group mb-3 w-75">
                                  <textarea className="form-control" id="comment" rows={5} value={newUserComment} onChange={(e) => setNewUserComment(e.target.value)} required disabled={userRating === 0} placeholder={userRating === 0 ? t('display.comment.rateFirst') : t('display.comment.placeholder')} />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={userRating === 0}>{t('display.comment.post')}</button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    <div className="row d-flex justify-content-center">
                      <div className="p-4 album">
                        <hr />
                        <h2 className="mb-4 pb-2">{t('display.comments', { count: commentsData.totalCount })}</h2>
                        {userComment.username &&
                          <div className="d-flex flex-start mb-5">
                            <img className="rounded-circle shadow-sm me-3" src={userComment.picture} alt={`Avatar of ${userComment.first_name}`} width={75} height={75} />
                            <div className="flex-grow-1 flex-shrink-1">
                              <h5 className="mb-1 text-uppercase fw-bold">
                                {t('display.comment.your')}
                                <span className="ms-4 small">
                                  {[...Array(5)].map((_, starIndex) => (
                                    <FontAwesomeIcon key={starIndex} icon={starIndex < userComment.rating ? faStar : faNoStar} className="text-warning mr-1" />
                                  ))}
                                </span>
                              </h5>
                              <p className="small">{new Date(userComment.time_last_modified).toLocaleString(i18n.language, { dateStyle: 'long', timeStyle: 'short' })}</p>
                              <p className="mb-0 fs-5">{userComment.comment}</p>
                            </div>
                          </div>
                        }
                        {commentsData.comments.map((comment, index) => (
                          <div key={index} className="d-flex flex-start mb-4">
                            <img className="rounded-circle shadow-sm me-3" src={comment.picture} alt={`Avatar of ${comment.first_name}`} width={65} height={65} />
                            <div className="flex-grow-1 flex-shrink-1">
                              <p className="mb-1 text-uppercase fw-bold">
                                <Link to={`/user/${comment.username}`}>{getAuthorName({ first_name: comment.first_name, last_name: comment.last_name })}</Link>
                                <span className="ms-4 small">
                                  {[...Array(5)].map((_, starIndex) => (
                                    <FontAwesomeIcon key={starIndex} icon={starIndex < comment.rating ? faStar : faNoStar} className="text-warning mr-1" />
                                  ))}
                                </span>
                              </p>
                              <p className="small">{new Date(comment.time_last_modified).toLocaleString(i18n.language, { dateStyle: 'long', timeStyle: 'short' })}</p>
                              <p className="mb-0">{comment.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </article>
            </div>
            {author && (
              <div className="col-md-4">
                <div className="position-sticky" style={{ top: "140px" }}>
                  <div className="p-4 mb-3 bg-body-tertiary rounded text-center" style={{ position: 'relative' }}>
                    <img src={author.picture} alt="User Picture" width={180} height={180} className="rounded-circle" style={{ border: '6px solid white', position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)' }} />
                    <h3 style={{ marginTop: '100px' }}>
                      <Trans i18nKey="display.about" components={[<span className="text-primary fw-bold" />]} values={{ name: author.first_name }} />
                    </h3>
                    <p className="mb-0">{author.bio}</p>
                    <Link to={`/user/${author.username}`} className="btn btn-primary mt-3">{t('display.learnMore')}</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <div className="album mt-5 bg-body-tertiary">
          <div className="container-fluid">
            <div className="row d-flex align-items-stretch">
              {viewAlsoRecipes.map((viewRecipe, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-3 p-0">
                  <Link to={`/recipe/${viewRecipe.rid}`}>
                    <div className="card text-bg-dark h-100 rounded-0 border-0 hover-effect position-relative">
                      <img src={`${viewRecipe.picture}`} className="card-img rounded-0" style={{ height: '13rem', objectFit: 'cover', transition: 'transform .3s ease-in-out' }} alt="..." />
                      <div className="card-img-overlay text-uppercase">
                        <h5 className="bg-primary card-title position-absolute bottom-0 left-0 py-1 px-2 fs-6 fw-normal" style={{ color: 'inherit', transition: 'none' }}>{getRecipeTitle(viewRecipe)}</h5>
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
