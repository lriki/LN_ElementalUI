import { DElement, DElementProps } from "./DElement";

export interface DImageProps extends DElementProps {
    source?: string;
}

export class DImage extends DElement {
    readonly props: DImageProps;

    constructor(props: DImageProps) {
        super(props);
        this.props = props;
    }

    public get source(): string {
        return this.props.source ?? "ElementalUI/BadImage";
    }
}
