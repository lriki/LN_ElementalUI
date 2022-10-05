import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { UICommandWindow } from "ts/ui/windows/UICommandWindow";


const _Window_Command_refresh = Window_Command.prototype.refresh;
Window_Command.prototype.refresh = function() {
    this.clearCommandList();

    assert(this._flexUIWindow instanceof UICommandWindow);

    // const manager = FlexWindowsManager.instance;
    // const design = manager.findWindowDesign(this);
    // if (design) {
    //     manager.windowBuilder.applyCommandListContents(this, design, () => this.makeCommandList());
    // }
    // else {
        this.makeCommandList();
    // }

    this._flexUIWindow.clearSelectableItems();
    for (let i = 0; i < this._list.length; i++) {
        const command = this._list[i];
        this._flexUIWindow.addCommandItem(command, i);
    }

    Window_Selectable.prototype.refresh.call(this);
}

const _Window_Selectable_drawAllItems = Window_Selectable.prototype.drawAllItems;
Window_Selectable.prototype.drawAllItems = function() {
    //_Window_Selectable_drawAllItems.call(this);
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
