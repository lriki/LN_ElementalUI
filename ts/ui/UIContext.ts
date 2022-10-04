import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DWindow } from "ts/design/DWindow";
import { UISelectableLayout } from "./layout/UISelectableLayout";
import { VUIContainer } from "./UIContainer";
import { UIInvalidateFlags } from "./UIElement";
import { UIFrameLayout } from "./UIFrameLayout";
import { UIScene } from "./UIScene";

export class UIContext {
    private _window: Window_Base | undefined;

    private _owner: UIScene;
    private _firstUpdate: boolean;
    private _layoutInitialing: boolean = false;

    public constructor(owner: UIScene) {
        this._owner = owner;
        //this._root = new UISelectableLayout();  // TODO;
        this._firstUpdate = true;
    }

    public get layoutInitialing(): boolean {
        return this._layoutInitialing;
    }

    public get owner(): UIScene {
        return this._owner;
    }

    public get currentWindow(): Window_Base {
        assert(this._window);
        return this._window;
    }

    public changeWindow(window: Window_Base | undefined): Window_Base | undefined {
        const old = this._window;
        this._window = window;
        return old;
    }

    public update(width: number, height: number): void {
        if (this._firstUpdate) {
            //FlexWindowsManager.instance.applyDesign(this._window);
            this._firstUpdate = false;
        }
        if (this._owner.isInvalidate(UIInvalidateFlags.Layout)) {
            this.updateStyle();
            this.layout(width, height);
        }
        if (this._owner.isInvalidate(UIInvalidateFlags.Visual)) {
            this.draw();
        }
    }

    public updateStyle(): void {
        if (!this._owner) return;
        this._owner.updateStyle(this);
    }

    /** Windows の初期 Rect を確定するための layout. */
    public layoutInitial(width: number, height: number): void {
        assert(this._owner);
        this._layoutInitialing = true;
        // コンストラクタで Default または Opening のスタイルが設定されているため、ここではスタイルを更新しない。
        this._owner.measure(this, { width: width, height: height });
        this._owner.arrange(this, { x: 0, y: 0, width: width, height: height });
        this._layoutInitialing = false;
    }

    private layout(width: number, height: number): void {
        assert(this._owner);

        this._owner.measure(
            this, {
            width: width,
            height: height });

        this._owner.arrange(
            this, { 
            x: 0, y: 0,
            width: width,
            height: height });

        this._owner.updateRmmzRect();
        this._owner.unsetInvalidate(UIInvalidateFlags.Layout);
    }

    private draw(): void {
        if (this._owner) {
            this._owner.draw(this);
            this._owner.updateRmmzRect();
            this._owner.unsetInvalidate(UIInvalidateFlags.Visual);
        }
    }
}
