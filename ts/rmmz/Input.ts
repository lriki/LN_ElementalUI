import { FlexWindowsManager } from "ts/core/FlexWindowsManager";

const _Input_onKeyDown = Input._onKeyDown;
Input._onKeyDown = function(event: any) {
    if (!FlexWindowsManager.instance ||
        !FlexWindowsManager.instance.isReady ||
        !FlexWindowsManager.instance.isPlaytest()) {
        return _Input_onKeyDown.call(this, event);
    }

    //console.log("Input._onKeyDown", event);

    if (event.key == "r") {
        FlexWindowsManager.instance.reloadDesigns();
    }
    else if (event.key == "e") {
        FlexWindowsManager.instance.displayWindowInfo = !FlexWindowsManager.instance.displayWindowInfo;
    }
    else {
        _Input_onKeyDown.call(this, event);
    }
}
