import { assert } from "ts/core/Common";
import { DListItem } from "ts/design/DListItem";
import { VUIRect } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";
import { UIText } from "./UIText";

export class UIListItem extends VUIContainer {
    private _data: DListItem;
    public rmmzCommandIndex: number;

    public constructor(data: DListItem) {
        super();
        this._data = data;
        this.rmmzCommandIndex = 0;

        if (this._data.text !== undefined) {
            const text = new UIText(this._data.text);
            this.addLogicalChild(text);
        }
    }
    
    override arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
        const window = context.window as Window_Selectable;
        assert(window);
        
        for (const child of this.children()) {
            const rect = window.itemLineRect(this.itemIndex) as any;
            child.arrange(context, rect);
        }
        super.setActualRect(finalArea);
        return finalArea;
    }
    
}
