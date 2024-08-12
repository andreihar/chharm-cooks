export class Notification {
    followed: string;
    rid: number;
    mode: string;
    first_name: string;
    last_name: string;
    picture: string;
    title: string;
    chin_title: string;

    constructor(followed: string, rid: number, mode: string, first_name: string, last_name: string, picture: string, title: string, chin_title: string) {
        this.followed = followed;
        this.rid = rid;
        this.mode = mode;
        this.first_name = first_name;
        this.last_name = last_name;
        this.picture = picture;
        this.title = title;
        this.chin_title = chin_title;
    }
}