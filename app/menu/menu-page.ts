import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { topmost } from "tns-core-modules/ui/frame";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { MenuViewModel } from "./menu-view-model";
import { Config } from "../shared/config";
import { NewsListViewModel } from '../news/news-list-view-model';

const frameModule = require("ui/frame");

export function onLoaded(args: NavigatedData): void {
    const page = <Page>args.object;
    let viewModel = <MenuViewModel>page.bindingContext;
    var userID = Config.loginUser;
    
    if (!args.isBackNavigation) {
        viewModel = new MenuViewModel();
        page.bindingContext = viewModel;
    }
    viewModel.load(userID);
}

export function onNavigatingTo(args: NavigatedData): void {
    const page = <Page>args.object;
    let viewModel = <MenuViewModel>page.bindingContext;
    var userID = Config.loginUser;

    if (!args.isBackNavigation) {
        viewModel = new MenuViewModel();
        page.bindingContext = viewModel;
    }

    viewModel.load(userID);
}

export function onNavigatingFrom(args: NavigatedData): void {
    const page = <Page>args.object;
    let viewModel = <MenuViewModel>page.bindingContext;
    var userID = Config.loginUser;

    if (!args.isBackNavigation) {
        viewModel = new MenuViewModel();
        page.bindingContext = viewModel;
    }

    viewModel.load(userID);
    const nlv = <NewsListViewModel>Config.gNewsModel;
    nlv.load();
}

export function onNativatedTap(args: EventData): void {
    const page = <GridLayout>args.object;
    const componentRoute = page.get("route");
    const componentTitle = page.get("title");
    
    const view = frameModule.getFrameById("topmost");
    if (componentTitle != "Comunidades Autónomas")
    {
        Config.userLimitedCategory = componentTitle;
        if (componentTitle == "Portada")
            Config.userLimitedCategory = "*";
        view.navigate({
            moduleName: componentRoute,
            context: {
                userID: Config.loginUser
            },
            transition: {
                name: "fade"
            }
        });
        const drawerComponent = <RadSideDrawer>view.getViewById("sideDrawer");
        drawerComponent.closeDrawer();
    }
    else {
        var menuModel: MenuViewModel = <MenuViewModel>Config.gMenuModel;
        menuModel.favoriteToggle();
    }
}


