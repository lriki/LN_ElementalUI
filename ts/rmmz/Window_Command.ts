import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { UICommandWindow } from "ts/ui/windows/UICommandWindow";


const _Window_Command_refresh = Window_Command.prototype.refresh;
Window_Command.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();


    Window_Selectable.prototype.refresh.call(this);
}

const _Window_Selectable_drawAllItems = Window_Selectable.prototype.drawAllItems;
Window_Selectable.prototype.drawAllItems = function() {
    //_Window_Selectable_drawAllItems.call(this);
    // this._contentsSprite.visible = false;
    // this._contentsBackSprite.visible = false;
}
// const _Window_Command_itemWidth = Window_Command.prototype.itemWidth;
// Window_Selectable.prototype.itemWidth = function() {
//     return 50;
//     return _Window_Command_itemWidth.call(this);
// }

// const _Window_Selectable_itemHeight = Window_Selectable.prototype.itemHeight;
// Window_Selectable.prototype.itemHeight = function() {
//     return 50;
//     return _Window_Selectable_itemHeight.call(this);
// };
