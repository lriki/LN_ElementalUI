import { FlexWindowsManager } from "ts/core/FlexWindowsManager";

declare global {
    namespace PluginManager {
        function flexWindowsManager(): FlexWindowsManager;
    }
}

/** 外部から拡張するために Manager を公開する */
PluginManager.flexWindowsManager = function(): FlexWindowsManager {
    return FlexWindowsManager.instance;
}

