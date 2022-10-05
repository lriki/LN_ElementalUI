import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DWindow } from "ts/design/DWindow";
import { UISelectableLayout } from "../layout/UISelectableLayout";
import { VUIRect, VUISize } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";
import { VUIElement } from "../UIElement";
import { UIFrameLayout } from "../UIFrameLayout";

export class UIWindowBase extends VUIElement {
    private _rmmzWindow: Window_Base | undefined;
    private _defaultRect: VUIRect;

    public constructor(design: DWindow) {
        super(design);
        this._defaultRect = {x: 0, y: 0, width: 0, height: 0};
    }

    override dispose(): void {
        if (this._rmmzWindow) {
            this._rmmzWindow._flexUIWindow = undefined;
            this._rmmzWindow = undefined;
        }
        super.dispose();
    }

    public get rmmzWindow(): Window_Base {
        assert(this._rmmzWindow)
        return this._rmmzWindow;
    }

    public onSyncFromRmmzWindowContents(): void {
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

        // this._defaultRect = {
        //     x: this._rmmzWindow.x,
        //     y: this._rmmzWindow.y,
        //     width: this._rmmzWindow.width,
        //     height: this._rmmzWindow.height,
        // };

        // this.onSetRmmzRect(this.actualRect());
    }

    override updateStyle(context: UIContext): void {
        const oldWindow = context.changeWindow(this._rmmzWindow);
        super.updateStyle(context);
        context.changeWindow(oldWindow);
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
    
    override draw(context: UIContext): void {
        const oldWindow = context.changeWindow(this._rmmzWindow);
        super.draw(context);
        context.changeWindow(oldWindow);
    }

    protected onGetDefaultRect(): VUIRect {
        if (this._rmmzWindow) {
            return this._defaultRect;
        }
        else {
            return super.onGetDefaultRect();
        }
    }

    protected onSetRmmzRect(actualRect: VUIRect): void {
        if (this._rmmzWindow) {
            this._rmmzWindow.move(actualRect.x, actualRect.y, actualRect.width, actualRect.height);
        }
    }
}
