import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import isEqual from 'lodash.isequal';
import DbService from '../services/DbService';
import noRecipe from '../assets/noRecipe.png';
import adjectives from '../assets/translations/adjectives.json';

function InputList({ items, label, addLabel, add, remove, change }: { items: any[], label: string, addLabel: string, add: any, remove: any, change: any; }) {
  return (
    <>
      {items.map((item, index) => (
        <div className="form-group d-flex align-items-center mb-2" key={index}>
          <label className="fw-bold me-2" htmlFor={`${label}-${index}`}>{index + 1}</label>
          <input id={`${label}-${index}`} type="text" className="form-control" name={`${label}-${index}`} value={item.name} onChange={e => change(e, index)} />
          <button type="button" className="btn btn-outline-danger fw-bold ms-2" onClick={() => remove(index)}>-</button>
        </div>
      ))}
      <button type="button" className="btn btn-outline-primary fw-bold px-4" onClick={add}>{addLabel}{label}</button>
    </>
  );
}

function Form() {
  const { id } = useParams<{ id: string; }>();
  const [name, setName] = useState('');
  const [chinName, setChinName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [servings, setServings] = useState(0);
  const [picture, setPicture] = useState('');
  const [ingredients, setIngreds] = useState([{ name: "" }]);
  const [steps, setSteps] = useState([{ name: "" }]);
  const cuisineOptions = Object.values(adjectives).map(country => ({ value: country[0], label: country[0] }));
  const { user, isAuthenticated } = useAuth0();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  interface OptionType {
    label: string;
    value: string;
  }

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (id && user) {
        const foundRecipe = await DbService.getRecipeById(Number(id));
        if (foundRecipe && user.sub === foundRecipe.username) {
          setName(foundRecipe.title);
          setChinName(foundRecipe.chin_title);
          setCuisine(foundRecipe.cuisine);
          setPrepTime(foundRecipe.prep_time);
          setCookTime(foundRecipe.cook_time);
          setServings(foundRecipe.servings);
          setPicture(foundRecipe.picture);
          setIngreds(foundRecipe.ingredients.map((ingredient: string) => ({ name: ingredient })));
          setSteps(foundRecipe.recipe_instructions.map((step: string) => ({ name: step })));
        } else {
          navigate('/');
        }
      }
    };
    fetchRecipe();
  }, [id, isAuthenticated, user]);

  const add = (setter: Function) => () => setter((prev: { name: string; }[]) => [...prev, { name: "" }]);
  const remove = (setter: Function) => (index: number) => setter((prev: { name: string; }[]) => prev.filter((_: any, i: number) => i !== index));
  const change = (setter: Function) => (e: React.ChangeEvent<HTMLInputElement>, index: number) =>
    setter((prev: { name: string; }[]) => prev.map((item, i) => i === index ? { name: e.target.value } : item));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let newRecipe = new Recipe(name.trim(), chinName.trim(), cuisine.trim(), (user!.sub as string), prepTime, cookTime, servings, picture.trim() || noRecipe, ingredients.map(i => i.name.trim()).filter(Boolean), steps.map(s => s.name.trim()).filter(Boolean));
    if (newRecipe.ingredients.length === 0) {
      alert(t('form.oneIngredient'));
      return;
    }
    if (newRecipe.recipe_instructions.length === 0) {
      alert(t('form.oneStep'));
      return;
    }
    if (id) {
      const oldRecipe = await DbService.getRecipeById(Number(id));
      if (oldRecipe && !isEqual(
        (({ created_on, time_last_modified, rid, ...rest }) => rest)(oldRecipe),
        (({ created_on, time_last_modified, rid, ...rest }) => rest)(newRecipe)
      )) {
        newRecipe.created_on = oldRecipe.created_on;
        DbService.updateRecipe(Number(id), newRecipe);
      }
    } else {
      DbService.addRecipe(newRecipe);
    }
    navigate('/');
  }

  return (
    <>
      <Navbar />
      <div className="wrapper">
        <header>
          <h2>{id ? t('form.edit') : t('form.create')}{t('form.recipe')}</h2>
        </header>
        <main>
          <form className="form-group" onSubmit={submit}>
            <fieldset className="p-4 my-4">
              <legend className="text-primary">{t('form.recipeInfo')}</legend>
              <div className="form-group">
                <label htmlFor="name">{t('form.recipeName')} *</label>
                <input id="name" type="text" className="form-control" name="name" placeholder="Ke bah png" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" maxLength={50} />
              </div>
              <div className="form-group">
                <label htmlFor="chinName">{t('form.chinName')} *</label>
                <input id="chinName" type="text" className="form-control" name="chinName" placeholder="雞肉飯" value={chinName} onChange={e => setChinName(e.target.value)} required maxLength={50} />
              </div>
              <div className="form-group">
                {/* <label htmlFor="cuisine">{t('form.cuisine')} *</label>
                <input id="cuisine" type="text" className="form-control" name="cuisine" placeholder="Taiwanese" value={cuisine} onChange={e => setCuisine(e.target.value)} required /> */}
                <label htmlFor="cuisine">{t('form.cuisine')} *</label>
                <Select
                  id="cuisine"
                  name="cuisine"
                  options={Object.entries(adjectives).map(([code, country]) => ({
                    value: code,
                    label: i18n.language === 'zh' ? country[1] : i18n.language === 'ms' ? country[2] : country[0]
                  }))}
                  isClearable
                  isSearchable
                  placeholder={i18n.language === 'zh' ? '台灣' : i18n.language === 'ms' ? 'Taiwan' : 'Taiwanese'}
                  value={Object.entries(adjectives).map(([code, country]) => ({
                    value: code,
                    label: i18n.language === 'zh' ? country[1] : i18n.language === 'ms' ? country[2] : country[0]
                  })).find(option => option.value === cuisine)}
                  onChange={(option: OptionType | null) => setCuisine(option ? option.value : '')}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="prepTime">{t('form.prepTime')} {t('form.min')} *</label>
                <input id="prepTime" type="number" className="form-control" name="prepTime" placeholder="Preparation time in minutes" value={prepTime} onChange={e => setPrepTime(Math.max(0, Number(e.target.value)))} required />
              </div>
              <div className="form-group">
                <label htmlFor="cookTime">{t('form.cookTime')} {t('form.min')} *</label>
                <input id="cookTime" type="number" className="form-control" name="cookTime" placeholder="Cooking time in minutes" value={cookTime} onChange={e => setCookTime(Math.max(0, Number(e.target.value)))} required />
              </div>
              <div className="form-group">
                <label htmlFor="servings">{t('form.servings')} *</label>
                <input id="servings" type="number" className="form-control" name="servings" placeholder="Number of servings" value={servings} onChange={e => setServings(Math.max(0, Number(e.target.value)))} required />
              </div>
              <div className="form-group">
                <label htmlFor="picture">{t('form.picture')} {t('form.optional')}</label>
                <input id="picture" type="text" className="form-control" name="picture" placeholder="https://live.staticflickr.com/65535/51720059627_0aed2b149b_o.jpg" value={picture} onChange={e => setPicture(e.target.value)} />
              </div>
              {picture && (
                <div className="d-flex justify-content-center mt-3">
                  <img src={picture} alt="Preview" style={{ width: '70%', height: 'auto' }} />
                </div>
              )}
            </fieldset>
            <fieldset className="p-4 my-4">
              <legend className="text-primary">{t('form.ingredients')}</legend>
              <InputList items={ingredients} label={t('form.ingredient')} addLabel={t('form.add')} add={add(setIngreds)} remove={remove(setIngreds)} change={change(setIngreds)} />
            </fieldset>
            <fieldset className="p-4 my-4">
              <legend className="text-primary">{t('form.directions')}</legend>
              <InputList items={steps} label={t('form.step')} addLabel={t('form.add')} add={add(setSteps)} remove={remove(setSteps)} change={change(setSteps)} />
            </fieldset>
            <div className="controls d-flex justify-content-center">
              <button type="submit" className="btn btn-outline-primary px-4 text-uppercase">{id ? t('form.update') : t('form.submit')}</button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Form;
