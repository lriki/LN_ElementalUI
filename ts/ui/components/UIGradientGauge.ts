import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DGradientGauge } from "ts/design/DGradientGauge";
import { DIcon } from "ts/design/DIcon";
import { DStaticText } from "ts/design/DStaticText";
import { VUIPoint, VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { UIElementFlags, VUIElement } from "../UIElement";
import { UIHAlignment, UIVAlignment } from "../utils/UILayoutHelper";

export class UIGradientGauge extends VUIElement {
    public readonly design: DGradientGauge;
    private _bitmap: Bitmap | undefined;
    
    public constructor(design: DGradientGauge) {
        super(design);
        this.design = design;
        this.setFlags(UIElementFlags.RequireForegroundSprite);
    }

    // override measureOverride(context: UIContext, constraint: VUISize): VUISize {
    //     return {
    //         width: ImageManager.iconWidth,
    //         height: ImageManager.iconHeight,
    //     };
    // }

    override update(context: UIContext): void {
        //console.log("UIGradientGauge.update", this);
    }

    override onRefreshVisual(context: UIContext): void {
        if (!this._bitmap) {
            const {width, height} = this.actualRect();
            this._bitmap = new Bitmap(width, height);
        }
        const sprite = this.prepareForegroundSprite(context, this._bitmap);
        this.drawGaugeRect();
    }

    private drawGaugeRect(): void {
        console.log("drawGaugeRect", this);
        if (!this._bitmap) return;
        const {width, height} = this.actualRect();
        const rate = 0.7;//this.gaugeRate();
        const fillW = Math.floor((width - 2) * rate);
        const fillH = height - 2;
        const color0 = this.design.backColor;
        const color1 = this.design.startingColor;
        const color2 = this.design.endingColor;
        this._bitmap.fillRect(0, 0, width, height, color0);
        this._bitmap.gradientFillRect(1, 1, fillW, fillH, color1, color2, false);
    };
}

