import { DText } from "ts/design/DText";
import { VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { VUIElement } from "../UIElement";

export class UIText extends VUIElement {
    private _text: string;
    private _color: string | undefined;
    private _bitmap: Bitmap | undefined;
    private _sprite: Sprite | undefined;
    
    public constructor(design: DText) {
        super(design);
        this._text = design.text;
    }

    private destroyResource(): void {
        if (this._bitmap) {
            this._bitmap.destroy();
            this._bitmap = undefined;
        }
        if (this._sprite) {
            this._sprite.destroy();
            this._sprite = undefined;
        }
    }

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
        return this.measureBasicBoxSize();
    }

    override onLayoutFixed(context: UIContext, actualRect: VUIRect): void {
        console.log("onLayoutFixed UIText", this);
        this.destroyResource();
        const rect = context.getRectInCurrentContaier(actualRect);
        this._bitmap = new Bitmap(rect.width, rect.height);
        this._sprite = new Sprite(this._bitmap);
        this._sprite.x = rect.x;
        this._sprite.y = rect.y;
        context.currentContainer.addChild(this._sprite);

        this._bitmap.drawText(this._text, 0, 0, rect.width, rect.height, "left");
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

