import { DElement, DElementProps } from "../DElement";
import { DOrientation } from "./DStackLayout";

export interface DAccordionLayoutProps extends DElementProps {
    orientation?: DOrientation;
}

export class DAccordionLayout extends DElement {
    readonly props: DAccordionLayoutProps;

    constructor(props: DAccordionLayoutProps) {
        super(props);
        this.props = props;
    }

    public get orientation(): DOrientation {
        return this.props.orientation || DOrientation.Horizontal;
    }
}
