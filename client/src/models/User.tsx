export class User {
	username:string;
	picture:string;
	social:string;

	constructor(username:string, picture:string, social:string) {
		this.username = username;
		this.picture = picture;
		this.social = social;
	}
}