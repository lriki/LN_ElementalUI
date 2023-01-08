import { DGridLayout } from "ts/design/layout/DGridLayout";
import { DStackLayout } from "ts/design/layout/DStackLayout";
import { VUIPoint, VUIRect, VUISize } from "../UICommon";
import { UIContext } from "../UIContext";
import { VUIElement } from "../UIElement";
import { UILayoutHelper } from "../utils/UILayoutHelper";

enum VUIGridLayoutLengthType
{
    /** 子要素のサイズに合わせる */
    Auto,

    /** サイズを直接指定する */
    Direct,

    /** レイアウト後、残りの領域を使う */
    Ratio,
};

enum VUIGridLayoutRule
{
    Box,
    VerticalFlow,

    // 子要素を上詰めで配置する。
    // Row は Auto となり、Height 0 の Item は表示されない。
    HorizontalFlow,
};

class VUIGridLayoutDefinitionData
{
    // input data
    type: VUIGridLayoutLengthType = VUIGridLayoutLengthType.Auto;
    size: number = 0;
    minSize: number = 0;
    maxSize: number = 100000;

    // working data
    desiredSize: number = 0;
    desiredOffset: number = 0;  // 一時計算用
    actualOffset: number = 0;    // 最終オフセット
    actualSize: number = 0;        // 最終サイズ

    public constructor(type: VUIGridLayoutLengthType ) {
        this.type = type;
    }

    // getAvailableDesiredSize(): number {
    //     if (this.type == VUIGridLayoutLengthType.Auto) {
    //         return this.desiredSize;
    //     }
    //     else if (this.type == VUIGridLayoutLengthType.Direct) {
    //         return UILayoutHelper.clamp(this.size, this.minSize, this.maxSize);
    //     }
    //     else {
    //         return this.desiredSize;
    //     }
    // }

    GetRatioSize(): number
    {
        return (this.size == 0) ? 1 : this.size;
    }

    AdjustActualSize(): void
    {
        this.actualSize = UILayoutHelper.clamp(this.actualSize, this.minSize, this.maxSize);
    }
}

export class UIGridLayout extends VUIElement {
    public readonly design: DGridLayout;
    
    private m_rowDefinitions: VUIGridLayoutDefinitionData[];
    private m_columnDefinitions: VUIGridLayoutDefinitionData[];
    private m_rule = VUIGridLayoutRule.VerticalFlow;

    public constructor(design: DGridLayout) {
        super(design);
        this.design = design;
        this.m_rowDefinitions = [];
        this.m_columnDefinitions = [];
    }
    
    private GetDefaultRowLengthType(): VUIGridLayoutLengthType
    {
        if (this.m_rule == VUIGridLayoutRule.VerticalFlow)
            return VUIGridLayoutLengthType.Auto;
        else
            return VUIGridLayoutLengthType.Ratio;
    }

    private GetDefaultColumnLengthType(): VUIGridLayoutLengthType
    {
        if (this.m_rule == VUIGridLayoutRule.HorizontalFlow)
            return VUIGridLayoutLengthType.Auto;
        else
            return VUIGridLayoutLengthType.Ratio;
    }

    private PrepareDefinitions(rowCount: number, colCount: number)
    {
        while (this.m_rowDefinitions.length < rowCount) {
            this.m_rowDefinitions.push(new VUIGridLayoutDefinitionData(this.GetDefaultRowLengthType()));
        }
        while (this.m_columnDefinitions.length < colCount) {
            this.m_columnDefinitions.push(new VUIGridLayoutDefinitionData(this.GetDefaultColumnLengthType()));
        }
    }

    override addLogicalChild(element: VUIElement): VUIElement {
        this.addVisualChild(element);
        return element;
    }

    protected measureOverride(context: UIContext, constraint: VUISize): VUISize {

        // Measure layout and grid size.
        const children = this.visualChildren;
        let rowCount = 0;
        let colCount = 0;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.measure(context, constraint);

            const gridInfo = child.gridInfo;
            rowCount = Math.max(rowCount, gridInfo.row + 1);
            colCount = Math.max(colCount, gridInfo.column + 1);
        }

        // Allocate definitions
        this.PrepareDefinitions(rowCount, colCount);

        // Measure desired sizes per cells.
        // 最初に、span が 1 であるセルサイズを適用する.
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const gridInfo = child.gridInfo;
            const row = this.m_rowDefinitions[gridInfo.row];
            const col = this.m_columnDefinitions[gridInfo.column];
            if (gridInfo.rowSpan == 1) {
                if (row.type == VUIGridLayoutLengthType.Auto || row.type == VUIGridLayoutLengthType.Ratio) {
                    row.desiredSize = Math.max(row.desiredSize, child.desiredHeight());
                }
            }
            if (gridInfo.columnSpan == 1) {
                if (col.type == VUIGridLayoutLengthType.Auto || col.type == VUIGridLayoutLengthType.Ratio) {
                    col.desiredSize = Math.max(col.desiredSize, child.desiredWidth());
                }
            }
        }
        // 次に、type が Direct であるセルのサイズを適用する。
        let ry = 0;
        for (const row of this.m_rowDefinitions) {
            if (row.type == VUIGridLayoutLengthType.Direct) {
                row.desiredSize = row.size;
            }
            row.desiredSize = UILayoutHelper.clamp(row.desiredSize, row.minSize, row.maxSize);
            row.desiredOffset = ry;
            ry += row.desiredSize;
        }
        let cx = 0;
        for (const col of this.m_columnDefinitions) {
            if (col.type == VUIGridLayoutLengthType.Direct) {
                col.desiredSize = col.size;
            }
            col.desiredSize = UILayoutHelper.clamp(col.desiredSize, col.minSize, col.maxSize);
            col.desiredOffset = cx;
            cx += col.desiredSize;
        }
        // 最期に Span をまたぐセルのサイズを適用する。
        // Span が続く最後のセルに対してサイズを適用する。
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const gridInfo = child.gridInfo;
            if (gridInfo.rowSpan > 1) {
                const row2 = this.m_rowDefinitions[gridInfo.row + (gridInfo.rowSpan - 1)];
                if (row2.type == VUIGridLayoutLengthType.Auto || row2.type == VUIGridLayoutLengthType.Ratio) {
                    const size = child.desiredHeight() - row2.desiredOffset;
                    row2.desiredSize = Math.max(row2.desiredSize, size);
                }
            }
            if (gridInfo.columnSpan > 1) {
                const col2 = this.m_columnDefinitions[gridInfo.column + (gridInfo.columnSpan - 1)];
                if (col2.type == VUIGridLayoutLengthType.Auto || col2.type == VUIGridLayoutLengthType.Ratio) {
                    const size = child.desiredWidth() - col2.desiredOffset;
                    col2.desiredSize = Math.max(col2.desiredSize, size);
                }
            }
        }

        // Aggregate DesiredSize of each cell to find DesiredSize of entire Grid
        let cellsDesiredWidth = 0;
        let cellsDesiredHeight = 0;
        for (const row of this.m_rowDefinitions) {
            cellsDesiredHeight += row.desiredSize;
        }
        for (const col of this.m_columnDefinitions) {
            cellsDesiredWidth += col.desiredSize;
        }

        return {width: cellsDesiredWidth, height: cellsDesiredHeight};
    }

    protected arrangeOverride(context: UIContext, borderBoxSize: VUISize): VUISize {
        //const auto finalWidth = finalArea.Size();
        //const dtx::Thickness padding(0);
        // const margin = this.getMargin();    // TODO: ほんとは arrange の外側でやるべき
        // finalArea.x += margin.left;
        // finalArea.y += margin.top;
        // finalArea.width -= margin.left + margin.right;
        // finalArea.height -= margin.top + margin.bottom;

        const padding = this.padding();
        const childrenBoundSize: VUISize = {
            width: borderBoxSize.width - (padding.left + padding.right),
            height: borderBoxSize.height - (padding.top + padding.bottom
        )};

        // Fix final size of 'Auto' and 'Direct', and count 'Ratio'
        const totalActualSize: VUISize = { width: 0, height: 0 };
        let ratioRowCount = 0;
        let ratioColCount = 0;
        for (const row of this.m_rowDefinitions) {
            if (row.type == VUIGridLayoutLengthType.Auto || row.type == VUIGridLayoutLengthType.Direct) {
                row.actualSize = row.desiredSize;
                totalActualSize.height += row.actualSize;
            }
            else {
                ratioRowCount += row.GetRatioSize();
            }
        }
        for (const col of this.m_columnDefinitions) {
            if (col.type == VUIGridLayoutLengthType.Auto || col.type == VUIGridLayoutLengthType.Direct) {
                col.actualSize = col.desiredSize;
                totalActualSize.width += col.actualSize;
            }
            else {
                ratioColCount += col.GetRatioSize();
            }
        }

        // "1*" 分のセルの領域を計算する
        const ratioUnit: VUISize = {
            width: (ratioColCount != 0) ? (childrenBoundSize.width - totalActualSize.width) / ratioColCount : 0,
            height: (ratioRowCount != 0) ? (childrenBoundSize.height - totalActualSize.height) / ratioRowCount : 0};
        ratioUnit.width = Math.max(0, ratioUnit.width);
        ratioUnit.height = Math.max(0, ratioUnit.height);

        // "*" 指定である Row/Column の最終サイズを確定させ、
        // 全セルのオフセット (位置) も確定させる
        const totalOffset: VUIPoint = { x: 0, y: 0 };
        for (const row of this.m_rowDefinitions) {
            if (row.type == VUIGridLayoutLengthType.Ratio) {
                row.actualSize = ratioUnit.height * row.GetRatioSize();
            }
            row.AdjustActualSize();

            // Fix cell offset
            row.actualOffset = totalOffset.y;
            totalOffset.y += row.actualSize;
        }
        for (const col of this.m_columnDefinitions) {
            if (col.type == VUIGridLayoutLengthType.Ratio) {
                col.actualSize = ratioUnit.width * col.GetRatioSize();
            }
            col.AdjustActualSize();

            // Fix cell offset
            col.actualOffset = totalOffset.x;
            totalOffset.x += col.actualSize;
        }

        // 子要素の最終位置・サイズを確定させる
        let resultRect: VUIRect = { x: 0, y: 0, width: 0, height: 0 };
        const rowDefCount = (this.m_rowDefinitions.length);
        const colDefCount = (this.m_columnDefinitions.length);
        const children = this.visualChildren;
        for (let iChild = 0; iChild < children.length; iChild++) {
            const child = children[iChild];
            const gridInfo = child.gridInfo;
            const rowIdx = gridInfo.row;
            const colIdx = gridInfo.column;
            let rowSpan = gridInfo.rowSpan;
            let colSpan = gridInfo.columnSpan;
            rowSpan = Math.max(1, rowSpan);    // 最低 1
            colSpan = Math.max(1, colSpan);    // 最低 1
            rowSpan = Math.min(rowSpan, rowIdx + rowDefCount);    // 最大値制限
            colSpan = Math.min(colSpan, colIdx + colDefCount);    // 最大値制限

            // Span を考慮してサイズを確定
            const rect: VUIRect = {x: padding.left, y: padding.top, width: 0, height: 0};
            {
                rect.y += this.m_rowDefinitions[rowIdx].actualOffset;
                for (let iRow = 0; iRow < rowSpan; iRow++) {
                    rect.height += this.m_rowDefinitions[rowIdx + iRow].actualSize;
                }
            }
            {
                rect.x += this.m_columnDefinitions[colIdx].actualOffset;
                for (let iCol = 0; iCol < colSpan; iCol++) {
                    rect.width += this.m_columnDefinitions[colIdx + iCol].actualSize;
                }
            }

            // Arrange
            child.arrange(context, rect);
            resultRect = UILayoutHelper.inflateIncludes(resultRect, rect);
        }

        console.log("arranged", this);
        console.log("ratioUnit", ratioUnit);
        return resultRect;
    }
}
