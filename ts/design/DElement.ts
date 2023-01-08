import { assert } from "ts/core/Common";
import { DStyle, DStyleProps, DStyleScriptValue } from "./DStyle";
import { DTransition } from "./DTransition";

export enum DAlignment {
    /** 子要素を、親のレイアウト スロットの中央に揃えて配置します。*/
    Center = "center",

    /** 子要素を、親のレイアウト スロットの左側に揃えて配置します。*/
    Left = "left",

    /** 子要素を、親のレイアウト スロットの上端に揃えて配置します。*/
    Top = "top",

    /** 子要素を、親のレイアウト スロットの右側に揃えて配置します。*/
    Right = "right",

    /** 子要素を、親のレイアウト スロットの下端に揃えて配置します。*/
    Bottom = "bottom",
    
    /** 子要素を、親のレイアウト スロットの左上に揃えて配置します。*/
    TopLeft = "top-left",

    /** 子要素を、親のレイアウト スロットの右上に揃えて配置します。*/
    TopRight = "top-right",

    /** 子要素を、親のレイアウト スロットの左下に揃えて配置します。*/
    BottomLeft = "bottom-left",

    /** 子要素を、親のレイアウト スロットの右下に揃えて配置します。*/
    BottomRight = "bottom-right",

    /** 子要素を、親のレイアウト スロットの左側に揃え、上下を引き延ばして配置します。*/
    LeftStretch = "left-stretch",

    /** 子要素を、親のレイアウト スロットの上側に揃え、左右を引き延ばして配置します。*/
    TopStretch = "top-stretch",

    /** 子要素を、親のレイアウト スロットの右側に揃え、上下を引き延ばして配置します。*/
    RightStretch = "right-stretch",

    /** 子要素を、親のレイアウト スロットの下側に揃え、左右を引き延ばして配置します。*/
    BottomStretch = "bottom-stretch",

    /** 子要素を、親のレイアウト スロットの中央に揃え、左右を引き延ばして配置します。*/
    HorizontalStretch = "horizontal-stretch",

    /** 子要素を、親のレイアウト スロットの中央に揃え、上下を引き延ばして配置します。*/
    VerticalStretch = "vertical-stretch",

    /** 子要素を、親のレイアウト スロット全体に引き伸ばします。*/
    Stretch = "stretch",
}

export enum DUpdateMode {
    OneTime = "one-time",
    RealTime = "real-time",
}

export interface DElementProps extends DStyleProps {
    class?: string;
    data?: DStyleScriptValue;
    alignment?: DAlignment;
    windowskin?: string;
    contents?: DElement[];
    transitions?: DTransition[];
    styles?: DStyle[];
    updateMode?: DUpdateMode;
    row?: number;  
    col?: number;
    rowSpan?: number;
    colSpan?: number;
}

export class DElement {
    public props: DElementProps;
    protected _defaultStyle: DStyle;

    constructor(props: DElementProps) {
        this.props = props;
        this._defaultStyle = new DStyle(this.props);
    }

    public get defaultStyle(): DStyle {
        return this._defaultStyle;
    }

    public clone(): DElement {
        return new DElement({...this.props});
    }

    public mergeProps(base : DElementProps): void {
        const result: DElementProps = {...base, ...this.props};
        this.props = result;
        this._defaultStyle = new DStyle(this.props);
    }

    // public get alignment(): DAlignment {
    //     return this.alignment ?? DAlignment.Center;
    // }

    public get contents(): readonly DElement[] {
        return this.props.contents ?? [];
    }

    public get transitions(): readonly DTransition[] {
        return this.props.transitions ?? [];
    }

    public get updateMode(): DUpdateMode {
        return this.props.updateMode ?? DUpdateMode.OneTime;
    }

    public findElementByClass(className: string): DElement | undefined {
        if(this.props.class === className) {
            return this;
        }
        for(const child of this.contents) {
            const result = child.findElementByClass(className);
            if(result) {
                return result;
            }
        }
        return undefined;
    }

    public findStyle(stateName: string): DStyle | undefined {
        const styles = this.props.styles;
        if (styles) {
            for (const style of styles) {
                if (style.props.state === stateName) {
                    return style;
                }
            }
        }
        return undefined;
    }
}



