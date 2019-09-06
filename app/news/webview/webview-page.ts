const Observable = require("tns-core-modules/data/observable").Observable;
const dialogs = require("tns-core-modules/ui/dialogs");
const webViewModule = require("tns-core-modules/ui/web-view");
import { topmost } from "tns-core-modules/ui/frame";
import { WebViewModel } from "./webview-model";
import { NavigatedData, Page } from "tns-core-modules/ui/page";

function onNavigatingTo(args) {
    if (args.isBackNavigation) {
        return;
    }

    const page = <Page>args.object;

    page.bindingContext = new WebViewModel(page.navigationContext);
}

function onWebViewLoaded(webargs) {
    const page = webargs.object.page;
    const vm = page.bindingContext;
    const webview = webargs.object;
    vm.set("result", "WebView is still loading...");
    vm.set("enabled", false);

    webview.on(webViewModule.WebView.loadFinishedEvent, (args) => {
        let message = "";
        if (!args.error) {
            message = `WebView finished loading of ${args.url}`;
        } else {
            message = `Error loading ${args.url} : ${args.error}`;
        }

        vm.set("isLoading", false);
        console.log(`WebView message - ${message}`);
    });
}

function goBack(args) {
    // const page = args.object.page;
    // const vm = page.bindingContext;
    // const webview = page.getViewById("detailNewsWebView");
    // if (webview.canGoBack) {
    //     webview.goBack();
    //     vm.set("enabled", true);
    // }
    topmost().goBack();
}


function goForward(args) {
    const page = args.object.page;
    const vm = page.bindingContext;
    const webview = page.getViewById("detailNewsWebView");
    if (webview.canGoForward) {
        webview.goForward();
    } else {
        vm.set("enabled", false);
    }
}

exports.onNavigatingTo = onNavigatingTo;
exports.onWebViewLoaded = onWebViewLoaded;
exports.goBack = goBack;
exports.goForward = goForward;