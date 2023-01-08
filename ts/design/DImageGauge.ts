import { DElement, DElementProps } from "./DElement";
import { DStyleValue } from "./DStyle";

export interface DImageGaugeProps extends DElementProps {
    file?: string;
    backFrame?: number[];
    gaugeFrame?: number[];
    gaugeOffsetX?: number;
    gaugeOffsetY?: number;
    value?: DStyleValue;
    maxValue?: DStyleValue;
}

export class DImageGauge extends DElement {
    readonly props: DImageGaugeProps;

    constructor(props: DImageGaugeProps) {
        super(props);
        this.props = props;
    }

    public get file(): string {
        return this.props.file ?? "img/sysyem/ElementalUI/BadImage";
    }

    public get gaugeOffsetX(): number {
        return this.props.gaugeOffsetX ?? 0;
    }

    public get gaugeOffsetY(): number {
        return this.props.gaugeOffsetY ?? 0;
    }

    public get value(): DStyleValue {
        return this.props.value ?? 50;
    }

    public get maxValue(): DStyleValue {
        return this.props.maxValue ?? 100;
    }
}
