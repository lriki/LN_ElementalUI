import { assert } from "ts/core/Common";
import { FlexWindowsManager } from "ts/core/FlexWindowsManager";
import { DPartProps } from "./DPart";
import { DStyle, DStyleProps } from "./DStyle";
import { DTransition } from "./DTransition";

export interface DElementProps extends DStyleProps {
    class?: string;
    children?: DElement[];
    transitions?: DTransition[];
    styles?: DStyle[];
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

    public get children(): readonly DElement[] {
        return this.props.children ?? [];
    }

    public get transitions(): readonly DTransition[] {
        return this.props.transitions ?? [];
    }

    public findElementByClass(className: string): DElement | undefined {
        if(this.props.class === className) {
            return this;
        }
        for(const child of this.children) {
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
    
    public link(manager: FlexWindowsManager) {

        const children = this.props.children;
        if (children) {
            for (let i = 0; i < this.children.length; i++) {
                let child = children[i];
                if (child instanceof DPart) {
                    child = manager.clonePartElement(child.props);
                    children[i] = child;
                }
    
                child.link(manager);
            }
        }

        for(const child of this.children) {
            child.link(manager);
        }
    }
}


/**
 * Desing 初期構築用のダミーデータ。
 * link で本来あるべきデータに置き換えられる。
 */
 export class DPart extends DElement {
    readonly props: DPartProps;
    private _target: DElement | undefined;

    public constructor(props: DPartProps) {
        super(props);
        this.props = props;
    }

    public get target(): DElement {
        assert(this._target)
        return this._target;
    }

    // override link(manager: FlexWindowsManager) {
    //     this._target = manager.windowDesigns.get(this.props.class);
    //     assert(this._target);

    //     super.link(manager);
    // }
}

