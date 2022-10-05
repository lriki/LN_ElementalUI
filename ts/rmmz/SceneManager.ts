

const _SceneManager_onSceneCreate = SceneManager.onSceneCreate;
SceneManager.onSceneCreate = function() {
    _SceneManager_onSceneCreate.call(this);

    // RMMZ の Window 構築は Scene の create() で行われる。
    // その内容を UIElement に反映するため、確実に構築が終わったタイミングをフックする。
    if (this._scene && this._scene._flexUIScene) {
        this._scene._flexUIScene.syncFromAllRmmzWindowContents();
    }
};
