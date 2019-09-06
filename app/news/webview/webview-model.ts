import { Observable } from "tns-core-modules/data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { News } from "../shared/news-model";
import { Config } from '../../shared/config';

export class WebViewModel extends Observable {
    @ObservableProperty() topbarColor: string;
    @ObservableProperty() webViewSrc: string;
    @ObservableProperty() result: string;
    @ObservableProperty() isLoading: boolean;

    constructor(private _news: News) {
        super();
        this.topbarColor = Config.topbarColor;
        this.webViewSrc = this._news.externalLink.trim();
        console.log("----------------"+this.webViewSrc);
        this.result = "";
        this.isLoading = true;
    }

    get news(): News {
        return this._news;
    }
}