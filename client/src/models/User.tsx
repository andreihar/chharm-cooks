export class User {
	username: string;
    email: string;
    picture: string;
    social: string;
    first_name: string;
    last_name: string;
    bio: string;
    occupation: string;
    created_on: Date;

	constructor(username: string, email: string, picture: string, social: string, first_name: string, last_name: string, bio: string, occupation: string, created_on: Date) {
        this.username = username;
        this.email = email;
        this.picture = picture;
        this.social = social;
        this.first_name = first_name;
        this.last_name = last_name;
        this.bio = bio;
        this.occupation = occupation;
        this.created_on = created_on;
    }
}