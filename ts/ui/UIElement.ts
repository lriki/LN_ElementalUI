import { VAnimation } from "ts/animation/AnimationManager";
import { easing } from "ts/animation/Easing";
import { assert } from "ts/core/Common";
import { DAlignment, DElement } from "ts/design/DElement";
import { DStyle } from "ts/design/DStyle";
import { VUIRect, VUISize, VUIThickness } from "./UICommon";
import { UIContext, UISpiteLayer } from "./UIContext";
import { UIStyle } from "./UIStyle";
import { UIHAlignment, UILayoutHelper, UIVAlignment } from "./utils/UILayoutHelper";

export enum UIVisualStates {
    Default = "Default",
    Opning = "Opening",
    Hover = "Hover",
    Pressed = "Pressed",
    Disabled = "Disabled",
}

export enum UIBoxSizing {
    ContentBox = "content-box",
    BorderBox = "border-box",
}

export enum UIInvalidateFlags {
    None = 0,
    Style = 1 << 1,
    Layout = 1 << 2,
    VisualContent = 1 << 3,
    
    // 以下内部用
     
    // いずれかの子・孫要素が VisualContent を要求している。this は VisualContent を持っていないこともある。
    ChildVisualContent = 1 << 4,

    Opening = 1 << 4,
    All = 0xFFFF,
    
    Routing = Style | Layout | ChildVisualContent,
    NoRouting = VisualContent,
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

    borderLeft: number;
    borderTop: number;
    borderRight: number;
    borderBottom: number;

    paddingLeft: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;

    x: number;
    y: number;
    width: number | undefined;  // 全く指定が無ければ、 arrange の finalSize を使う。
    height: number | undefined;

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

    horizontalAlignment: UIHAlignment | undefined;
    verticalAlignment: UIVAlignment | undefined;
    defaultHorizontalAlignment: UIHAlignment = UIHAlignment.Stretch;
    defaultVerticalAlignment: UIVAlignment = UIVAlignment.Stretch;

    public constructor() {
        this.marginLeft = 0;
        this.marginTop = 0;
        this.marginRight = 0;
        this.marginBottom = 0;

        this.borderLeft = 0;
        this.borderTop = 0;
        this.borderRight = 0;
        this.borderBottom = 0;

        this.paddingLeft = 0;
        this.paddingTop = 0;
        this.paddingRight = 0;
        this.paddingBottom = 0;

        this.x = 0;
        this.y = 0;
        // this.width = 0;
        // this.height = 0;

        this.colorTone = [0, 0, 0, 1];

        this.opacity = 255;           // 全体
        this.backOpacity = 255;
        this.contentsOpacity = 255;

        this.originX = 0;
        this.originY = 0;

        this.frameVisible = true;
    }

    public get marginWidth(): number { return this.marginLeft + this.marginRight; }
    public get marginHeight(): number { return this.marginTop + this.marginBottom; }
    public get borderWidth(): number { return this.borderLeft + this.borderRight; }
    public get borderHeight(): number { return this.borderTop + this.borderBottom; }
    public get paddingWidth(): number { return this.paddingLeft + this.paddingRight; }
    public get paddingHeight(): number { return this.paddingTop + this.paddingBottom; }

    public set padding(value: number) {
        this.paddingLeft = value;
        this.paddingTop = value;
        this.paddingRight = value;
        this.paddingBottom = value;
    }
    
    public getHorizontalAlignment(): UIHAlignment { return this.horizontalAlignment ?? this.defaultHorizontalAlignment; }
    public getVerticalAlignment(): UIVAlignment { return this.verticalAlignment ?? this.defaultVerticalAlignment; }

    public getInvalidateFlags(propertyName: string): UIInvalidateFlags {
        switch (propertyName) {
            case "x":
            case "y":
            case "width":
            case "height":
                return UIInvalidateFlags.Layout | UIInvalidateFlags.VisualContent;
            case "background":
            case "foreground":
                return UIInvalidateFlags.VisualContent;
        }
        return UIInvalidateFlags.None;
    }
}

/**
 * 
 * Box Model
 * ----------
 * UIElement の Box-Model は、 CSS の border-box 相当です。
 * つまり次のようになります。
 * - width、height プロパティで指定できる領域に padding + border 領域を含める。
 * - width、height プロパティで指定できる領域には、margin 領域は含めない。
 * これは、本プラグインの重要なコンセプトのひとつの「コンテンツ領域外のウィンドウの装飾が簡単にできること」を実現するためです。
 * すなわち、何らかの描画が行われる領域の左上が、コンテンツ(子要素)の原点となります。
 * 
 * desiredSize
 * ----------
 * desiredSize は、子要素のサイズを考慮した、この要素の理想的なレイアウトサイズです。
 * 設定に関わらず、常に MerginBox と等しくなります。
 */
export class VUIElement {
    public readonly design: DElement;
    public readonly id: number;

    private _margin: VUIThickness;
    private _padding: VUIThickness;
    private _desiredWidth: number;
    private _desiredHeight: number;
    _actualMarginBoxRect: VUIRect;   // 親の ClientArea 内での MarinBox. レイアウトスロット内ではない点に注意。
    _combinedVisualRect: VUIRect;
    public itemIndex: number;
    // private _actualWidth: number;
    // private _actualHeight: number;
    public _parent: VUIElement | undefined;

    private _styles: UIStyle[];
    public readonly actualStyle: UIActualStyle;
    _boxSizing: UIBoxSizing;
    
    private _foregroundBitmap: Bitmap | undefined;
    private _foregroundSprite: Sprite | undefined;
    private _backgroundBitmap: Bitmap | undefined;
    private _backgroundSprite: Sprite | undefined;
    private _debugBitmap: Bitmap | undefined;
    private _debugSprite: Sprite | undefined;

    private _visualChildren: VUIElement[];
    private _visualParent: VUIElement | undefined;
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
        this._actualMarginBoxRect = { x: 0, y: 0, width: 0, height: 0 };
        this._combinedVisualRect = { x: 0, y: 0, width: 0, height: 0 };
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
        this._boxSizing = UIBoxSizing.ContentBox;
        this._invalidateFlags = UIInvalidateFlags.All;
        this._flags = UIElementFlags.None;

        this._visualChildren = [];
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

        {
            switch (this.design.props.alignment) {
                case undefined:
                    break;
                case DAlignment.Center:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Center;
                    this.actualStyle.verticalAlignment = UIVAlignment.Center;
                    break;
                case DAlignment.Left:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Left;
                    this.actualStyle.verticalAlignment = UIVAlignment.Center;
                    break;
                case DAlignment.Right:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Right;
                    this.actualStyle.verticalAlignment = UIVAlignment.Center;
                    break;
                case DAlignment.Top:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Center;
                    this.actualStyle.verticalAlignment = UIVAlignment.Top;
                    break;
                case DAlignment.Bottom:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Center;
                    this.actualStyle.verticalAlignment = UIVAlignment.Bottom;
                    break;
                case DAlignment.TopLeft:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Left;
                    this.actualStyle.verticalAlignment = UIVAlignment.Top;
                    break;
                case DAlignment.TopRight:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Right;
                    this.actualStyle.verticalAlignment = UIVAlignment.Top;
                    break;
                case DAlignment.BottomLeft:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Left;
                    this.actualStyle.verticalAlignment = UIVAlignment.Bottom;
                    break;
                case DAlignment.BottomRight:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Right;
                    this.actualStyle.verticalAlignment = UIVAlignment.Bottom;
                    break;
                case DAlignment.LeftStretch:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Left;
                    this.actualStyle.verticalAlignment = UIVAlignment.Stretch;
                    break;
                case DAlignment.TopStretch:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Stretch;
                    this.actualStyle.verticalAlignment = UIVAlignment.Top;
                    break;
                case DAlignment.RightStretch:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Right;
                    this.actualStyle.verticalAlignment = UIVAlignment.Stretch;
                    break;
                case DAlignment.BottomStretch:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Stretch;
                    this.actualStyle.verticalAlignment = UIVAlignment.Bottom;
                    break;
                case DAlignment.HorizontalStretch:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Stretch;
                    this.actualStyle.verticalAlignment = UIVAlignment.Center;
                    break;
                case DAlignment.VerticalStretch:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Center;
                    this.actualStyle.verticalAlignment = UIVAlignment.Stretch;
                    break;
                case DAlignment.Stretch:
                    this.actualStyle.horizontalAlignment = UIHAlignment.Stretch;
                    this.actualStyle.verticalAlignment = UIVAlignment.Stretch;
                    break;
                default:
                    throw new Error("unknown alignment: " + this.design.props.alignment);
            }
        }
    }

    public dispose(): void {
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
        // VisualContent の変更は ChildVisualContent を伴う
        if ((flags & UIInvalidateFlags.VisualContent) !== 0) {
            flags |= UIInvalidateFlags.ChildVisualContent;
        }

        const oldRoutingFlags = this._invalidateFlags & UIInvalidateFlags.Routing;

        if (this._invalidateFlags != flags) {
            this._invalidateFlags |= flags;

            const newRoutingFlags = this._invalidateFlags & UIInvalidateFlags.Routing;
            if (oldRoutingFlags != newRoutingFlags) {
                if (this._parent) {
                    this._parent.setInvalidate(newRoutingFlags);
                }
            }
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

        // if (this._parent) {
        //     this.setInvalidate(UIInvalidateFlags.All);
        // }
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
    // Visual tree

    public addVisualChild(element: VUIElement): void {
        assert(!element._visualParent);
        this._visualChildren.push(element);
        element._visualParent = this;
    }

    public get visualChildren(): readonly VUIElement[] {
        return this._visualChildren;
    }

    public get visualParent(): VUIElement | undefined {
        return this._visualParent;
    }

    public traverseVisualChildren(callback: (element: VUIElement) => void): void {
        for (const child of this._visualChildren) {
            callback(child);
            child.traverseVisualChildren(callback);
        }
    }

    //--------------------------------------------------------------------------
    // Style

    public setValue(context: UIContext, propertyName: string, value: number, reset: boolean): void {
        const obj = this.actualStyle as any;
        if (reset) {
            this.setActualStyleValueInternal(propertyName, value);
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
                this.setActualStyleValueInternal(propertyName, v);
            }, transition.delay);
        }
        else {
            this.setActualStyleValueInternal(propertyName, value);
        }
    }

    private setActualStyleValueInternal(propertyName: string, value: any) {
        const obj = this.actualStyle as any;
        obj[propertyName] = value;
        this.setInvalidate(this.actualStyle.getInvalidateFlags(propertyName));
    }

    
    public applyStyle(context: UIContext, style: UIStyle, reset: boolean): void {
        style.evaluate(context, this);
        const props = style;
        
        if (props.marginLeft) this.setValue(context, "marginLeft", props.marginLeft, reset);
        if (props.marginTop) this.setValue(context, "marginTop", props.marginTop, reset);
        if (props.marginRight) this.setValue(context, "marginRight", props.marginRight, reset);
        if (props.marginBottom) this.setValue(context, "marginBottom", props.marginBottom, reset);

        if (props.paddingLeft) this.setValue(context, "paddingLeft", props.paddingLeft, reset);
        if (props.paddingTop) this.setValue(context, "paddingTop", props.paddingTop, reset);
        if (props.paddingRight) this.setValue(context, "paddingRight", props.paddingRight, reset);
        if (props.paddingBottom) this.setValue(context, "paddingBottom", props.paddingBottom, reset);

        if (props.x) this.setValue(context, "x", props.x, reset);
        if (props.y) this.setValue(context, "y", props.y, reset);
        if (props.width) this.setValue(context, "width", props.width, reset);
        if (props.height) this.setValue(context, "height", props.height, reset);
        // this.setValue("x", props.x ?? defaultRect.x, reset);
        // this.setValue("y", props.y ?? defaultRect.y, reset);
        // this.setValue("width", props.width ?? defaultRect.width, reset);
        // this.setValue("height", props.height ?? defaultRect.height, reset);


        //if (props.windowskin) this.setValue("windowskin", props.windowskin);
        //if (props.colorTone) this.setValue("colorTone", props.colorTone);

        if (props.opacity) this.setValue(context, "opacity", props.opacity, reset);
        if (props.backOpacity) this.setValue(context, "backOpacity", props.backOpacity, reset);
        if (props.contentsOpacity) this.setValue(context, "contentsOpacity", props.contentsOpacity, reset);
        if (props.background) this.setActualStyleValueInternal("background", props.background);

        if (props.originX) this.setValue(context, "originX", props.originX, reset);
        if (props.originY) this.setValue(context, "originY", props.originY, reset);


        //if (props.frameVisible) this.setValue("frameVisible", props.frameVisible);
    }

    // public setVisualState(state: UIVisualStates): void {
    //     if (this._visualState == state) {
    //         this._visualState = state;
    //         this.setInvalidate(UIInvalidateFlags.Style);
    //     }
    // }

    public _updateStyleHierarchical(context: UIContext): void {
        this.updateStyle(context);
        for (const child of this._visualChildren) {
            child._updateStyleHierarchical(context);
        }
    }

    private updateStyle(context: UIContext): void {
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


    //--------------------------------------------------------------------------
    // Layout


    /** 子要素は考慮せず、この UIElement のスタイルを元にした最小サイズ。 */
    protected measureBasicBorderBoxSize(): VUISize {
        switch (this._boxSizing) {
            case UIBoxSizing.ContentBox:
                const width = (this.actualStyle.width ?? 0) + (this.actualStyle.borderLeft + this.actualStyle.borderRight) + (this.actualStyle.paddingLeft + this.actualStyle.paddingRight);
                const height = (this.actualStyle.height ?? 0) + (this.actualStyle.borderTop + this.actualStyle.borderBottom)  + (this.actualStyle.paddingTop + this.actualStyle.paddingBottom);
                return { width, height };
            case UIBoxSizing.BorderBox:
                return { width: this.actualStyle.width ?? 0, height: this.actualStyle.height ?? 0 };
            default:
                throw new Error("Unknown box-sizing: " + this._boxSizing);
        }
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
     * 
     */
    public measure(context: UIContext, availableSize: VUISize): void {
        const marginWidth = this.actualStyle.marginWidth;
        const marginHeight = this.actualStyle.marginHeight;
        const borderWidth = this.actualStyle.borderWidth;
        const borderHeight = this.actualStyle.borderHeight;
        const paddingWidth = this.actualStyle.paddingWidth;
        const paddingHeight = this.actualStyle.paddingHeight;

        const width = Math.max(0.0, availableSize.width - marginWidth);
        const height = Math.max(0.0, availableSize.height - marginHeight);

        const contentSize = this.measureOverride(context, {width: width, height: height});
        assert(Number.isFinite(contentSize.width));
        assert(Number.isFinite(contentSize.height));
        
        this.setDesiredSize(
            contentSize.width + marginWidth,// + borderWidth + paddingWidth,
            contentSize.height + marginHeight);// + borderHeight + paddingHeight);
    }

    /**
     * この要素を表示するために必要なサイズを計測します。
     * 
     * @param context 
     * @param constraint 要素を配置できる領域の最大サイズ。通常は親要素のサイズが渡されます。
     *                   スクロール領域の場合は Inf が渡されることがあるので注意してください。
     * @returns BorderBox の希望サイズ。
     */
    protected measureOverride(context: UIContext, constraint: VUISize): VUISize {
        return this.measureBasicBorderBoxSize();
        // 基本は、親レイアウトスロット一杯に広がると考えてよい。
        // スクロールエリアの場合はちゃんとオーバーライドして計算する必要があるが、
        // base としては inf を返さないようにしておく。
        // return {
        //     width: ((Number.isFinite(constraint.width)) ? constraint.width : 0),
        //     height: ((Number.isFinite(constraint.height)) ? constraint.height : 0),
        // };
    }

    /**
     * 
     * @param context 
     * @param finalArea 親要素のローカル座標において、 親要素がこの要素に対して割り当てた領域のサイズ（レイアウトスロットの Rect）
     * @returns 
     */
    public arrange(context: UIContext, finalArea: VUIRect): void {
        // https://developer.mozilla.org/ja/docs/Learn/CSS/Building_blocks/The_box_model#%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9%E3%81%AE%E6%A7%8B%E6%88%90
        // const localMarginBox = {
        //     x: finalArea.x + this.actualStyle.marginLeft,
        //     y: finalArea.y + this.actualStyle.marginTop,
        //     width: finalArea.width - this.actualStyle.marginLeft - this.actualStyle.marginRight,
        //     height: finalArea.height - this.actualStyle.marginTop - this.actualStyle.marginBottom,
        // };

        assert(!Number.isNaN(this._desiredWidth));
        assert(!Number.isNaN(this._desiredHeight));

        // width/height が直接指定されていれば、desiredSize は最低でもその分の大きさがなければならない。
        if (this.actualStyle.width !== undefined) {
            assert(this._desiredWidth >= this.actualStyle.width);
        }
        if (this.actualStyle.height !== undefined) {
            assert(this._desiredHeight >= this.actualStyle.height);
        }

        const marginWidth = this.actualStyle.marginWidth;
        const marginHeight = this.actualStyle.marginHeight;
        
        // CSS の border-box 相当なので、一番外側 (margin-box) のサイズ計算はこんな感じ。
        const marginBoxWidthOrUndefined = (this.actualStyle.width === undefined) ? undefined : this._desiredWidth + marginWidth;
        const marginBoxHeightOrUndefined = (this.actualStyle.height === undefined) ? undefined : this._desiredHeight + marginHeight;

        console.log("arrnge", this, this.actualStyle.getHorizontalAlignment(),this.actualStyle.getVerticalAlignment(), this._desiredWidth, this._desiredHeight);

        const marginBox: VUIRect = { x: 0, y: 0, width: 0, height: 0 };
        console.log("  finalArea.width", finalArea.width);
        console.log("  this._desiredWidth", this._desiredWidth);
        console.log("  marginBoxWidthOrUndefined", marginBoxWidthOrUndefined);
        console.log("  this.actualStyle.getHorizontalAlignment()", this.actualStyle.getHorizontalAlignment());
        UILayoutHelper.adjustHorizontalAlignment(
            finalArea.width,
            this._desiredWidth,
            marginBoxWidthOrUndefined,
            this.actualStyle.getHorizontalAlignment(),
            marginBox);
        UILayoutHelper.adjustVerticalAlignment(
            finalArea.height,
            this._desiredHeight,
            marginBoxHeightOrUndefined,
            this.actualStyle.getVerticalAlignment(),
            marginBox);

        const borderBoxSize: VUISize = {
            width: marginBox.width - marginWidth,
            height: marginBox.height - marginHeight};
        console.log("  marginBox", marginBox);
        console.log("  marginWidth", marginWidth);
        console.log("  marginHeight", marginHeight);
        console.log("  borderBoxSize", borderBoxSize);
        const result = this.arrangeOverride(context, borderBoxSize);

        //console.log("  arrnge", this, finalArea, marginBox, borderBoxSize);

        this.setActualRect({ x: finalArea.x + marginBox.x, y: finalArea .y + marginBox.y, width: result.width, height: result.height });
    }

    /**
     * 
     * @param context 
     * @param borderBoxSize 
     * @returns 
     * 
     * なぜ BorderBoxSize なのか？
     * ----------
     * Decoration をレイアウトできるようにするため。
     * これは box-sizing に関わらず、何かしらの可視 Box と同じ範囲にレイアウトしたい。 （BorderBox の左上を (0, 0) にしたい）
     * 論理的な子要素を配置するべき Box は、 getLocalClientBox() を使うこと。
     */
    protected arrangeOverride(context: UIContext, borderBoxSize: VUISize): VUISize {
        //this.setActualRect({x: 0, y: 0, width: contentSize.width, height: contentSize.height});
        return borderBoxSize;
    }

    protected makeBorderBoxSize(clientSize: VUISize): VUISize {
        switch (this._boxSizing) {
            case UIBoxSizing.BorderBox:
                return clientSize;
            case UIBoxSizing.ContentBox:
                return {
                    width: clientSize.width + this.actualStyle.borderWidth + this.actualStyle.paddingWidth,
                    height: clientSize.height + this.actualStyle.borderHeight + this.actualStyle.paddingHeight,
                };
            default:
                throw new Error("Unknown box-sizing");
        }
    }

    // protected getClientBoxSize(): VUISize {
    //     switch (this._boxSizing) {
    //         case UIBoxSizing.BorderBox:
    //             return {
    //                 width: this.actualStyle.width ?? 0,
    //                 height: this.actualStyle.height ?? 0,
    //             };
    //         case UIBoxSizing.ContentBox:
    //             return {

    //                 width: this._actualBorderBoxRect.width - this.actualStyle.borderLeft - this.actualStyle.borderRight,
    //                 height: this._actualBorderBoxRect.height - this.actualStyle.borderTop - this.actualStyle.borderBottom,
    //             };
    //         default:
    //             throw new Error("Unknown box-sizing");
    //     }
    // }

    protected getLocalClientBox(borderBoxSize: VUISize): VUIRect {
        // switch (this._boxSizing) {
        //     case UIBoxSizing.ContentBox:
                return {
                    x: this.actualStyle.borderLeft + this.actualStyle.paddingLeft,
                    y: this.actualStyle.borderTop + this.actualStyle.paddingTop,
                    width: borderBoxSize.width - (this.actualStyle.borderLeft + this.actualStyle.borderRight) - (this.actualStyle.paddingLeft + this.actualStyle.paddingRight),
                    height: borderBoxSize.height - (this.actualStyle.borderTop + this.actualStyle.borderBottom) - (this.actualStyle.paddingTop + this.actualStyle.paddingBottom) };
        //     case UIBoxSizing.BorderBox:
        //         return {
        //             x: 0,
        //             y: 0,
        //             width: borderBoxSize.width,
        //             height: borderBoxSize.height };
        //     default:
        //         throw new Error("Unknown box-sizing");
        // }
    }

    protected setActualRect(rect: VUIRect): void {
        this._actualMarginBoxRect = {...rect};
        this._actualMarginBoxRect.x += this.actualStyle.x;
        this._actualMarginBoxRect.y += this.actualStyle.y;
    }

    public actualRect(): VUIRect{
        return this._actualMarginBoxRect;
    }

    /**
     * updateCombinedVisualRect
     * 
     * visualRect とは、この要素の描画領域を表す矩形。CSS の border-box 相当 では BorderBox.
     * CombinedVisualRect は、実際に RMMZ の Window や Sprite に適用できる Rect.
     * つまり、直近の親 PIXI.Container のローカル座標系内の Rect となる。
     */
    public updateCombinedVisualRectHierarchical(context: UIContext, parentCombinedVisualRect: VUIRect): void {
        //this._combinedVisualRect = this.updateCombinedVisualRectOverride(context, parentCombinedVisualRect);
        this.updateCombinedVisualRect(context, parentCombinedVisualRect);

        for (const child of this._visualChildren) {
            child.updateCombinedVisualRectHierarchical(context, this._combinedVisualRect);
        }
    }
    
    protected updateCombinedVisualRect(context: UIContext, parentCombinedVisualRect: VUIRect): void {
        this._combinedVisualRect.x = parentCombinedVisualRect.x + this._actualMarginBoxRect.x;
        this._combinedVisualRect.y = parentCombinedVisualRect.y + this._actualMarginBoxRect.y;
        this._combinedVisualRect.width = this._actualMarginBoxRect.width;
        this._combinedVisualRect.height = this._actualMarginBoxRect.height;
        this.unsetInvalidate(UIInvalidateFlags.Layout);
        this.onLayoutFixed(context, this._combinedVisualRect);
    }

    protected getCombinedVisualRect(): VUIRect {
        return this._combinedVisualRect;
    }

    protected setCombinedVisualRect(rect: VUIRect): void {
        this._combinedVisualRect = rect;
    }

    // protected updateCombinedVisualRectOverride(context: UIContext, parentCombinedVisualRect: VUIRect): VUIRect {
    //     return {
    //         x: parentCombinedVisualRect.x + this._actualBorderBoxRect.x,
    //         y: parentCombinedVisualRect.y + this._actualBorderBoxRect.y,
    //         width: this._actualBorderBoxRect.width,
    //         height: this._actualBorderBoxRect.height,
    //     };
    //     // this._combinedVisualRect.x = parentCombinedVisualRect.x + this._actualBorderBoxRect.x;
    //     // this._combinedVisualRect.y = parentCombinedVisualRect.y + this._actualBorderBoxRect.y;
    //     // this._combinedVisualRect.width = this._actualBorderBoxRect.width;
    //     // this._combinedVisualRect.height = this._actualBorderBoxRect.height;
    // }
    // public updateRmmzRect(): void {
    //     this.onSetRmmzRect(this._actualBorderBoxRect);
    // }

    // protected onSetRmmzRect(actualRect: VUIRect): void {
    // }

    protected onLayoutFixed(context: UIContext, combinedVisualRect: VUIRect): void {

    }

    //--------------------------------------------------------------------------
    // Visual

    private prepareSprites(context: UIContext): void {
        if (!this.hasFlags(UIElementFlags.ReadySprites)) {
            this.setFlags(UIElementFlags.ReadySprites);
            if (this.hasFlags(UIElementFlags.RequireForegroundSprite)) {
                if (!this._foregroundBitmap) {
                    this._foregroundBitmap = new Bitmap(this._combinedVisualRect.width, this._combinedVisualRect.height);
                }
                if (!this._foregroundSprite) {
                    this._foregroundSprite = new Sprite(this._foregroundBitmap);
                }
            }
            if (this.hasFlags(UIElementFlags.RequireBackgroundSprite)) {
                if (!this._backgroundBitmap) {
                    
                    if (this.actualStyle.background) {
                        this._backgroundBitmap = ImageManager.loadSystem(this.actualStyle.background);
                    }
                    else {
                        this._backgroundBitmap = new Bitmap(this._combinedVisualRect.width, this._combinedVisualRect.height);
                    }
                }
                if (!this._backgroundSprite) {
                    this._backgroundSprite = new Sprite(this._backgroundBitmap);
                }
            }
            context.addSprite(this._foregroundSprite, this._backgroundSprite);

            if (1) {
                this._debugBitmap = new Bitmap(this._combinedVisualRect.width, this._combinedVisualRect.height);
                this._debugSprite = new Sprite(this._debugBitmap);
                this._debugBitmap.fillRect(0, 0, this._debugBitmap.width, this._debugBitmap.height, "#FFFF0022");
                this._debugBitmap.strokeRect(0, 0, this._debugBitmap.width, this._debugBitmap.height, "#FF0000FF");
                context.addSprite2(UISpiteLayer.Overlay, this._debugSprite);
            }
        }
        
        if (this._foregroundSprite) {
            this._foregroundSprite.x = this._combinedVisualRect.x;
            this._foregroundSprite.y = this._combinedVisualRect.y;
        }
        if (this._backgroundSprite) {
            this._backgroundSprite.x = this._combinedVisualRect.x;
            this._backgroundSprite.y = this._combinedVisualRect.y;
        }
        if (this._debugSprite) {
            this._debugSprite.x = this._combinedVisualRect.x;
            this._debugSprite.y = this._combinedVisualRect.y;
        }
    }

    /** onRefreshVisual() で使える。 */
    protected prepareForegroundSprite(context: UIContext, bitmap: Bitmap | undefined): Sprite {
        if (!this._foregroundSprite) {
            this._foregroundBitmap = bitmap;
            if (!this._foregroundBitmap) {
                this._foregroundBitmap = new Bitmap(this._combinedVisualRect.width, this._combinedVisualRect.height);
            }
            if (!this._foregroundSprite) {
                this._foregroundSprite = new Sprite(this._foregroundBitmap);
            }
    
            context.addSprite2(UISpiteLayer.Foreground, this._foregroundSprite);
        }
        
        this._foregroundSprite.x = this._combinedVisualRect.x;
        this._foregroundSprite.y = this._combinedVisualRect.y;
        return this._foregroundSprite;
    }

    /** onRefreshVisual() で使える。 */
    protected prepareBackgroundSprite(context: UIContext): Sprite {
        this.prepareSprites(context);
        assert(this._backgroundSprite);
        return this._backgroundSprite;
    }

    
    public updateVisualContentsHierarchical(context: UIContext) {
        this.updateVisualContents(context);
        for (const child of this._visualChildren) {
            child.updateVisualContentsHierarchical(context);
        }
    }

    private updateVisualContents(context: UIContext) {
        
        if (this.isInvalidate(UIInvalidateFlags.VisualContent)) {
            this.unsetInvalidate(UIInvalidateFlags.VisualContent);

            if (this.actualStyle.background) {
                this.setFlags(UIElementFlags.RequireBackgroundSprite);
            }
            this.onRefreshVisual(context);

            if (this.actualStyle.background) {
                const sprite = this.prepareBackgroundSprite(context);
                const bitmap = sprite.bitmap;
                assert(bitmap);
                //bitmap.fillRect(0, 0, bitmap.width, bitmap.height, this.actualStyle.background);
            }
        }
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
