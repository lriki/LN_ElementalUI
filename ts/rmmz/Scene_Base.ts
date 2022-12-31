import { VAnimation } from "ts/animation/AnimationManager";
import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { UIScene } from "ts/ui/UIScene";

declare global {
    interface Scene_Base {
        _flexUIScene: UIScene | undefined;
        _flexDesignRevision: number | undefined;
        _flexUIInitialUpdate: boolean | undefined;
    }
}

// Scene_Title.initialize() 時点では Graphics.boxWidth が 0 なので、create で構築してみる。
const _Scene_Base_create = Scene_Base.prototype.create;
Scene_Base.prototype.create = function() {
    _Scene_Base_create.call(this);

    // UIScene のインスタンスを作り、関連付ける。
    // instantiateScene() から VisualTree も作られる。
    // ただし、Game_Window とのアタッチはまだ行われないので注意。
    // Game_Window を new するときには Rect が取れるようにしたいので、VisualTree はそれらよりも先に作っておく必要がある。
    const manager = FlexWindowsManager.instance;
    if (manager) {
        const design = manager.findSceneDesign(this);
        this._flexUIScene = manager.uiElementFactory.instantiateScene(design);
        this._flexUIScene.attachRmmzScene(this);
        this._flexDesignRevision = manager.designFilesRevision;
    }
    
    this._flexUIInitialUpdate = true;
}

const _Scene_Base_addWindow = Scene_Base.prototype.addWindow;
Scene_Base.prototype.addWindow = function(window) {
    _Scene_Base_addWindow.call(this, window);

    // if (this._flexUIScene) {
    //     this._flexUIScene.attachRmmzWindowIfNeeded(window);
    // }
};

const _Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    _Scene_Base_update.call(this);

    if (this._flexUIInitialUpdate) {
        assert(this._flexUIScene);
        this._flexUIScene.onSceneCreate();
    }
    
    const manager = FlexWindowsManager.instance;
    if (manager) {
        manager.reloadSceneDesignIfNeeded(this);
    }

    // RMMZ の Window 構築は Scene の create() で行われる。
    // その内容を UIElement に反映するため、確実に構築が終わったタイミングをフックする。
    // if (this._scene && this._scene._flexUIScene) {
    //     this._scene._flexUIScene.onSceneCreate();
    // }

    if (this._flexUIScene) {
        this._flexUIScene.context.update(Graphics.boxWidth, Graphics.boxHeight);
    }
    VAnimation.update();
}
