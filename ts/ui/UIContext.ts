import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { WindowDesign } from "ts/core/WindowDesign";
import { UISelectableLayout } from "./layout/UISelectableLayout";
import { VUIContainer } from "./UIContainer";
import { UIFrameLayout } from "./UIFrameLayout";

export class UIWindowContext {
    private _window: Window_Base;
    private _root: VUIContainer;
    private _invalidateLayout: boolean;
    private _invalidateDraw: boolean;
    private _firstUpdate: boolean;

    public constructor(window: Window_Base, design: WindowDesign) {
        this._window = window;
        this._root = new UISelectableLayout();  // TODO;
        this._invalidateLayout = true;
        this._invalidateDraw = true;
        this._firstUpdate = true;
    }

    public get window(): Window_Base {
        return this._window;
    }

    public get root(): VUIContainer {
        return this._root;
    }

    public update(): void {
        if (this._firstUpdate) {
            FlexWindowsManager.instance.applyDesign(this._window);
            this._firstUpdate = false;
        }
        if (this._invalidateLayout) {
            this.layout();
            this._invalidateLayout = false;
        }
        if (this._invalidateDraw) {
            this.draw();
            this._invalidateDraw = false;
        }
    }

    private layout(): void {
        if (!this._root) return;

        this._root.measure(
            this, {
            width: this._window.contents.width,
            height: this._window.contents.height });

        this._root.arrange(
            this, { 
            x: 0, y: 0,
            width: this._window.contents.width,
            height: this._window.contents.height });
    }

    private draw(): void {
        if (!this._root) return;
        this._window.contents.clear();
        this._root.draw(this);
    }
}
