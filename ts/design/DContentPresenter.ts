import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DElement, DElementProps } from "./DElement";

export interface DContentPresenterProps extends DElementProps {
    class: string;
}

export class DContentPresenter extends DElement {
    readonly props: DContentPresenterProps;

    public constructor(props: DContentPresenterProps) {
        super(props);
        this.props = props;
    }

}
