import { assert } from "ts/core/Common";
import { DText } from "ts/design/DText";
import { VUIPoint, VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { UIElementFlags, VUIElement } from "../UIElement";
import { UIHAlignment, UIVAlignment } from "../utils/UILayoutHelper";

export class UIText extends VUIElement {
    private _text: string;
    private _color: string | undefined;
    // private _bitmap: Bitmap | undefined;
    // private _sprite: Sprite | undefined;
    
    public constructor(design: DText) {
        super(design);
        this.actualStyle.defaultHorizontalAlignment = UIHAlignment.Center;
        this.actualStyle.defaultVerticalAlignment = UIVAlignment.Center;
        this._text = design.text;
        this.setFlags(UIElementFlags.RequireForegroundSprite);
    }

    // private destroyResource(): void {
    //     if (this._bitmap) {
    //         this._bitmap.destroy();
    //         this._bitmap = undefined;
    //     }
    //     if (this._sprite) {
    //         this._sprite.destroy();
    //         this._sprite = undefined;
    //     }
    // }

    public setText(value: string): this {
        this._text = value;
        return this;
    }

    public setColor(value: string): this {
        this._color = value;
        return this;
    }

    public getItemSize(rmmzWindow: Window_Base): VUISize {
        if (rmmzWindow instanceof Window_Selectable) {
            // Window_Selectable で使う場合、高さは lineHeight() ではなく itemHeight() を使う。
            // こうしないと、 Window のサイズが未指定(子要素のサイズに合わせる) ときに、
            // 最終的な Client サイズに対してサイズが合わず、スクロールカーソルが出てしまう。
            const size: VUISize = {
                width: rmmzWindow.textWidth(this._text) + (rmmzWindow.itemPadding() * 2),
                height: rmmzWindow.itemHeight() };
            return size;
        }
        else {
            const rect: VUIRect = {
                x: 0,
                y: 0,
                width: rmmzWindow.textWidth(this._text),
                //width: metrics.width,
                height: rmmzWindow.lineHeight() };
            return rect;
        }
    }

    public getItemLineOffset(rmmzWindow: Window_Base): VUIPoint {
        if (rmmzWindow instanceof Window_Selectable) {
            // RMMZ の Item の描画仕様に合わせてみる。
            // こうしなくても動くが、テキストが上寄りになったり、微妙にレイアウトがきれいにならない。
            const size = this.getItemSize(rmmzWindow);
            const offset: VUIPoint = {
                x: rmmzWindow.itemPadding(),
                y: (size.height - rmmzWindow.lineHeight()) / 2 };
            return offset;
        }
        else {
            const offset: VUIPoint = {
                x: 0,
                y: 0 };
            return offset;
        }
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        //const size = context.currentWindow.textSizeEx(this._text);

        context.currentWindow.resetFontSettings();

        // const wi = context.currentWindow.textWidth(this._text);
        // const metrics = context.currentWindow.contents.context.measureText(this._text);
        const rmmzWindow = context.currentWindow;
        return this.getItemSize(rmmzWindow);

        // if (rmmzWindow instanceof Window_Selectable) {
        //     console.log("Window_Selectable!!");
            
        // }
        // else {
        //     const size: VUISize = {
        //         width: rmmzWindow.textWidth(this._text),
        //         //width: metrics.width,
        //         height: rmmzWindow.lineHeight() };
        //     // height は metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent でも取得できるが、
        //     // フォントによっては見切れてしまうことがある。
        //     // やむをえず、やや大きめにはなるが確実な lineHeight を使う。
    
        //     const outer = this.calcContentOuter();
        //     //this.setDesiredSize(size.width + outer.left + outer.right, size.height + outer.top + outer.bottom);
        //     return size;
        // }

    }


    override onRefreshVisual(context: UIContext): void {
        const sprite = this.prepareForegroundSprite(context, undefined);
        const bitmap = sprite.bitmap;
        assert(bitmap);
        bitmap.clear();



        const rmmzWindow = context.currentWindow;
        assert(rmmzWindow instanceof Window_Selectable);

        const oldContents = context.currentWindow.contents;
        context.currentWindow.contents = bitmap;

        //const rect = this.getItemRect(rmmzWindow);

        
        // const padding = this.itemPadding();
        // rect.x += padding;

        // // Window_Selectable.prototype.itemLineRect
        // let y = 0;
        // const padding = (rect.height - rmmzWindow.lineHeight()) / 2;
        // y += padding;

        const offset = this.getItemLineOffset(rmmzWindow);
        
        context.currentWindow.resetFontSettings();
        //bitmap.drawText(this._text, 0, 0, bitmap.width, bitmap.height, "center");
        context.currentWindow.drawTextEx(this._text, offset.x, offset.y, bitmap.width);

        context.currentWindow.contents = oldContents;
    }

    public draw(context: UIContext): void {
        //console.log("draw UIText", this);

        // const window = context.currentWindow;
        // if (this.actualStyle.opacity > 0.0) {
        //     const rect = this.actualRect();
        //     if (this._color) {
        //         window.changeTextColor(this._color);
        //     }
        //     else {
        //         window.resetTextColor();
        //     }

        //     window.contents.paintOpacity = this.actualStyle.opacity * 255;
        //     //window.drawText(this._text, rect.x, rect.y, rect.width, "left");
        //     window.drawTextEx(this._text, rect.x, rect.y, rect.width);
        // }
    }
}

