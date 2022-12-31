import { DElement, DElementProps } from "ts/design/DElement";


export interface DWindowProps extends DElementProps {
    class: string;
    //rect?: number[];
    //itemTemplate: DElement;
    visibleCoreContents?: boolean;

    /** Window のインスタンスに設定するプロパティ */
    windowProps?: { [key: string]: any; }
}

/**
 * 各種 Window のデザインデータ
 * 
 * Window が new されたとき (initialize() されたとき) に、このデザインを適用する。
 */
export class DWindow extends DElement {
    public readonly props: DWindowProps;
    // name: string;
    // content: string;

    

    public revision: number;


    constructor(props: DWindowProps) {
        super(props);
        this.props = props;
        this.revision = 1;
    }

    override clone(): DElement {
        return new DWindow({...this.props});
    }

}
