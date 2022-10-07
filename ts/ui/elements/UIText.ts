import { assert } from "ts/core/Common";
import { DText } from "ts/design/DText";
import { VUIRect, VUISize } from "../UICommon";
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

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        //const size = context.currentWindow.textSizeEx(this._text);

        context.currentWindow.resetFontSettings();

        const wi = context.currentWindow.textWidth(this._text);
        const metrics = context.currentWindow.contents.context.measureText(this._text);

        const size: VUISize = {
            width: context.currentWindow.textWidth(this._text),
            //width: metrics.width,
            height: context.currentWindow.lineHeight() };
        // height は metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent でも取得できるが、
        // フォントによっては見切れてしまうことがある。
        // やむをえず、やや大きめにはなるが確実な lineHeight を使う。

        console.log("UIText.measureOverride", this._text, size, wi);
        const outer = this.calcContentOuter();
        //this.setDesiredSize(size.width + outer.left + outer.right, size.height + outer.top + outer.bottom);
        return size;
    }


    override onRefreshVisual(context: UIContext): void {
        const sprite = this.prepareForegroundSprite(context);
        const bitmap = sprite.bitmap;
        assert(bitmap);
        bitmap.clear();

        const oldContents = context.currentWindow.contents;
        context.currentWindow.contents = bitmap;

        
        context.currentWindow.resetFontSettings();
        //bitmap.drawText(this._text, 0, 0, bitmap.width, bitmap.height, "center");
        context.currentWindow.drawTextEx(this._text, 0, 0, bitmap.width);

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

