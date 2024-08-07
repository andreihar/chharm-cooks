export class Recipe {
    rid: number;
    title: string;
    chin_title: string;
    cuisine: string;
    username: string;
    prep_time: number;
    cook_time: number;
    servings: number;
    picture: string;
    created_on: Date;
    time_last_modified: Date;
    ingredients: { name: string, quantity: string; }[];
    recipe_instructions: string[];

    constructor(title: string, chin_title: string, cuisine: string, username: string, prep_time: number, cook_time: number, servings: number, picture: string, ingredients: { name: string, quantity: string; }[], recipe_instructions: string[]) {
        this.rid = 0;
        this.title = title;
        this.chin_title = chin_title;
        this.cuisine = cuisine;
        this.username = username;
        this.prep_time = prep_time;
        this.cook_time = cook_time;
        this.servings = servings;
        this.picture = picture;
        this.created_on = new Date();
        this.time_last_modified = new Date();
        this.ingredients = ingredients;
        this.recipe_instructions = recipe_instructions;
    }
}