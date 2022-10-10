import { DGridLayout } from "ts/design/layout/DGridLayout";
import { DStackLayout } from "ts/design/layout/DStackLayout";
import { VUIElement } from "../UIElement";

export class UIGridLayout extends VUIElement {
    public readonly design: DGridLayout;

    public constructor(design: DGridLayout) {
        super(design);
        this.design = design;
    }
}
