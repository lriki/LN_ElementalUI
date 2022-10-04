import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DWindow } from "ts/design/DWindow";
import { UISelectableLayout } from "./layout/UISelectableLayout";
import { VUIContainer } from "./UIContainer";
import { UIFrameLayout } from "./UIFrameLayout";
import { UIScene } from "./UIScene";

export class UIContext {
    private _window: Window_Base | undefined;

    private _owner: UIScene;
    //private _window: Window_Base;
    //private _root: VUIContainer;
    private _invalidateLayout: boolean;
    private _invalidateDraw: boolean;
    private _firstUpdate: boolean;
    private _layoutInitialing: boolean = false;

    public constructor(owner: UIScene) {
        this._owner = owner;
        //this._root = new UISelectableLayout();  // TODO;
        this._invalidateLayout = true;
        this._invalidateDraw = true;
        this._firstUpdate = true;
    }

    public get layoutInitialing(): boolean {
        return this._layoutInitialing;
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
        if (this._invalidateLayout) {
            this.updateStyle();
            this.layout(width, height);
        }
        if (this._invalidateDraw) {
            this.draw();
        }
    }

    public updateStyle(): void {
        if (!this._owner) return;
        this._owner.updateStyle();
    }

    /** Windows の初期 Rect を確定するための layout. */
    public layoutInitial(width: number, height: number): void {
        assert(this._owner);
        this._layoutInitialing = true;
        this._owner.updateStyle();
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

        this._invalidateLayout = false;
    }

    private draw(): void {
        if (this._owner) {
            this._owner.draw(this);
        }
        //this._window.contents.clear();
        this._invalidateDraw = false;
    }
}
