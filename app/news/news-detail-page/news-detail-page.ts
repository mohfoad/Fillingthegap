import { topmost } from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "tns-core-modules/ui/page";

import { NewsDetailViewModel } from "./news-detail-view-model";
import { WebViewModel } from "../webview/webview-model";

export function onNavigatingTo(args: NavigatedData): void {
    if (args.isBackNavigation) {
        return;
    }

    const page = <Page>args.object;

    page.bindingContext = new NewsDetailViewModel(page.navigationContext);
}

export function onBackButtonTap(): void {
    topmost().goBack();
}

export function onEditButtonTap(args): void {
    const bindingContext = <NewsDetailViewModel>args.object.bindingContext;

    topmost().navigate({
        moduleName: "news/news-detail-edit-page/news-detail-edit-page",
        context: bindingContext.news,
        animated: true,
        transition: {
            name: "slideTop",
            duration: 200,
            curve: "ease"
        }
    });
}

export function onUrlTap(args): void {
    const bindingContext = <NewsDetailViewModel>args.object.bindingContext;
    if (bindingContext.news.externalLink.trim() == "")
        return;
    topmost().navigate({
        moduleName: "news/webview/webview-page",
        context: bindingContext.news,
        animated: true,
        transition: {
            name: "slideTop",
            duration: 200,
            curve: "ease"
        }
    });
}
