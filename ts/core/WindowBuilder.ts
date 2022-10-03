import { WindowDesign } from "./WindowDesign";


export class WindowBuilder {
    public applyDesign(window: Window_Base, design: WindowDesign) {
        const rect = design.props.rect;
        if (rect) {
            if (rect[0] !== undefined) window.x = rect[0];
            if (rect[1] !== undefined) window.y = rect[1];
            if (rect[2] !== undefined) window.width = rect[2];
            if (rect[3] !== undefined) window.height = rect[3];
        }

        window._flexWindowDesignRevision = design.revision;
    }
}

