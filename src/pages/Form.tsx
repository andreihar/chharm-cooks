import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../Recipe';
import Navbar from './Navbar';
import Footer from './Footer';

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
  const [ingredients, setIngreds] = useState([{ name:"" }]);
  const [steps, setSteps] = useState([{ name:"" }]);
  const [imageUrl, setImageUrl] = useState('');

  const navigate = useNavigate();

  const add = (setter:Function) => () => setter((prev:{ name:string }[]) => [...prev, { name:"" }]);
  const remove = (setter:Function) => (index:number) => setter((prev:{ name:string }[]) => prev.filter((_:any, i:number) => i !== index));
  const change = (setter:Function) => (e:React.ChangeEvent<HTMLInputElement>, index:number) =>
    setter((prev:{ name:string }[]) => prev.map((item, i) => i === index ? { name:e.target.value }:item));

  function getValuesWithPrefix(formData: FormData, prefix: string): string[] {
    return Array.from(formData.keys())
      .filter(key => key.startsWith(prefix) && String(formData.get(key)).trim() !== '')
      .map(key => formData.get(key) as string);
  }

  function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const index = JSON.parse(localStorage.getItem('index') || "3") as number;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const chinName = formData.get('chin-name') as string;
    const cuisine = formData.get('cuisine') as string;
    const picture = formData.get('picture') as string;
    const ingredients = getValuesWithPrefix(formData, 'Ingredient');
    const steps = getValuesWithPrefix(formData, 'Step');

    if (ingredients.length === 0) {
      alert('At least one Ingredient is required');
      return;
    }
    if (steps.length === 0) {
      alert('At least one Step is required');
      return;
    }

    let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    let newRecipe = new Recipe(name + " | " + chinName, cuisine, picture, ingredients, steps);
    newRecipe.id = index;
    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    localStorage.setItem('index', JSON.stringify(index+1));
    navigate('/');
  }

  return (
    <>
      <Navbar/>
      <div className="wrapper mt-5">
        <header>
          <h2>Create Recipe</h2>
        </header>
        <main>
          <form className="form-group" onSubmit={submit}>
            <fieldset className="p-4 my-4">
              <legend>Recipe Information</legend>
              <div className="form-group">
                <label htmlFor="name">Recipe Name *</label>
                <input type="text" className="form-control" name="name" placeholder="Ke bah png" required/>
              </div>
              <div className="form-group">
                <label htmlFor="chin-name">Chinese Name *</label>
                <input type="text" className="form-control" name="chin-name" placeholder="雞肉飯" required/>
              </div>
              <div className="form-group">
                <label htmlFor="cuisine">Cuisine *</label>
                <input type="text" className="form-control" name="cuisine" placeholder="Taiwanese" required/>
              </div>
              <div className="form-group">
                <label htmlFor="picture">Image URL (optional)</label>
                <input type="text" className="form-control" name="picture" onChange={e => setImageUrl(e.target.value)} />
              </div>
              {imageUrl && (
                <div className="d-flex justify-content-center mt-3">
                  <img src={imageUrl} alt="Preview" style={{ width: '70%', height: 'auto' }} />
                </div>
              )}
            </fieldset>
            <fieldset className="p-4 my-4">
              <legend>Ingredients</legend>
              <InputList items={ingredients} label="Ingredient" add={add(setIngreds)} remove={remove(setIngreds)} change={change(setIngreds)}/>
            </fieldset>
            <fieldset className="p-4 my-4">
              <legend>Directions</legend>
              <InputList items={steps} label="Step" add={add(setSteps)} remove={remove(setSteps)} change={change(setSteps)}/>
            </fieldset>
            <div className="controls d-flex justify-content-center">
              <button type="submit" className="btn btn-outline-primary px-4">SUBMIT</button>
            </div>
          </form>
        </main>
      </div>
      <Footer/>
    </>
  )
}

export default Form
