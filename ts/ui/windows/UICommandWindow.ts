import { assert } from "ts/core/Common";
import { DCommandWindow } from "ts/design/DCommandWindow";
import { UICommandItem } from "../elements/UICommandItem";
import { UISelectableItem } from "../elements/UISelectableItem";
import { UIWindow } from "./UIWindow";

export interface RmmzCommandItem {
    name: string;
    symbol: string;
    enabled: boolean;
    ext: any;
}

export class UICommandWindow extends UIWindow {

    constructor(design: DCommandWindow) {
        super(design);
    }

    public addCommandItem(data: RmmzCommandItem, index: number): void {
        const item = this.design.props.itemTemplate;
        assert(item);

        const uiItem = new UICommandItem(item);
        this.addSelectableItem(uiItem);
    }
}

