import { DElement, DElementProps } from "./DElement";
import { DStyleValue } from "./DStyle";

export interface DStaticTextProps extends DElementProps {
    text?: DStyleValue;
}

export class DStaticText extends DElement {
    readonly props: DStaticTextProps;

    constructor(props: DStaticTextProps) {
        super(props);
        this.props = props;
    }
}
