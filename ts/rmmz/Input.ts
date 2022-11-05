import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { paramInfoKey, paramReloadKey } from "ts/PluginParameters";

const _Input_onKeyDown = Input._onKeyDown;
Input._onKeyDown = function(event: any) {
    if (!FlexWindowsManager.instance ||
        !FlexWindowsManager.instance.isReady ||
        !FlexWindowsManager.instance.isPlaytest()) {
        return _Input_onKeyDown.call(this, event);
    }

    if (event.key == paramReloadKey) {
        FlexWindowsManager.instance.reloadDesigns();
    }
    else if (event.key == paramInfoKey) {
        FlexWindowsManager.instance.displayWindowInfo = !FlexWindowsManager.instance.displayWindowInfo;
    }
    else {
        _Input_onKeyDown.call(this, event);
    }
}
