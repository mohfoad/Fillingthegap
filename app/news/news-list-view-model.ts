import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { Observable } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
const imageSourceModule = require("tns-core-modules/image-source");
import { ObservableProperty } from "../shared/observable-property-decorator";
import { News } from "./shared/news-model";
import { NewService } from "./shared/news-service";
import { Config } from '../shared/config';

export class NewsListViewModel extends Observable {
    @ObservableProperty() news: ObservableArray<News>;
    @ObservableProperty() isLoading: boolean;
    @ObservableProperty() username: string;
    @ObservableProperty() userLogo: string;
    @ObservableProperty() topbarColor: string;
    @ObservableProperty() imgWidth: number;
    @ObservableProperty() imgHeight: number;
    @ObservableProperty() logoImage: string;

    private _NewService: NewService;
    private _dataSubscription: Subscription;

    constructor() {
        super();
        this.topbarColor = Config.topbarColor;
        this.news = new ObservableArray<News>([]);
        this.isLoading = false;
        this.username = Config.loginClientName;
        this.imgWidth = Config.screenWidth * 2 / 10;
        this.imgHeight = this.imgWidth;
        this._NewService = NewService.getInstance();
    }

    load(): void {
        this.topbarColor = Config.topbarColor;
        if (!this._dataSubscription) {
            this.isLoading = true;
            this._dataSubscription = this._NewService.load()
                .pipe(finalize(() => {
                    this.isLoading = false;
                }))
                .subscribe((news: Array<News>) => {
                    this.news = new ObservableArray(news);
                    this.isLoading = false;
                });
        }
    }

    unload(): void {
        this.topbarColor = Config.topbarColor;
        if (this._dataSubscription) {
            this._dataSubscription.unsubscribe();
            this._dataSubscription = null;
        }
    }
}
