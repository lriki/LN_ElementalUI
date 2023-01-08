
export class DTheme {
    // 固定値 (Window_Base.prototype.lineHeight)
    lineHeight: number = 36;

    public color(index: number): string {
        return ColorManager.textColor(index);
    }
    
    // Sprite_Gauge.labelFontFace
    /** ステータスのラベル部分のフォント名 */
    public get labelFontFace(): string {
        return $gameSystem.mainFontFace();
    };

    // Sprite_Gauge.labelFontFace
    /** ステータスのラベル部分のフォントサイズ */
    public get labelFontSize(): number {
        return $gameSystem.mainFontSize() - 2;
    };

    // Sprite_Gauge.labelColor
    /** ステータスのラベル部分のテキスト色 */
    public get labelColor() {
        return ColorManager.systemColor();
    };
    
    // Sprite_Gauge.labelOutlineColor
    /** ステータスのラベル部分のテキストアウトライン色 */
    public labelOutlineColor() {
        return ColorManager.outlineColor();
    };
    
    // Sprite_Gauge.labelOutlineWidth
    /** ステータスのラベル部分のテキストアウトラインサイズ */
    public get labelOutline() {
        return 3;
    };

    // Sprite_Gauge.numberFontFace
    /** ステータスの値部分のフォント名 */
    public get getDefaultValueFontFace(): string {
        return $gameSystem.numberFontFace();
    };

    // Sprite_Gauge.valueFontSize
    /** ステータスの値部分のフォントサイズ */
    public get getDefaultValueFontSize(): number {
        return $gameSystem.mainFontSize() - 6;
    };

    // Sprite_Gauge.prototype.valueColor
    /** ステータスの値部分のテキスト色 */
    public get valueNormalColor(): string {
        return ColorManager.normalColor();
    }

    // Sprite_Gauge.prototype.valueOutlineColor
    /** ステータスの値部分のテキストアウトライン色 */
    public get valueOutlineColor(): string {
        return "rgba(0, 0, 0, 1)";
    };
    
    // Sprite_Gauge.prototype.valueOutlineWidth
    /** ステータスの値部分のテキストアウトラインサイズ */
    public get valueOutlineWidth(): number {
        return 2;
    };
}
