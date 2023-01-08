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
                        }),
                        UIGradientGauge({
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
                            width: 100,
                            height: 8,
                            color1: theme.color(20),
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