import { DText } from "ts/design/DText";
import { VUISize } from "../UICommon";
import { FontInfo, UIContext } from "../UIContext";
import { UIElementFlags, UIInvalidateFlags, VUIElement } from "../UIElement";
import { UIFontHelper } from "../utils/UIFontHelper";

export class UIText extends VUIElement {
    public readonly design: DText;
    private _bitmap: Bitmap | undefined;
    private _fontInfo: FontInfo;
    
    public constructor(design: DText) {
        super(design);
        this.design = design;
        this._fontInfo = new FontInfo();
        this.setFlags(UIElementFlags.RequireForegroundSprite);
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        const value = this.design.props.text;
        if (!value) return { width: 0, height: 0 };

        const text = context.evaluateStyleValueAsString(this, value);
        const [width, height] = UIFontHelper.measureTextSize(context.currentWindow.contents, text);

        const info = context.currentFontInfo;
        if (info.face !== this._fontInfo.face ||
            info.size !== this._fontInfo.size) {
            this._fontInfo = info.clone();
            this._bitmap = new Bitmap(width, height);
            this._fontInfo.apply(this._bitmap);
            this._bitmap.drawText(text, 0, 0, width, height, "left");
            this.setInvalidate(UIInvalidateFlags.VisualContent);
        }

        return { width, height };
    }

    override onRefreshVisual(context: UIContext): void {
        if (!this._bitmap) return;
        const sprite = this.prepareForegroundSprite(context, this._bitmap);
        sprite.bitmap = this._bitmap;
    }
}

