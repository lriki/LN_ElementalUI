import { FlexWindowsManager } from "ts/core/FlexWindowsManager";

declare global {
    interface Window_Base {
        _flexWindowDesignRevision: number | undefined;
    }
}

const _Window_Base_initialize = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(rect: Rectangle): void {
    _Window_Base_initialize.call(this, rect);
    FlexWindowsManager.instance.applyDesign(this);
}

