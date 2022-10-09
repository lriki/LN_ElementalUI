import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DStyle, DStyleScriptValue, DStyleValue } from "ts/design/DStyle";
import { DWindow } from "ts/design/DWindow";
import { UISelectableLayout } from "./layout/UISelectableLayout";
import { VUIRect } from "./UICommon";
import { VUIContainer } from "./UIContainer";
import { UIInvalidateFlags, VUIElement } from "./UIElement";
import { UIFrameLayout } from "./UIFrameLayout";
import { UIScene } from "./UIScene";

export enum UISpiteLayer {
    Background,
    Foreground,
    Overlay,
}

export class UIContext {
    private _window: Window_Base | undefined;

    private _owner: UIScene;
    private _firstUpdate: boolean;
    private _layoutInitialing: boolean = false;
    //private _refreshRequestedVisualContents: VUIElement[];

    public constructor(owner: UIScene) {
        this._owner = owner;
        //this._root = new UISelectableLayout();  // TODO;
        this._firstUpdate = true;
        //this._refreshRequestedVisualContents = [];
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

    // public get rmmzSpriteOffset(): Window_Base | undefined {
    // }

    // public get currentContainer(): PIXI.Container {
    //     if (this._window) {
    //         return this._window;
    //     }
    //     return this._owner.owner;
    // }

    // public requestRefreshVisualContent(element: VUIElement): void {
    //     if (!this._refreshRequestedVisualContents.find(x => x == element)) {
    //         this._refreshRequestedVisualContents.push(element);
    //     }
    // }

    public addSprite(foreground: Sprite | undefined, background: Sprite | undefined): void {
        if (this._window) {
            // _container に追加しないと、openness のエフェクトが効かない。
            if (background) this._window._container.addChildAt(background, 0);
            if (foreground) this._window._container.addChild(foreground);
        }
        else {
            if (background) this._owner.owner.addChildAt(background, 0);
            if (foreground) this._owner.owner.addChild(foreground);
        }
    }
    public addSprite2(layer: UISpiteLayer, sprite: Sprite): void {
        // TODO: layer
        if (this._window) {
            this._window._container.addChild(sprite);
        }
        else {
            this._owner.owner.addChild(sprite);
        }
    }

    public getRectInCurrentContaier(actualRect: VUIRect): VUIRect {
        return actualRect;  // TODO:
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
        if (this._owner.isInvalidate(UIInvalidateFlags.Style)) {
            this._owner._updateStyleHierarchical(this);
        }
        if (this._owner.isInvalidate(UIInvalidateFlags.Layout)) {
            this.layout(width, height);
        }
        // if (this._owner.isInvalidate(UIInvalidateFlags.VisualContent)) {
        //     this.draw();
        // }

        if (this._owner.isInvalidate(UIInvalidateFlags.ChildVisualContent)) {
            this._owner.updateVisualContentsHierarchical(this);
        }

        // if (this._refreshRequestedVisualContents.length > 0) {
        //     for (const element of this._refreshRequestedVisualContents) {
        //         element.updateVisualContents(this);
        //     }
        //     this._refreshRequestedVisualContents = [];
        // }
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

        console.log("========== layout begin ==========", width, height, this);

        this._owner.measure(
            this, {
            width: width,
            height: height });

        this._owner.arrange(
            this, { 
            x: 0, y: 0,
            width: width,
            height: height });

        this._owner.updateCombinedVisualRectHierarchical(this, { x: 0, y: 0, width: width, height: height });
        //this._owner.updateRmmzRect();
        this._owner.unsetInvalidate(UIInvalidateFlags.Layout);
    }

    public evaluateStyleValueAsString(element: VUIElement, value: DStyleValue | undefined): string {
        if (value instanceof DStyleScriptValue) {
            const scene = this._owner;
            const window = this._window;
            const self = element;
            value = eval(value.script);
        }
        if (value === undefined) return "";
        if (typeof value === "string") return value;
        if (typeof value === "number") return value.toString();
        if (typeof value === "boolean") return value.toString();
        return "";
    }

    private draw(): void {
        if (this._owner) {
            this._owner.draw(this);
            //this._owner.updateRmmzRect();
            this._owner.unsetInvalidate(UIInvalidateFlags.VisualContent);
        }
    }
}
