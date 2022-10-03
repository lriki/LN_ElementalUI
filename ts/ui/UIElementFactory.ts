import { DElement } from "ts/design/DElement";
import { DListItem } from "ts/design/DListItem";
import { UIListItem } from "./elements/UIListItem";
import { VUIElement } from "./UIElement";

export class UIElementFactory {
    public createUIElement(element: DElement): VUIElement {
        if (element instanceof DListItem) {
            return new UIListItem(element);
        }
        throw new Error("Not implemented");
    }
}

