import { assert } from "ts/core/Common";
import { DText } from "ts/design/DText";
import { VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { UIElementFlags, VUIElement } from "../UIElement";

export class UIText extends VUIElement {
    private _text: string;
    private _color: string | undefined;
    // private _bitmap: Bitmap | undefined;
    // private _sprite: Sprite | undefined;
    
    public constructor(design: DText) {
        super(design);
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
        const size = context.currentWindow.textSizeEx(this._text);
        const outer = this.calcContentOuter();
        this.setDesiredSize(size.width + outer.left + outer.right, size.height + outer.top + outer.bottom);
        return this.measureBasicBorderBoxSize();
    }


    override onRefreshVisual(context: UIContext): void {
        const sprite = this.prepareForegroundSprite(context);
        const bitmap = sprite.bitmap;
        assert(bitmap);
        bitmap.clear();
        bitmap.drawText(this._text, 0, 0, bitmap.width, bitmap.height, "left");
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

