

export class DStyleScriptValue {
    public readonly script: string;

    public constructor(script: string) {
        this.script = script;
    }
}

export type DStyleValue = number | DStyleScriptValue;


export interface DStyleProps {
    state?: string;

    marginLeft?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;

    paddingLeft?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;

    x?: number;
    y?: number;
    width?: number;
    height?: number;

    colorTone?: number[];

    opacity?: number;           // 全体
    backOpacity?: number;
    contentsOpacity?: number;

    background?: string;

    // Window.origin
    originX?: number;
    originY?: number;

    // Window.frameVisible
    frameVisible?: boolean;

    // unils
    rect?: DStyleValue;
}

export class DStyle {
    public readonly props: DStyleProps;
    constructor(props: DStyleProps) {
        this.props = props;
    }
}
