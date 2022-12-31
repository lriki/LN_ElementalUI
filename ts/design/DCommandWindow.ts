import { DElement, DElementProps } from "ts/design/DElement";
import { DCommandItem } from "./DCommandItem";
import { DWindow, DWindowProps } from "./DWindow";


export interface DCommandWindowProps extends DWindowProps {
    /** コアスクリプト内で作られたコマンドに対して表示内容を定義するときのテンプレート。 */
    itemTemplate?: DCommandItem;

    /** Design から直接生成する子要素 */
    items: DCommandItem[];
}

/**
 */
export class DCommandWindow extends DWindow {
    // NOTE: 論理的な子要素は持たず、items によって子要素を生成したいので、通常の Window とは異なる。

    public readonly props: DCommandWindowProps;

    constructor(props: DCommandWindowProps) {
        super(props);
        this.props = props;
    }

    override clone(): DElement {
        return new DCommandWindow({...this.props});
    }
}
