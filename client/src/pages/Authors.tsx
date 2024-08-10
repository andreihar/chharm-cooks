import { useState, useEffect } from 'react';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserCard from '../components/UserCard';
import DbService from '../services/DbService';

function Authors() {
  const { t } = useTranslation();
  const { getAuthorName } = useLocalisationHelper();
  const [authors, setAuthors] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    DbService.getUsers().then(setAuthors);
    DbService.getRecipes().then(setRecipes);
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${t('navbar.contributors')} | ChhármCooks`}</title>
        <meta name="description" content="Discover the top contributors and authors of ChhármCooks. Explore their recipes and culinary expertise." />
        <meta name="keywords" content="ChhármCooks, authors, contributors, recipes, culinary experts, top chefs" />
      </Helmet>
      <Navbar />
      <div className="album py-5">
        <div className="container">
          <h2>{t('authors.top')}</h2>
          <div className="row">
            {authors
              .filter(author => recipes.some(recipe => recipe.username === author.username))
              .sort((a, b) => {
                const aRecipes = recipes.filter(recipe => recipe.username === a.username).length;
                const bRecipes = recipes.filter(recipe => recipe.username === b.username).length;
                if (aRecipes === bRecipes)
                  return getAuthorName(a).localeCompare(getAuthorName(b));
                else
                  return bRecipes - aRecipes;
              })
              .map(author => (
                <UserCard key={author.username} user={author} classes={'col-12 col-sm-6 col-md-4 col-lg-3'} />
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Authors;
