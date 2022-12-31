

const _SceneManager_onSceneCreate = SceneManager.onSceneCreate;
SceneManager.onSceneCreate = function() {
    _SceneManager_onSceneCreate.call(this);
};
