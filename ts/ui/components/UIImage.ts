import { assert } from "ts/core/Common";
import { DImage } from "ts/design/DImage";
import { DText } from "ts/design/DText";
import { VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { UIElementFlags, VUIElement } from "../UIElement";
import { UIHAlignment, UIVAlignment } from "../utils/UILayoutHelper";

export class UIImage extends VUIElement {
    private _bitmap: Bitmap;
    
    public constructor(design: DImage) {
        super(design);
        this._bitmap = ImageManager.loadSystem(design.source);
        this.actualStyle.defaultHorizontalAlignment = UIHAlignment.Center;
        this.actualStyle.defaultVerticalAlignment = UIVAlignment.Center;
        this.setFlags(UIElementFlags.RequireForegroundSprite);
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        return { width: this._bitmap.width, height: this._bitmap.height };
    }

    override onRefreshVisual(context: UIContext): void {
        const sprite = this.prepareForegroundSprite(context, this._bitmap);
    }
}

