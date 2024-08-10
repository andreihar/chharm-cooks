import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { useLocalisationHelper } from '../libs/useLocalisationHelper';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TextEditor from '../components/TextEditor';
import isEqual from 'lodash.isequal';
import DbService from '../services/DbService';
import noRecipe from '../assets/noRecipe.png';

function InputList({ items, label, addLabel, add, remove, change, mode }: { items: any[], label: string, addLabel: string, add: () => void, remove: (index: number) => void, change: (e: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => void; mode: string; }) {
  return (
    <>
      {items.map((item, index) => (
        <div className="form-group d-flex align-items-center mb-2" key={index}>
          <label className="fw-bold me-2" htmlFor={`${label}-${index}`}>{index + 1}</label>
          {mode === 'ingredient' && (
            <input id={`${label}-quantity-${index}`} type="text" className="form-control me-2" name={`${label}-quantity-${index}`}
              value={item.quantity} onChange={e => change(e, index, 'quantity')} style={{ maxWidth: '200px' }} />
          )}
          <input id={`${label}-${index}`} type="text" className="form-control me-2" name={`${label}-${index}`}
            value={item.name} onChange={e => change(e, index, 'name')} />
          <button type="button" className="btn btn-outline-danger fw-bold ms-2" onClick={() => remove(index)}>-</button>
        </div>
      ))}
      <button type="button" className="btn btn-outline-primary fw-bold px-4" onClick={add}>{addLabel} {label}</button>
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
  const [ingredients, setIngreds] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([{ name: "" }]);
  const [content, setContent] = useState('');
  const { user, isAuthenticated } = useAuth0();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const editorRef = useRef<{ getContent: () => string; }>(null);
  const { getCuisines } = useLocalisationHelper();

  useEffect(() => {
    const fetchRecipe = () => {
      if (!isAuthenticated) {
        alert(t('form.login'));
        navigate('/');
      } else if (id && user) {
        DbService.getRecipeById(Number(id))
          .then((foundRecipe) => {
            if (foundRecipe && user.sub === foundRecipe.username) {
              setName(foundRecipe.title);
              setChinName(foundRecipe.chin_title);
              setCuisine(foundRecipe.cuisine);
              setPrepTime(foundRecipe.prep_time);
              setCookTime(foundRecipe.cook_time);
              setServings(foundRecipe.servings);
              setPicture(foundRecipe.picture);
              setIngreds(foundRecipe.ingredients.map((ingredient: { name: string, quantity: string; }) => ({ name: ingredient.name, quantity: ingredient.quantity })));
              setSteps(foundRecipe.recipe_instructions.map((step: string) => ({ name: step })));
              setContent(foundRecipe.content);
            } else {
              navigate('/');
            }
          })
          .catch(() => {
            navigate('/');
          });
      }
    };
    fetchRecipe();
  }, [id, isAuthenticated, user]);

  const add = (setter: Function) => () => setter((prev: { name: string; quantity: string; }[]) => [...prev, { name: "", quantity: "" }]);
  const remove = (setter: Function) => (index: number) => setter((prev: { name: string; quantity: string; }[]) => prev.filter((_: any, i: number) => i !== index));
  const change = (setter: Function) => (e: React.ChangeEvent<HTMLInputElement>, index: number, field: string) =>
    setter((prev: { name: string; quantity: string; }[]) => prev.map((item, i) => i === index ? { ...item, [field]: e.target.value } : item));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const content = editorRef.current?.getContent() || '';
    let newRecipe = new Recipe(name.trim(), chinName.trim(), cuisine.trim(), (user!.sub as string), prepTime, cookTime, servings, picture.trim() || noRecipe, ingredients.map(i => ({ name: i.name.trim(), quantity: i.quantity.trim() })).filter(i => i.name && i.quantity), steps.map(s => s.name.trim()).filter(Boolean), content);
    if (newRecipe.ingredients.length === 0) {
      alert(t('form.oneIngredient'));
      return;
    }
    if (newRecipe.recipe_instructions.length === 0) {
      alert(t('form.oneStep'));
      return;
    }
    if (id) {
      DbService.getRecipeById(Number(id))
        .then((oldRecipe) => {
          if (oldRecipe && !isEqual(
            (({ created_on, time_last_modified, rid, ...rest }) => rest)(oldRecipe),
            (({ created_on, time_last_modified, rid, ...rest }) => rest)(newRecipe)
          )) {
            newRecipe.created_on = oldRecipe.created_on;
            DbService.updateRecipe(Number(id), newRecipe);
          }
        })
        .catch((error) => {
          console.error('Error fetching old recipe:', error);
        });
    } else {
      DbService.addRecipe(newRecipe)
        .catch((error) => {
          console.error('Error adding new recipe:', error);
        });
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
                <label htmlFor="cuisine">{t('form.cuisine')} *</label>
                {getCuisines(cuisine, setCuisine)}
              </div>
              <div className="form-group">
                <label htmlFor="prepTime">{t('form.prepTime')} {t('form.min')} *</label>
                <input id="prepTime" type="text" className="form-control" name="prepTime" placeholder="5" value={prepTime === 0 ? '' : prepTime} required
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9\b]+$/.test(value)) {
                      setPrepTime(value === '' ? 0 : Math.max(0, Number(value)));
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cookTime">{t('form.cookTime')} {t('form.min')} *</label>
                <input id="cookTime" type="text" className="form-control" name="cookTime" placeholder="22" value={cookTime === 0 ? '' : cookTime} required
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9\b]+$/.test(value)) {
                      setCookTime(value === '' ? 0 : Math.max(0, Number(value)));
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="servings">{t('form.servings')} *</label>
                <input id="servings" type="text" className="form-control" name="servings" placeholder="6" value={servings === 0 ? '' : servings} required
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9\b]+$/.test(value)) {
                      setServings(value === '' ? 0 : Math.max(0, Number(value)));
                    }
                  }}
                />
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
              <legend className="text-primary">{t('form.blog')}</legend>
              <TextEditor ref={editorRef} content={content} />
            </fieldset>
            <fieldset className="p-4 my-4">
              <legend className="text-primary">{t('form.ingredients')}</legend>
              <InputList items={ingredients} label={t('form.ingredient')} addLabel={t('form.add')} add={add(setIngreds)} remove={remove(setIngreds)} change={change(setIngreds)} mode='ingredient' />
            </fieldset>
            <fieldset className="p-4 my-4">
              <legend className="text-primary">{t('form.directions')}</legend>
              <InputList items={steps} label={t('form.step')} addLabel={t('form.add')} add={add(setSteps)} remove={remove(setSteps)} change={change(setSteps)} mode='step' />
            </fieldset>
            <div className="controls d-flex justify-content-center">
              <button type="submit" className="btn btn-outline-primary btn-lg px-4 text-uppercase fw-bold">{id ? t('form.update') : t('form.submit')}</button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Form;
