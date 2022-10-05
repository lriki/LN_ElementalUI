import { assert } from "ts/core/Common";
import { DCommandWindow } from "ts/design/DCommandWindow";
import { VUIRect } from "./UICommon";
import { UIContext } from "./UIContext";
import { UIWindow } from "./UIWindow";

/**
 * Window_Selectable に対応する UIElement.
 * 
 * LogicalChildren のレイアウトは Window_Selectable のメソッドを利用して行われる。
 */
export class UISelectableWindow extends UIWindow {

    public readonly design: DCommandWindow;

    constructor(design: DCommandWindow) {
        super(design);
        this.design = design;
    }

    override arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
        const window = context.currentWindow as Window_Selectable;
        assert(window);

        for (const child of this.children()) {
            const rect = window.itemRect(child.itemIndex) as any;
            child.arrange(context, {x: rect.x, y: rect.y, width: rect.width, height: rect.height});
        }
        this.setActualRect(finalArea);
        return finalArea;
    }
}

