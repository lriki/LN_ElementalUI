import { assert } from "ts/core/Common";
import { DCommandWindow } from "ts/design/DCommandWindow";
import { UISelectableItem } from "../elements/UISelectableItem";
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
    public readonly design: DCommandWindow;

    private _content: VUIElement | undefined;
    private _itemsChildren: UISelectableItem[];

    constructor(design: DCommandWindow) {
        super(design);
        this.design = design;
        this._itemsChildren = [];
    }

    override dispose(): void {
        this._itemsChildren.forEach((item) => item.dispose());
        super.dispose();
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
        if (this._content) {
            this._content.measure(context, constraint);
            contentAreaSize = this._content.desiredSize;
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

        // Choose max.
        const boxSize = super.measureBasicBorderBoxSize();
        return {
            width: Math.max(boxSize.width, contentAreaSize.width, itemsAreaSize.width),
            height: Math.max(boxSize.height, contentAreaSize.height, itemsAreaSize.height) };
    }

    protected arrangeOverride(context: UIContext, contentSize: VUISize): VUISize {

        // Arrange content.
        if (this._content) {
            const contentBox = { x: 0, y: 0, width: contentSize.width, height: contentSize.height };
            this._content.arrange(context, contentBox);
        }

        // Arrange items.
        const rmmzWindow = context.currentWindow as Window_Selectable;
        if (rmmzWindow) {

            for (const child of this._itemsChildren) {
                const rect = rmmzWindow.itemRect(child.itemIndex) as any;
                child.arrange(context, { x: rect.x, y: rect.y, width: rect.width, height: rect.height });
            }
            return contentSize;
        }
        else {
            throw new Error("Not implemented");
        }
    }

    override updateVisualContents(context: UIContext) {
        const oldWindow = context.changeWindow(this.rmmzWindow);
        if (this.isInvalidate(UIInvalidateFlags.ChildVisualContent)) {
            this.unsetInvalidate(UIInvalidateFlags.ChildVisualContent);
            for (const child of this._itemsChildren) {
                child.updateVisualContents(context);
            }
        }
        super.updateVisualContents(context);
        context.changeWindow(oldWindow);
    }
}

