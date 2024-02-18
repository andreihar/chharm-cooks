export class User {
	username:string;
	password:string;
	picture:string;
	social:string;

	constructor(username:string, password:string, picture:string, social:string) {
		this.username = username;
		this.password = password;
		this.picture = picture;
		this.social = social;
	}
}