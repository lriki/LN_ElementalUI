import fs from "fs";
import { DListItem, DListItemProps } from "ts/design/DListItem";
import { UIElementFactory } from "ts/ui/UIElementFactory";
import { SceneDesign, SceneProps } from "../design/SceneDesign";
import { WindowBuilder } from "./WindowBuilder";
import { DWindow, DWindowProps } from "../design/DWindow";
import { DPart, DPartProps } from "ts/design/DPart";
import { assert } from "./Common";
import { DElement } from "ts/design/DElement";
import { evalDesignScript } from "./DesignScripEvaluator";
import { paramThemeName } from "ts/PluginParameters";
import { Log } from "./Logger";
//import { JSDOM } from 'jsdom';




export interface PictureProps {
    bitmap: string;
}

export class PictureDef {
    props: PictureProps;
    constructor(props: PictureProps) {
        this.props = props;
    }
}


export interface EasingAnimationProps {
    start: number;
    end: number;
    duration: number;
    func: string;
}


/**
 * 
 * 
 * Scene初期化の流れ
 * ----------
 * - Scene 作成自に、UIScene のインスタンスと、VisualTree を作る。(Scene_Base.create)
 * - Window_Base の initialUpdate で、UIWindowBase と Window_Base の紐づけ (Attach) を行う。
 *     - 派生クラスの initialize の後に実行したいので、このタイミングの必要がある。
 * - Scene の initialUpdate で、Attach が行われていない UIWindowBase から、新しい Window_Base(またはその派生) を作る。
 */
export class FlexWindowsManager {
    public static instance: FlexWindowsManager;
    public displayWindowInfo: boolean;
    
    private _sceneDesigns: Map<string, SceneDesign>;
    private _windowDesigns: Map<string, DWindow>;
    private _loadedFileCount;
    private _settingFiles: string[];
    private _designFilesRevision: number;
    private _isReady: boolean;
    private _windowBuilder: WindowBuilder;
    private _uiElementFactory: UIElementFactory;
    

    public constructor() {
        this.displayWindowInfo = false;
        this._sceneDesigns = new Map<string, SceneDesign>();
        this._windowDesigns = new Map<string, DWindow>();
        this._loadedFileCount = 0;
        this._settingFiles = [];
        this._designFilesRevision = 0;
        this._isReady = false;
        this._windowBuilder = new WindowBuilder();
        this._uiElementFactory = new UIElementFactory();
    }

    public initialize(): void {
        this.updateIndexFile();
        this.beginLoadDesignFiles();
    }

    public get isReady(): boolean {
        return this._isReady;
    }

    public get designFilesRevision(): number {
        return this._designFilesRevision;
    }

    public get sceneDesigns(): ReadonlyMap<string, SceneDesign> {
        return this._sceneDesigns;
    }

    public get windowDesigns(): ReadonlyMap<string, DWindow> {
        return this._windowDesigns;
    }

    public get windowBuilder(): WindowBuilder {
        return this._windowBuilder;
    }

    public get uiElementFactory(): UIElementFactory {
        return this._uiElementFactory;
    }
    
    public get designDirectory(): string {
        return `data/ui/${paramThemeName}/`;
    }

    public registerElementComponent(): void {

    }

    public registerValueComponent(): void {

    }

    public findSceneDesign(window: Scene_Base): SceneDesign | undefined {
        const className = window.constructor.name;
        return this._sceneDesigns.get(className);
    }

    public findWindowDesign(window: Window_Base): DWindow | undefined {
        const className = window.constructor.name;
        return this._windowDesigns.get(className);
    }

    
    public clonePartElement(props: DPartProps): DElement {
        const className = props.class;
        const design = this._windowDesigns.get(className);
        assert(design);
        const newDesign = design.clone();
        newDesign.mergeProps(props);
        return newDesign;
    }



    // VisualTree と Game_Window のインスタンスが紐づいていることが前提なので、 initialUpdate した後ではないと使えない点に注意。
    public reloadSceneDesignIfNeeded(rmmzScene: Scene_Base): void {
        if (rmmzScene._flexDesignRevision === this.designFilesRevision) return;
        rmmzScene._flexDesignRevision = this.designFilesRevision;

        let attachedExistingWindows: Window_Base[] = [];
        if (rmmzScene._flexUIScene) {
            attachedExistingWindows = [...rmmzScene._flexUIScene.attachedExistingWindows];
            this.unloadSceneDesignIfNeeded(rmmzScene);
        }

        const design = this.findSceneDesign(rmmzScene); // 見つからなくても空 Scene を作る
        rmmzScene._flexUIScene = this.uiElementFactory.instantiateScene(design);
        rmmzScene._flexUIScene.attachRmmzScene(rmmzScene);
        rmmzScene._flexUIScene.context.layoutInitial(Graphics.boxWidth, Graphics.boxHeight);

        // attachedExistingWindows が存在するということは、デザインのリロードが行われたということ。
        if (attachedExistingWindows.length > 0) {
            for (const rmmzWindow of attachedExistingWindows) {
                rmmzScene._flexUIScene.attachRmmzWindowIfNeeded(rmmzWindow);
            };
        }
        rmmzScene._flexUIScene.onSceneCreate();
    }

    public unloadSceneDesignIfNeeded(rmmzScene: Scene_Base): void {
        if (rmmzScene._flexUIScene) {
            rmmzScene._flexUIScene.detachRmmzScene();
            rmmzScene._flexUIScene = undefined;
        }
    }
    

    /** 既に存在している Window に対して、テンプレートを適用する */
    // public applyDesign(window: Window_Base): void {
    //     const className = window.constructor.name;
    //     const data = this._windowDesigns.get(className);
    //     if (data) {
    //         this._windowBuilder.applyDesign(window, data);
    //     }
    // }

    // private loadWindowTemplate(className: string): WindowTemplate {
    //     const data = this._windowTemplates.get(className);
    //     if (data) {
    //         return data;
    //     }
    //     else {
            
    //     }
    // }

    public reloadDesigns(): void {
        this.beginLoadDesignFiles();
    }

    private updateIndexFile(): void {
        if (this.isNode()) {
            const allFiles = fs.readdirSync(this.designDirectory);
            const settingFiles = allFiles.filter((file) => file.endsWith(".js"));
            const indexData = settingFiles;
            fs.writeFileSync(this.designDirectory + "/index.json", JSON.stringify(indexData));
        }
        else {
        }
    }

    private beginLoadDesignFiles(): void {
        this.loadDataFile(this.designDirectory + "/index.json", (obj) => {
            this._settingFiles = (obj as string[]);
            this._loadedFileCount = 0;
            for (let i = 0; i < this._settingFiles.length; i++) {
                const file = this._settingFiles[i];
                if (file) {
                    this.loadTextFile(this.designDirectory + "/" + file, (str) => {
                        this.evalSetting(str)
                        this._loadedFileCount++;
                        Log.info(`Loaded design file: ${file}`);

                        if (this._loadedFileCount >= this._settingFiles.length) {
                            this.buildDesigns();
                            this._isReady = true;
                            this._designFilesRevision++;
                        }
                    });
                }
            }
        });
    }

    public evalSetting(str: string): void {
        const data = evalDesignScript(str);
        if (data instanceof SceneDesign) {
            this._sceneDesigns.set(data.class, data);
        }
        else if (data instanceof DWindow) {
            this._windowDesigns.set(data.props.class, data);
        }
    }

    public buildDesigns(): void {
        this._windowDesigns.forEach((value, key) => {
            this.linkHierarchical(value);
        });
        this._sceneDesigns.forEach((value, key) => {
            this.linkHierarchical(value);
        });
    }

    public linkHierarchical(element: DElement): void {
        const contents = element.props.contents;
        if (contents) {
            for (let i = 0; i < element.contents.length; i++) {
                let child = contents[i];
                if (child instanceof DPart) {
                    child = this.clonePartElement(child.props);
                    contents[i] = child;
                }
    
                this.linkHierarchical(child);
            }
        }

        // for(const child of element.contents) {
        //     child.link(manager);
        // }


        // if (this.props.windowskin) {
        //     this.props.windowskin = manager.designDirectory + "/" + this.props.windowskin;
        // }
    }
    
    public loadBitmap(file: string): Bitmap {
        if (file[0] == ":") {
            return ImageManager.loadBitmap(FlexWindowsManager.instance.designDirectory, file.substring(1));
        }
        else {
            return ImageManager.loadBitmap("", file);
        }
    }

    private loadDataFile(src: string, onLoad: (obj: any) => void) {
        if (this.isNode()) {
            const data = JSON.parse(fs.readFileSync(src).toString());
            onLoad(data);
        }
        else {
            const xhr = new XMLHttpRequest();
            const url = src;
            xhr.open("GET", url);
            xhr.overrideMimeType("application/json");
            xhr.onload = () => this.onXhrLoad(xhr, src, url, (obj) => { onLoad(obj); });
            xhr.onerror = () => DataManager.onXhrError(src, src, url);
            xhr.send();
        }
    }

    private loadTextFile(src: string, onLoad: (obj: string) => void) {
        if (this.isNode()) {
            onLoad(fs.readFileSync(src).toString());
        }
        else {
            throw new Error("Not implemented.");
        }
    }

    // private loadXmlFile(src: string, onLoad: (obj: any) => void) {
    //     if (this.isNode()) {
    //         const dataDir = "data/";
    //         const xmlString = fs.readFileSync(dataDir + src).toString();
    //         const jsdom = new JSDOM();
    //         const parser = new jsdom.window.DOMParser();
    //         const dom = parser.parseFromString(xmlString, "application/xml");
    //         onLoad(dom);
    //     }
    //     else {
    //         // const xhr = new XMLHttpRequest();
    //         // const url = "data/" + src;
    //         // xhr.open("GET", url);
    //         // xhr.overrideMimeType("text/xml");
    //         // xhr.onload = () => onLoad(xhr, src, url, (obj) => { onLoad(obj); });
    //         // xhr.onerror = () => DataManager.onXhrError(src, src, url);
    //         // xhr.send();
    //     }
    // }

    private isNode(): boolean {
        return (process.title !== 'browser');
    }

    public isPlaytest(): boolean {
        return $gameTemp && $gameTemp.isPlaytest();
    }

    private onXhrLoad(xhr: XMLHttpRequest, src: string, url: string, onLoad: (obj: any) => void) {
        if (xhr.status < 400) {
            onLoad(JSON.parse(xhr.responseText));
        } else {
            DataManager.onXhrError(src, src, url);
        }
    }
}
