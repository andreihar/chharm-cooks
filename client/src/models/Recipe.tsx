export class Recipe {
	id:number
	title:string;
	chinTitle:string;
	cuisine:string;
	author:string;
	picture:string;
	createdOn:Date;
	timeLastModified:Date;
	ingredients:string[];
	recipeInstructions:string[];

	constructor(title:string, chinTitle:string, cuisine:string, author:string, picture:string, ingredients:string[], recipeInstructions:string[]) {
		this.id = 0;
		this.title = title;
		this.chinTitle = chinTitle;
		this.cuisine = cuisine;
		this.author = author
		this.picture = picture;
		this.ingredients = ingredients;
		this.recipeInstructions = recipeInstructions;
		this.createdOn = new Date();
		this.timeLastModified = new Date();
	}
}