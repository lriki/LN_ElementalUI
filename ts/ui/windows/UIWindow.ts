import { assert } from "ts/core/Common";
import { DCommandWindow } from "ts/design/DCommandWindow";
import { DWindow } from "ts/design/DWindow";
import { UISelectableItem } from "../components/UISelectableItem";
import { VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { UIInvalidateFlags, VUIElement } from "../UIElement";
import { UIWindowBase } from "./UIWindowBase";

/**
 * Window_Base, Window_Scrollable, Window_Selectable に対応する UIElement.
 * 
 * 上記まとめてこのクラスで扱っているのは、 RMMZ 標準の各種ウィンドウがほぼすべて Window_Selectable の派生であるため。
 * Content を自由に配置できるステータスウィンドウであっても Window_Selectable の派生として実装されている。
 * このため WPF でいうところの ItemsControl と ContentControl が統合された Control とみなして扱うほうが都合がよい。
 * あと、デザインファイルを編集するときも、「ステータスウィンドウなのにベースが Selectable？」となるのもちょっと気持ち悪い。
 * 
 * Items のレイアウトは Window_Selectable のメソッドを利用して行われる。
 * WPF のように ItemsPane を自由に変更できると、Selection の変更をいい感じに制御するのが難しく、自分で専用の実装が必要になってしまう。
 * RMMZ 標準の動きとも異なるので、今はデフォルトに寄せたほうがいいだろう。
 */
export class UIWindow extends UIWindowBase {
    public readonly design: DWindow;

    //private _content: VUIElement | undefined;
    private _itemsChildren: UISelectableItem[];

    constructor(design: DWindow) {
        super(design);
        this.design = design;
        this._itemsChildren = [];
        this.actualStyle.padding = $gameSystem.windowPadding();
    }

    override dispose(): void {
        this._itemsChildren.forEach((item) => item.dispose());
        super.dispose();
    }

    override onCreateUserRmmzWindow(rect: Rectangle): Window_Base {
        return new Window_Selectable(rect);
    }

    public clearSelectableItems(): void {
        if (this._itemsChildren.length == 0) return;
        throw new Error("Not implemented");
    }

    public addSelectableItem(item: UISelectableItem): void {
        this._itemsChildren.push(item);
        item.setParent(this);
        item.itemIndex = this._itemsChildren.length - 1;
        this.addVisualChild(item);
    }

    // override updateStyle(context: UIContext): void {
    //     for (const child of this._itemsChildren) {
    //         child.updateStyle(context);
    //     }
    //     super.updateStyle(context);
    // }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        // Measure content.
        let contentAreaSize: VUISize = { width: 0, height: 0 };
        for (const child of this.contentChildren()) {
            child.measure(context, constraint);
            contentAreaSize.width = Math.max(contentAreaSize.width, child.desiredSize.width);
            contentAreaSize.height = Math.max(contentAreaSize.height, child.desiredSize.height);
        }

        // Measure items.
        let itemsAreaSize: VUISize = { width: 0, height: 0 };
        const rmmzWindow = context.currentWindow as Window_Selectable;
        if (rmmzWindow) {
            for (const child of this._itemsChildren) {
                const rect = rmmzWindow.itemRect(child.itemIndex) as any;
                child.measure(context, { width: rect.width, height: rect.height });
                itemsAreaSize.width = Math.max(itemsAreaSize.width, child.desiredSize.width);
                itemsAreaSize.height = Math.max(itemsAreaSize.height, child.desiredSize.height);
            }
        }
        else {
            throw new Error("Not implemented");
        }

        // Make border size.
        const contentsSize = {
            width: Math.max(contentAreaSize.width, itemsAreaSize.width),
            height: Math.max(contentAreaSize.height, itemsAreaSize.height) };
        const contentsBorderSize = this.makeBorderBoxSize(contentsSize);

        // Measure self.
        const selfSize = {
            width: this.actualStyle.width ?? 0,
            height: this.actualStyle.height ?? 0,
        }

        // Choose max.
        //   RMMZWindow は box-sizing: border-box なので、makeBorderBoxSize() したコンテンツ領域と比較する必要がある。
        const clientSize = {
            width: Math.max(selfSize.width, contentsBorderSize.width),
            height: Math.max(selfSize.height, contentsBorderSize.height) };

        return clientSize;

        // assert(this.rmmzWindow);
        // console.log("measureOverride", this, this.actualStyle.width, this.actualStyle.height, this.rmmzWindow.width, this.rmmzWindow.height);
        
        // const result = this.makeBorderBoxSize(clientSize);
        // console.log("  result", result);
        // return result;
    }

    override arrangeOverride(context: UIContext, borderBoxSize: VUISize): VUISize {
        const clientBox = this.getLocalClientBox(borderBoxSize);

        // Arrange content.
        for (const child of this.contentChildren()) {
            child.arrange(context, clientBox);
        }
        // if (this._content) {
        //     const contentBox = { x: 0, y: 0, width: contentSize.width, height: contentSize.height };
        //     this._content.arrange(context, contentBox);
        // }

        // Arrange items.
        const rmmzWindow = context.currentWindow as Window_Selectable;
        if (rmmzWindow) {

            for (const child of this._itemsChildren) {
                const rect = rmmzWindow.itemRect(child.itemIndex) as any;
                child.arrange(context, { x: clientBox.x + rect.x, y: clientBox.y + rect.y, width: rect.width, height: rect.height });
            }
            return borderBoxSize;
        }
        else {
            throw new Error("Not implemented");
        }
    }

    // override updateCombinedVisualRect(context: UIContext, parentCombinedVisualRect: VUIRect): void {
    //     this._combinedVisualRect.x = parentCombinedVisualRect.x + this._actualMarginBoxRect.x;
    //     this._combinedVisualRect.y = parentCombinedVisualRect.y + this._actualMarginBoxRect.y;
    //     this._combinedVisualRect.width = this._actualMarginBoxRect.width;
    //     this._combinedVisualRect.height = this._actualMarginBoxRect.height;
    // }

    override updateVisualContentsHierarchical(context: UIContext) {
        const oldWindow = context.changeWindow(this.rmmzWindow);
        super.updateVisualContentsHierarchical(context);
        context.changeWindow(oldWindow);
    }
}

