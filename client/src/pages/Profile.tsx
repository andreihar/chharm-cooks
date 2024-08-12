import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';
import UserCard from '../components/UserCard';
import DbService from '../services/DbService';
import { Helmet } from 'react-helmet-async';

function Display() {
  const { username } = useParams<{ username: string; }>();
  const [author, setAuthor] = useState<User>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [userFollows, setUserFollows] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuth0();
  const { t, i18n } = useTranslation();
  const { getAuthorName, getCountryName, getIconByWebsite } = useLocalisationHelper();
  const navigate = useNavigate();

  if (!username) {
    navigate('/');
    return;
  }

  function getPrimaryUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (error) {
      console.error('Invalid URL:', error);
      return '';
    }
  }

  useEffect(() => {
    const loadData = () => {
      Promise.all([DbService.getUserByName(username), DbService.getRecipesByUsername(username), DbService.getFollowing(username), DbService.getFollowers(username)])
        .then(([foundAuthor, foundRecipes, followingUsernames, followersUsernames]) => {
          if (foundAuthor && foundRecipes && followingUsernames && followersUsernames) {
            return Promise.all([
              Promise.all(followingUsernames.map((username) => DbService.getUserByName(username))),
              Promise.all(followersUsernames.map((username) => DbService.getUserByName(username)))
            ])
              .then(([foundFollowing, foundFollowers]) => {
                setAuthor(foundAuthor);
                setRecipes(foundRecipes);
                setFollowing(foundFollowing);
                setFollowers(foundFollowers);
                if (isAuthenticated && user?.sub && foundFollowers.some(follower => follower.username === user.sub)) {
                  setUserFollows(true);
                }
              });
          } else {
            alert(t('display.error'));
            navigate('/');
          }
        })
        .catch(() => {
          alert(t('display.error'));
          navigate('/');
        });
    };
    loadData();
  }, [username, isAuthenticated, user, t, navigate]);

  const follow = () => {
    DbService.followUser(username)
      .then(() => {
        setUserFollows(true);
      })
      .catch((error) => {
        console.error('Error following user:', error);
      });
  };

  const unfollow = () => {
    DbService.unfollowUser(username)
      .then(() => {
        setUserFollows(false);
      })
      .catch((error) => {
        console.error('Error unfollowing user:', error);
      });
  };

  if (author) {
    const { username, picture, social, bio, occupation, country, created_on } = author;
    return (
      <>
        <Helmet>
          <title>{`${getAuthorName(author)} | ChhármCooks`}</title>
          <meta name="description" content={bio ? bio.slice(0, 150) : `Explore the profile of ${username}. Discover their favorite recipes, cooking tips, and more on ChhármCooks.`} />
          <meta name="keywords" content="profile, user, details, recipe, ChhármCooks" />
          <meta name="author" content={getAuthorName(author)} />
          <meta property="og:title" content={`${getAuthorName(author)} | ChhármCooks`} />
          <meta property="og:description" content={bio ? bio.slice(0, 150) : `Explore the profile of ${username}. Discover their favorite recipes, cooking tips, and more on ChhármCooks.`} />
          <meta property="og:type" content="profile" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:image" content={picture} />
          <meta property="og:site_name" content="ChhármCooks" />
        </Helmet>
        <Navbar />
        <div className="p-5 text-center bg-image text-uppercase position-relative" style={{ backgroundImage: recipes.length > 0 ? `url(${recipes[0].picture})` : 'none' }}>
          <div className="mask position-absolute top-0 start-0 bottom-0 end-0">
            <div className="d-flex justify-content-center align-items-center h-100">
            </div>
          </div>
        </div>
        <div className="angled-div" />
        <main className="container mb-5">
          <div className="col-md-8 mx-auto">
            <article className="blog-post" style={{ marginTop: '-190px' }}>
              <div style={{ transform: 'translateY(-20px)', display: 'flex', alignItems: 'center' }}>
                <img src={picture} alt="User Picture" width={180} height={180} className="rounded-circle ms-2" style={{ border: '6px solid white' }} />
                <div className="ms-4 text-light">
                  <h2 className="display-5 mb-1">{getAuthorName(author)}</h2>
                  {country && <p className="fs-4 mb-0">{getCountryName(country)}</p>}
                </div>
              </div>
              <div className="text-dark-emphasis align-items-center d-flex justify-content-between">
                <div>
                  <div className="fs-5">{occupation}</div>
                  {social && (
                    <a href={social ? social : '#'} target="_blank" rel="noopener noreferrer" className="text-dark-emphasis align-items-center nav-link">
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={getIconByWebsite(social)} fontSize="1.5rem" className="me-2" />
                        {getPrimaryUrl(social)}
                      </div>
                    </a>
                  )}
                </div>
                <div className="d-flex justify-content-end text-center py-1">
                  {[{ count: recipes.length, label: t('home.recipes') }, { count: followers.length, label: t('profile.followers') }, { count: following.length, label: t('profile.following') }].map((item, index) => (
                    <div key={index} className={index === 1 ? "px-3" : ""}>
                      <h5 className="mb-1">{item.count}</h5>
                      <p className="text-muted mb-0">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <p className="text-dark-emphasis">
                  {t('profile.joined', { date: new Date(created_on).toLocaleString(i18n.language, { dateStyle: 'long', timeStyle: 'short' }) })}
                </p>
                {isAuthenticated && user && (user.sub !== username) &&
                  <div className="align-items-center d-flex fs-5">
                    {userFollows
                      ? <button className="btn btn-secondary" onClick={unfollow}>{t('profile.unfollow')}</button>
                      : <button className="btn btn-primary" onClick={follow}>{t('profile.follow')}</button>
                    }
                  </div>
                }
              </div>
              <div className="bd-example-snippet bd-code-snippet">
                <div className="bd-example m-0 border-0">
                  <nav>
                    <div className="nav nav-underline mb-3" id="nav-tab" role="tablist">
                      <button className="nav-link active" id="nav-bio-tab" data-bs-toggle="tab" data-bs-target="#nav-bio" type="button" role="tab" aria-controls="nav-bio" aria-selected="false" tabIndex={-1}>{t('profile.biography')}</button>
                      <button className="nav-link" id="nav-recipes-tab" data-bs-toggle="tab" data-bs-target="#nav-recipes" type="button" role="tab" aria-controls="nav-recipes" aria-selected="false" tabIndex={-1}>{t('home.recipes')}</button>
                      <button className="nav-link" id="nav-following-tab" data-bs-toggle="tab" data-bs-target="#nav-following" type="button" role="tab" aria-controls="nav-following" aria-selected="false" tabIndex={-1}>{t('profile.following')}</button>
                      <button className="nav-link" id="nav-followers-tab" data-bs-toggle="tab" data-bs-target="#nav-followers" type="button" role="tab" aria-controls="nav-followers" aria-selected="false" tabIndex={-1}>{t('profile.followers')}</button>
                    </div>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade album show active" id="nav-bio" role="tabpanel" aria-labelledby="nav-bio-tab">
                      <h2 className="text-capitalize">{t('profile.about')}</h2>
                      <p className="mt-4 fs-5">{bio}</p>
                    </div>
                    <div className="tab-pane fade" id="nav-recipes" role="tabpanel" aria-labelledby="nav-recipes-tab">
                      <div className="row">
                        {recipes.map((recipe) => (
                          <RecipeCard key={recipe.rid} recipe={recipe} classes={'col-12 col-lg-6'} />
                        ))}
                      </div>
                    </div>
                    <div className="tab-pane fade" id="nav-following" role="tabpanel" aria-labelledby="nav-following-tab">
                      <div className="row">
                        {following.map((user) => (
                          <UserCard key={user.username} user={user} classes={'col-12 col-lg-6'} />
                        ))}
                      </div>
                    </div>
                    <div className="tab-pane fade" id="nav-followers" role="tabpanel" aria-labelledby="nav-followers-tab">
                      <div className="row">
                        {followers.map((user) => (
                          <UserCard key={user.username} user={user} classes={'col-12 col-lg-6'} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </main>
        <Footer />
      </>
    );
  }
};

export default Display;
