import { DOrientation, DStackLayout } from "ts/design/layout/DStackLayout";
import { VUIPoint, VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { VUIElement } from "../UIElement";

export class UIStackLayout extends VUIElement {
    public readonly design: DStackLayout;

    public constructor(design: DStackLayout) {
        super(design);
        this.design = design;
    }
    
    override addLogicalChild(element: VUIElement): VUIElement {
        this.addVisualChild(element);
        return element;
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        const size = { ...constraint };
        if (this.design.orientation == DOrientation.Horizontal) {
            // 横に並べる場合、幅の制限を設けない
            size.width = Number.POSITIVE_INFINITY;
        }
        else {
            // 縦に並べる場合、高さの制限を設けない
            size.height = Number.POSITIVE_INFINITY;
        }

        const visualChildren = this.visualChildren;
        const desiredSize = { width: 0, height: 0 };
        for (let i = 0; i < visualChildren.length; i++)
        {
            const child = visualChildren[i];
            if (context.testLayoutEnabled(child)) {
                child.measure(context, size);

                const childDesiredSize = child.desiredSize;
                if (this.design.orientation == DOrientation.Horizontal || this.design.orientation == DOrientation.ReverseHorizontal) {
                    desiredSize.width += childDesiredSize.width;
                    desiredSize.height = Math.max(desiredSize.height, childDesiredSize.height);
                }
                else {
                    desiredSize.width = Math.max(desiredSize.width, childDesiredSize.width);
                    desiredSize.height += childDesiredSize.height;
                }
            }
        }

        return desiredSize;
    }
    
    override arrangeOverride(context: UIContext, borderBoxSize: VUISize): VUISize {
        const scrollOffset: VUIPoint = { x: 0, y: 0 };
        const finalSize = borderBoxSize;
        // const Thickness& padding = style->padding;
        // Size childrenBoundSize(finalSize.width - (padding.left + padding.right), finalSize.height - (padding.top + padding.bottom));
        // Rect finalSlotRect(padding.left, padding.top, childrenBoundSize.width, childrenBoundSize.height);
        const childrenBoundSize = finalSize;
        const finalSlotRect = { x: 0, y: 0, width: finalSize.width, height: finalSize.height };
    
        let prevChildSize = 0;
        let rPos = 0;
        const childRect = { x: 0, y: 0, width: 0, height: 0 };
        const visualChildren = this.visualChildren;
        for (let i = 0; i < visualChildren.length; i++)
        {
            const child = visualChildren[i];
            if (context.testLayoutEnabled(child)) {
                const childDesiredSize = child.desiredSize;
    
                switch (this.design.orientation)
                {
                case DOrientation.Horizontal:
                    childRect.x += prevChildSize;
                    prevChildSize = childDesiredSize.width;
                    childRect.width = prevChildSize;
                    childRect.height = childrenBoundSize.height;
                    break;
                case DOrientation.Vertical:
                    childRect.y += prevChildSize;
                    prevChildSize = childDesiredSize.height;
                    childRect.width = childrenBoundSize.width;
                    childRect.height = prevChildSize;
                    break;
                case DOrientation.ReverseHorizontal:
                    prevChildSize = childDesiredSize.width;
                    rPos -= prevChildSize;
                    childRect.x = childrenBoundSize.width + rPos;
                    childRect.width = prevChildSize;
                    childRect.height = childrenBoundSize.height;
                    break;
                case DOrientation.ReverseVertical:
                    prevChildSize = childDesiredSize.height;
                    rPos -= prevChildSize;
                    childRect.y = childrenBoundSize.height + rPos;
                    childRect.width = childrenBoundSize.width;
                    childRect.height = prevChildSize;
                    break;
                default:
                    throw new Error("Invalid orientation");
                }
    
                // Lumino 特殊仕様。採集要素を Stretch で配置する。
                const actual: VUIRect = { x: finalSlotRect.x + childRect.x, y: finalSlotRect.y + childRect.y, width: childRect.width, height: childRect.height };
                if (this.design.props.lastStretch && i == visualChildren.length - 1) {
                    actual.width = finalSlotRect.width - actual.x;
                    actual.height = finalSlotRect.height - actual.y;
                }
    
                actual.x -= scrollOffset.x;
                actual.y -= scrollOffset.y;
                child.arrange(context, actual);
            }
        }
    
        return { ...finalSlotRect };
    }
}
