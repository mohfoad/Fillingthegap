import * as imagePicker from "nativescript-imagepicker";
import { Observable } from "tns-core-modules/data/observable";
import { Folder, knownFolders, path } from "tns-core-modules/file-system";
import { ImageAsset } from "tns-core-modules/image-asset";
import { fromAsset, ImageSource } from "tns-core-modules/image-source";

import { ObservableProperty } from "../../shared/observable-property-decorator";
import { News } from "../shared/news-model";
import { NewService } from "../shared/news-service";
import { RoundingValueConverter } from "./roundingValueConverter";
import { VisibilityValueConverter } from "./visibilityValueConverter";

const tempImageFolderName = "nsimagepicker";

export class NewsDetailEditViewModel extends Observable {
    static get imageTempFolder(): Folder {
        return knownFolders.temp().getFolder(tempImageFolderName);
    }

    private static clearImageTempFolder(): void {
        NewsDetailEditViewModel.imageTempFolder.clear();
    }

    @ObservableProperty() news: News;
    @ObservableProperty() isUpdating: boolean;

    private _roundingValueConverter: RoundingValueConverter;
    private _visibilityValueConverter: VisibilityValueConverter;
    private _isNewsImageDirty: boolean;
    private _NewService: NewService;

    constructor(news: News) {
        super();

        // get a fresh editable copy of news model
        this.news = new News(news);

        this.isUpdating = false;

        this._NewService = NewService.getInstance();
        this._isNewsImageDirty = false;

        // set up value converter to force iOS UISlider to work with discrete steps
        this._roundingValueConverter = new RoundingValueConverter();

        this._visibilityValueConverter = new VisibilityValueConverter();
    }

    get roundingValueConverter(): RoundingValueConverter {
        return this._roundingValueConverter;
    }

    get visibilityValueConverter(): VisibilityValueConverter {
        return this._visibilityValueConverter;
    }

    saveChanges(): Promise<any> {
        let queue = Promise.resolve();

        this.isUpdating = true;

        // TODO: news image should be required field
        if (this._isNewsImageDirty && this.news.imageUrl) {
            queue = queue
                .then(() => {
                    // no need to explicitly delete old image as upload to an existing remote path overwrites it
                })
                .then((uploadedFile: any) => {
                    this.news.imageUrl = uploadedFile.url;

                    this._isNewsImageDirty = false;
                });
        }

        return queue.then(() => {
            // return this._NewService.update(this.news);
        }).then(() => this.isUpdating = false)
            .catch((errorMessage: any) => {
                this.isUpdating = false;
                throw errorMessage;
            });
    }

    onImageAddRemove(): void {
        if (this.news.imageUrl) {
            this.handleImageChange(null);

            return;
        }

        NewsDetailEditViewModel.clearImageTempFolder();

        this.pickImage();
    }

    private pickImage(): void {
        const context = imagePicker.create({
            mode: "single"
        });

        context
            .authorize()
            .then(() => context.present())
            .then((selection) => selection.forEach(
                (selectedAsset: ImageAsset) => {
                    selectedAsset.options.height = 768;
                    fromAsset(selectedAsset)
                        .then((imageSource: ImageSource) => this.handleImageChange(imageSource));
                })
            ).catch((errorMessage: any) => console.log(errorMessage));
    }

    private handleImageChange(source: ImageSource): void {
        let raisePropertyChange = true;
        let tempImagePath = null;

        if (source) {
            tempImagePath = path.join(NewsDetailEditViewModel.imageTempFolder.path, `${Date.now()}.jpg`);
            raisePropertyChange = source.saveToFile(tempImagePath, "jpeg");
        }

        if (raisePropertyChange) {
            this.news.imageUrl = tempImagePath;
            this._isNewsImageDirty = true;
        }
    }
}
