import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DWindow } from "ts/design/DWindow";
import { UISelectableLayout } from "../layout/UISelectableLayout";
import { VUIRect, VUISize } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";
import { VUIElement } from "../UIElement";
import { UIFrameLayout } from "../UIFrameLayout";
import { UIScene } from "../UIScene";
import { UIHAlignment, UIVAlignment } from "../utils/UILayoutHelper";

export class UIWindowBase extends VUIContainer {
    private _rmmzWindow: Window_Base | undefined;
    private _defaultRect: VUIRect;


    public constructor(design: DWindow) {
        super(design);
        this.actualStyle.defaultHorizontalAlignment = UIHAlignment.Left;
        this.actualStyle.defaultVerticalAlignment = UIVAlignment.Top;
        this._defaultRect = {x: 0, y: 0, width: 0, height: 0};
    }

    override dispose(): void {
        if (this._rmmzWindow) {
            this._rmmzWindow._flexUIWindow = undefined;
            this._rmmzWindow = undefined;
        }
        super.dispose();
    }

    //--------------------------------------------------------------------------
    // Rmmz Window integration.

    public createRmmzWindowIfNeeded(scene: UIScene): void {
        if (this._rmmzWindow) return;
        // この rect はダミー。
        // onLayoutFixed() で正しい値に更新される。
        const rect = new Rectangle(0, 0, 100, 100);
        this._rmmzWindow = this.onCreateRmmzWindow(rect);
        this._rmmzWindow._flexUIWindow = this;
        scene.owner.addWindow(this._rmmzWindow);
    }

    protected onCreateRmmzWindow(rect: Rectangle): Window_Base {
        return new Window_Base(rect);
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
    }


    //--------------------------------------------------------------------------

    override _updateStyleHierarchical(context: UIContext): void {
        const oldWindow = context.changeWindow(this._rmmzWindow);
        super._updateStyleHierarchical(context);
        context.changeWindow(oldWindow);
    }

    override measure(context: UIContext, size: VUISize): void {
        if (context.layoutInitialing) {
            // 子要素の masure 不要
        }
        else {
            const oldWindow = context.changeWindow(this._rmmzWindow);
            super.measure(context, size);
            context.changeWindow(oldWindow);
        }
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        const baseSize = super.measureOverride(context, constraint);

        if (this._rmmzWindow) {
            // this の desiredSize は、 Design で指定されたサイズがあればそれを使い、そうでなければ RMMZ デフォルトのを使う。
            const size = {
                width: this.actualStyle.width ?? this._rmmzWindow.width,
                height: this.actualStyle.height ?? this._rmmzWindow.height,
            };
            return size;
        }
        else {
            return baseSize;
        }
    }

    override arrange(context: UIContext, finalArea: VUIRect): void {
        if (context.layoutInitialing) {
            // 子要素の arrange 不要
            this.setActualRect(finalArea);
        }
        else {
            const oldWindow = context.changeWindow(this._rmmzWindow);
            super.arrange(context, finalArea);
            context.changeWindow(oldWindow);
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

    public updateCombinedVisualRectHierarchical(context: UIContext, parentCombinedVisualRect: VUIRect): void {
        this.updateCombinedVisualRect(context, parentCombinedVisualRect);

        // 以下子要素の原点は this の左上になるようにする。
        const combinedVisualRect = this.getCombinedVisualRect();
        const rect = { x: 0, y: 0, width: combinedVisualRect.width, height: combinedVisualRect.height };
        for (const child of this.visualChildren) {
            child.updateCombinedVisualRectHierarchical(context,  rect);
        }
    }

    // override updateCombinedVisualRect(context: UIContext, parentCombinedVisualRect: VUIRect): void {
    //     super.updateCombinedVisualRect(context, parentCombinedVisualRect);
    //     if (this._rmmzWindow) {
    //         const srcRect = this.getCombinedVisualRect();
    //         const rmmzWindow = this._rmmzWindow;
    //         const newRect = {
    //             x: 0,
    //             y: 0,
    //             width: srcRect.width,
    //             height: srcRect.height,
    //         };
    //         this.setCombinedVisualRect(newRect);
    //     }
    // }
    
    // protected updateCombinedVisualRectOverride(context: UIContext, parentCombinedVisualRect: VUIRect): VUIRect {

    // }

    // protected onSetRmmzRect(actualRect: VUIRect): void {
    //     if (this._rmmzWindow) {
    //         this._rmmzWindow.move(actualRect.x, actualRect.y, actualRect.width, actualRect.height);
    //     }
    // }

    override onLayoutFixed(context: UIContext, combinedVisualRect: VUIRect): void {
        if (this._rmmzWindow) {
            this._rmmzWindow.move(combinedVisualRect.x, combinedVisualRect.y, combinedVisualRect.width, combinedVisualRect.height);
        }
    }
}
