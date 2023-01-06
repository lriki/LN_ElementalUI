import { assert } from "ts/core/Common";
import { DCommandItem } from "ts/design/DCommandItem";
import { DCommandWindow } from "ts/design/DCommandWindow";
import { DStaticText } from "ts/design/DStaticText";
import { UICommandItem } from "../components/UICommandItem";
import { UISelectableItem } from "../components/UISelectableItem";
import { UIStaticText } from "../components/UIStaticText";
import { UIWindow } from "./UIWindow";

export interface RmmzCommandItem {
    name: string;
    symbol: string;
    enabled: boolean;
    ext: any;
}

export class UICommandWindow extends UIWindow {
    public readonly design: DCommandWindow;

    constructor(design: DCommandWindow) {
        super(design);
        this.design = design;
    }

    override onSyncFromRmmzWindowContents(): void {
        const rmmzWindow = this.rmmzWindow as Window_Command;
        assert(rmmzWindow);
        this.clearSelectableItems();
        for (let i = 0; i < rmmzWindow._list.length; i++) {
            const command = rmmzWindow._list[i];
            this.addCommandItem(command, i);
        }
    }

    public addCommandItem(data: RmmzCommandItem, index: number): void {
        const template = this.design.props.itemTemplate;
        assert(template);
        const design = template.clone() as DCommandItem;
        design.props.text = data.name;
        design.props.symbol = data.symbol;
        design.props.enabled = data.enabled;
        const uiItem = new UICommandItem(design);
        
        if (design.contents.length > 0) {
            throw new Error("not implemented");
        }
        else {
            const textDesign = new DStaticText({text: data.name});
            const text = new UIStaticText(textDesign);
            uiItem.addLogicalChild(text);
        }
        
        this.addSelectableItem(uiItem);
    }
}

