export class Recipe {
	id:number
	name:string;
	chinName:string;
	cuisine:string;
	author:string;
	picture:string;
	createdOn:Date;
	modifiedOn:Date;
	ingredients:string[];
	steps:string[];

	constructor(name:string, chinName:string, cuisine:string, author:string, picture:string, ingredients:string[], steps:string[]) {
		this.id = 0;
		this.name = name;
		this.chinName = chinName;
		this.cuisine = cuisine;
		this.author = author
		this.picture = picture;
		this.ingredients = ingredients;
		this.steps = steps;
		this.createdOn = new Date();
		this.modifiedOn = new Date();
	}
}