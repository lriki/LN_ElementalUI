import { FlexWindowsManager } from "ts/core/FlexWindowsManager";

const _Scene_Boot_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
    _Scene_Boot_create.call(this);
    
    FlexWindowsManager.instance = new FlexWindowsManager();
    FlexWindowsManager.instance.initialize();
}

const _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    if (!FlexWindowsManager.instance.isReady) {
        return false;
    }
    return _Scene_Boot_isReady.call(this);
}
