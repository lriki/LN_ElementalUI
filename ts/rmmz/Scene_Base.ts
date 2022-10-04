import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { UIScene } from "ts/ui/UIScene";

declare global {
    interface Scene_Base {
        _flexUIScene: UIScene | undefined;
    }
}

const _Scene_Base_initialize  = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function() {
    _Scene_Base_initialize.call(this);

    const design = FlexWindowsManager.instance.findSceneDesign(this);
    if (design) {
        this._flexUIScene = FlexWindowsManager.instance.uiElementFactory.instantiateScene(design);
        this._flexUIScene.attachRmmzScene(this);
    }
}

const _Scene_Base_addWindow = Scene_Base.prototype.addWindow ;
Scene_Base.prototype.addWindow = function(window) {
    _Scene_Base_addWindow.call(this, window);

    if (this._flexUIScene && window._flexUIWindow) {
        this._flexUIScene.attachRmmzWindowIfNeeded(window);
    }
};
