import { DElement } from "ts/design/DElement";


export interface WindowProps {
    class: string;
    rect?: number[];
    itemTemplate: DElement;
    children?: DElement[];
}

/**
 * 各種 Window のデザインデータ
 * 
 * Window が new されたとき (initialize() されたとき) に、このデザインを適用する。
 */
export class WindowDesign {
    public readonly props: WindowProps;
    // name: string;
    // content: string;

    

    public revision: number;


    constructor(props: WindowProps) {
        this.props = props;
        this.revision = 1;
    }

}
