

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


    // ailias
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;

    // unils
    rect?: DStyleValue;
}

export class DStyle {
    public readonly props: DStyleProps;
    constructor(props: DStyleProps) {
        this.props = props;

        if (this.props.left !== undefined) this.props.marginLeft = this.props.left;
        if (this.props.top !== undefined) this.props.marginTop = this.props.top;
        if (this.props.right !== undefined) this.props.marginRight = this.props.right;
        if (this.props.bottom !== undefined) this.props.marginBottom = this.props.bottom;
    }
}
