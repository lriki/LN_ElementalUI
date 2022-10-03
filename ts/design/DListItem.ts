import { DElement, DElementProps } from "./DElement";

export interface DListItemProps extends DElementProps {
    text?: string;
    symbol?: string;
    enabled?: boolean;
}

export class DListItem extends DElement {
    readonly props: DListItemProps;

    constructor(props: DListItemProps) {
        super(props);
        this.props = props;
    }

    public get text(): string {
        return this.props.text ?? "";
    }

    public get symbol(): string {
        return this.props.symbol ?? "";
    }

    public get enabled(): boolean {
        return this.props.enabled ?? true;
    }
}
