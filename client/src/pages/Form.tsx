import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import isEqual from 'lodash.isequal';
import DbService from '../services/DbService';

function InputList({ items, label, add, remove, change }:{ items:any[], label:string, add:any, remove:any, change:any }) {
  return (
    <>
      {items.map((item, index) => (
        <div className="form-group d-flex align-items-center mb-2" key={index}>
          <label className="fw-bold me-2" htmlFor={`${label}-${index}`}>{index + 1}</label>
          <input type="text" className="form-control" name={`${label}-${index}`} value={item.name} onChange={e => change(e, index)}/>
          <button type="button" className="btn btn-outline-danger fw-bold ms-2" onClick={() => remove(index)}>-</button>
        </div>
      ))}
      <button type="button" className="btn btn-outline-primary fw-bold px-4" onClick={add}>Add {label}</button>
    </>
  );
}

function Form() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [chinName, setChinName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [servings, setServings] = useState(0);
  const [picture, setPicture] = useState('');
  const [ingredients, setIngreds] = useState([{ name:"" }]);
  const [steps, setSteps] = useState([{ name:"" }]);
  const {authUser, isLogged} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged)
      navigate('/login');
    const loadedRecipesJSON = localStorage.getItem('recipes');
    if (loadedRecipesJSON) {
      const recipes = JSON.parse(loadedRecipesJSON);
      const foundRecipe = recipes.find((r: Recipe) => r.rid === Number(id));
      if (foundRecipe && authUser?.username === foundRecipe.author) {
        setName(foundRecipe.name);
        setChinName(foundRecipe.chinName);
        setCuisine(foundRecipe.cuisine);
        setPicture(foundRecipe.picture);
        setIngreds(foundRecipe.ingredients.map((ingredient:string) => ({ name:ingredient })));
        setSteps(foundRecipe.steps.map((step:string) => ({ name:step })));
      } else if (id) {
        navigate('/');
      }
    }
  }, [id]);

  const add = (setter:Function) => () => setter((prev:{ name:string }[]) => [...prev, { name:"" }]);
  const remove = (setter:Function) => (index:number) => setter((prev:{ name:string }[]) => prev.filter((_:any, i:number) => i !== index));
  const change = (setter:Function) => (e:React.ChangeEvent<HTMLInputElement>, index:number) =>
    setter((prev:{ name:string }[]) => prev.map((item, i) => i === index ? { name:e.target.value }:item));

  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (ingredients.length === 0) {
      alert('At least one Ingredient is required');
      return;
    }
    if (steps.length === 0) {
      alert('At least one Step is required');
      return;
    }

    // let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    let recipes = await DbService.getRecipes();
    let newRecipe = new Recipe(name.trim(), chinName.trim(), cuisine.trim(), authUser.username, prepTime, cookTime, servings, picture.trim(), ingredients.map(i => i.name.trim()).filter(Boolean), steps.map(s => s.name.trim()).filter(Boolean));
    if (id) {
      newRecipe.rid = Number(id);
      const oldRecipe = recipes.find((r: Recipe) => r.rid === Number(id));
      if (oldRecipe && !isEqual(
        (({ createdOn, timeLastModified, ...rest }) => rest)(oldRecipe),
        (({ createdOn, timeLastModified, ...rest }) => rest)(newRecipe)
      )) {
        newRecipe.timeLastModified = new Date()
        newRecipe.createdOn = oldRecipe.createdOn;
        recipes[recipes.findIndex((r: Recipe) => r.rid === Number(id))] = newRecipe;
      }
    } else {
      DbService.addRecipe(newRecipe);
      // const index = JSON.parse(localStorage.getItem('index') || "3") as number;
      // newRecipe.id = index;
      // recipes.push(newRecipe);
      // localStorage.setItem('index', JSON.stringify(index+1));
    }
    // localStorage.setItem('recipes', JSON.stringify(recipes));
    navigate('/');
  }

  return (
    <>
      <Navbar/>
      <div className="wrapper">
        <header>
          <h2>{id ? 'Edit' : 'Create'} Recipe</h2>
        </header>
        <main>
          <form className="form-group" onSubmit={submit}>
            <fieldset className="p-4 my-4">
              <legend className="text-primary">Recipe Information</legend>
              <div className="form-group">
                <label htmlFor="name">Recipe Name *</label>
                <input type="text" className="form-control" name="name" placeholder="Ke bah png" value={name} onChange={e => setName(e.target.value)} required/>
              </div>
              <div className="form-group">
                <label htmlFor="chin-name">Chinese Name *</label>
                <input type="text" className="form-control" name="chin-name" placeholder="雞肉飯" value={chinName} onChange={e => setChinName(e.target.value)} required/>
              </div>
              <div className="form-group">
                <label htmlFor="cuisine">Cuisine *</label>
                <input type="text" className="form-control" name="cuisine" placeholder="Taiwanese" value={cuisine} onChange={e => setCuisine(e.target.value)} required/>
              </div>
              <div className="form-group">
                <label htmlFor="prepTime">Preparation Time *</label>
                <input type="number" className="form-control" name="prepTime" placeholder="Preparation time in minutes" value={prepTime} onChange={e => setPrepTime(Math.max(0, Number(e.target.value)))} required/>
              </div>

              <div className="form-group">
                <label htmlFor="cookTime">Cooking Time *</label>
                <input type="number" className="form-control" name="cookTime" placeholder="Cooking time in minutes" value={cookTime} onChange={e => setCookTime(Math.max(0, Number(e.target.value)))} required/>
              </div>

              <div className="form-group">
                <label htmlFor="servings">Number of Servings *</label>
                <input type="number" className="form-control" name="servings" placeholder="Number of servings" value={servings} onChange={e => setServings(Math.max(0, Number(e.target.value)))} required/>
              </div>
              <div className="form-group">
                <label htmlFor="picture">Image URL (optional)</label>
                <input type="text" className="form-control" name="picture" placeholder="https://live.staticflickr.com/65535/51720059627_0aed2b149b_o.jpg" value={picture} onChange={e => setPicture(e.target.value)} />
              </div>
              {picture && (
                <div className="d-flex justify-content-center mt-3">
                  <img src={picture} alt="Preview" style={{ width: '70%', height: 'auto' }} />
                </div>
              )}
            </fieldset>
            <fieldset className="p-4 my-4">
              <legend className="text-primary">Ingredients</legend>
              <InputList items={ingredients} label="Ingredient" add={add(setIngreds)} remove={remove(setIngreds)} change={change(setIngreds)}/>
            </fieldset>
            <fieldset className="p-4 my-4">
              <legend className="text-primary">Directions</legend>
              <InputList items={steps} label="Step" add={add(setSteps)} remove={remove(setSteps)} change={change(setSteps)}/>
            </fieldset>
            <div className="controls d-flex justify-content-center">
              <button type="submit" className="btn btn-outline-primary px-4">{id ? 'UPDATE' : 'SUBMIT'}</button>
            </div>
          </form>
        </main>
      </div>
      <Footer/>
    </>
  )
}

export default Form
