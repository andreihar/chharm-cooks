export class User {
	username: string;
	picture: string;
	social: string | null;
	first_name: string;
	last_name: string;
	bio: string | null;
	occupation: string | null;
	created_on: Date;

	constructor(username: string, picture: string, social: string | null = null, first_name: string, last_name: string, bio: string | null = null, occupation: string | null = null, created_on: Date) {
		this.username = username;
		this.picture = picture;
		this.social = social;
		this.first_name = first_name;
		this.last_name = last_name;
		this.bio = bio;
		this.occupation = occupation;
		this.created_on = created_on;
	}
}