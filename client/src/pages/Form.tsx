import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import isEqual from 'lodash.isequal';

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
  const [imageUrl, setImageUrl] = useState('');
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
      const foundRecipe = recipes.find((r: Recipe) => r.id === Number(id));
      if (foundRecipe && authUser?.name === foundRecipe.author) {
        setName(foundRecipe.name);
        setChinName(foundRecipe.chinName);
        setCuisine(foundRecipe.cuisine);
        setImageUrl(foundRecipe.picture);
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

  function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (ingredients.length === 0) {
      alert('At least one Ingredient is required');
      return;
    }
    if (steps.length === 0) {
      alert('At least one Step is required');
      return;
    }

    let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    let newRecipe = new Recipe(name.trim(), chinName.trim(), cuisine.trim(), authUser.name, imageUrl.trim(), ingredients.map(i => i.name.trim()).filter(Boolean), steps.map(s => s.name.trim()).filter(Boolean));
    if (id) {
      newRecipe.id = Number(id);
      const oldRecipe = recipes.find((r: Recipe) => r.id === Number(id));
      if (!isEqual(
        (({ createdOn, modifiedOn, ...rest }) => rest)(oldRecipe),
        (({ createdOn, modifiedOn, ...rest }) => rest)(newRecipe)
      )) {
        newRecipe.modifiedOn = new Date()
        newRecipe.createdOn = oldRecipe.createdOn;
        recipes[recipes.findIndex((r: Recipe) => r.id === Number(id))] = newRecipe;
      }
    } else {
      const index = JSON.parse(localStorage.getItem('index') || "3") as number;
      newRecipe.id = index;
      recipes.push(newRecipe);
      localStorage.setItem('index', JSON.stringify(index+1));
    }
    localStorage.setItem('recipes', JSON.stringify(recipes));
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
                <label htmlFor="picture">Image URL (optional)</label>
                <input type="text" className="form-control" name="picture" placeholder="https://live.staticflickr.com/65535/51720059627_0aed2b149b_o.jpg" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
              </div>
              {imageUrl && (
                <div className="d-flex justify-content-center mt-3">
                  <img src={imageUrl} alt="Preview" style={{ width: '70%', height: 'auto' }} />
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
