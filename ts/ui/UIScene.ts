import { assert } from "ts/core/Common";
import { SceneDesign } from "ts/design/SceneDesign";
import { VUIRect } from "./UICommon";
import { VUIContainer } from "./UIContainer";
import { UIContext } from "./UIContext";
import { VUIElement } from "./UIElement";

export class UIScene extends VUIContainer {
    private _owner: Scene_Base | undefined;
    private _context: UIContext;

    public constructor(design: SceneDesign) {
        super();
        this._context = new UIContext(this);
    }

    public get context(): UIContext {
        return this._context;
    }

    public attachRmmzScene(owner: Scene_Base): void {
        this._owner = owner;
    }

    override addLogicalChild(element: VUIElement): VUIElement {
        super.addLogicalChild(element);
        return element;
    }

    public getRmmzWindowInitialRect(className: string): VUIRect | undefined {
        return undefined;
    }
    
    /** RMMZ コアスクリプト側で new された Window を論理的な子要素として管理下に入れる */
    public attachExsistingRmmzWindow(window: Window_Base): void {
        assert(window._flexUIWindow);
        //this.addLogicalChild(window._flexUIWindow);
    }
}
