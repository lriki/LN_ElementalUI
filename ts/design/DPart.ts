import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DElement, DElementProps } from "./DElement";

export interface DPartProps extends DElementProps {
    class: string;
}
