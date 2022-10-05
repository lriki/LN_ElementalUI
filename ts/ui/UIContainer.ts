import { DElement } from "ts/design/DElement";
import { VUIRect, VUISize } from "./UICommon";
import { UIContext } from "./UIContext";
import { VUIElement } from "./UIElement";

export class VUIContainer extends VUIElement {
    private _children: VUIElement[];

    public constructor(design: DElement) {
        super(design);
        this._children = [];
    }


    override addLogicalChild(element: VUIElement): VUIElement {
        element.itemIndex = this._children.length;
        this._children.push(element);
        element._parent = this;
        return element;
    }

    public children(): readonly VUIElement[] {
        return this._children;
    }

    override findLogicalChildByClass(className: string): VUIElement | undefined {
        const result1 = super.findLogicalChildByClass(className);
        if (result1) {
            return result1;
        }
        for(const child of this._children) {
            const result = child.findLogicalChildByClass(className);
            if(result) {
                return result;
            }
        }
        return undefined;
    }

    override updateStyle(context: UIContext): void {
        for (const child of this._children) {
            child.updateStyle(context);
        }
        super.updateStyle(context);
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        for (const child of this._children) {
            child.measure(context, constraint);
        }
        return this.measureBasicBorderBoxSize();
    }

    override arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
        for (const child of this._children) {
            child.arrange(context, finalArea);
        }
        return super.arrangeOverride(context, finalArea);
    }

    override updateRmmzRect(): void {
        super.updateRmmzRect();
        for (const child of this._children) {
            child.updateRmmzRect();
        }
    }

    override draw(context: UIContext): void {
        for (const child of this._children) {
            child.draw(context);
        }
    }
}


