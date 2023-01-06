import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DIcon } from "ts/design/DIcon";
import { DStaticText } from "ts/design/DStaticText";
import { VUIPoint, VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { UIElementFlags, VUIElement } from "../UIElement";
import { UIHAlignment, UIVAlignment } from "../utils/UILayoutHelper";

export class UIICon extends VUIElement {
    public readonly design: DIcon;
    private _bitmap: Bitmap;
    
    public constructor(design: DIcon) {
        super(design);
        this.design = design;
        if (design.props.src) {
            this._bitmap = ImageManager.loadBitmap(FlexWindowsManager.instance.designDirectory, design.props.src);
        }
        else {
            this._bitmap = ImageManager.loadSystem("IconSet");
        }
        // this.actualStyle.defaultHorizontalAlignment = UIHAlignment.Center;
        // this.actualStyle.defaultVerticalAlignment = UIVAlignment.Center;
        this.setFlags(UIElementFlags.RequireForegroundSprite);
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        return {
            width: ImageManager.iconWidth,
            height: ImageManager.iconHeight,
        };
    }

    override onRefreshVisual(context: UIContext): void {
        const sprite = this.prepareForegroundSprite(context, this._bitmap);
        
        // Window_Base.prototype.drawIcon
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (this.design.iconIndex % 16) * pw;
        const sy = Math.floor(this.design.iconIndex / 16) * ph;
        sprite.setFrame(sx, sy, pw, ph);
    }
}

