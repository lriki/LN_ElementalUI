import { VUIRect, VUISize } from "./UICommon";
import { UIContext } from "./UIContext";
import { VUIElement } from "./UIElement";

export class VUIContainer extends VUIElement {
    private _children: VUIElement[];

    public constructor() {
        super();
        this._children = [];
    }


    override addLogicalChild(element: VUIElement): VUIElement {
        element.itemIndex = this._children.length;
        this._children.push(element);
        return element;
    }

    public children(): readonly VUIElement[] {
        return this._children;
    }

    // public findLogicalChildByClass(className: string): VUIElement | undefined {
    //     if(this.props.class === className) {
    //         return this;
    //     }
    //     for(const child of this.children) {
    //         const result = child.findElementByClass(className);
    //         if(result) {
    //             return result;
    //         }
    //     }
    //     return undefined;
    // }

    override measureOverride(context: UIContext, constraint: VUISize): void {
        for (const child of this._children) {
            child.measure(context, constraint);
        }
    }

    override arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
        for (const child of this._children) {
            child.arrange(context, finalArea);
        }
        return super.arrangeOverride(context, finalArea);
    }
    
    override draw(context: UIContext): void {
        for (const child of this._children) {
            child.draw(context);
        }
    }
}


