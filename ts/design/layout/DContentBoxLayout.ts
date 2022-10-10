import { DElement, DElementProps } from "../DElement";
import { DOrientation } from "./DStackLayout";

export interface DContentBoxLayoutProps extends DElementProps {
    orientation?: DOrientation;
}

export class DContentBoxLayout extends DElement {
    readonly props: DContentBoxLayoutProps;

    constructor(props: DContentBoxLayoutProps) {
        super(props);
        this.props = props;
    }
}
