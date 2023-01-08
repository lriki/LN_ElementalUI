import { VUIRect } from "../UICommon";

/** 縦方向の表示位置を示します。*/
export enum UIVAlignment {
    /** 子要素を、親のレイアウト スロットの中央に揃えて配置します。*/
    Center = 0,

    /** 子要素を、親のレイアウト スロットの上端に揃えて配置します。*/
    Top,

    /** 子要素を、親のレイアウト スロットの下端に揃えて配置します。*/
    Bottom,

    /** 子要素を、親のレイアウト スロット全体に引き伸ばします。*/
    Stretch,
};

/** 横方向の表示位置を示します。*/
export enum UIHAlignment {
    /** 子要素を、親のレイアウト スロットの中央に揃えて配置します。*/
    Center = 0,

    /** 子要素を、親のレイアウト スロットの左側に揃えて配置します。*/
    Left,

    /** 子要素を、親のレイアウト スロットの右側に揃えて配置します。*/
    Right,

    /** 子要素を、親のレイアウト スロット全体に引き伸ばします。*/
    Stretch,
};

export class UILayoutHelper {

    // widthNan : ユーザーが希望するサイズを指定しているか
    static adjustHorizontalAlignment(
        areaWidth: number,
        desiredWidth: number,
        fixedWidthOrUndefined: number | undefined,
        align: UIHAlignment,
        outRect: VUIRect) {
        switch (align) {
            default:
            case UIHAlignment.Center:
                outRect.x = (areaWidth - desiredWidth) / 2;
                outRect.width = desiredWidth;
                break;
            case UIHAlignment.Left:
                outRect.x = 0;
                outRect.width = desiredWidth;
                break;
            case UIHAlignment.Right:
                outRect.x = areaWidth - desiredWidth;
                outRect.width = desiredWidth;
                break;
            case UIHAlignment.Stretch:
                if (fixedWidthOrUndefined === undefined) {
                    outRect.x = 0;
                    outRect.width = areaWidth;
                }
                else {
                    outRect.x = (areaWidth - desiredWidth) / 2;
                    outRect.width = fixedWidthOrUndefined;
                }
                break;
        }
    }

    static adjustVerticalAlignment(
        areaHeight: number,
        desiredHeight: number,
        fixedHeightOrUndefined: number | undefined,
        align: UIVAlignment,
        outRect: VUIRect) {
        switch (align) {
            default:
            case UIVAlignment.Center:
                outRect.y = (areaHeight - desiredHeight) / 2;
                outRect.height = desiredHeight;
                break;
            case UIVAlignment.Top:
                outRect.y = 0;
                outRect.height = desiredHeight;
                break;
            case UIVAlignment.Bottom:
                outRect.y = areaHeight - desiredHeight;
                outRect.height = desiredHeight;
                break;
            case UIVAlignment.Stretch:
                if (fixedHeightOrUndefined === undefined) {
                    outRect.y = 0;
                    outRect.height = areaHeight;
                }
                else {
                    outRect.y = (areaHeight - desiredHeight) / 2;
                    outRect.height = fixedHeightOrUndefined;
                }
                break;
        }
    }

    public static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }
    
    public static makeOffset(rect: VUIRect, x_: number, y_: number): VUIRect {
        return {x: rect.x + x_, y: rect.y + y_, width: rect.width, height: rect.height};
    }
    /** 指定した矩形が収まるようにこの矩形を拡張します。 */
    public static inflateIncludes(self: VUIRect, rect: VUIRect): VUIRect {
        if (self.width == 0 && self.height == 0) {
            return rect;
        }
        else {
            const result: VUIRect = { x: 0, y: 0, width: 0, height: 0 };
            let dx1 = self.x;
            let dy1 = self.y;
            let dx2 = self.x + self.width;
            let dy2 = self.y + self.height;
            const sx1 = rect.x;
            const sy1 = rect.y;
            const sx2 = rect.x + rect.width;
            const sy2 = rect.y + rect.height;
            dx1 = Math.min(dx1, sx1);
            dy1 = Math.min(dy1, sy1);
            dx2 = Math.max(dx2, sx2);
            dy2 = Math.max(dy2, sy2);
            result.x = dx1;
            result.y = dy1;
            result.width = dx2 - dx1;
            result.height = dy2 - dy1;
            return result;
        }
    }
}

