import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DWindow } from "ts/design/DWindow";
import { UISelectableLayout } from "./layout/UISelectableLayout";
import { VUIRect, VUISize } from "./UICommon";
import { VUIContainer } from "./UIContainer";
import { UIContext } from "./UIContext";
import { UIFrameLayout } from "./UIFrameLayout";

export class UIWindow extends VUIContainer {
    private _rmmzWindow: Window_Base | undefined;

    public constructor(design: DWindow) {
        super(design);
    }

    public get rmmzWindow(): Window_Base {
        assert(this._rmmzWindow)
        return this._rmmzWindow;
    }

    override findPIXIContainer(): PIXI.Container | undefined {
        if (this._rmmzWindow) {
            return this._rmmzWindow;
        }
        return super.findPIXIContainer();
    }
    
    public attachRmmzWindow(rmmzWindow: Window_Base): void {
        assert(!rmmzWindow._flexUIWindow);
        this._rmmzWindow = rmmzWindow;
        rmmzWindow._flexUIWindow = this;
        this.onSetRmmzRect(this.actualRect());
    }

    override measure(context: UIContext, size: VUISize): void {
        if (context.layoutInitialing) {
            // 子要素の masure 不要
        }
        else {
            const oldWindow = context.changeWindow(this._rmmzWindow);
            this.measureOverride(context, size);
            context.changeWindow(oldWindow);
        }
    }

    override arrange(context: UIContext, finalArea: VUIRect): VUIRect {
        if (context.layoutInitialing) {
            // 子要素の arrange 不要
            console.log("actualStyle", this.actualStyle);
            this.setActualRect(finalArea);
            return finalArea;
        }
        else {
            const oldWindow = context.changeWindow(this._rmmzWindow);
            const result = super.arrange(context, finalArea);
            context.changeWindow(oldWindow);
            return result;
        }
    }
    
    protected onSetRmmzRect(actualRect: VUIRect): void {
        if (this._rmmzWindow) {
            this._rmmzWindow.move(actualRect.x, actualRect.y, actualRect.width, actualRect.height);
        }
    }
}
