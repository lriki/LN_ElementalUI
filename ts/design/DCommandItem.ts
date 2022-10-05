import { DElement, DElementProps } from "ts/design/DElement";


export interface DCommandItemProps extends DElementProps {
    /** UIText として追加する text .*/
    text?: string;

    /** RMMZ の Command Symbol. */
    symbol?: string;

    /** 選択時に実行するスクリプトコマンド。 */
    script?: string;
}

/**
 */
export class DCommandItem extends DElement {
    public readonly props: DCommandItemProps;

    constructor(props: DCommandItemProps) {
        super(props);
        this.props = props;
    }

    public clone(): DElement {
        return new DCommandItem({...this.props});
    }
}
