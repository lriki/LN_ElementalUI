import { DElement, DElementProps } from "ts/design/DElement";


export interface WindowProps extends DElementProps {
    class: string;
    //rect?: number[];
    //itemTemplate: DElement;
    visibleCoreContents?: boolean;
}

/**
 * 各種 Window のデザインデータ
 * 
 * Window が new されたとき (initialize() されたとき) に、このデザインを適用する。
 */
export class DWindow extends DElement {
    public readonly props: WindowProps;
    // name: string;
    // content: string;

    

    public revision: number;


    constructor(props: WindowProps) {
        super(props);
        this.props = props;
        this.revision = 1;
    }

    override clone(): DElement {
        return new DWindow({...this.props});
    }

}
