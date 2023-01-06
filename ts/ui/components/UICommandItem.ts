import { assert } from "ts/core/Common";
import { DCommandItem } from "ts/design/DCommandItem";
import { DListItem } from "ts/design/DListItem";
import { DStaticText } from "ts/design/DStaticText";
import { VUIRect } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";
import { VUIElement } from "../UIElement";
import { UISelectableItem } from "./UISelectableItem";
import { UIStaticText } from "./UIStaticText";

export class UICommandItem extends UISelectableItem {
    //private _design: DCommandItem;
    public rmmzCommandIndex: number;

    public constructor(design: DCommandItem) {
        super(design);
        //this._design = design;
        this.rmmzCommandIndex = 0;

        // if (this._design.text !== undefined) {
        //     const textDesign = new DText({text: this._design.text});
        //     const text = new UIText(textDesign);
        //     this.addLogicalChild(text);
        // }
    }
    
    // override arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
    //     const window = context.currentWindow as Window_Selectable;
    //     assert(window);
        
    //     for (const child of this.children()) {
    //         const rect = window.itemLineRect(this.itemIndex) as any;
    //         child.arrange(context, rect);
    //     }
    //     super.setActualRect(finalArea);
    //     return finalArea;
    // }
    
}
