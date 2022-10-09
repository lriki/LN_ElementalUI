import { DElement, DElementProps } from "./DElement";
import { DStyleValue } from "./DStyle";

export interface DTextProps extends DElementProps {
    text?: DStyleValue;
}

export class DText extends DElement {
    readonly props: DTextProps;

    constructor(props: DTextProps) {
        super(props);
        this.props = props;
    }
}
