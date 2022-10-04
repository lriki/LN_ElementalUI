import { DElement } from "ts/design/DElement";
import { DListItem } from "ts/design/DListItem";
import { DWindow } from "ts/design/DWindow";
import { SceneDesign } from "ts/design/SceneDesign";
import { UIListItem } from "./elements/UIListItem";
import { VUIElement } from "./UIElement";
import { UIScene } from "./UIScene";
import { UIWindow } from "./UIWindow";

export class UIElementFactory {
    public createUIElement(element: DElement): VUIElement {
        if (element instanceof DListItem) {
            return new UIListItem(element);
        }
        else if (element instanceof DWindow) {
            return new UIWindow(element);
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

