import { Observable } from "tns-core-modules/data/observable";

import { ObservableProperty } from "../../shared/observable-property-decorator";

import { Config } from "../../shared/config";

export class News extends Observable {
    @ObservableProperty() imageUrl: string;
    @ObservableProperty() title: string;
    @ObservableProperty() subtitle: string;
    @ObservableProperty() date: string;
    @ObservableProperty() externalLink: string;
    @ObservableProperty() categoryName: string;
    @ObservableProperty() dateColor: string;
    @ObservableProperty() newSameDate: string;

    constructor(options: any) {
        super();
        this.imageUrl = Config.baseImagePath + options[0];
        this.title = JSON.parse(options[1]);
        this.subtitle = JSON.parse(options[2]);
        this.date = this.dateFormat(options[3]);
        this.externalLink = JSON.parse(options[5]);
        this.categoryName = JSON.parse(options[4]);
        this.dateColor = Config.topbarColor;
        this.newSameDate = options[6];
    }

    dateFormat(oldDate: any): any {
        var temp = new String(oldDate);
        var split = temp.split("-", 3);
        var ret = "";
        ret = split[2] + "/" + split[1] + "/" + split[0];
        return ret;
    }
}
