import { DElement } from "ts/design/DElement";
import { DListItem } from "ts/design/DListItem";
import { UIListItem } from "ts/ui/elements/UIListItem";
import { UIElementFactory } from "ts/ui/UIElementFactory";
import { assert } from "./Common";
import { FlexWindowsManager } from "./FlexWindowsManager";
import { DWindow } from "../design/DWindow";


export class WindowBuilder {
    public applyDesign(window: Window_Base, design: DWindow) {
        const rect = design.props.rect;
        if (rect) {
            if (rect[0] !== undefined) window.x = rect[0];
            if (rect[1] !== undefined) window.y = rect[1];
            if (rect[2] !== undefined) window.width = rect[2];
            if (rect[3] !== undefined) window.height = rect[3];
        }

        window._flexWindowDesignRevision = design.revision;



        // (window as any).itemLineRect = function(index: number) {
        //     console.log("itemLineRect !!!!");
        //     return new Rectangle(0, 0, 100, 100);
        // }


    }

    public applyCommandListContents(rmmzWindow: Window_Command, design: DWindow, baseMakeList: () => void): void {
        const manager = FlexWindowsManager.instance;
        const window = rmmzWindow._flexUIWindow;
        assert(window);
        
        let index = 0;
        const children = design.props.children || [];
        // for (; index < children.length; index++) {
        //     const element = children[index];
        //     if (element instanceof DListItem) {
        //         window.addCommand(element.text, element.symbol, element.enable, undefined);
        //     }
        // }

        // ItemPresenter
        {
            let firstOriginalIndex = rmmzWindow._list.length;
            baseMakeList();
            // 元の makeCommandList() によって追加されたアイテムの分の UIElement を作成する。
            for (let i = firstOriginalIndex; i < rmmzWindow._list.length; i++) {
                const command = rmmzWindow._list[i];
                const element = new DListItem({
                    text: command.name,
                    symbol: command.symbol,
                    enabled: command.enabled,
                });
                const uielement = new UIListItem(element);
                uielement.rmmzCommandIndex = i;
                window.addLogicalChild(uielement);
            }
        }

        // ItemPresenter の後
        for (; index < children.length; index++) {
            const element = children[index];
            if (element instanceof DListItem) {
                const uielement = new UIListItem(element);
                uielement.rmmzCommandIndex = rmmzWindow._list.length;
                window.addLogicalChild(uielement);
                rmmzWindow.addCommand(element.text, element.symbol, element.enabled, undefined);
            }
        }
        
        // Item template
        {
            
        }
    }

    public makeRect(design: DWindow, src: Rectangle): Rectangle {
        const rect = design.props.rect;
        if (rect) {
            const newRect = new Rectangle(src.x, src.y, src.width, src.height);
            if (rect[0] !== undefined) newRect.x = rect[0];
            if (rect[1] !== undefined) newRect.y = rect[1];
            if (rect[2] !== undefined) newRect.width = rect[2];
            if (rect[3] !== undefined) newRect.height = rect[3];
            return newRect;
        }
        else {
            return src;
        }
    }

    public applyElement(window: Window_Base, element: DElement): void {
        console.log("a");

        if (element instanceof DListItem) {
            console.log("a1");
            if (window instanceof Window_Command) {
                console.log("a2", element);
                window.addCommand(element.text, element.symbol, element.enabled, undefined);
                window.refresh();
            }
        }
        
        
    }
}

