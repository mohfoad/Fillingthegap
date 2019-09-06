import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";

import { ListViewEventData } from "nativescript-ui-listview";
import { topmost } from "tns-core-modules/ui/frame";

import { NewsListViewModel } from "./news-list-view-model";
import { News } from "./shared/news-model";

import { Config } from '../shared/config';
import { MenuViewModel } from '../menu/menu-view-model';

const frameModule = require("ui/frame");

export function onNavigatingTo(args: NavigatedData): void {
    const page = <Page>args.object;
    let viewModel = <NewsListViewModel>page.bindingContext;
    if (!args.isBackNavigation) {
        viewModel = new NewsListViewModel();
        page.bindingContext = viewModel;
    }
    Config.gNewsModel = viewModel;
    viewModel.load();
}

export function onNavigatingFrom(args: NavigatedData): void {
    const page = <Page>args.object;
    const oldViewModel = <NewsListViewModel>page.bindingContext;
    if (oldViewModel) {
        oldViewModel.unload();
    }
}

export function onDrawerButtonTap(args: EventData) {
    const view = frameModule.getFrameById("topmost");
    const drawerComponent = <RadSideDrawer>view.getViewById("sideDrawer");
    if (drawerComponent !== undefined) {
        var menuModel: MenuViewModel = <MenuViewModel>Config.gMenuModel;
        menuModel.setFavoriteToggle();
        drawerComponent.showDrawer();
    }
}

export function onUserButtonTap(args: EventData) {
    topmost().navigate({
        moduleName: "userinfo/info-page",
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
}

export function onNewsItemTap(args: ListViewEventData): void {
    const tappedNewsItem = <News>args.view.bindingContext;

    topmost().navigate({
        moduleName: "news/news-detail-page/news-detail-page",
        context: tappedNewsItem,
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
}
