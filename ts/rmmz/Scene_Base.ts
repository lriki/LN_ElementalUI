import { VAnimation } from "ts/animation/AnimationManager";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { UIScene } from "ts/ui/UIScene";

declare global {
    interface Scene_Base {
        _flexUIScene: UIScene | undefined;
    }
}

// Scene_Title.initialize() 時点では Graphics.boxWidth が 0 なので、create で構築してみる。
const _Scene_Base_create = Scene_Base.prototype.create;
Scene_Base.prototype.create = function() {
    _Scene_Base_create.call(this);

    const manager = FlexWindowsManager.instance;
    if (manager) {
        const design = manager.findSceneDesign(this);
        if (design) {
            this._flexUIScene = manager.uiElementFactory.instantiateScene(design);
            this._flexUIScene.attachRmmzScene(this);
            this._flexUIScene.context.layoutInitial(Graphics.boxWidth, Graphics.boxHeight);
        }
    }
}

const _Scene_Base_addWindow = Scene_Base.prototype.addWindow;
Scene_Base.prototype.addWindow = function(window) {
    _Scene_Base_addWindow.call(this, window);

    if (this._flexUIScene) {
        this._flexUIScene.attachRmmzWindowIfNeeded(window);
    }
};

const _Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    _Scene_Base_update.call(this);
    if (this._flexUIScene) {
        this._flexUIScene.context.update(Graphics.boxWidth, Graphics.boxHeight);
    }
    VAnimation.update();
}
