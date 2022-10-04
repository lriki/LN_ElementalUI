import { DElement, DElementProps } from "./DElement";

export interface DTextProps extends DElementProps {
    text?: string;
}

export class DText extends DElement {
    readonly props: DTextProps;

    constructor(props: DTextProps) {
        super(props);
        this.props = props;
    }

    public get text(): string {
        return this.props.text ?? "";
    }
}
