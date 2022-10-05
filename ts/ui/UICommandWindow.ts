import { DCommandWindow } from "ts/design/DCommandWindow";
import { UIWindow } from "./UIWindow";

export class UICommandWindow extends UIWindow {
    /*
    ItemPresenter は？
    ----------
    作らない。複雑になりすぎる。
    RMMZ では Content Area は contents という Sprite が示す箇所となるが、それに合わせておく方が良いだろう。
    */

    public readonly design: DCommandWindow;

    constructor(design: DCommandWindow) {
        super(design);
        this.design = design;
    }

}

