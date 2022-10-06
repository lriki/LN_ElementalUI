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
}
