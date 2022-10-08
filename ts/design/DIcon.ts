import { DElement, DElementProps } from "./DElement";

export interface DIconProps extends DElementProps {
    src?: string;
    iconIndex?: number;
}

export class DIcon extends DElement {
    readonly props: DIconProps;

    constructor(props: DIconProps) {
        super(props);
        this.props = props;
    }

    public get iconIndex(): number {
        return this.props.iconIndex ?? 0;
    }
}
