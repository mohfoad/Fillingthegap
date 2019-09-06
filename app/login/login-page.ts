import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { LoginViewModel } from "./login-view-model";

const loginViewModel = new LoginViewModel();

export function pageLoaded(args: NavigatedData): void {
    const page = <Page>args.object;
    page.bindingContext = loginViewModel;
}

export function onNavigatingTo(args: NavigatedData): void {
    const page = <Page>args.object;
    let viewModel = <LoginViewModel>page.bindingContext;
    if (!args.isBackNavigation) {
        viewModel = new LoginViewModel();
        page.bindingContext = viewModel;
    }
}
