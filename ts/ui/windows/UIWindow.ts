import { assert } from "ts/core/Common";
import { DCommandWindow } from "ts/design/DCommandWindow";
import { UISelectableItem } from "../elements/UISelectableItem";
import { VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { VUIElement } from "../UIElement";
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

    public clearSelectableItems(): void {
        if (this._itemsChildren.length == 0) return;
        throw new Error("Not implemented");
    }

    public addSelectableItem(item: UISelectableItem): void {
        this._itemsChildren.push(item);
        item.setParent(this);
        item.itemIndex = this._itemsChildren.length - 1;
    }

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
        const boxSize = super.measureBasicBoxSize();
        return {
            width: Math.max(boxSize.width, contentAreaSize.width, itemsAreaSize.width),
            height: Math.max(boxSize.height, contentAreaSize.height, itemsAreaSize.height) };
    }

    override arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
        console.log("UIWindow.arrangeOverride", finalArea);

        // Arrange content.
        if (this._content) {
            this._content.arrange(context, finalArea);
        }

        // Arrange items.
        const rmmzWindow = context.currentWindow as Window_Selectable;
        if (rmmzWindow) {

            for (const child of this._itemsChildren) {
                const rect = rmmzWindow.itemRect(child.itemIndex) as any;
                child.arrange(context, { x: rect.x, y: rect.y, width: rect.width, height: rect.height });
                console.log("arrange", child, rect);
            }
            this.setActualRect(finalArea);
            return finalArea;
        }
        else {
            throw new Error("Not implemented");
        }

    }
}

