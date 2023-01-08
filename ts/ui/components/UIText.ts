import { DText } from "ts/design/DText";
import { VUISize } from "../UICommon";
import { FontInfo, UIContext } from "../UIContext";
import { UIElementFlags, UIInvalidateFlags, VUIElement } from "../UIElement";
import { UIFontHelper } from "../utils/UIFontHelper";

export class UIText extends VUIElement {
    public readonly design: DText;
    private _bitmap: Bitmap | undefined;
    private _fontInfo: FontInfo;
    private _text: string;
    private _needsRedrawText: boolean;
    
    public constructor(design: DText) {
        super(design);
        this.design = design;
        this._fontInfo = new FontInfo();
        this._text = "";
        this._needsRedrawText = false;
        this.setFlags(UIElementFlags.RequireForegroundSprite);
    }

    override update(context: UIContext): void {
        const value = this.design.props.text;
        const text = context.evaluateStyleValueAsString(this, value);
        if (this._text !== text) {
            this._text = text;
            this._needsRedrawText = true;
            this.setInvalidate(UIInvalidateFlags.Layout);
        }
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        if (!this._text) return { width: 0, height: 0 };

        const [width, height] = UIFontHelper.measureTextSize(context.currentWindow.contents, this._text);

        // テキストの頻繁な変更により、Bitmapの再生成をある程度防ぐため、最小サイズを維持する
        if (!this._bitmap || width > this._bitmap.width || height > this._bitmap.height) {
            this._bitmap = new Bitmap(width, height);
        }

        const info = context.currentFontInfo;
        if (info.face !== this._fontInfo.face ||
            info.size !== this._fontInfo.size) {
            this._fontInfo = info.clone();
            this._needsRedrawText = true;
        }

        if (this._needsRedrawText) {
            this._fontInfo.apply(this._bitmap);
            this._bitmap.clear();
            this._bitmap.drawText(this._text, 0, 0, width, height, "left");
            this.setInvalidate(UIInvalidateFlags.VisualContent);
        }

        return { width, height };
    }

    override onRefreshVisual(context: UIContext): void {
        if (!this._bitmap) return;
        const sprite = this.prepareForegroundSprite(context, this._bitmap);
    }
}

