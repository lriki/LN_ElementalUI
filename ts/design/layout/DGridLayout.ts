import { DElement, DElementProps } from "../DElement";

export interface DGridLayoutProps extends DElementProps {
}

export class DGridLayout extends DElement {
    readonly props: DGridLayoutProps;

    constructor(props: DGridLayoutProps) {
        super(props);
        this.props = props;
    }
}
