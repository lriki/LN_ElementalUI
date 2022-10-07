import { DCommandWindow } from "ts/design/DCommandWindow";
import { DElement } from "ts/design/DElement";
import { DListItem } from "ts/design/DListItem";
import { DText } from "ts/design/DText";
import { DWindow } from "ts/design/DWindow";
import { SceneDesign } from "ts/design/SceneDesign";
import { UIListItem } from "./elements/UIListItem";
import { UIText } from "./elements/UIText";
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
        else if (design instanceof DListItem) {
            return new UIListItem(design);
        }
        else if (design instanceof DCommandWindow) {
            return new UICommandWindow(design);
        }
        else if (design instanceof DWindow) {
            return new UIWindow(design);
        }
        throw new Error("Not implemented");
    }

    
    public instantiateScene(design: SceneDesign): UIScene {
        const scene = new UIScene(design);
        for (const child of design.children) {
            scene.addLogicalChild(this.instantiateElement(child));
        }

        return scene;
    }

    public instantiateElement(design: DElement): VUIElement {
        const element = this.createUIElement(design);
        for (const child of design.children) {
            element.addLogicalChild(this.instantiateElement(child));
        }
        return element;
    }
}

