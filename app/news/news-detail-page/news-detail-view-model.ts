import { Observable } from "tns-core-modules/data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { News } from "../shared/news-model";
import { Config } from '../../shared/config';
import {screen} from "platform";

export class NewsDetailViewModel extends Observable {
    @ObservableProperty() topbarColor: string;
    @ObservableProperty() screenWidth: number;
    constructor(private _news: News) {
        super();
        this.topbarColor = Config.topbarColor;
        console.log("++++++++++++++"+_news.categoryName);
        this.screenWidth = screen.mainScreen.widthDIPs;
    }

    get news(): News {
        return this._news;
    }
}
