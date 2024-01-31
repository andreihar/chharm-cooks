export class Recipe {
	id:number
	name:string;
	cuisine:string;
	picture:string;
	ingredients:string[];
	steps:string[];
  
	constructor(name:string, cuisine:string, picture:string, ingredients:string[], steps:string[]) {
		this.id = 0;
		this.name = name;
		this.cuisine = cuisine;
		this.picture = picture;
		this.ingredients = ingredients;
		this.steps = steps;
	}
}