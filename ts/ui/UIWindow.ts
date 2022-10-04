import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DWindow } from "ts/design/DWindow";
import { UISelectableLayout } from "./layout/UISelectableLayout";
import { VUIRect, VUISize } from "./UICommon";
import { VUIContainer } from "./UIContainer";
import { UIContext } from "./UIContext";
import { UIFrameLayout } from "./UIFrameLayout";

export class UIWindow extends VUIContainer {
    private _window: Window_Base | undefined;

    public constructor(design: DWindow) {
        super();
    }

    public get window(): Window_Base {
        assert(this._window)
        return this._window;
    }
    
    override measure(context: UIContext, size: VUISize): void {
        const oldWindow = context.changeWindow(this._window);
        this.measureOverride(context, size);
        context.changeWindow(oldWindow);
    }

    override arrange(context: UIContext, finalArea: VUIRect): VUIRect {
        const oldWindow = context.changeWindow(this._window);
        const result = super.arrange(context, finalArea);
        context.changeWindow(oldWindow);
        return result;
    }
    
}
