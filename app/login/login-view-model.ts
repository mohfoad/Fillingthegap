const dialogsModule = require("ui/dialogs");
const frameModule = require("ui/frame");
const imageSource = require('image-source');
const platformModule = require("tns-core-modules/platform");
import { Observable } from "tns-core-modules/data/observable";
const imageSourceModule = require("tns-core-modules/image-source");
const fileSystemModule = require("tns-core-modules/file-system");
import { ObservableProperty } from "../shared/observable-property-decorator";
import {screen} from "platform";
import {MixpanelHelper} from "nativescript-mixpanel";
import { Config } from "../shared/config";
import { login } from "tns-core-modules/ui/dialogs/dialogs";
import { config } from "rxjs";
import { Image } from "tns-core-modules/ui/image/image";
const base64 = require("base-64");
const localStorage = require("nativescript-localstorage");
import {CFAlertDialog, DialogOptions,CFAlertGravity,
    CFAlertActionAlignment,
    CFAlertActionStyle,
    CFAlertStyle} from 'nativescript-cfalert-dialog';

let cfalertDialog = new CFAlertDialog();

export class LoginViewModel extends Observable {
    @ObservableProperty() isLoggingIn: boolean;
    @ObservableProperty() isRegistered: boolean;
    @ObservableProperty() userName: string;
    @ObservableProperty() email: string;
    @ObservableProperty() password: string;
    @ObservableProperty() confirmPassword: string;
    @ObservableProperty() userLogoPathName: string;
    @ObservableProperty() userLogoIcon: string;
    @ObservableProperty() logoImage: Image;
    @ObservableProperty() isLoading: boolean;
    @ObservableProperty() deviceInfo: string;

    constructor() {
        super();
        Config.screenWidth = screen.mainScreen.widthDIPs;
        this.userName = "";
        this.email = "a.herreralima@gmail.com";
        this.password = "123456";
        
        this.confirmPassword = "";
        this.userLogoPathName = "";
        this.isLoggingIn = true;
        this.isRegistered = false;
        this.isLoading = true;
        this.deviceInfo = platformModule.device.os;
        this.isCheckDeviceRegistered();
        var email = localStorage.getItem("noticiasEmail");
        var password = localStorage.getItem("noticiasPassword");
        var name = localStorage.getItem("noticiasUserName");
        var logoPath = localStorage.getItem("noticiasLogoPath");
        // if (email != null && password != null && logoPath != null){
        this.email = email;
        this.password = password;
        this.userName = name;
        Config.baseLogoPath = logoPath;
            //this.login();
        // }
    }

    toggleForm(): void {
        this.isLoggingIn = !this.isLoggingIn;
    }

    navigateMenuPage(): void {
        frameModule.getFrameById("topmost").navigate({
            moduleName: "menu/menu-page",
            context: {
                userID: this.email.trim()
            },
            transition: {
                name: "fade"
            }
        });
    }

    gotoNewsPage(): void {
        imageSourceModule.fromUrl(Config.baseLogoIconPath).then((res) => {
            const folderDest = fileSystemModule.knownFolders.currentApp();
            const pathDest = fileSystemModule.path.join(folderDest.path, "./images/logoUser.png");
            
            const saved = res.saveToFile(pathDest, "png");
            if (saved) { 
                console.log("+++++++++++++Image saved successfully!" + pathDest);
                //this.image =  imageSourceModule.fromFile(pathDest);
                this.navigateMenuPage();
                this.isLoading = false;
            }
        }).catch(err => {
            console.log("********image download fail"+err);
            this.navigateMenuPage();
            this.isLoading = false;
        });
    }

    submit(): void {
        // if (this.userName.trim() === "")
        // {
        //     alert("Please input your full name.");
        //     return;
        // }

        if (this.email == null || this.password == null) {
            // alert("Please provide both an email address and password.");
            let options: DialogOptions = {
                // Options go here
                dialogStyle: CFAlertStyle.ALERT,
                title: "",
                message: "Indíquenos su email y contraseña.",
            };
            cfalertDialog.show(options);
            
            return;
        }
        
        Config.loginPass = this.password.trim();

        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    isCheckDeviceRegistered(): void {
        const url = Config.BASE_URL + "checkDevice.php";
        const base64 = require("base-64");
        const headers = new Headers();
        
        headers.set("Content-Type", "application/json; charset=utf-8");
        headers.set("Authorization", "Basic " + base64.encode(Config.username + ":" + Config.password));
        
        fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "device": this.deviceInfo.trim(),
                    "uuid": Config.deviceUUID.trim()
                })
            })
        .then((response) => response.json())
        .then((json: string) => {
            if (json !== ("error occured")) {
                this.isRegistered = true;
            } else {
                this.isRegistered = false;
            }
        })
        .catch(err => {
            console.log("check registered device fail.");
        });
    }

    login(): void {
        const url = Config.BASE_URL + "login.php";
        const base64 = require("base-64");
        const headers = new Headers();
        Config.loginUser = this.email.trim();
        
        headers.set("Content-Type", "application/json; charset=utf-8");
        headers.set("Authorization", "Basic " + base64.encode(Config.username + ":" + Config.password));
        
        fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "email": this.email.trim(),
                    "password": this.password.trim(),
                    "device": this.deviceInfo.trim(),
                    "uuid": Config.deviceUUID.trim()
                })
            })
        .then((response) => response.json())
        .then((json: string) => {
            if (json !== ("error occured")) {
                
                var index = 0;
                for (const loop of json) {
                    if (loop == null) {
                        index++;
                        continue;
                    }
                    if (index == 0)
                        this.userLogoPathName = loop.trim();
                    else if (index == 1)
                        this.userLogoIcon = loop.trim();
                    else if (index == 2)
                        Config.topbarColor = loop.trim();
                    else if (index == 3)
                        this.userName = loop.trim();
                    index++;
                }
                
                Config.baseLogoPath = "https://newsletter-noticias.com" + this.userLogoPathName;
                Config.baseLogoIconPath = "https://newsletter-noticias.com" + this.userLogoIcon;
                Config.loginClientName = this.userName;
                this.addInfoToStorage();
                
                this.gotoNewsPage();
                interface iPerson {
                    Email: string
                }
                var person: {[id: string]: iPerson} = {
                    "mail": {Email: this.email.trim()}
                };
        
                MixpanelHelper.identify(Config.deviceUUID, person["mail"]);
                MixpanelHelper.addPushDeviceToken("593869998772");
            } else {
                // alert("Por favor introduzca el email registrado y la contraseña correctamente. Para cualquier consulta puede contactarnos en info@newsletter-noticias.com");
                let options: DialogOptions = {
                    // Options go here
                    dialogStyle: CFAlertStyle.ALERT,
                    title: "",
                    message: "Por favor introduzca el email registrado y la contraseña correctamente. Para cualquier consulta puede contactarnos en info@newsletter-noticias.com",
                };
                cfalertDialog.show(options);
            }
        })
        .catch(err => {
            console.log("Login Fail");
            // alert("Hay un error. El servidor no está respondiendo. Pruebe más tarde.");
            let options: DialogOptions = {
                // Options go here
                dialogStyle: CFAlertStyle.ALERT,
                title: "",
                message: "Hay un error. El servidor no está respondiendo. Pruebe más tarde.",
            };
            cfalertDialog.show(options);
        });
    }

    addInfoToStorage(): void {
        localStorage.setItem ("noticiasUserName", this.userName.trim());
        localStorage.setItem ("noticiasEmail", this.email.trim());
        localStorage.setItem ("noticiasPassword", this.password.trim());
        localStorage.setItem ("noticiasLogoPath", Config.baseLogoPath.trim());
        localStorage.setItem ("noticiasLogoIconPath", Config.baseLogoIconPath.trim());
        localStorage.setItem ("noticiasLogoColor", Config.topbarColor);
    }

    register(): void {
        if (this.password.trim() !== this.confirmPassword.trim()) {
            // alert("Your passwords do not match.");
            let options: DialogOptions = {
                // Options go here
                dialogStyle: CFAlertStyle.ALERT,
                title: "",
                message: "Sus contraseñas no coinciden.",
            };
            cfalertDialog.show(options);
            return;
        }

        const url = Config.BASE_URL + "register.php";

        const headers = new Headers();
        Config.loginUser = this.email.trim();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Basic " + base64.encode(Config.username + ":" + Config.password));
        fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "email": this.email.trim(),
                    "password": this.password.trim(),
                    "device": this.deviceInfo.trim(),
                    "uuid": Config.deviceUUID.trim()
                })
            })
        .then((response) => response.json())
        .then((json: any) => {
            console.log (json+"+++++");
            if (json !== ("error occured")) {
                if (json == "already exist")
                {
                    // alert("Your account already was registerd. Wait for admin review.")
                    ;
                    let options: DialogOptions = {
                        // Options go here
                        dialogStyle: CFAlertStyle.ALERT,
                        title: "",
                        message: "Su cuenta ya está registada. Recibirá por email la autorización de acceso",
                    };
                    cfalertDialog.show(options);
                }
                else {
                    // alert("Se ha registrado correctamente. Desde Administración verificaremos su cuenta y le enviaremos un email de confirmación para que pueda acceder a la App. Para cualquier consulta puede contactarnos en info@newsletter-noticias.com");
                    let options: DialogOptions = {
                        // Options go here
                        dialogStyle: CFAlertStyle.ALERT,
                        title: "",
                        message: "Se ha registrado correctamente. Desde Administración verificaremos su cuenta y le enviaremos un email de confirmación para que pueda acceder a la App. Para cualquier consulta puede contactarnos en info@newsletter-noticias.com",
                    };
                    cfalertDialog.show(options);
                }
                this.isRegistered = true;
                this.isLoggingIn = true;
                this.addInfoToStorage();
                interface iPerson {
                    Email: string
                }
                var person: {[id: string]: iPerson} = {
                    "mail": {Email: this.email.trim()}
                };
        
                MixpanelHelper.identify(Config.deviceUUID, person["mail"]);
                MixpanelHelper.addPushDeviceToken("593869998772");
            } else {
                // alert("Fail to register your account. Please enter your email and password correctly!");
                let options: DialogOptions = {
                    // Options go here
                    dialogStyle: CFAlertStyle.ALERT,
                    title: "",
                    message: "Ha habido un error al registrar su cuenta. Por favor teclee su email y contraseña correctamente.",
                };
                cfalertDialog.show(options);
            }
        });
    }

    forgotPassword(): void {
        dialogsModule.prompt({
            title: "Forgot Password",
            message: "",
            inputType: "email",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        });
    }
}
