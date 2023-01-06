import { DElement, DElementProps } from "./DElement";
import { DStyleValue } from "./DStyle";

export interface DGradientGaugeProps extends DElementProps {
    backColor?: string;
    color1?: string; // startingColor
    color2?: string; // endingColor
}

export class DGradientGauge extends DElement {
    readonly props: DGradientGaugeProps;

    constructor(props: DGradientGaugeProps) {
        super(props);
        this.props = props;
    }

    public get backColor(): string {
        return this.props.backColor ?? ColorManager.gaugeBackColor();
    }

    public get startingColor(): string {
        return this.props.color1 ?? ColorManager.normalColor();
    }

    public get endingColor(): string {
        return this.props.color2 ?? ColorManager.normalColor();
    }
}
