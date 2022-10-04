import { VAnimation } from "ts/animation/AnimationManager";
import { easing } from "ts/animation/Easing";
import { assert } from "ts/core/Common";
import { DElement } from "ts/design/DElement";
import { DStyle } from "ts/design/DStyle";
import { VUIRect, VUISize, VUIThickness } from "./UICommon";
import { UIContext } from "./UIContext";

export enum UIVisualStates {
    Default = "default",
    Opning = "opening",
    Hover = "hover",
    Pressed = "pressed",
    Disabled = "disabled",
}


export class UIActualStyle {
    
    marginLeft: number;
    marginTop: number;
    marginRight: number;
    marginBottom: number;

    paddingLeft: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;

    x: number;
    y: number;
    width: number;
    height: number;

    windowskin: string;
    colorTone: number[];

    opacity: number;           // 全体
    backOpacity: number;
    contentsOpacity: number;

    // Window.origin
    originX: number;
    originY: number;

    // Window.frameVisible
    frameVisible: boolean;

    public constructor() {
        this.marginLeft = 0;
        this.marginTop = 0;
        this.marginRight = 0;
        this.marginBottom = 0;

        this.paddingLeft = 0;
        this.paddingTop = 0;
        this.paddingRight = 0;
        this.paddingBottom = 0;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        this.windowskin = "";
        this.colorTone = [0, 0, 0, 1];

        this.opacity = 255;           // 全体
        this.backOpacity = 255;
        this.contentsOpacity = 255;

        this.originX = 0;
        this.originY = 0;

        this.frameVisible = true;
    }
}


export class VUIElement {
    public readonly design: DElement;
    public readonly id: number;

    private _margin: VUIThickness;
    private _padding: VUIThickness;
    private _desiredWidth: number;
    private _desiredHeight: number;
    private _actualRect: VUIRect;   // margin は含まない
    public itemIndex: number;
    // private _actualWidth: number;
    // private _actualHeight: number;
    public _parent: VUIElement | undefined;

    public readonly actualStyle: UIActualStyle;

    private _visualState: UIVisualStates;
    private _visualStateChanged: boolean;

    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;

    // x: number;
    // y: number;
    // opacity: number;    // 0~1.0

    

    public constructor(design: DElement) {
        this.design = design;
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
        // this.x = 0;
        // this.y = 0;
        // this.opacity = 1.0;

        this.actualStyle = new UIActualStyle();

        // 最初は opening で設定し、次の update 時に default が適用されるようにする
        this._visualState = UIVisualStates.Default;
        if (this.applyStyleByName("opening")) {
            this._visualStateChanged = true;
        }
        else {
            this._visualStateChanged = false;
        }

        var min = 1;
        var max = 1000000000;
        this.id = Math.floor( Math.random() * (max + 1 - min) ) + min;
    }


    // private onApplyDesign(): void {

    // }

    public findPIXIContainer(): PIXI.Container | undefined {
        if (this._parent) {
            return this._parent.findPIXIContainer();
        }
        else {
            return undefined;
        }
    }

    public addLogicalChild(element: VUIElement): VUIElement {
        throw new Error("Unreachable.");
        return element;
    }

    public findLogicalChildByClass(className: string): VUIElement | undefined {
        if(this.design.props.class === className) {
            return this;
        }
        return undefined;
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

    // public setOpacity(value: number): this {
    //     this.opacity = value;
    //     return this;
    // }

    // public addTo(container: VUIContainer): this {
    //     container.addChild(this);
    //     return this;
    // }

    //--------------------------------------------------------------------------
    // Style framework

    public setValue(propertyName: string, value: number, reset: boolean): void {
        const obj = this.actualStyle as any;
        if (reset) {
            obj[propertyName] = value;
            return;
        }

        const container = this.findPIXIContainer();
        const transition = this.design.transitions.find(x => x.property === propertyName);
        if (container && transition) {
            const start = obj[propertyName] as number;
            VAnimation.startAt(container, `${this.id}.${propertyName}`, start, value, transition.duration, easing.linear, v => {
                obj[propertyName] = v;
            }, transition.delay);
        }
        else {
            obj[propertyName] = value;
        }
    }
    
    public applyStyle(style: DStyle, reset: boolean): void {
        const props = style.props;
        if (props.marginLeft) this.setValue("marginLeft", props.marginLeft, reset);
        if (props.marginTop) this.setValue("marginTop", props.marginTop, reset);
        if (props.marginRight) this.setValue("marginRight", props.marginRight, reset);
        if (props.marginBottom) this.setValue("marginBottom", props.marginBottom, reset);

        if (props.paddingLeft) this.setValue("paddingLeft", props.paddingLeft, reset);
        if (props.paddingTop) this.setValue("paddingTop", props.paddingTop, reset);
        if (props.paddingRight) this.setValue("paddingRight", props.paddingRight, reset);
        if (props.paddingBottom) this.setValue("paddingBottom", props.paddingBottom, reset);

        if (props.x) this.setValue("x", props.x, reset);
        if (props.y) this.setValue("y", props.y, reset);
        if (props.width) this.setValue("width", props.width, reset);
        if (props.height) this.setValue("height", props.height, reset);

        //if (props.windowskin) this.setValue("windowskin", props.windowskin);
        //if (props.colorTone) this.setValue("colorTone", props.colorTone);

        if (props.opacity) this.setValue("opacity", props.opacity, reset);
        if (props.backOpacity) this.setValue("backOpacity", props.backOpacity, reset);
        if (props.contentsOpacity) this.setValue("contentsOpacity", props.contentsOpacity, reset);

        if (props.originX) this.setValue("originX", props.originX, reset);
        if (props.originY) this.setValue("originY", props.originY, reset);

        //if (props.frameVisible) this.setValue("frameVisible", props.frameVisible);
    }

    public setVisualState(state: UIVisualStates): void {
        if (this._visualState == state) {
            this._visualState = state;
            this._visualStateChanged = true;
        }
    }

    public updateStyle(): void {
        if (this._visualStateChanged) {
            this._visualStateChanged = false;
            this.applyStyleByName(this._visualState);
        }
    }

    private applyStyleByName(state: string): boolean {
        const style = this.design.findStyle(this._visualState);
        if (style) {
            this.applyStyle(style, false);
            return true;
        }
        else {
            this.applyStyle(this.design.defaultStyle, false);
            return false;
        }
    }




    //--------------------------------------------------------------------------
    // Layout



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
        this._actualRect.x += this.actualStyle.x;
        this._actualRect.y += this.actualStyle.y;
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

    // private setupTransitions(): void {
    //     for (const transition of this.design.transitions) {
            
    //     }
    // }
}
