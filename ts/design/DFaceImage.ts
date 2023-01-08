import { DElement, DElementProps } from "./DElement";

export interface DFaceImageProps extends DElementProps {
    faceName?: string;
    faceIndex?: number;
}

export class DFaceImage extends DElement {
    readonly props: DFaceImageProps;

    constructor(props: DFaceImageProps) {
        super(props);
        this.props = props;
    }
}
