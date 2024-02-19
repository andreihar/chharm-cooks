export class Recipe {
	rid:number
	title:string;
	chinTitle:string;
	cuisine:string;
	username:string;
	prepTime:number;
	cookTime:number;
	servings:number;
	picture:string;
	createdOn:Date;
	timeLastModified:Date;
	ingredients:string[];
	recipeInstructions:string[];

	constructor(title:string, chinTitle:string, cuisine:string, username:string, prepTime:number, cookTime:number, servings:number, picture:string, ingredients:string[], recipeInstructions:string[]) {
		this.rid = 0;
		this.title = title;
		this.chinTitle = chinTitle;
		this.cuisine = cuisine;
		this.username = username;
		this.prepTime = prepTime;
		this.cookTime = cookTime;
		this.servings = servings;
		this.picture = picture;
		this.ingredients = ingredients;
		this.recipeInstructions = recipeInstructions;
		this.createdOn = new Date();
		this.timeLastModified = new Date();
	}
}