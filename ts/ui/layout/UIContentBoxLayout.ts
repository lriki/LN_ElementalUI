import { DContentBoxLayout } from "ts/design/layout/DContentBoxLayout";
import { DStackLayout } from "ts/design/layout/DStackLayout";
import { VUIElement } from "../UIElement";

export class UIContentBoxLayout extends VUIElement {
    public readonly design: DContentBoxLayout;

    public constructor(design: DContentBoxLayout) {
        super(design);
        this.design = design;
    }
}
