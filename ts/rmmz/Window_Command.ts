import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { UIWindowContext } from "ts/ui/UIContext";


const _Window_Command_refresh = Window_Command.prototype.refresh;
Window_Command.prototype.refresh = function() {
    this.clearCommandList();

    const manager = FlexWindowsManager.instance;
    const design = manager.findWindowDesign(this);
    if (design) {
        manager.windowBuilder.applyCommandListContents(this, design, () => this.makeCommandList());
    }
    else {
        this.makeCommandList();
    }

    Window_Selectable.prototype.refresh.call(this);
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
