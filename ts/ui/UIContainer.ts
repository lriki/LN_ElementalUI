import { VUIRect, VUISize } from "./UICommon";
import { UIWindowContext } from "./UIContext";
import { VUIElement } from "./UIElement";

export class VUIContainer extends VUIElement {
    private _children: VUIElement[];

    public constructor() {
        super();
        this._children = [];
    }


    public addChild(element: VUIElement): VUIElement {
        element.itemIndex = this._children.length;
        this._children.push(element);
        return element;
    }

    public children(): readonly VUIElement[] {
        return this._children;
    }

    override measureOverride(context: UIWindowContext, constraint: VUISize): void {
        for (const child of this._children) {
            child.measure(context, constraint);
        }
    }

    override arrangeOverride(context: UIWindowContext, finalArea: VUIRect): VUIRect {
        for (const child of this._children) {
            child.arrange(context, finalArea);
        }
        return super.arrangeOverride(context, finalArea);
    }
    
    override draw(context: UIWindowContext): void {
        for (const child of this._children) {
            child.draw(context);
        }
    }
}


