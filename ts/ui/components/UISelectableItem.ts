import { assert } from "ts/core/Common";
import { DListItem } from "ts/design/DListItem";
import { DSelectableItem } from "ts/design/DSelectableItem";
import { DStaticText } from "ts/design/DText";
import { VUIRect, VUISize } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";
import { UIStaticText } from "./UIStaticText";

export class UISelectableItem extends VUIContainer {
    private _design: DSelectableItem;
    public rmmzCommandIndex: number;

    public constructor(design: DSelectableItem) {
        super(design);
        this._design = design;
        this.rmmzCommandIndex = 0;

        // if (this._design.text !== undefined) {
        //     const textDesign = new DText({text: this._design.text});
        //     const text = new UIText(textDesign);
        //     this.addLogicalChild(text);
        // }
    }
    
    // protected arrangeOverride(context: UIContext, contentSize: VUISize): VUISize {
    //     const window = context.currentWindow as Window_Selectable;
    //     assert(window);
        
    //     for (const child of this.children()) {
    //         const rect = window.itemLineRect(this.itemIndex) as any;
    //         child.arrange(context, rect);
    //     }
    //     return contentSize;
    // }
    
}
