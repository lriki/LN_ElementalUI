import { VAnimation } from "ts/animation/AnimationManager";
import { easing } from "ts/animation/Easing";
import { assert } from "ts/core/Common";
import { DElement } from "ts/design/DElement";
import { DStyle } from "ts/design/DStyle";
import { VUIRect, VUISize, VUIThickness } from "./UICommon";
import { UIContext } from "./UIContext";
import { UIStyle } from "./UIStyle";

export enum UIVisualStates {
    Default = "Default",
    Opning = "Opening",
    Hover = "Hover",
    Pressed = "Pressed",
    Disabled = "Disabled",
}

export enum UIInvalidateFlags {
    None = 0,
    Style = 1 << 1,
    Layout = 1 << 2,
    Visual = 1 << 3,

    Opening = 1 << 4,
    All = 0xFFFF,
}

export enum UIElementFlags {
    None = 0,
    RequireForegroundSprite = 1 << 1,
    RequireBackgroundSprite = 1 << 2,
    ReadySprites = 1 << 3,
    All = 0xFFFF,
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
    width: number | undefined;  // 全く指定が無ければ、 arrange の finalSize を使う。
    height: number | undefined;

    windowskin: string;
    colorTone: number[];

    opacity: number;           // 全体
    backOpacity: number;
    contentsOpacity: number;

    background: string | undefined;// = "red";

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
        // this.width = 0;
        // this.height = 0;

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
    private _actualBorderBoxRect: VUIRect;   // margin は含まない
    public itemIndex: number;
    // private _actualWidth: number;
    // private _actualHeight: number;
    public _parent: VUIElement | undefined;

    private _styles: UIStyle[];
    public readonly actualStyle: UIActualStyle;
    
    private _foregroundBitmap: Bitmap | undefined;
    private _foregroundSprite: Sprite | undefined;
    private _backgroundBitmap: Bitmap | undefined;
    private _backgroundSprite: Sprite | undefined;

    private _visualState: UIVisualStates;
    private _invalidateFlags: UIInvalidateFlags;
    private _flags: UIElementFlags;

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
        this._actualBorderBoxRect = {
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

        this._styles = [new UIStyle(design.defaultStyle)];
        for (const style of design.props.styles ?? []) {
            this._styles.push(new UIStyle(style));
        }


        this.actualStyle = new UIActualStyle();
        this._invalidateFlags = UIInvalidateFlags.All;
        this._flags = UIElementFlags.None;

        this._visualState = UIVisualStates.Default;
        // 最初は opening で設定し、次の update 時に default が適用されるようにする
        // if (this.applyStyleByName("Opening", true)) {
        //     this.setInvalidate(UIInvalidateFlags.Style);
        // }
        // else {
        //     this.unsetInvalidate(UIInvalidateFlags.Style);
        // }

        var min = 1;
        var max = 1000000000;
        this.id = Math.floor( Math.random() * (max + 1 - min) ) + min;
    }

    public destroy(): void {
        if (this._foregroundSprite) {
            this._foregroundSprite.destroy();
            this._foregroundSprite = undefined;
        }
        if (this._foregroundBitmap) {
            this._foregroundBitmap.destroy();
            this._foregroundBitmap = undefined;
        }
        if (this._backgroundSprite) {
            this._backgroundSprite.destroy();
            this._backgroundSprite = undefined;
        }
        if (this._backgroundBitmap) {
            this._backgroundBitmap.destroy();
            this._backgroundBitmap = undefined;
        }
    }

    // private onApplyDesign(): void {

    // }

    public setInvalidate(flags: UIInvalidateFlags): void {
        this._invalidateFlags |= flags;
        if (this._parent) {
            this._parent.setInvalidate(flags);
        }
    }

    public unsetInvalidate(flags: UIInvalidateFlags): void {
        this._invalidateFlags &= ~flags;
    }

    public isInvalidate(flags: UIInvalidateFlags): boolean {
        return (this._invalidateFlags & flags) !== 0;
    }

    public setFlags(flags: UIElementFlags): void {
        this._flags |= flags;
    }

    public unsetFlags(flags: UIElementFlags): void {
        this._flags &= ~flags;
    }

    public hasFlags(flags: UIElementFlags): boolean {
        return (this._flags & flags) !== 0;
    }

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

    public setParent(parent: VUIElement | undefined): void {
        assert(!this._parent);
        this._parent = parent;

        if (this._parent) {
            this.setInvalidate(UIInvalidateFlags.All);
        }
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
    // Style

    public setValue(propertyName: string, value: number, reset: boolean): void {
        const obj = this.actualStyle as any;
        if (reset) {
            obj[propertyName] = value;
            return;
        }

        if (obj[propertyName] === value) {
            return;
        }

        const container = this.findPIXIContainer();
        const transition = this.design.transitions.find(x => x.property === propertyName);
        if (container && transition) {
            const start = obj[propertyName] as number;
            VAnimation.startAt(container, `${this.id}.${propertyName}`, start, value, transition.duration, easing.linear, v => {
                obj[propertyName] = v;
                this.setInvalidate(UIInvalidateFlags.Layout | UIInvalidateFlags.Visual);
            }, transition.delay);
        }
        else {
            obj[propertyName] = value;
        }
    }
    
    public applyStyle(context: UIContext, style: UIStyle, reset: boolean): void {
        style.evaluate(context, this);
        const props = style;
        //const defaultRect = this.onGetDefaultRect();
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
        // this.setValue("x", props.x ?? defaultRect.x, reset);
        // this.setValue("y", props.y ?? defaultRect.y, reset);
        // this.setValue("width", props.width ?? defaultRect.width, reset);
        // this.setValue("height", props.height ?? defaultRect.height, reset);


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
            this.setInvalidate(UIInvalidateFlags.Style);
        }
    }

    public updateStyle(context: UIContext): void {
        if (this.isInvalidate(UIInvalidateFlags.Style)) {
            this.unsetInvalidate(UIInvalidateFlags.Style);
            this.applyStyleByName(context, this._visualState, false);
        }
    }

    public findStyle(stateName: string): UIStyle | undefined {
        for (const style of this._styles) {
            if (style.stateName === stateName) {
                return style;
            }
        }
        return undefined;
    }

    private applyStyleByName(context: UIContext, state: string, reset: boolean): boolean {
        const style = this.findStyle(state);
        if (style) {
            this.applyStyle(context, style, reset);
            return true;
        }
        else {
            this.applyStyle(context, this._styles[0], reset);
            return false;
        }
    }

    protected onGetDefaultRect(): VUIRect {
        // 設定忘れで見えなくなってしまうことを防ぐためにデフォルト値を設定しておく
        return { x: 0, y: 0, width: 64, height: 64 };
    }



    //--------------------------------------------------------------------------
    // Layout

    /** 子要素は考慮せず、この UIElement のスタイルを元にした最小サイズ。 */
    protected measureBasicBorderBoxSize(): VUISize {
        const width = (this.actualStyle.width ?? 0) + this.actualStyle.paddingLeft + this.actualStyle.paddingRight;
        const height = (this.actualStyle.height ?? 0) + this.actualStyle.paddingTop + this.actualStyle.paddingBottom;
        return { width, height };
    }

    protected setDesiredSize(width: number, height: number): void {
        this._desiredWidth = width;
        this._desiredHeight = height;
    }

    public get desiredSize(): VUISize {
        return { width: this._desiredWidth, height: this._desiredHeight };
    }

    public desiredWidth(): number {
        return this._desiredWidth;
    }

    public desiredHeight(): number {
        return this._desiredHeight;
    }

    /**
     * この要素を表示するために必要なサイズを計測します。結果は desiredSize に格納されます。
     * 
     * @param context 
     * @param availableSize 親要素が子要素を割り当てることができる使用可能な領域。
     *                      通常、レイアウトスロットのサイズを指定します。
     */
    public measure(context: UIContext, availableSize: VUISize): void {
        const marginWidth = this.actualStyle.marginLeft + this.actualStyle.marginRight;
        const marginHeight = this.actualStyle.marginTop + this.actualStyle.marginBottom;

        const width = Math.max(0.0, availableSize.width - marginWidth);
        const height = Math.max(0.0, availableSize.height - marginHeight);
        const size = this.measureOverride(context, {width: width, height: height});
        
        this.setDesiredSize(size.width + marginWidth, size.height + marginHeight);
    }

    /**
     * この要素を表示するために必要なサイズを計測します。
     * 
     * @param context 
     * @param constraint 要素を配置できる領域の最大サイズ。通常は親要素のサイズが渡されます。
     *                   スクロール領域の場合は Inf が渡されることがあるので注意してください。
     */
    protected measureOverride(context: UIContext, constraint: VUISize): VUISize {
        return this.measureBasicBorderBoxSize();
    }

    /**
     * 
     * @param context 
     * @param finalArea 親要素のローカル座標において、 親要素がこの要素に対して割り当てた領域のサイズ（レイアウトスロットの Rect）
     * @returns 
     */
    public arrange(context: UIContext, finalArea: VUIRect): VUIRect {
        const width = this.actualStyle.width ?? finalArea.width;
        const height = this.actualStyle.height ?? finalArea.height;

        const rect: VUIRect = {
            x: finalArea.x + this._margin.left,
            y: finalArea.y + this._margin.top,
            width: width - this._margin.left - this._margin.right,
            height: height - this._margin.top - this._margin.bottom};
        const result = this.arrangeOverride(context, rect);
        this.onLayoutFixed(context, this._actualBorderBoxRect);


        // update viual
        {
            if (this.isInvalidate(UIInvalidateFlags.Visual)) {
                this.unsetInvalidate(UIInvalidateFlags.Visual);

                if (this.actualStyle.background) {
                    this.setFlags(UIElementFlags.RequireBackgroundSprite);
                }
                this.onRefreshVisual(context); // TODO: temp
    
                if (this.actualStyle.background) {
                    const sprite = this.prepareBackgroundSprite(context);
                    const bitmap = sprite.bitmap;
                    assert(bitmap);
                    bitmap.fillRect(0, 0, bitmap.width, bitmap.height, this.actualStyle.background);
                }
            }

        }

        return result;
    }

    protected arrangeOverride(context: UIContext, finalArea: VUIRect): VUIRect {
        this.setActualRect(finalArea);
        return finalArea;
    }

    protected setActualRect(rect: VUIRect): void {
        this._actualBorderBoxRect = {...rect};
        this._actualBorderBoxRect.x += this.actualStyle.x;
        this._actualBorderBoxRect.y += this.actualStyle.y;
    }

    public actualRect(): VUIRect{
        return this._actualBorderBoxRect;
    }

    public updateRmmzRect(): void {
        this.onSetRmmzRect(this._actualBorderBoxRect);
    }

    protected onSetRmmzRect(actualRect: VUIRect): void {
    }

    protected onLayoutFixed(context: UIContext,actualRect: VUIRect): void {

    }

    //--------------------------------------------------------------------------
    // Visual

    private prepareSprites(context: UIContext): void {
        if (!this.hasFlags(UIElementFlags.ReadySprites)) {
            this.setFlags(UIElementFlags.ReadySprites);
            if (this.hasFlags(UIElementFlags.RequireForegroundSprite)) {
                if (!this._foregroundBitmap) {
                    this._foregroundBitmap = new Bitmap(this._actualBorderBoxRect.width, this._actualBorderBoxRect.height);
                }
                if (!this._foregroundSprite) {
                    this._foregroundSprite = new Sprite(this._foregroundBitmap);
                }
            }
            if (this.hasFlags(UIElementFlags.RequireBackgroundSprite)) {
                if (!this._backgroundBitmap) {
                    this._backgroundBitmap = new Bitmap(this._actualBorderBoxRect.width, this._actualBorderBoxRect.height);
                }
                if (!this._backgroundSprite) {
                    this._backgroundSprite = new Sprite(this._backgroundBitmap);
                }
            }
            context.addSprite(this._foregroundSprite, this._backgroundSprite);
        }

        
        if (this._foregroundSprite) {
            this._foregroundSprite.x = this._actualBorderBoxRect.x;
            this._foregroundSprite.y = this._actualBorderBoxRect.y;
        }
        if (this._backgroundSprite) {
            this._backgroundSprite.x = this._actualBorderBoxRect.x;
            this._backgroundSprite.y = this._actualBorderBoxRect.y;
        }
    }

    /** onRefreshVisual() で使える。 */
    protected prepareForegroundSprite(context: UIContext): Sprite {
        this.prepareSprites(context);
        assert(this._foregroundSprite);
        return this._foregroundSprite;
    }

    /** onRefreshVisual() で使える。 */
    protected prepareBackgroundSprite(context: UIContext): Sprite {
        this.prepareSprites(context);
        assert(this._backgroundSprite);
        return this._backgroundSprite;
    }

    protected onRefreshVisual(context: UIContext): void {
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
