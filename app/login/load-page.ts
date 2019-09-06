import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { LoadViewModel } from "./load-view-model";

const loadViewModel = new LoadViewModel();

export function pageDefineLoaded(args: NavigatedData): void {
    console.log("LoadViewModel^^^^^^^^^^^^^^");
    const page = <Page>args.object;
    page.bindingContext = loadViewModel;
}
