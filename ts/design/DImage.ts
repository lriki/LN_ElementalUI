import { DElement, DElementProps } from "./DElement";

export interface DImageProps extends DElementProps {
    file?: string;
    frame?: number[];
}

export class DImage extends DElement {
    readonly props: DImageProps;

    constructor(props: DImageProps) {
        super(props);
        this.props = props;
    }

    public get file(): string {
        return this.props.file ?? "img/sysyem/ElementalUI/BadImage";
    }
}
