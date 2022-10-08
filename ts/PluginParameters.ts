
var pluginName = 'LN_ElementalUI';

function getNumber(key: string, defaultValue: number): number {
    if (typeof PluginManager == "undefined") return defaultValue;
    const v = PluginManager.parameters(pluginName)[key];
    if (v === undefined) return defaultValue;
    return Number(v);
}

function getBoolean(key: string, defaultValue: boolean): boolean {
    if (typeof PluginManager == "undefined") return defaultValue;
    const v = PluginManager.parameters(pluginName)[key];
    if (v === undefined) return defaultValue;
    return v.toLowerCase() === 'true';
}

function getString(key: string, defaultValue: string): string {
    if (typeof PluginManager == "undefined") return defaultValue;
    const v = PluginManager.parameters(pluginName)[key];
    if (v === undefined) return defaultValue;
    return v;
}

export const paramThemeName = getString("ThemeName", "Default");
export const paramReloadKey = getString("ReloadKey", "r");

console.log("paramThemeName", paramThemeName);

