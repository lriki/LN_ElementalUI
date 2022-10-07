import { DElement } from "ts/design/DElement";
import { VUIRect, VUISize } from "./UICommon";
import { UIContext } from "./UIContext";
import { UIInvalidateFlags, VUIElement } from "./UIElement";

export class VUIContainer extends VUIElement {
    private _contentChildren: VUIElement[];

    public constructor(design: DElement) {
        super(design);
        this._contentChildren = [];
    }

    override dispose(): void {
        super.dispose();
        this._contentChildren.forEach((child) => child.dispose());
        this._contentChildren = [];
    }

    override addLogicalChild(element: VUIElement): VUIElement {
        element.itemIndex = this._contentChildren.length;
        this._contentChildren.push(element);
        element._parent = this;
        this.addVisualChild(element);
        return element;
    }

    public contentChildren(): readonly VUIElement[] {
        return this._contentChildren;
    }

    override findLogicalChildByClass(className: string): VUIElement | undefined {
        const result1 = super.findLogicalChildByClass(className);
        if (result1) {
            return result1;
        }
        for(const child of this._contentChildren) {
            const result = child.findLogicalChildByClass(className);
            if(result) {
                return result;
            }
        }
        return undefined;
    }

    // override updateStyle(context: UIContext): void {
    //     for (const child of this._children) {
    //         child.updateStyle(context);
    //     }
    //     super.updateStyle(context);
    // }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        for (const child of this._contentChildren) {
            child.measure(context, constraint);
        }
        return this.measureBasicBorderBoxSize();
    }

    protected arrangeOverride(context: UIContext, contentSize: VUISize): VUISize {
        const contentBox = {x: 0, y: 0, width: contentSize.width, height: contentSize.height};
        for (const child of this._contentChildren) {
            child.arrange(context, contentBox);
        }
        return super.arrangeOverride(context, contentBox);
    }

    // override updateRmmzRect(): void {
    //     super.updateRmmzRect();
    //     for (const child of this._children) {
    //         child.updateRmmzRect();
    //     }
    // }

    // override updateVisualContents(context: UIContext) {
    //     if (this.isInvalidate(UIInvalidateFlags.ChildVisualContent)) {
    //         this.unsetInvalidate(UIInvalidateFlags.ChildVisualContent);
    //         for (const child of this._contentChildren) {
    //             child.updateVisualContents(context);
    //         }
    //     }
    //     super.updateVisualContents(context);
    // }

    // override draw(context: UIContext): void {
    //     for (const child of this._children) {
    //         child.draw(context);
    //     }
    // }
}


