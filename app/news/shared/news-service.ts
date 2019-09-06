import * as firebase from "nativescript-plugin-firebase";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { News } from "./news-model";

import { Config } from "../../shared/config";

export class NewService {
    static getInstance(): NewService {
        return NewService._instance;
    }

    private static _instance: NewService = new NewService();

    private _news: Array<News> = [];

    constructor() {
        if (NewService._instance) {
            throw new Error("Use NewService.getInstance() instead of new.");
        }

        NewService._instance = this;
    }

    /* Load from the server */
    load(): Observable<any> {
        return new Observable((observer: any) => {
            {
                const base64 = require("base-64");

                const url = Config.BASE_URL + "getAllNews.php";
                
                const headers = new Headers();
                headers.set("Content-Type", "application/json");
                headers.set("Authorization", "Basic " + base64.encode(Config.username + ":" + Config.password));
                fetch(url, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({
                            "categoryName": (Config.userLimitedCategory === "") ? "*" : Config.userLimitedCategory,
                            "userID": Config.loginUser
                        })
                })
                .then((response) => response.json())
                .then((json: any) => {
                    const results = this.handleSnapshot(json);
                    observer.next(results);
                })
                .catch(err => {
                    console.log("Get News Fail. Error: " + err);
                });
            }
        }).pipe(catchError(this.handleErrors));
    }

    private handleSnapshot(data: any): Array<News> {
        this._news = [];

        if (data) {
            for (const id in data) {
                if (data.hasOwnProperty(id)) {
                    this._news.push(new News(data[id]));
                }
            }
        }

        return this._news;
    }

    private handleErrors(error: Response): Observable<any> {
        return Observable.throw(error);
    }
}
