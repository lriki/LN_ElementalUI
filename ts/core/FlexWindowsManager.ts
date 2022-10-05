import fs from "fs";
import { DListItem, DListItemProps } from "ts/design/DListItem";
import { UIElementFactory } from "ts/ui/UIElementFactory";
import { SceneDesign, SceneProps } from "../design/SceneDesign";
import { WindowBuilder } from "./WindowBuilder";
import { DWindow, WindowProps } from "../design/DWindow";
import { DPartProps } from "ts/design/DPart";
import { assert } from "./Common";
import { DElement, DPart } from "ts/design/DElement";
import { evalDesignScript } from "./DesignScripEvaluator";
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



export class FlexWindowsManager {
    public static instance: FlexWindowsManager;
    public displayWindowInfo: boolean;
    
    private _sceneDesigns: Map<string, SceneDesign>;
    private _windowDesigns: Map<string, DWindow>;
    private _loadedFileCount;
    private _settingFiles: string[];
    private _isReady: boolean;
    private _windowBuilder: WindowBuilder;
    private _uiElementFactory: UIElementFactory;
    

    public constructor() {
        this.displayWindowInfo = false;
        this._sceneDesigns = new Map<string, SceneDesign>();
        this._windowDesigns = new Map<string, DWindow>();
        this._loadedFileCount = 0;
        this._settingFiles = [];
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

    }

    private updateIndexFile(): void {
        if (this.isNode()) {
            const allFiles = fs.readdirSync("data/windows");
            const settingFiles = allFiles.filter((file) => file.endsWith(".js"));
            const indexData = settingFiles;
            fs.writeFileSync("data/windows/index.json", JSON.stringify(indexData));
        }
        else {
        }
    }

    private beginLoadDesignFiles(): void {
        this.loadDataFile("windows/index.json", (obj) => {
            this._settingFiles = (obj as string[]);
            this._loadedFileCount = 0;
            for (let i = 0; i < this._settingFiles.length; i++) {
                const file = this._settingFiles[i];
                if (file) {
                    this.loadTextFile("windows/" + file, (str) => {
                        this.evalSetting(str)
                        this._loadedFileCount++;

                        if (this._loadedFileCount >= this._settingFiles.length) {
                            this.buildDesigns();
                            this._isReady = true;
                        }
                    });
                }
            }
        });
    }

    public evalSetting(str: string): void {
        const data = evalDesignScript(str);
        if (data instanceof SceneDesign) {
            this._sceneDesigns.set(data.props.class, data);
        }
        else if (data instanceof DWindow) {
            this._windowDesigns.set(data.props.class, data);
        }
    }

    public buildDesigns(): void {
        this._windowDesigns.forEach((value, key) => {
            value.link(this);
        });
        this._sceneDesigns.forEach((value, key) => {
            value.link(this);
        });
    }



    private loadDataFile(src: string, onLoad: (obj: any) => void) {
        if (this.isNode()) {
            const dataDir = "data/";
            const data = JSON.parse(fs.readFileSync(dataDir + src).toString());
            onLoad(data);
        }
        else {
            const xhr = new XMLHttpRequest();
            const url = "data/" + src;
            xhr.open("GET", url);
            xhr.overrideMimeType("application/json");
            xhr.onload = () => this.onXhrLoad(xhr, src, url, (obj) => { onLoad(obj); });
            xhr.onerror = () => DataManager.onXhrError(src, src, url);
            xhr.send();
        }
    }

    private loadTextFile(src: string, onLoad: (obj: string) => void) {
        if (this.isNode()) {
            const dataDir = "data/";
            onLoad(fs.readFileSync(dataDir + src).toString());
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
