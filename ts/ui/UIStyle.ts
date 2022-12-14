import { assert } from "ts/core/Common";
import { DStyle, DStyleScriptValue, DStyleValue } from "ts/design/DStyle";
import { VUIRect } from "./UICommon";
import { UIContext } from "./UIContext";
import { VUIElement } from "./UIElement";
import { UIScene } from "./UIScene";
import { UIHAlignment } from "./utils/UILayoutHelper";

export class UIStyle {
    public readonly data: DStyle;
    public dirty: boolean;

    horzonAlignment: UIHAlignment | undefined;
    verticalAlignment: UIHAlignment | undefined;

    marginLeft: number | undefined;
    marginTop: number | undefined;
    marginRight: number | undefined;
    marginBottom: number | undefined;

    paddingLeft: number | undefined;
    paddingTop: number | undefined;
    paddingRight: number | undefined;
    paddingBottom: number | undefined;

    x: number | undefined;
    y: number | undefined;
    width: number | undefined;
    height: number | undefined;

    opacity: number | undefined;           // 全体
    backOpacity: number | undefined;
    contentsOpacity: number | undefined;

    background: string | undefined;


    // Window.origin
    originX: number | undefined;
    originY: number | undefined;

    // Window.frameVisible
    frameVisible: boolean | undefined;

    public constructor(data: DStyle) {
        this.data = data;
        this.dirty = true;
    }

    public get stateName(): string {
        return this.data.props.state || "";
    }

    public evaluate(context: UIContext, self: VUIElement): void {
        if (! this.dirty) return;
        this.dirty = false;

        const props = this.data.props;

        if (props.marginLeft !== undefined) {
            this.marginLeft = props.marginLeft;
        }
        if (props.marginTop !== undefined) {
            this.marginTop = props.marginTop;
        }
        if (props.marginRight !== undefined) {
            this.marginRight = props.marginRight;
        }
        if (props.marginBottom !== undefined) {
            this.marginBottom = props.marginBottom;
        }

        if (props.paddingLeft !== undefined) {
            this.paddingLeft = props.paddingLeft;
        }
        if (props.paddingTop !== undefined) {
            this.paddingTop = props.paddingTop;
        }
        if (props.paddingRight !== undefined) {
            this.paddingRight = props.paddingRight;
        }
        if (props.paddingBottom !== undefined) {
            this.paddingBottom = props.paddingBottom;
        }


        if (this.data.props.rect) {
            const rect = this.data.props.rect;
            if (rect instanceof DStyleScriptValue) {
                const r = this.evalScript(rect.script, context, self) as VUIRect;
                if (r) {
                    this.x = r.x;
                    this.y = r.y;
                    this.width = r.width;
                    this.height = r.height;
                }
            }
            else {
                throw new Error("not implemented");
            }
        }

        if (props.x !== undefined) {
            this.x = props.x;
        }
        if (props.y !== undefined) {
            this.y = props.y;
        }
        if (props.width !== undefined) {
            this.width = this.evalScriptAsNumber(props.width, context, self);
        }
        if (props.height !== undefined) {
            this.height = this.evalScriptAsNumber(props.height, context, self);
        }
        if (props.opacity !== undefined) {
            this.opacity = props.opacity;
        }
        if (props.backOpacity !== undefined) {
            this.backOpacity = props.backOpacity;
        }
        if (props.contentsOpacity !== undefined) {
            this.contentsOpacity = props.contentsOpacity;
        }
        if (props.background !== undefined) {
            this.background = props.background;
        }

        if (props.originX !== undefined) {
            this.originX = props.originX;
        }
        if (props.originY !== undefined) {
            this.originY = props.originY;
        }

        if (props.frameVisible !== undefined) {
            this.frameVisible = props.frameVisible;
        }
    }

    private evalScript(script: string, content: UIContext, self_: VUIElement): any {
        const scene = content.owner.owner;
        const window = content.currentWindow;
        //const self = self_.owner;
        return eval(script);
    }

    private evalScriptAsNumber(value: DStyleValue, content: UIContext, self_: VUIElement): number {
        let result;
        if (value instanceof DStyleScriptValue) {
            result = this.evalScript(value.script, content, self_);
        }
        else {
            result = value;
        }
        assert(typeof result === "number");
        return result;
    }
    
}

