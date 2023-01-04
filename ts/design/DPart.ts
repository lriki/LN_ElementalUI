import { assert } from "ts/core/Common";
import { DElement } from "./DElement";

export interface DPartProps {
    class: string;
}

/**
 * Desing 初期構築用のダミーデータ。
 * link で本来あるべきデータに置き換えられる。
 */
export class DPart extends DElement {
    readonly props: DPartProps;
    private _target: DElement | undefined;

    public constructor(props: DPartProps) {
        super(props);
        this.props = props;
    }

    public get target(): DElement {
        assert(this._target)
        return this._target;
    }

    // override link(manager: FlexWindowsManager) {
    //     this._target = manager.windowDesigns.get(this.props.class);
    //     assert(this._target);

    //     super.link(manager);
    // }
}
