import { assert } from "ts/core/Common";
import { VUIRect, VUISize } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";

/**
 * Window_Selectable に準じた Item の配置を行うことを示す。
 */
export class UISelectableLayout extends VUIContainer {

    override measureOverride(context: UIContext, constraint: VUISize): void {
        for (const child of this.children()) {
            child.measure(context, constraint);
        }
    }

    override arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
        const window = context.window as Window_Selectable;
        assert(window);

        for (const child of this.children()) {
            const rect = window.itemRect(child.itemIndex) as any;
            child.arrange(context, {x: rect.x, y: rect.y, width: rect.width, height: rect.height});
        }
        this.setActualRect(finalArea);
        return finalArea;
    }
}



