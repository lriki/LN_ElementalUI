import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DImageGauge, DImageGaugeOrientation } from "ts/design/DImageGauge";
import { VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { UIElementFlags, VUIElement } from "../UIElement";

export class UIImageGauge extends VUIElement {
    public readonly design: DImageGauge;
    private _bitmap: Bitmap;
    private _gaugeSprite: Sprite | undefined;
    private _value: number;
    private _maxValue: number;
    
    public constructor(design: DImageGauge) {
        super(design);
        this.design = design;
        this._bitmap = FlexWindowsManager.instance.loadBitmap(design.file);
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
            this.refreshGaugeSprite();
        }
    }

    override measureOverride(context: UIContext, constraint: VUISize): VUISize {
        const frame = this.design.props.backFrame;
        if (frame) {
            return { width: frame[2], height: frame[3] };
        }
        else {
            return { width: this._bitmap.width, height: this._bitmap.height };
        }
    }
    
    override onRefreshVisual(context: UIContext): void {
        const sprite = this.prepareForegroundSprite(context, this._bitmap);
        const backFrame = this.design.props.backFrame;
        if (backFrame) {
            sprite.setFrame(backFrame[0], backFrame[1], backFrame[2], backFrame[3]);
        }

        if (this._gaugeSprite) {
            sprite.removeChild(this._gaugeSprite);
            this._gaugeSprite = undefined;
        }
        this._gaugeSprite = new Sprite(this._bitmap);
        sprite.addChild(this._gaugeSprite);
        this.refreshGaugeSprite();
    }

    private refreshGaugeSprite(): void {
        const frame = this.design.props.gaugeFrame;
        if (!frame) return;
        if (!this._gaugeSprite) return;

        const rate = this._value / (this._maxValue <= 0 ? 1 : this._maxValue);

        if (this.design.orientation == DImageGaugeOrientation.LeftToRight) {
            const frameWidth = frame[2];
            const width = Math.floor(frameWidth * rate);
            this._gaugeSprite.setFrame(frame[0], frame[1], width, frame[3]);
            this._gaugeSprite.x = this.design.gaugeOffsetX;
            this._gaugeSprite.y = this.design.gaugeOffsetY;
        }
        else if (this.design.orientation == DImageGaugeOrientation.BottomToTop) {
            const frameHeight = frame[3];
            const height = Math.floor(frameHeight * rate);
            this._gaugeSprite.setFrame(frame[0], frame[1] + (frameHeight - height), frame[2], height);
            this._gaugeSprite.x = this.design.gaugeOffsetX;
            this._gaugeSprite.y = this.design.gaugeOffsetY + (frameHeight - height);
        }
    }
}

