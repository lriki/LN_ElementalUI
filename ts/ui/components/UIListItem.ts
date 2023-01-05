import { assert } from "ts/core/Common";
import { DListItem } from "ts/design/DListItem";
import { DStaticText } from "ts/design/DText";
import { VUIRect, VUISize } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";
import { UIStaticText } from "./UIStaticText";

export class UIListItem extends VUIContainer {
    private _design: DListItem;
    public rmmzCommandIndex: number;

    public constructor(design: DListItem) {
        super(design);
        this._design = design;
        this.rmmzCommandIndex = 0;

        if (this._design.text !== undefined) {
            const textDesign = new DStaticText({text: this._design.text});
            const text = new UIStaticText(textDesign);
            this.addLogicalChild(text);
        }
    }
    
    protected arrangeOverride(context: UIContext, borderBoxSize: VUISize): VUISize {
        const window = context.currentWindow as Window_Selectable;
        assert(window);
        
        for (const child of this.contentChildren()) {
            const rect = window.itemLineRect(this.itemIndex) as any;
            child.arrange(context, rect);
        }
        return borderBoxSize;
    }
    
}
