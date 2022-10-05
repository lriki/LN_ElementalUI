import { assert } from "ts/core/Common";
import { DWindow } from "ts/design/DWindow";
import { SceneDesign } from "ts/design/SceneDesign";
import { VUIRect } from "./UICommon";
import { VUIContainer } from "./UIContainer";
import { UIContext } from "./UIContext";
import { VUIElement } from "./UIElement";
import { UIWindowBase } from "./windows/UIWindowBase";

export class UIScene extends VUIContainer {
    private _owner: Scene_Base | undefined;
    public readonly attachedExistingWindows: Window_Base[] = [];
    private _context: UIContext;

    public constructor(design: SceneDesign) {
        super(design);
        this._context = new UIContext(this);
    }

    public get owner(): Scene_Base {
        assert(this._owner);
        return this._owner;
    }

    public get context(): UIContext {
        return this._context;
    }

    public attachRmmzScene(owner: Scene_Base): void {
        this._owner = owner;
    }

    public detachRmmzScene(): void {
        this.dispose();
        this._owner = undefined;
    }

    override findPIXIContainer(): PIXI.Container | undefined {
        if (this._owner) {
            return this._owner;
        }
        return super.findPIXIContainer();
    }

    override addLogicalChild(element: VUIElement): VUIElement {
        super.addLogicalChild(element);
        return element;
    }

    public getRmmzWindowInitialRect(className: string): VUIRect | undefined {
        return undefined;
    }
    
    /** RMMZ コアスクリプト側で new された Window を論理的な子要素として管理下に入れる */
    public attachRmmzWindowIfNeeded(window: Window_Base): void {
        if (window._flexUIWindow) return;

        const element = this.findLogicalChildByClass(window.constructor.name);
        if (element instanceof UIWindowBase) {
            element.attachRmmzWindow(window);
            this.attachedExistingWindows.push(window);
        }
    }

    public syncFromAllRmmzWindowContents(): void {
        for (const window of this.attachedExistingWindows) {
            window._flexUIWindow?.onSyncFromRmmzWindowContents();
        }
    }
}
