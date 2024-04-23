import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faClock, faBowlRice, faThumbsUp as faThumbsUpL } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DbService from '../services/DbService';

function Display() {
  const { username } = useParams<{ username: string }>();
  const [author, setAuthor] = useState<User>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [userFollows, setUserFollows] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const {authUser, isLogged} = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const foundAuthor = await DbService.getUserByName(username || '');
      const foundRecipes = await DbService.getRecipesByUsername(username || '');
      // const foundLikedRecipes = await DbService.getLikesByUsername(username || '');
      const followingUsernames = await DbService.getFollowing(username || '');
      const followersUsernames = await DbService.getFollowers(username || '');
      if (foundAuthor && foundRecipes && followingUsernames && followersUsernames) {
        const foundFollowing = await Promise.all(followingUsernames.map((username: string) => DbService.getUserByName(username)));
        const foundFollowers = await Promise.all(followersUsernames.map((username: string) => DbService.getUserByName(username)));
        setAuthor(foundAuthor);
        setRecipes(foundRecipes);
        // setLikedRecipes(foundLikedRecipes);
        setFollowing(foundFollowing);
        setFollowers(foundFollowers);
        const followerUsernames = followersUsernames.map(user => user.follower);
        if (followerUsernames.includes(authUser.username)) {
          setUserFollows(true);
        }
        setFollowersCount(followersUsernames.length);
      } else {
        alert (t('display.error'));
        navigate('/');
        return;
      }
    };
    loadData();

  }, [username]);

  const follow = async () => {
    await DbService.followUser(username || '');
    const newFollowing = await DbService.getFollowers(username || '');
    setFollowersCount(newFollowing.length);
    setUserFollows(true);
  }

  const unfollow = async () => {
    await DbService.unfollowUser(username || '');
    const newFollowing = await DbService.getFollowers(username || '');
    setFollowersCount(newFollowing.length);
    setUserFollows(false);
  }

  if (author) {
    const {username, email, picture, social, first_name, last_name, bio, occupation, created_on} = author
    return (
    <>
      <Navbar/>
      <div className="p-5 text-center bg-image text-uppercase position-relative" 
      style={{ backgroundImage: recipes.length > 0 ? `url(${recipes[0].picture})` : 'none' }}>
        <div className="mask position-absolute top-0 start-0 bottom-0 end-0">
          <div className="d-flex justify-content-center align-items-center h-100">
          </div>
        </div>
      </div>
      <div className="angled-div" />

      
      <main className="container">
        <div className="row g-5">
          <div className="col-md-8 mx-auto">
            <article className="blog-post" style={{marginTop: '-190px'}}>
              <div style={{transform: 'translateY(-20px)', display: 'flex', alignItems: 'center'}}>
                <img src={picture} alt="User Picture" width={180} height={180} className="rounded-circle ms-2" style={{border: '6px solid white'}}/>
                <div className="ms-4 text-light">
                  <h2 className="display-5 mb-1">{i18n.language === 'en' ? `${first_name} ${last_name}` : `${last_name} ${first_name}`}</h2>
                  <p className="fs-4 mb-0">New York, USA</p>
                </div>
              </div>
              <div className="text-dark-emphasis align-items-center d-flex justify-content-between">
                <div>
                  <a href={social} target="_blank" rel="noopener noreferrer" className="text-dark-emphasis align-items-center d-flex">
                    <span className="fs-5 ms-2">{occupation}</span>
                    
                  </a>
                </div>
                <div className="d-flex justify-content-end text-center py-1">
                <div>
                  <p className="mb-1 h5">{recipes.length}</p>
                  <p className="small text-muted mb-0">Recipes</p>
                </div>
                <div className="px-3">
                  <p className="mb-1 h5">{followers.length}</p>
                  <p className="small text-muted mb-0">Followers</p>
                </div>
                <div>
                  <p className="mb-1 h5">{following.length}</p>
                  <p className="small text-muted mb-0">Following</p>
                </div>
              </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <p className="text-dark-emphasis">
                  Joined On <span className="">{`${new Date(created_on).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}`}</span>
                </p>
                {isLogged && (authUser.username !== username) &&
                  <div className="align-items-center d-flex fs-5">
                    {userFollows
                      ? <button className="btn btn-outline-secondary" onClick={unfollow}>Unfollow</button>
                      : <button className="btn btn-primary" onClick={follow}>Follow</button>
                    }
                  </div>
                }
              </div>
              <div className="bd-example-snippet bd-code-snippet">
                <div className="bd-example m-0 border-0">
                  <nav>
                    <div className="nav nav-underline mb-3" id="nav-tab" role="tablist">
                      <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="false" tabIndex={-1}>Home</button>
                      <button className="nav-link" id="nav-recipes-tab" data-bs-toggle="tab" data-bs-target="#nav-recipes" type="button" role="tab" aria-controls="nav-recipes" aria-selected="false" tabIndex={-1}>Recipes</button>
                      <button className="nav-link" id="nav-following-tab" data-bs-toggle="tab" data-bs-target="#nav-following" type="button" role="tab" aria-controls="nav-following" aria-selected="false" tabIndex={-1}>Following</button>
                      <button className="nav-link" id="nav-followers-tab" data-bs-toggle="tab" data-bs-target="#nav-followers" type="button" role="tab" aria-controls="nav-followers" aria-selected="false" tabIndex={-1}>Followers</button>
                      <button className="nav-link" id="nav-liked-tab" data-bs-toggle="tab" data-bs-target="#nav-liked" type="button" role="tab" aria-controls="nav-liked" aria-selected="false" tabIndex={-1}>Liked</button>
                    </div>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                      <p>This is some placeholder.</p>
                    </div>
                    <div className="tab-pane fade" id="nav-recipes" role="tabpanel" aria-labelledby="nav-recipes-tab">
                      <p>This is some placeholder.</p>
                    </div>
                    <div className="tab-pane fade" id="nav-following" role="tabpanel" aria-labelledby="nav-following-tab">
                      <p>This is some placeholder.</p>
                    </div>
                    <div className="tab-pane fade" id="nav-followers" role="tabpanel" aria-labelledby="nav-followers-tab">
                      <p>This is some placeholder.</p>
                    </div>
                    <div className="tab-pane fade" id="nav-liked" role="tabpanel" aria-labelledby="nav-liked-tab">
                      <p>This is some placeholder.</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
          {/* <div className="col-md-4">
            <div className="position-sticky" style={{ top: "90px" }}>
              <div className="p-4 mb-3 bg-body-tertiary rounded">
                <p className="mb-0">{t('display.aboutText')}</p>
              </div>
            </div>
          </div> */}
        </div>
      </main>
      <Footer/>
    </>
  )
  }
}

export default Display
