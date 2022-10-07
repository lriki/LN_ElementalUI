import { assert } from "ts/core/Common";
import { VUIRect, VUISize } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";

/**
 * Window_Selectable に準じた Item の配置を行うことを示す。
 */
export class UISelectableLayout extends VUIContainer {

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        for (const child of this.contentChildren()) {
            child.measure(context, constraint);
        }
        return this.measureBasicBorderBoxSize();
    }

    protected arrangeOverride(context: UIContext, contentSize: VUISize): VUISize {
        const window = context.currentWindow as Window_Selectable;
        assert(window);

        for (const child of this.contentChildren()) {
            const rect = window.itemRect(child.itemIndex) as any;
            child.arrange(context, {x: rect.x, y: rect.y, width: rect.width, height: rect.height});
        }
        return contentSize;
    }
}



