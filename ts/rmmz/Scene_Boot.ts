import { FlexWindowsManager } from "ts/core/FlexWindowsManager";

const _Scene_Boot_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
    _Scene_Boot_create.call(this);
}

// const _Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
// Scene_Boot.prototype.onDatabaseLoaded = function() {
//     _Scene_Boot_onDatabaseLoaded.call(this);
//     // デフォルトの WindowSkin のロード後に実行したい
//     FlexWindowsManager.instance = new FlexWindowsManager();
//     FlexWindowsManager.instance.initialize();
// };

const _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {

    // Base の isReady の中から、 onDatabaseLoaded() が呼ばれる。
    const baseResult = _Scene_Boot_isReady.call(this);

    if (baseResult && !FlexWindowsManager.instance) {
        // デフォルトの WindowSkin のロード後に実行したい
        FlexWindowsManager.instance = new FlexWindowsManager();
        FlexWindowsManager.instance.initialize();
    }

    return baseResult && FlexWindowsManager.instance && FlexWindowsManager.instance.isReady;
}
