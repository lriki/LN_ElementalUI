import fs from "fs";
import { DListItem, DListItemProps } from "ts/design/DListItem";
import { UIElementFactory } from "ts/ui/UIElementFactory";
import { WindowBuilder } from "./WindowBuilder";
import { WindowDesign, WindowProps } from "./WindowDesign";
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


export interface StyleProps {
    x: string;
}

export class StyleDef {
    props: StyleProps;
    constructor(props: StyleProps) {
        this.props = props;
    }
}

export interface EasingAnimationProps {
    start: number;
    end: number;
    duration: number;
    func: string;
}







function Window(props: WindowProps): WindowDesign {
    return new WindowDesign(props);
}



export interface ContentPresenterProps {
    
}

function ContentPresenter(props: ContentPresenterProps): ContentPresenterProps {
    return props;
}




function ListItem(props: DListItemProps): DListItem {
    return new DListItem(props);
}



function Picture(props: PictureProps) {
    return new PictureDef(props);
}

function Style(props: StyleProps) {
    return new StyleDef(props);
}

function EasingAnimation(props: EasingAnimationProps) {
    return props;
}




export class FlexWindowsManager {
    public static instance: FlexWindowsManager;
    public displayWindowInfo: boolean;
    
    private _windowDesigns: Map<string, WindowDesign>;
    private _loadedFileCount;
    private _settingFiles: string[];
    private _isReady: boolean;
    private _windowBuilder: WindowBuilder;
    private _uiElementFactory: UIElementFactory;
    

    public constructor() {
        this.displayWindowInfo = false;
        this._windowDesigns = new Map<string, WindowDesign>();
        this._loadedFileCount = 0;
        this._settingFiles = [];
        this._isReady = false;
        this._windowBuilder = new WindowBuilder();
        this._uiElementFactory = new UIElementFactory();
        this.updateIndexFile();
        this.beginLoadSettingFiles();
    }

    public get isReady(): boolean {
        return this._isReady;
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

    public findWindowDesign(window: Window_Base): WindowDesign | undefined {
        const className = window.constructor.name;
        return this._windowDesigns.get(className);
    }

    /** 既に存在している Window に対して、テンプレートを適用する */
    public applyDesign(window: Window_Base): void {
        const className = window.constructor.name;
        const data = this._windowDesigns.get(className);
        if (data) {
            this._windowBuilder.applyDesign(window, data);
        }
    }

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

    private beginLoadSettingFiles(): void {
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
                            this._isReady = true;
                        }
                    });
                }
            }
        });
    }

    public evalSetting(str: string): void {
        let data: any = undefined;
        eval(str);
        if (data instanceof WindowDesign) {
            this._windowDesigns.set(data.props.class, data);
        }
    }


    public initialize(): void {
        console.log("FlexWindowsManager.initialize");
        // this.loadTextFile("windows/Scene_Title.js", str => {
            

        //     let data = null;
        //     eval(str);
        //     console.log(data);
        // });

        // this.loadXmlFile("windows/Scene_Name.xml", (obj: XMLDocument) => {
        //     console.log(obj);
        //     console.log(obj.nodeName);
        //     console.log(obj.nodeType);
        //     console.log(obj.nodeValue);
        //     const root = obj.firstElementChild;
        //     console.log(root?.getAttribute("class"));

        // });
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
