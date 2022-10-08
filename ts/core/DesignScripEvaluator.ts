
import { DContentPresenter, DContentPresenterProps } from "ts/design/DContentPresenter";
import { DStyle, DStyleScriptValue, DStyleProps } from "ts/design/DStyle";
import { DTransition, DTransitionProps } from "ts/design/DTransition";
import { DCommandWindow, DCommandWindowProps } from "ts/design/DCommandWindow";
import { SceneDesign, SceneProps } from "ts/design/SceneDesign";
import { DWindow, WindowProps } from "ts/design/DWindow";
import { DPartProps } from "ts/design/DPart";
import { DElement, DPart } from "ts/design/DElement";
import { DListItem, DListItemProps } from "ts/design/DListItem";
import { DCommandItem, DCommandItemProps } from "ts/design/DCommandItem";
import { DText, DTextProps } from "ts/design/DText";
import { DImage, DImageProps } from "ts/design/DImage";
import { DIcon, DIconProps } from "ts/design/DIcon";

let designData: any = null;

//------------------------------------------------------------------------------
// Core

function Design(data: any): void {
    designData = data;
}

function Scene(props: SceneProps): SceneDesign {
    return new SceneDesign(props);
}

function Window(props: WindowProps): DWindow {
    return new DWindow(props);
}



//------------------------------------------------------------------------------
// Components

function Text(props: DTextProps): DText {
    return new DText(props);
}

function Image(props: DImageProps): DImage {
    return new DImage(props);
}


function UIIcon(props: DIconProps): DIcon {
    return new DIcon(props);
}

//------------------------------------------------------------------------------
// 
function ContentPresenter(props: DContentPresenterProps): DContentPresenter {
    return new DContentPresenter(props);
}




function ListItem(props: DListItemProps): DListItem {
    return new DListItem(props);
}



// function Picture(props: PictureProps) {
//     return new PictureDef(props);
// }

function Style(props: DStyleProps) {
    return new DStyle(props);
}

// function EasingAnimation(props: EasingAnimationProps) {
//     return props;
// }

function Part(props: DPartProps): DElement {
    return new DPart(props);
    //return FlexWindowsManager.instance.clonePartElement(props);
}

function Transition(props: DTransitionProps): DTransition {
    return new DTransition(props);
    //return FlexWindowsManager.instance.clonePartElement(props);
}

function Script(script: string): DStyleScriptValue {
    return new DStyleScriptValue(script);
}

function CommandWindow(props: DCommandWindowProps): DCommandWindow {
    return new DCommandWindow(props);
}

function CommandItem(props: DCommandItemProps): DCommandItem {
    return new DCommandItem(props);
}





export function evalDesignScript(code: string): any {
    eval(code);
    return designData;

    // var result = null;
    // var script = new Function("context", code);
    // try {
    //     result = script(context);
    // } catch (e) {
    //     console.log(e);
    // }
    // return result;
}

