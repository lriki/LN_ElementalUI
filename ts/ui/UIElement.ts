import { assert } from "ts/core/Common";
import { VUIRect, VUISize, VUIThickness } from "./UICommon";
import { UIContext } from "./UIContext";

export class VUIElement {
    private _margin: VUIThickness;
    private _padding: VUIThickness;
    private _desiredWidth: number;
    private _desiredHeight: number;
    private _actualRect: VUIRect;   // margin は含まない
    public itemIndex: number;
    // private _actualWidth: number;
    // private _actualHeight: number;

    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;

    x: number;
    y: number;
    opacity: number;    // 0~1.0

    

    public constructor() {
        this._margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
        this._padding = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
        this._desiredWidth = 0;
        this._desiredHeight = 0;
        this._actualRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        // this._actualWidth = 0;
        // this._actualHeight = 0;t
        this.itemIndex = 0;
        this.row = 0;
        this.col = 0;
        this.rowSpan = 1;
        this.colSpan = 1;
        this.x = 0;
        this.y = 0;
        this.opacity = 1.0;
    }

    // private onApplyDesign(): void {

    // }

    public addLogicalChild(element: VUIElement): VUIElement {
        throw new Error("Unreachable.");
        return element;
    }

    protected calcContentOuter(): VUIThickness {
        return {
            top: this._margin.top + this._padding.top,
            right: this._margin.right + this._padding.right,
            bottom: this._margin.bottom + this._padding.bottom,
            left: this._margin.left + this._padding.left,
        };
    }

    public margin(top: number, right?: number, bottom?: number, left?: number): this {
        if (right !== undefined && bottom !== undefined && left !== undefined) {
            this._margin.top = top;
            this._margin.right = right;
            this._margin.bottom = bottom;
            this._margin.left = left;
        }
        else if (right !== undefined) {
            this._margin.top = this._margin.bottom = top;
            this._margin.right = this._margin.left = right;
        }
        else {
            this._margin.top = this._margin.bottom = this._margin.right = this._margin.left = top;
        }
        return this;
    }

    public getMargin(): VUIThickness {
        return this._margin;
    }

    public padding(): VUIThickness {
        return this._padding;
    }

    public setGrid(col: number, row: number, colSpan: number = 1, rowSpan: number = 1): this {
        this.row = row;
        this.col = col;
        this.rowSpan = rowSpan;
        this.colSpan = colSpan;
        return this;
    }

    public setOpacity(value: number): this {
        this.opacity = value;
        return this;
    }

    // public addTo(container: VUIContainer): this {
    //     container.addChild(this);
    //     return this;
    // }

    protected setDesiredSize(width: number, height: number): void {
        this._desiredWidth = width;
        this._desiredHeight = height;
    }

    public desiredWidth(): number {
        return this._desiredWidth;
    }

    public desiredHeight(): number {
        return this._desiredHeight;
    }

    public measure(context: UIContext, size: VUISize): void {
        this.measureOverride(context, size);
    }

    /**
     * この要素を表示するために必要なサイズを計測します。
     * @param context 
     * @param constraint : この要素を配置できる領域の最大サイズ。通常は親要素のサイズが渡されます。
     */
    protected measureOverride(context: UIContext, constraint: VUISize): void {
    }

    public arrange(context: UIContext, finalArea: VUIRect): VUIRect {
        const rect: VUIRect = {
            x: finalArea.x + this._margin.left,
            y: finalArea.y + this._margin.top,
            width: finalArea.width - this._margin.left - this._margin.right,
            height: finalArea.height - this._margin.top - this._margin.bottom};
        return this.arrangeOverride(context, rect);
    }

    protected arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
        this.setActualRect(finalArea);
        return finalArea;
    }

    protected setActualRect(rect: VUIRect): void {
        this._actualRect = {...rect};
        this._actualRect.x += this.x;
        this._actualRect.y += this.y;
    }

    public actualRect(): VUIRect{
        return this._actualRect;
    }

    // public actualWidth(): number {
    //     return this._actualWidth;
    // }

    // public actualHeight(): number {
    //     return this._actualHeight;
    // }
    
    public draw(context: UIContext): void {
        
    }
}
