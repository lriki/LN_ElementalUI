import { FlexWindowsManager } from "ts/core/FlexWindowsManager";

const _Input_onKeyDown = Input._onKeyDown;
Input._onKeyDown = function(event: any) {
    if (!FlexWindowsManager.instance ||
        !FlexWindowsManager.instance.isReady ||
        !FlexWindowsManager.instance.isPlaytest()) {
        return _Input_onKeyDown.call(this, event);
    }

    if (event.ctrlKey && event.key == "@") {
        FlexWindowsManager.instance.reloadDesigns();
    }
    else {
        _Input_onKeyDown.call(this, event);
    }
}
