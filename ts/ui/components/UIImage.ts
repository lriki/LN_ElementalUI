import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DImage } from "ts/design/DImage";
import { DStaticText } from "ts/design/DText";
import { VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { UIElementFlags, VUIElement } from "../UIElement";
import { UIHAlignment, UIVAlignment } from "../utils/UILayoutHelper";

export class UIImage extends VUIElement {
    public readonly design: DImage;
    private _bitmap: Bitmap;
    
    public constructor(design: DImage) {
        super(design);
        this.design = design;
        this._bitmap = FlexWindowsManager.instance.loadBitmap(design.file);
        this.setFlags(UIElementFlags.RequireForegroundSprite);
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        const frame = this.design.props.frame;
        if (frame) {
            return { width: frame[2], height: frame[3] };
        }
        else {
            return { width: this._bitmap.width, height: this._bitmap.height };
        }
    }

    override onRefreshVisual(context: UIContext): void {
        const sprite = this.prepareForegroundSprite(context, this._bitmap);
        const frame = this.design.props.frame;
        if (frame) {
            sprite.setFrame(frame[0], frame[1], frame[2], frame[3]);
        }
    }
}

