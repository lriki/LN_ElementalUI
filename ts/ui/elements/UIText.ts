import { DText } from "ts/design/DText";
import { VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { VUIElement } from "../UIElement";

export class UIText extends VUIElement {
    private _text: string;
    private _color: string | undefined;
    
    public constructor(design: DText) {
        super(design);
        this._text = design.text;
    }

    public setText(value: string): this {
        this._text = value;
        return this;
    }

    public setColor(value: string): this {
        this._color = value;
        return this;
    }

    protected measureOverride(context: UIContext, constraint: VUISize): void {
        const size = context.window.textSizeEx(this._text);
        const outer = this.calcContentOuter();
        this.setDesiredSize(size.width + outer.left + outer.right, size.height + outer.top + outer.bottom);
    }

    public draw(context: UIContext): void {
        //console.log("draw UIText", this);

        const window = context.window;
        if (this.actualStyle.opacity > 0.0) {
            const rect = this.actualRect();
            if (this._color) {
                window.changeTextColor(this._color);
            }
            else {
                window.resetTextColor();
            }

            window.contents.paintOpacity = this.actualStyle.opacity * 255;
            //window.drawText(this._text, rect.x, rect.y, rect.width, "left");
            window.drawTextEx(this._text, rect.x, rect.y, rect.width);
        }
    }
}

