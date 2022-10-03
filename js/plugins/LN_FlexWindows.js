//=============================================================================
// LN_FilmicFilter.js
// ----------------------------------------------------------------------------
// Copyright (c) 2021 lriki
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/lriki/LN_FilmicFilter
// [Twitter]: https://twitter.com/lriki8
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc LN_FilmicFilter v1.0.2 (MIT License)
 * @author LRIKI
 *
 * @help グラフィックスをより豊かに見せるための撮影効果を付加します。
 *
 * 使い方は次のページを参照してください。
 * https://github.com/lriki/LN_FilmicFilter/blob/main/README.md
 *
 * 変更履歴は次のページを参照してください。
 * https://github.com/lriki/LN_FilmicFilter/releases
 *
 * 既知の不具合や要望は次のページを参照してください。
 * https://github.com/lriki/LN_FilmicFilter/issues
 *
 * @param EditorKey
 * @text エディタの表示キー
 * @desc デフォルトのF11キーでエディタが表示できない場合に、キーを変更できます。例えば A キーで表示する場合 a と入力してください。
 * @default F11
 * @type string
 *
 * @command SetFilmicFilter
 * @text SetFilmicFilter
 * @desc フィルタを適用します。
 *
 * @arg filterId
 * @type number
 * @min -1
 * @default 0
 * @text フィルタID
 * @desc 適用するフィルタファイルの番号です。 (例: 2-夕焼け.json の場合は 2 を指定する)
 *
 * @arg duration
 * @type number
 * @default 30
 * @text 時間
 * @desc 変化にかける時間です。フレーム単位で指定します。
 *
 * @arg wait
 * @type boolean
 * @default true
 * @text 完了までウェイト
 * @desc 変化が完了するまでイベントを待機します。
 */
 
 

 
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ts/core/Common.ts":
/*!***************************!*\
  !*** ./ts/core/Common.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.assert = void 0;\r\nfunction assert(condition, msg) {\r\n    if (!condition) {\r\n        console.error(\"assert: \" + msg);\r\n        throw new Error(msg);\r\n    }\r\n}\r\nexports.assert = assert;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/core/Common.ts?");

/***/ }),

/***/ "./ts/core/FlexWindowsManager.ts":
/*!***************************************!*\
  !*** ./ts/core/FlexWindowsManager.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.FlexWindowsManager = exports.StyleDef = exports.PictureDef = void 0;\r\nconst fs_1 = __importDefault(__webpack_require__(/*! fs */ \"fs\"));\r\nconst DListItem_1 = __webpack_require__(/*! ts/design/DListItem */ \"./ts/design/DListItem.ts\");\r\nconst UIElementFactory_1 = __webpack_require__(/*! ts/ui/UIElementFactory */ \"./ts/ui/UIElementFactory.ts\");\r\nconst WindowBuilder_1 = __webpack_require__(/*! ./WindowBuilder */ \"./ts/core/WindowBuilder.ts\");\r\nconst WindowDesign_1 = __webpack_require__(/*! ./WindowDesign */ \"./ts/core/WindowDesign.ts\");\r\nclass PictureDef {\r\n    constructor(props) {\r\n        this.props = props;\r\n    }\r\n}\r\nexports.PictureDef = PictureDef;\r\nclass StyleDef {\r\n    constructor(props) {\r\n        this.props = props;\r\n    }\r\n}\r\nexports.StyleDef = StyleDef;\r\nfunction Window(props) {\r\n    return new WindowDesign_1.WindowDesign(props);\r\n}\r\nfunction ContentPresenter(props) {\r\n    return props;\r\n}\r\nfunction ListItem(props) {\r\n    return new DListItem_1.DListItem(props);\r\n}\r\nfunction Picture(props) {\r\n    return new PictureDef(props);\r\n}\r\nfunction Style(props) {\r\n    return new StyleDef(props);\r\n}\r\nfunction EasingAnimation(props) {\r\n    return props;\r\n}\r\nclass FlexWindowsManager {\r\n    constructor() {\r\n        this.displayWindowInfo = false;\r\n        this._windowDesigns = new Map();\r\n        this._loadedFileCount = 0;\r\n        this._settingFiles = [];\r\n        this._isReady = false;\r\n        this._windowBuilder = new WindowBuilder_1.WindowBuilder();\r\n        this._uiElementFactory = new UIElementFactory_1.UIElementFactory();\r\n        this.updateIndexFile();\r\n        this.beginLoadSettingFiles();\r\n    }\r\n    get isReady() {\r\n        return this._isReady;\r\n    }\r\n    get windowBuilder() {\r\n        return this._windowBuilder;\r\n    }\r\n    get uiElementFactory() {\r\n        return this._uiElementFactory;\r\n    }\r\n    registerElementComponent() {\r\n    }\r\n    registerValueComponent() {\r\n    }\r\n    findWindowDesign(window) {\r\n        const className = window.constructor.name;\r\n        return this._windowDesigns.get(className);\r\n    }\r\n    /** 既に存在している Window に対して、テンプレートを適用する */\r\n    applyDesign(window) {\r\n        const className = window.constructor.name;\r\n        const data = this._windowDesigns.get(className);\r\n        if (data) {\r\n            this._windowBuilder.applyDesign(window, data);\r\n        }\r\n    }\r\n    // private loadWindowTemplate(className: string): WindowTemplate {\r\n    //     const data = this._windowTemplates.get(className);\r\n    //     if (data) {\r\n    //         return data;\r\n    //     }\r\n    //     else {\r\n    //     }\r\n    // }\r\n    reloadDesigns() {\r\n    }\r\n    updateIndexFile() {\r\n        if (this.isNode()) {\r\n            const allFiles = fs_1.default.readdirSync(\"data/windows\");\r\n            const settingFiles = allFiles.filter((file) => file.endsWith(\".js\"));\r\n            const indexData = settingFiles;\r\n            fs_1.default.writeFileSync(\"data/windows/index.json\", JSON.stringify(indexData));\r\n        }\r\n        else {\r\n        }\r\n    }\r\n    beginLoadSettingFiles() {\r\n        this.loadDataFile(\"windows/index.json\", (obj) => {\r\n            this._settingFiles = obj;\r\n            this._loadedFileCount = 0;\r\n            for (let i = 0; i < this._settingFiles.length; i++) {\r\n                const file = this._settingFiles[i];\r\n                if (file) {\r\n                    this.loadTextFile(\"windows/\" + file, (str) => {\r\n                        this.evalSetting(str);\r\n                        this._loadedFileCount++;\r\n                        if (this._loadedFileCount >= this._settingFiles.length) {\r\n                            this._isReady = true;\r\n                        }\r\n                    });\r\n                }\r\n            }\r\n        });\r\n    }\r\n    evalSetting(str) {\r\n        let data = undefined;\r\n        eval(str);\r\n        if (data instanceof WindowDesign_1.WindowDesign) {\r\n            this._windowDesigns.set(data.props.class, data);\r\n        }\r\n    }\r\n    initialize() {\r\n        console.log(\"FlexWindowsManager.initialize\");\r\n        // this.loadTextFile(\"windows/Scene_Title.js\", str => {\r\n        //     let data = null;\r\n        //     eval(str);\r\n        //     console.log(data);\r\n        // });\r\n        // this.loadXmlFile(\"windows/Scene_Name.xml\", (obj: XMLDocument) => {\r\n        //     console.log(obj);\r\n        //     console.log(obj.nodeName);\r\n        //     console.log(obj.nodeType);\r\n        //     console.log(obj.nodeValue);\r\n        //     const root = obj.firstElementChild;\r\n        //     console.log(root?.getAttribute(\"class\"));\r\n        // });\r\n    }\r\n    loadDataFile(src, onLoad) {\r\n        if (this.isNode()) {\r\n            const dataDir = \"data/\";\r\n            const data = JSON.parse(fs_1.default.readFileSync(dataDir + src).toString());\r\n            onLoad(data);\r\n        }\r\n        else {\r\n            const xhr = new XMLHttpRequest();\r\n            const url = \"data/\" + src;\r\n            xhr.open(\"GET\", url);\r\n            xhr.overrideMimeType(\"application/json\");\r\n            xhr.onload = () => this.onXhrLoad(xhr, src, url, (obj) => { onLoad(obj); });\r\n            xhr.onerror = () => DataManager.onXhrError(src, src, url);\r\n            xhr.send();\r\n        }\r\n    }\r\n    loadTextFile(src, onLoad) {\r\n        if (this.isNode()) {\r\n            const dataDir = \"data/\";\r\n            onLoad(fs_1.default.readFileSync(dataDir + src).toString());\r\n        }\r\n        else {\r\n            throw new Error(\"Not implemented.\");\r\n        }\r\n    }\r\n    // private loadXmlFile(src: string, onLoad: (obj: any) => void) {\r\n    //     if (this.isNode()) {\r\n    //         const dataDir = \"data/\";\r\n    //         const xmlString = fs.readFileSync(dataDir + src).toString();\r\n    //         const jsdom = new JSDOM();\r\n    //         const parser = new jsdom.window.DOMParser();\r\n    //         const dom = parser.parseFromString(xmlString, \"application/xml\");\r\n    //         onLoad(dom);\r\n    //     }\r\n    //     else {\r\n    //         // const xhr = new XMLHttpRequest();\r\n    //         // const url = \"data/\" + src;\r\n    //         // xhr.open(\"GET\", url);\r\n    //         // xhr.overrideMimeType(\"text/xml\");\r\n    //         // xhr.onload = () => onLoad(xhr, src, url, (obj) => { onLoad(obj); });\r\n    //         // xhr.onerror = () => DataManager.onXhrError(src, src, url);\r\n    //         // xhr.send();\r\n    //     }\r\n    // }\r\n    isNode() {\r\n        return (process.title !== 'browser');\r\n    }\r\n    isPlaytest() {\r\n        return $gameTemp && $gameTemp.isPlaytest();\r\n    }\r\n    onXhrLoad(xhr, src, url, onLoad) {\r\n        if (xhr.status < 400) {\r\n            onLoad(JSON.parse(xhr.responseText));\r\n        }\r\n        else {\r\n            DataManager.onXhrError(src, src, url);\r\n        }\r\n    }\r\n}\r\nexports.FlexWindowsManager = FlexWindowsManager;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/core/FlexWindowsManager.ts?");

/***/ }),

/***/ "./ts/core/WindowBuilder.ts":
/*!**********************************!*\
  !*** ./ts/core/WindowBuilder.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.WindowBuilder = void 0;\r\nconst DListItem_1 = __webpack_require__(/*! ts/design/DListItem */ \"./ts/design/DListItem.ts\");\r\nconst UIListItem_1 = __webpack_require__(/*! ts/ui/elements/UIListItem */ \"./ts/ui/elements/UIListItem.ts\");\r\nconst Common_1 = __webpack_require__(/*! ./Common */ \"./ts/core/Common.ts\");\r\nconst FlexWindowsManager_1 = __webpack_require__(/*! ./FlexWindowsManager */ \"./ts/core/FlexWindowsManager.ts\");\r\nclass WindowBuilder {\r\n    applyDesign(window, design) {\r\n        const rect = design.props.rect;\r\n        if (rect) {\r\n            if (rect[0] !== undefined)\r\n                window.x = rect[0];\r\n            if (rect[1] !== undefined)\r\n                window.y = rect[1];\r\n            if (rect[2] !== undefined)\r\n                window.width = rect[2];\r\n            if (rect[3] !== undefined)\r\n                window.height = rect[3];\r\n        }\r\n        window._flexWindowDesignRevision = design.revision;\r\n        // (window as any).itemLineRect = function(index: number) {\r\n        //     console.log(\"itemLineRect !!!!\");\r\n        //     return new Rectangle(0, 0, 100, 100);\r\n        // }\r\n    }\r\n    applyCommandListContents(window, design, baseMakeList) {\r\n        const manager = FlexWindowsManager_1.FlexWindowsManager.instance;\r\n        const context = window._flexUILayoutContext;\r\n        (0, Common_1.assert)(context);\r\n        let index = 0;\r\n        const children = design.props.children || [];\r\n        // for (; index < children.length; index++) {\r\n        //     const element = children[index];\r\n        //     if (element instanceof DListItem) {\r\n        //         window.addCommand(element.text, element.symbol, element.enable, undefined);\r\n        //     }\r\n        // }\r\n        // ItemPresenter\r\n        {\r\n            let firstOriginalIndex = window._list.length;\r\n            baseMakeList();\r\n            // 元の makeCommandList() によって追加されたアイテムの分の UIElement を作成する。\r\n            for (let i = firstOriginalIndex; i < window._list.length; i++) {\r\n                const command = window._list[i];\r\n                const element = new DListItem_1.DListItem({\r\n                    text: command.name,\r\n                    symbol: command.symbol,\r\n                    enabled: command.enabled,\r\n                });\r\n                const uielement = new UIListItem_1.UIListItem(element);\r\n                uielement.rmmzCommandIndex = i;\r\n                context.root.addChild(uielement);\r\n            }\r\n        }\r\n        // ItemPresenter の後\r\n        for (; index < children.length; index++) {\r\n            const element = children[index];\r\n            if (element instanceof DListItem_1.DListItem) {\r\n                const uielement = new UIListItem_1.UIListItem(element);\r\n                uielement.rmmzCommandIndex = window._list.length;\r\n                context.root.addChild(uielement);\r\n                window.addCommand(element.text, element.symbol, element.enabled, undefined);\r\n            }\r\n        }\r\n        // Item template\r\n        {\r\n        }\r\n    }\r\n    makeRect(design, src) {\r\n        const rect = design.props.rect;\r\n        if (rect) {\r\n            const newRect = new Rectangle(src.x, src.y, src.width, src.height);\r\n            if (rect[0] !== undefined)\r\n                newRect.x = rect[0];\r\n            if (rect[1] !== undefined)\r\n                newRect.y = rect[1];\r\n            if (rect[2] !== undefined)\r\n                newRect.width = rect[2];\r\n            if (rect[3] !== undefined)\r\n                newRect.height = rect[3];\r\n            return newRect;\r\n        }\r\n        else {\r\n            return src;\r\n        }\r\n    }\r\n    applyElement(window, element) {\r\n        console.log(\"a\");\r\n        if (element instanceof DListItem_1.DListItem) {\r\n            console.log(\"a1\");\r\n            if (window instanceof Window_Command) {\r\n                console.log(\"a2\", element);\r\n                window.addCommand(element.text, element.symbol, element.enabled, undefined);\r\n                window.refresh();\r\n            }\r\n        }\r\n    }\r\n}\r\nexports.WindowBuilder = WindowBuilder;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/core/WindowBuilder.ts?");

/***/ }),

/***/ "./ts/core/WindowDesign.ts":
/*!*********************************!*\
  !*** ./ts/core/WindowDesign.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.WindowDesign = void 0;\r\n/**\r\n * 各種 Window のデザインデータ\r\n *\r\n * Window が new されたとき (initialize() されたとき) に、このデザインを適用する。\r\n */\r\nclass WindowDesign {\r\n    constructor(props) {\r\n        this.props = props;\r\n        this.revision = 1;\r\n    }\r\n}\r\nexports.WindowDesign = WindowDesign;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/core/WindowDesign.ts?");

/***/ }),

/***/ "./ts/design/DElement.ts":
/*!*******************************!*\
  !*** ./ts/design/DElement.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.DElement = void 0;\r\nclass DElement {\r\n    constructor(props) {\r\n        this.props = props;\r\n    }\r\n}\r\nexports.DElement = DElement;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/design/DElement.ts?");

/***/ }),

/***/ "./ts/design/DListItem.ts":
/*!********************************!*\
  !*** ./ts/design/DListItem.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.DListItem = void 0;\r\nconst DElement_1 = __webpack_require__(/*! ./DElement */ \"./ts/design/DElement.ts\");\r\nclass DListItem extends DElement_1.DElement {\r\n    constructor(props) {\r\n        super(props);\r\n        this.props = props;\r\n    }\r\n    get text() {\r\n        var _a;\r\n        return (_a = this.props.text) !== null && _a !== void 0 ? _a : \"\";\r\n    }\r\n    get symbol() {\r\n        var _a;\r\n        return (_a = this.props.symbol) !== null && _a !== void 0 ? _a : \"\";\r\n    }\r\n    get enabled() {\r\n        var _a;\r\n        return (_a = this.props.enabled) !== null && _a !== void 0 ? _a : true;\r\n    }\r\n}\r\nexports.DListItem = DListItem;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/design/DListItem.ts?");

/***/ }),

/***/ "./ts/index.ts":
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\n__webpack_require__(/*! ./core/FlexWindowsManager */ \"./ts/core/FlexWindowsManager.ts\");\r\n__webpack_require__(/*! ./rmmz/PluginManager */ \"./ts/rmmz/PluginManager.ts\");\r\n// import \"./rmmz/PluginParameters\"\r\n__webpack_require__(/*! ./rmmz/Input */ \"./ts/rmmz/Input.ts\");\r\n// import \"./rmmz/TouchInput\"\r\n// import \"./rmmz/DataManager\"\r\n// import \"./rmmz/Game_Screen\"\r\n// import \"./rmmz/Game_Map\"\r\n// import \"./rmmz/PluginCommands\"\r\n// import \"./rmmz/Sprite_Animation\"\r\n// import \"./rmmz/Spriteset_Map\"\r\n// import \"./rmmz/Spriteset_Battle\"\r\n__webpack_require__(/*! ./rmmz/Scene_Base */ \"./ts/rmmz/Scene_Base.ts\");\r\n__webpack_require__(/*! ./rmmz/Scene_Boot */ \"./ts/rmmz/Scene_Boot.ts\");\r\n__webpack_require__(/*! ./rmmz/Window_Base */ \"./ts/rmmz/Window_Base.ts\");\r\n__webpack_require__(/*! ./rmmz/Window_Command */ \"./ts/rmmz/Window_Command.ts\");\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/index.ts?");

/***/ }),

/***/ "./ts/rmmz/Input.ts":
/*!**************************!*\
  !*** ./ts/rmmz/Input.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst FlexWindowsManager_1 = __webpack_require__(/*! ts/core/FlexWindowsManager */ \"./ts/core/FlexWindowsManager.ts\");\r\nconst _Input_onKeyDown = Input._onKeyDown;\r\nInput._onKeyDown = function (event) {\r\n    if (!FlexWindowsManager_1.FlexWindowsManager.instance ||\r\n        !FlexWindowsManager_1.FlexWindowsManager.instance.isReady ||\r\n        !FlexWindowsManager_1.FlexWindowsManager.instance.isPlaytest()) {\r\n        return _Input_onKeyDown.call(this, event);\r\n    }\r\n    console.log(\"Input._onKeyDown\", event);\r\n    if (event.ctrlKey && event.key == \"@\") {\r\n        FlexWindowsManager_1.FlexWindowsManager.instance.reloadDesigns();\r\n    }\r\n    else if (event.key == \"e\") {\r\n        FlexWindowsManager_1.FlexWindowsManager.instance.displayWindowInfo = !FlexWindowsManager_1.FlexWindowsManager.instance.displayWindowInfo;\r\n    }\r\n    else {\r\n        _Input_onKeyDown.call(this, event);\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/rmmz/Input.ts?");

/***/ }),

/***/ "./ts/rmmz/PluginManager.ts":
/*!**********************************!*\
  !*** ./ts/rmmz/PluginManager.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst FlexWindowsManager_1 = __webpack_require__(/*! ts/core/FlexWindowsManager */ \"./ts/core/FlexWindowsManager.ts\");\r\n/** 外部から拡張するために Manager を公開する */\r\nPluginManager.flexWindowsManager = function () {\r\n    return FlexWindowsManager_1.FlexWindowsManager.instance;\r\n};\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/rmmz/PluginManager.ts?");

/***/ }),

/***/ "./ts/rmmz/Scene_Base.ts":
/*!*******************************!*\
  !*** ./ts/rmmz/Scene_Base.ts ***!
  \*******************************/
/***/ (() => {

eval("\r\nconst _Scene_Base_addWindow = Scene_Base.prototype.addWindow;\r\nScene_Base.prototype.addWindow = function (window) {\r\n    _Scene_Base_addWindow.call(this, window);\r\n};\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/rmmz/Scene_Base.ts?");

/***/ }),

/***/ "./ts/rmmz/Scene_Boot.ts":
/*!*******************************!*\
  !*** ./ts/rmmz/Scene_Boot.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst FlexWindowsManager_1 = __webpack_require__(/*! ts/core/FlexWindowsManager */ \"./ts/core/FlexWindowsManager.ts\");\r\nconst _Scene_Boot_create = Scene_Boot.prototype.create;\r\nScene_Boot.prototype.create = function () {\r\n    _Scene_Boot_create.call(this);\r\n    FlexWindowsManager_1.FlexWindowsManager.instance = new FlexWindowsManager_1.FlexWindowsManager();\r\n};\r\nconst _Scene_Boot_isReady = Scene_Boot.prototype.isReady;\r\nScene_Boot.prototype.isReady = function () {\r\n    if (!FlexWindowsManager_1.FlexWindowsManager.instance.isReady) {\r\n        return false;\r\n    }\r\n    return _Scene_Boot_isReady.call(this);\r\n};\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/rmmz/Scene_Boot.ts?");

/***/ }),

/***/ "./ts/rmmz/Window_Base.ts":
/*!********************************!*\
  !*** ./ts/rmmz/Window_Base.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst FlexWindowsManager_1 = __webpack_require__(/*! ts/core/FlexWindowsManager */ \"./ts/core/FlexWindowsManager.ts\");\r\nconst UIContext_1 = __webpack_require__(/*! ts/ui/UIContext */ \"./ts/ui/UIContext.ts\");\r\nconst _Window_Base_initialize = Window_Base.prototype.initialize;\r\nWindow_Base.prototype.initialize = function (rect) {\r\n    // Rect は先にオーバーライドしておかないと、初期レイアウトが上手く動かない。\r\n    let actualRect = rect;\r\n    const manager = FlexWindowsManager_1.FlexWindowsManager.instance;\r\n    const design = manager.findWindowDesign(this);\r\n    if (design) {\r\n        actualRect = manager.windowBuilder.makeRect(design, rect);\r\n        this._flexUILayoutContext = new UIContext_1.UIWindowContext(this, design);\r\n    }\r\n    _Window_Base_initialize.call(this, actualRect);\r\n};\r\nconst _Window_Base_createContents = Window_Base.prototype.createContents;\r\nWindow_Base.prototype.createContents = function () {\r\n    _Window_Base_createContents.call(this);\r\n    const width = this.contentsWidth();\r\n    const height = this.contentsHeight();\r\n    this._flexInfoContents = new Bitmap(width, height);\r\n    this._flexInfoSprite = new Sprite(this._flexInfoContents);\r\n    this._clientArea.addChild(this._flexInfoSprite);\r\n    this._flexInfoSprite.visible = false;\r\n    this._flexInfoSprite.x = 0;\r\n    this._flexInfoSprite.y = 0;\r\n    this._flexInfoContents.fillRect(0, 0, width, this.lineHeight(), \"rgba(0, 0, 0, 0.75)\");\r\n    this._flexInfoContents.drawText(this.constructor.name, 0, 0, width, this.lineHeight(), \"left\");\r\n};\r\nconst _Window_Base_destroyContents = Window_Base.prototype.destroyContents;\r\nWindow_Base.prototype.destroyContents = function () {\r\n    _Window_Base_destroyContents.call(this);\r\n    if (this._flexInfoSprite) {\r\n        this._clientArea.removeChild(this._flexInfoSprite);\r\n        this._flexInfoSprite = undefined;\r\n    }\r\n    if (this._flexInfoContents) {\r\n        this._flexInfoContents.destroy();\r\n        this._flexInfoContents = undefined;\r\n    }\r\n};\r\nconst _Window_Base_update = Window_Base.prototype.update;\r\nWindow_Base.prototype.update = function () {\r\n    _Window_Base_update.call(this);\r\n    if (this._flexInfoSprite) {\r\n        this._flexInfoSprite.visible = FlexWindowsManager_1.FlexWindowsManager.instance.displayWindowInfo;\r\n    }\r\n    if (this._flexUILayoutContext) {\r\n        this._flexUILayoutContext.update();\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/rmmz/Window_Base.ts?");

/***/ }),

/***/ "./ts/rmmz/Window_Command.ts":
/*!***********************************!*\
  !*** ./ts/rmmz/Window_Command.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst FlexWindowsManager_1 = __webpack_require__(/*! ts/core/FlexWindowsManager */ \"./ts/core/FlexWindowsManager.ts\");\r\nconst _Window_Command_refresh = Window_Command.prototype.refresh;\r\nWindow_Command.prototype.refresh = function () {\r\n    this.clearCommandList();\r\n    const manager = FlexWindowsManager_1.FlexWindowsManager.instance;\r\n    const design = manager.findWindowDesign(this);\r\n    if (design) {\r\n        manager.windowBuilder.applyCommandListContents(this, design, () => this.makeCommandList());\r\n    }\r\n    else {\r\n        this.makeCommandList();\r\n    }\r\n    Window_Selectable.prototype.refresh.call(this);\r\n};\r\n// const _Window_Command_itemWidth = Window_Command.prototype.itemWidth;\r\n// Window_Selectable.prototype.itemWidth = function() {\r\n//     return 50;\r\n//     return _Window_Command_itemWidth.call(this);\r\n// }\r\n// const _Window_Selectable_itemHeight = Window_Selectable.prototype.itemHeight;\r\n// Window_Selectable.prototype.itemHeight = function() {\r\n//     return 50;\r\n//     return _Window_Selectable_itemHeight.call(this);\r\n// };\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/rmmz/Window_Command.ts?");

/***/ }),

/***/ "./ts/ui/UIContainer.ts":
/*!******************************!*\
  !*** ./ts/ui/UIContainer.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.VUIContainer = void 0;\r\nconst UIElement_1 = __webpack_require__(/*! ./UIElement */ \"./ts/ui/UIElement.ts\");\r\nclass VUIContainer extends UIElement_1.VUIElement {\r\n    constructor() {\r\n        super();\r\n        this._children = [];\r\n    }\r\n    addChild(element) {\r\n        this._children.push(element);\r\n        return element;\r\n    }\r\n    children() {\r\n        return this._children;\r\n    }\r\n    draw(context) {\r\n        for (const child of this._children) {\r\n            child.draw(context);\r\n        }\r\n    }\r\n}\r\nexports.VUIContainer = VUIContainer;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/ui/UIContainer.ts?");

/***/ }),

/***/ "./ts/ui/UIContext.ts":
/*!****************************!*\
  !*** ./ts/ui/UIContext.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.UIWindowContext = void 0;\r\nconst FlexWindowsManager_1 = __webpack_require__(/*! ts/core/FlexWindowsManager */ \"./ts/core/FlexWindowsManager.ts\");\r\nconst UIFrameLayout_1 = __webpack_require__(/*! ./UIFrameLayout */ \"./ts/ui/UIFrameLayout.ts\");\r\nclass UIWindowContext {\r\n    constructor(window, design) {\r\n        this._window = window;\r\n        this._root = new UIFrameLayout_1.UIFrameLayout();\r\n        this._invalidateLayout = true;\r\n        this._invalidateDraw = true;\r\n        this._firstUpdate = true;\r\n    }\r\n    get root() {\r\n        return this._root;\r\n    }\r\n    update() {\r\n        if (this._firstUpdate) {\r\n            FlexWindowsManager_1.FlexWindowsManager.instance.applyDesign(this._window);\r\n            this._firstUpdate = false;\r\n        }\r\n        if (this._invalidateLayout) {\r\n            this.layout();\r\n            this._invalidateLayout = false;\r\n        }\r\n        if (this._invalidateDraw) {\r\n            this.draw();\r\n            this._invalidateDraw = false;\r\n        }\r\n    }\r\n    layout() {\r\n        if (!this._root)\r\n            return;\r\n        this._root.measure(this);\r\n        this._root.arrange({\r\n            x: 0, y: 0,\r\n            width: this._window.contents.width,\r\n            height: this._window.contents.height\r\n        });\r\n    }\r\n    draw() {\r\n        if (!this._root)\r\n            return;\r\n        this._window.contents.clear();\r\n        this._root.draw(this);\r\n    }\r\n}\r\nexports.UIWindowContext = UIWindowContext;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/ui/UIContext.ts?");

/***/ }),

/***/ "./ts/ui/UIElement.ts":
/*!****************************!*\
  !*** ./ts/ui/UIElement.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.VUIElement = void 0;\r\nclass VUIElement {\r\n    constructor() {\r\n        this._margin = {\r\n            top: 0,\r\n            right: 0,\r\n            bottom: 0,\r\n            left: 0,\r\n        };\r\n        this._padding = {\r\n            top: 0,\r\n            right: 0,\r\n            bottom: 0,\r\n            left: 0,\r\n        };\r\n        this._desiredWidth = 0;\r\n        this._desiredHeight = 0;\r\n        this._actualRect = {\r\n            x: 0,\r\n            y: 0,\r\n            width: 0,\r\n            height: 0,\r\n        };\r\n        // this._actualWidth = 0;\r\n        // this._actualHeight = 0;\r\n        this.row = 0;\r\n        this.col = 0;\r\n        this.rowSpan = 1;\r\n        this.colSpan = 1;\r\n        this.x = 0;\r\n        this.y = 0;\r\n        this.opacity = 1.0;\r\n    }\r\n    calcContentOuter() {\r\n        return {\r\n            top: this._margin.top + this._padding.top,\r\n            right: this._margin.right + this._padding.right,\r\n            bottom: this._margin.bottom + this._padding.bottom,\r\n            left: this._margin.left + this._padding.left,\r\n        };\r\n    }\r\n    margin(top, right, bottom, left) {\r\n        if (right !== undefined && bottom !== undefined && left !== undefined) {\r\n            this._margin.top = top;\r\n            this._margin.right = right;\r\n            this._margin.bottom = bottom;\r\n            this._margin.left = left;\r\n        }\r\n        else if (right !== undefined) {\r\n            this._margin.top = this._margin.bottom = top;\r\n            this._margin.right = this._margin.left = right;\r\n        }\r\n        else {\r\n            this._margin.top = this._margin.bottom = this._margin.right = this._margin.left = top;\r\n        }\r\n        return this;\r\n    }\r\n    getMargin() {\r\n        return this._margin;\r\n    }\r\n    padding() {\r\n        return this._padding;\r\n    }\r\n    setGrid(col, row, colSpan = 1, rowSpan = 1) {\r\n        this.row = row;\r\n        this.col = col;\r\n        this.rowSpan = rowSpan;\r\n        this.colSpan = colSpan;\r\n        return this;\r\n    }\r\n    setOpacity(value) {\r\n        this.opacity = value;\r\n        return this;\r\n    }\r\n    // public addTo(container: VUIContainer): this {\r\n    //     container.addChild(this);\r\n    //     return this;\r\n    // }\r\n    setDesiredSize(width, height) {\r\n        this._desiredWidth = width;\r\n        this._desiredHeight = height;\r\n    }\r\n    desiredWidth() {\r\n        return this._desiredWidth;\r\n    }\r\n    desiredHeight() {\r\n        return this._desiredHeight;\r\n    }\r\n    measure(context) {\r\n    }\r\n    measureOverride(context) {\r\n    }\r\n    arrange(finalArea) {\r\n        const rect = {\r\n            x: finalArea.x + this._margin.left,\r\n            y: finalArea.y + this._margin.top,\r\n            width: finalArea.width - this._margin.left - this._margin.right,\r\n            height: finalArea.height - this._margin.top - this._margin.bottom\r\n        };\r\n        return this.arrangeOverride(rect);\r\n    }\r\n    arrangeOverride(finalArea) {\r\n        this.setActualRect(finalArea);\r\n        return finalArea;\r\n    }\r\n    setActualRect(rect) {\r\n        this._actualRect = Object.assign({}, rect);\r\n        this._actualRect.x += this.x;\r\n        this._actualRect.y += this.y;\r\n    }\r\n    actualRect() {\r\n        return this._actualRect;\r\n    }\r\n    // public actualWidth(): number {\r\n    //     return this._actualWidth;\r\n    // }\r\n    // public actualHeight(): number {\r\n    //     return this._actualHeight;\r\n    // }\r\n    draw(context) {\r\n    }\r\n}\r\nexports.VUIElement = VUIElement;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/ui/UIElement.ts?");

/***/ }),

/***/ "./ts/ui/UIElementFactory.ts":
/*!***********************************!*\
  !*** ./ts/ui/UIElementFactory.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.UIElementFactory = void 0;\r\nconst DListItem_1 = __webpack_require__(/*! ts/design/DListItem */ \"./ts/design/DListItem.ts\");\r\nconst UIListItem_1 = __webpack_require__(/*! ./elements/UIListItem */ \"./ts/ui/elements/UIListItem.ts\");\r\nclass UIElementFactory {\r\n    createUIElement(element) {\r\n        if (element instanceof DListItem_1.DListItem) {\r\n            return new UIListItem_1.UIListItem(element);\r\n        }\r\n        throw new Error(\"Not implemented\");\r\n    }\r\n}\r\nexports.UIElementFactory = UIElementFactory;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/ui/UIElementFactory.ts?");

/***/ }),

/***/ "./ts/ui/UIFrameLayout.ts":
/*!********************************!*\
  !*** ./ts/ui/UIFrameLayout.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.UIFrameLayout = void 0;\r\nconst UIContainer_1 = __webpack_require__(/*! ./UIContainer */ \"./ts/ui/UIContainer.ts\");\r\nclass UIFrameLayout extends UIContainer_1.VUIContainer {\r\n}\r\nexports.UIFrameLayout = UIFrameLayout;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/ui/UIFrameLayout.ts?");

/***/ }),

/***/ "./ts/ui/elements/UIListItem.ts":
/*!**************************************!*\
  !*** ./ts/ui/elements/UIListItem.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.UIListItem = void 0;\r\nconst UIContainer_1 = __webpack_require__(/*! ../UIContainer */ \"./ts/ui/UIContainer.ts\");\r\nclass UIListItem extends UIContainer_1.VUIContainer {\r\n    constructor(data) {\r\n        super();\r\n        this._data = data;\r\n        this.rmmzCommandIndex = 0;\r\n    }\r\n}\r\nexports.UIListItem = UIListItem;\r\n\n\n//# sourceURL=webpack://FlexWindows/./ts/ui/elements/UIListItem.ts?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./ts/index.ts");
/******/ 	
/******/ })()
;