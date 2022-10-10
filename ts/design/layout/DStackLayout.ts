import { DElement, DElementProps } from "../DElement";

export enum DOrientation {
    Horizontal = "horizontal",
    Vertical = "vertical",
    ReverseHorizontal = "reverse-horizontal",
    ReverseVertical = "reverse-vertical",
}

export interface DStackLayoutProps extends DElementProps {
    orientation?: DOrientation;
    lastStretch?: boolean;
}

export class DStackLayout extends DElement {
    readonly props: DStackLayoutProps;

    constructor(props: DStackLayoutProps) {
        super(props);
        this.props = props;
    }

    public get orientation(): DOrientation {
        return this.props.orientation || DOrientation.Horizontal;
    }
}
