const dialogsModule = require("ui/dialogs");
const frameModule = require("ui/frame");
const imageSource = require('image-source');
const platformModule = require("tns-core-modules/platform");
import { Observable } from "tns-core-modules/data/observable";
const imageSourceModule = require("tns-core-modules/image-source");
const fileSystemModule = require("tns-core-modules/file-system");
import { ObservableProperty } from "../shared/observable-property-decorator";
import {screen} from "platform";

import { Config } from "../shared/config";
import { login } from "tns-core-modules/ui/dialogs/dialogs";
import { config } from "rxjs";
import { Image } from "tns-core-modules/ui/image/image";
const base64 = require("base-64");
const localStorage = require("nativescript-localstorage");
import {MixpanelHelper} from "nativescript-mixpanel";
import {device} from "platform";

export class LoadViewModel extends Observable {
    public defaultPage: string;
    
    constructor() {
        super();
        Config.loginUser = localStorage.getItem("noticiasEmail");
        Config.loginPass = localStorage.getItem("noticiasPassword");
        Config.loginClientName = localStorage.getItem("noticiasUserName");
        Config.baseLogoPath = localStorage.getItem("noticiasLogoPath");
        Config.topbarColor = localStorage.getItem("noticiasLogoColor");

        MixpanelHelper.init("db0a4ad9a064ba09f292d19e9fce9e13");

        Config.deviceUUID = device.uuid;
        console.log("-----------"+Config.loginUser);
        if (Config.loginUser != null && Config.loginPass != null && Config.baseLogoPath != null) {
            interface iPerson {
                Email: string
            }
            var email = localStorage.getItem("noticiasEmail")
            var person: {[id: string]: iPerson} = {
                "mail": {Email: email}
            };
            MixpanelHelper.identify(device.uuid, person["mail"]);
            MixpanelHelper.addPushDeviceToken("593869998772");
            this.defaultPage = "menu/menu-page";
        }
        else {
            this.defaultPage = "login/login-page";
        }
    }

}
