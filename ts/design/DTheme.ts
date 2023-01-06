
export class DTheme {
    // 固定値 (Window_Base.prototype.lineHeight)
    lineHeight: number = 36;

    public color(index: number): string {
        return ColorManager.textColor(index);
    }
}
