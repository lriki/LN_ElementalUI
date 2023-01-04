import { DCommandWindow } from "ts/design/DCommandWindow";
import { DElement } from "ts/design/DElement";
import { DIcon } from "ts/design/DIcon";
import { DImage } from "ts/design/DImage";
import { DListItem } from "ts/design/DListItem";
import { DText } from "ts/design/DText";
import { DWindow } from "ts/design/DWindow";
import { DAccordionLayout } from "ts/design/layout/DAccordionLayout";
import { DGridLayout } from "ts/design/layout/DGridLayout";
import { DStackLayout } from "ts/design/layout/DStackLayout";
import { SceneDesign } from "ts/design/SceneDesign";
import { UIImage } from "./components/UIImage";
import { UIICon } from "./components/UIIon";
import { UIListItem } from "./components/UIListItem";
import { UIText } from "./components/UIText";
import { UIAccordionLayout } from "./layout/UIAccordionLayout";
import { UIGridLayout } from "./layout/UIGridLayout";
import { UIStackLayout } from "./layout/UIStackLayout";
import { VUIElement } from "./UIElement";
import { UIScene } from "./UIScene";
import { UICommandWindow } from "./windows/UICommandWindow";
import { UIWindow } from "./windows/UIWindow";
import { UIWindowBase } from "./windows/UIWindowBase";

export class UIElementFactory {
    public createUIElement(design: DElement): VUIElement {
        if (design instanceof DText) {
            return new UIText(design);
        }
        else if (design instanceof DImage) {
            return new UIImage(design);
        }
        else if (design instanceof DIcon) {
            return new UIICon(design);
        }
        else if (design instanceof DListItem) {
            return new UIListItem(design);
        }
        else if (design instanceof DStackLayout) {
            return new UIStackLayout(design);
        }
        else if (design instanceof DGridLayout) {
            return new UIGridLayout(design);
        }
        else if (design instanceof DAccordionLayout) {
            return new UIAccordionLayout(design);
        }
        else if (design instanceof DCommandWindow) {
            return new UICommandWindow(design);
        }
        else if (design instanceof DWindow) {
            return new UIWindow(design);
        }
        throw new Error("Not implemented");
    }

    
    public instantiateScene(design: SceneDesign | undefined): UIScene {
        if (design) {
            const scene = new UIScene(design);
            for (const child of design.contents) {
                scene.addLogicalChild(this.instantiateElement(child));
            }
            return scene;
        }
        else {
            // Create empty scene.
            const design = new SceneDesign({});
            const scene = new UIScene(design);
            return scene;
        }
    }

    public instantiateElement(design: DElement): VUIElement {
        const element = this.createUIElement(design);
        for (const child of design.contents) {
            element.addLogicalChild(this.instantiateElement(child));
        }
        return element;
    }
}

