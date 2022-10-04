import { DElement, DElementProps } from "./DElement";

export interface SceneProps extends DElementProps {
    class: string;
}

/**
 * 
 */
export class SceneDesign extends DElement {
    

    public readonly props: SceneProps;
    //public revision: number;
    constructor(props: SceneProps) {
        super(props);
        this.props = props;
        //this.revision = 1;
    }

    
}
