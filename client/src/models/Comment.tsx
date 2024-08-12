export class Comment {
    username: string;
    comment: string;
    time_last_modified: string;
    first_name: string;
    last_name: string;
    picture: string;
    rating: number;

    constructor(username: string, comment: string, time_last_modified: string, first_name: string, last_name: string, picture: string, rating: number) {
        this.username = username;
        this.comment = comment;
        this.time_last_modified = time_last_modified;
        this.first_name = first_name;
        this.last_name = last_name;
        this.picture = picture;
        this.rating = rating;
    }
}