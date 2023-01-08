import { DGradientGauge } from "ts/design/DGradientGauge";
import { UIContext } from "../UIContext";
import { UIElementFlags, VUIElement } from "../UIElement";

export class UIGradientGauge extends VUIElement {
    public readonly design: DGradientGauge;
    private _bitmap: Bitmap | undefined;
    private _value: number;
    private _maxValue: number;
    
    public constructor(design: DGradientGauge) {
        super(design);
        this.design = design;
        this._value = 0;
        this._maxValue = 0;
        this.setFlags(UIElementFlags.RequireForegroundSprite);
    }

    override update(context: UIContext): void {
        const value = context.evaluateStyleValueAsNumber(this, this.design.value);
        const maxValue = context.evaluateStyleValueAsNumber(this, this.design.maxValue);
        if (this._value != value || this._maxValue != maxValue) {
            this._value = value;
            this._maxValue = maxValue;
            this.drawGaugeRect();
        }
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
        if (!this._bitmap) return;
        const {width, height} = this.actualRect();
        const rate = this._value / (this._maxValue <= 0 ? 1 : this._maxValue);
        const padding = this.design.gaugePadding;
        const fillW = Math.floor((width - (padding * 2)) * rate);
        const fillH = height - (padding * 2);
        const color0 = this.design.backColor;
        const color1 = this.design.startingColor;
        const color2 = this.design.endingColor;
        this._bitmap.clear();
        this._bitmap.fillRect(0, 0, width, height, color0);
        this._bitmap.gradientFillRect(padding, padding, fillW, fillH, color1, color2, false);
    }
}

