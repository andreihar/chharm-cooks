export class Author {
	id:number;
	name:string;
	password:string;
	picture:string;
	social:string;

	constructor(name:string, password:string, picture:string, social:string) {
		this.id = 0;
		this.name = name;
		this.password = password;
		this.picture = picture;
		this.social = social;
	}
}