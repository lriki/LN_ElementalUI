import { DElement } from "ts/design/DElement";
import { DSelectableItem, DSelectableItemProps } from "./DSelectableItem";

export interface DCommandItemProps extends DSelectableItemProps {
    /** UIText として追加する text .*/
    text?: string;

    /** RMMZ の Command Symbol. */
    symbol?: string;

    enabled?: boolean;

    /** 選択時に実行するスクリプトコマンド。 */
    script?: string;
    
}

/**
 */
export class DCommandItem extends DSelectableItem {
    public readonly props: DCommandItemProps;

    constructor(props: DCommandItemProps) {
        super(props);
        this.props = props;
    }

    override clone(): DElement {
        return new DCommandItem({...this.props});
    }
}
