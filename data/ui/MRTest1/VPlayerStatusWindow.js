Design(
//==============================================================================
// 
//------------------------------------------------------------------------------
//==============================================================================
UIWindow({
    //--------------------------------------------------------------------------
    // Window 自身の設定
    //--------------------------------------------------------------------------
    class: "VPlayerStatusWindow",
    visibleCoreContents: false,
    width: 200,

    //--------------------------------------------------------------------------
    // Window の表示内容
    //--------------------------------------------------------------------------
    contents: [
        UIStackLayout({
            orientation: "vertical",
            contents: [
                UIText({
                    text: Script("data.name()"),
                }),
                UIImage({
                    file: "img/faces/Actor1",
                    frame: [0, 0, 144, 144],
                    left: 0,
                    top: 0,
                }),
                UIGridLayout({
                    contents: [
                        UIText({
                            text: "HP",
                            row: 0,
                            col: 0,
                        }),
                        UIText({
                            text: Script("data.hp"),
                            alignment: "right",
                            row: 0,
                            col: 1,
                            updateMode: "real-time",
                        }),
                        UIGradientGauge({
                            value: Script("data.hp"),
                            maxValue: Script("data.mhp"),
                            color1: theme.color(20),
                            width: 100,
                            height: 8,
                            updateMode: "real-time",
                            row: 1,
                            colSpan: 2,
                        }),
                        UIText({
                            text: "MP",
                            row: 2,
                            col: 0,
                        }),
                        UIText({
                            text: Script("data.mp"),
                            alignment: "right",
                            row: 2,
                            col: 1,
                        }),
                        UIGradientGauge({
                            value: Script("data.mp"),
                            maxValue: Script("data.mmp"),
                            color1: theme.color(12),
                            gaugePadding: 0,
                            width: 100,
                            height: 8,
                            row: 3,
                            colSpan: 2,
                        }),
                    ],
                }),
                UIAccordionLayout({
                    contents: [
                        UIIcon({
                            iconIndex: 208,
                            alignment: "left",
                        }),
                        UIStaticText({
                            text: "test",
                            alignment: "right",
                        }),
                        UIStaticText({
                            text: "X"
                        }),
                    ],
                }),
                UIImageGauge({
                    file: ":img/MRUI-1",
                    backFrame: [96, 18, 238, 28],
                    gaugeFrame: [336, 0, 230, 20],
                    gaugeOffsetX: 4,
                    gaugeOffsetY: 4,
                    value: 70,
                    maxValue: 100,
                }),
                UIImageGauge({
                    file: ":img/MRUI-1",
                    orientation: "BottomToTop",
                    backFrame: [48, 96, 48, 48],
                    gaugeFrame: [0, 96, 48, 48],
                    gaugeOffsetX: 0,
                    gaugeOffsetY: 0,
                    value: 70,
                    maxValue: 100,
                }),
                // UIImage({
                //     file: ":img/MRUI-1",
                //     frame: [0, 0, 82, 94],
                // }),
                // UIImage({
                //     file: ":img/MRUI-1",
                //     frame: [82, 0, 252, 14],
                //     left: 82,
                //}),
            ],
        }),
    ]
})
);