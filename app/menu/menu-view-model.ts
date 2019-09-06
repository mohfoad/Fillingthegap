import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { ObservableProperty } from "../shared/observable-property-decorator";
import { SelectedPageService } from "../shared/selected-page-service";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
const frameModule = require("ui/frame");
import { Config } from "../shared/config";
import { categories } from "tns-core-modules/trace/trace";

export class MenuViewModel extends Observable {
    @ObservableProperty() selectedPage: string;
    @ObservableProperty() categories: ObservableArray<DataItem>;
    @ObservableProperty() isLoading: boolean;
    @ObservableProperty() userName: string;
    @ObservableProperty() Email: string;
    @ObservableProperty() logoPath: string;
    @ObservableProperty() topbarColor: string;
    @ObservableProperty() itemsRegion: ObservableArray<DataItem>;
    @ObservableProperty() isFavoriteToggle: boolean;
    

    constructor() {
        super();
        this.logoPath = Config.baseLogoPath;
        this.topbarColor = Config.topbarColor;
        SelectedPageService.getInstance().selectedPage$
        .subscribe((selectedPage: string) => this.selectedPage = selectedPage);
        this.categories = new ObservableArray<DataItem>([]);
        this.itemsRegion = new ObservableArray<DataItem>([]);
        this.isLoading = false;
        this.isFavoriteToggle = false;
    }

    load(userID): void {
        this.userName = Config.loginClientName; // to show in drill-down menu
        this.Email = Config.loginUser; // to show in drill-down menu
        /* sync with app server */
        this.isLoading = true;
        const base64 = require("base-64");

        const url = Config.BASE_URL + "getCategoriesByID.php";

        const headers = new Headers();
        
        headers.set("Content-Type", "application/json; charset=utf-8");
        headers.set("Authorization", "Basic " + base64.encode(Config.username + ":" + Config.password));
        
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                "userID": userID
            })
        })
        .then((response) => response.json())
        .then((json: any) => {
            if (this.categories.length > 0)
            {
                this.categories.splice(0);
                this.itemsRegion.splice(0);
            }
            var isAddedRegion: boolean = false;
            this.categories.push(new DataItem("-1,Portada", this.isFavoriteToggle));
            this.itemsRegion.push(new DataItem("-1,Portada", !this.isFavoriteToggle));
            
            for (const loop of json) {
                var temp:String = String(loop);
                if (loop == null || temp.length < 3) {
                    continue;
                }
                if (this.hasRegionCategory(loop) && !isAddedRegion)
                {
                    this.categories.push(new DataItem("0,Comunidades Autónomas", this.isFavoriteToggle));
                    this.itemsRegion.push(new DataItem("0,Comunidades Autónomas", !this.isFavoriteToggle));
                    isAddedRegion = true;
                }
                this.categories.push (new DataItem(loop, this.isFavoriteToggle));
                this.itemsRegion.push (new DataItem(loop, !this.isFavoriteToggle));
            }
            this.isLoading = false;
        })
        .catch (err => {
            //this.test();
            this.isLoading = false;
        });
        Config.gMenuModel = this;
        /* end */
    }

    hasRegionCategory(loop: any): any {
        var ret:boolean = false;
        var temp = new String(loop);
        var split = temp.split(",", 2);
        if (this.isRegion(split[0]))
        {
            ret = true;
        }
        return ret;
    }

    favoriteToggle(): void {
        this.isFavoriteToggle = !this.isFavoriteToggle;
        if (this.categories.length > 0)
        {
            var temp: any = this.categories;
            this.categories = this.itemsRegion;
            this.itemsRegion = temp;
            Config.gMenuModel = this;
        }
    }

    isRegion(id: string): boolean {
        for (const loop of Config.arrayRegion) {
            if (id == loop)
                return true;
            else
                continue;
        }
        return false;
    }

    setFavoriteToggle() :void {
        if (this.isFavoriteToggle)
            this.favoriteToggle();
    }
}

export class DataItem {
    public itemName: string;
    public collapsed: boolean;
    public real: boolean;
    public favText: string;
    public backColor: string;
    constructor(name: string, isFavorite: boolean) {
        var temp = new String(name);
        var split = temp.split(",", 2);
        this.itemName = split[1];
        this.real = this.isRegion(split[0]);
        this.collapsed = this.isRegion(split[0]) && !isFavorite;
        this.backColor = Config.topbarColor;
        if (isFavorite)
            this.favText = "一";
        else
            this.favText = "十";
    }
    isRegion(id: string): boolean {
        for (const loop of Config.arrayRegion) {
            if (id == loop)
                return true;
            else
                continue;
        }
        return false;
    }
}
