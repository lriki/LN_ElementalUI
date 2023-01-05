import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DWindow } from "ts/design/DWindow";
import { UISelectableLayout } from "../layout/UISelectableLayout";
import { VUIRect, VUISize } from "../UICommon";
import { VUIContainer } from "../UIContainer";
import { UIContext } from "../UIContext";
import { UIInvalidateFlags, VUIElement } from "../UIElement";
import { UIFrameLayout } from "../UIFrameLayout";
import { UIScene } from "../UIScene";
import { UIHAlignment, UIVAlignment } from "../utils/UILayoutHelper";

export class UIWindowBase extends VUIContainer {
    public readonly design: DWindow;
    private _rmmzWindow: Window_Base | undefined;
    private _userWindow: boolean;
    private _defaultRect: VUIRect;
    private _refreshFunc: (() => void) | undefined;


    public constructor(design: DWindow) {
        super(design);
        this.design = design;
        this.actualStyle.defaultHorizontalAlignment = UIHAlignment.Left;
        this.actualStyle.defaultVerticalAlignment = UIVAlignment.Top;
        this._userWindow = false;
        this._defaultRect = {x: 0, y: 0, width: 0, height: 0};
    }

    override dispose(): void {
        if (this._rmmzWindow) {
            if (this._userWindow) {
                this._rmmzWindow.parent.removeChild(this._rmmzWindow);
            }
            this._rmmzWindow._flexUIWindow = undefined;
            this._rmmzWindow = undefined;
        }
        super.dispose();
    }

    //--------------------------------------------------------------------------
    // Rmmz Window integration.

    // Window_Base がアタッチされていない場合、新しい Window_Base を作成する。
    public createUserRmmzWindowIfNeeded(scene: UIScene): void {
        if (this._rmmzWindow) return;
        // この rect はダミー。
        // onLayoutFixed() で正しい値に更新される。
        const rect = new Rectangle(0, 0, 100, 100);
        this._rmmzWindow = this.onCreateUserRmmzWindow(rect);
        this._rmmzWindow._flexUIWindow = this;
        scene.owner.addWindow(this._rmmzWindow);
        this._userWindow = true;
    }

    protected onCreateUserRmmzWindow(rect: Rectangle): Window_Base {
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
        
        {
            const rmmzWindowAny = rmmzWindow as any;
            if (rmmzWindowAny.refresh) {
                this._refreshFunc = rmmzWindowAny.refresh;
                rmmzWindowAny.refresh = function() {
                    if (this._flexUIWindow._refreshFunc) this._flexUIWindow._refreshFunc.call(this);
                    this._flexUIWindow.onRefreshRmmzWindow();
                };
            }
        }

        // 必要であれば、rmmzWindow の配置情報を Style の初期値として取り出しておく。
        if (this.actualStyle.marginLeft === undefined) this.actualStyle.marginLeft = rmmzWindow.x;
        if (this.actualStyle.marginTop === undefined) this.actualStyle.marginTop = rmmzWindow.y;
        if (this.actualStyle.width === undefined) this.actualStyle.width = rmmzWindow.width;
        if (this.actualStyle.height === undefined) this.actualStyle.height = rmmzWindow.height;
        
        if (this.design.props.windowskin) {
            rmmzWindow.windowskin = ImageManager.loadBitmap(FlexWindowsManager.instance.designDirectory, this.design.props.windowskin);
        }
        if (this.design.props.visibleCoreContents !== undefined) {
            rmmzWindow._contentsSprite.visible = this.design.props.visibleCoreContents;
            rmmzWindow._contentsBackSprite.visible = this.design.props.visibleCoreContents;
        }
        
        if (this.design.props.windowProps) {
            for (const [key, value] of Object.entries(this.design.props.windowProps)) {
                (rmmzWindow as any)[key] = value;
            }
        }
    }

    private onRefreshRmmzWindow(): void {
        this.setInvalidate(UIInvalidateFlags.All);
        this.traverseVisualChildren((child) => {
            child.setInvalidate(UIInvalidateFlags.All);
        });
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
            this._rmmzWindow.move(
                this.actualStyle.marginLeft + combinedVisualRect.x,
                this.actualStyle.marginTop + combinedVisualRect.y,
                combinedVisualRect.width,
                combinedVisualRect.height);
        }
    }
}
