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
        UIImage({
            file: "img/faces/Actor1",
            frame: [0, 0, 144, 144],
            left: 100,
            top: 50,
        }),
        UIText({
            text: "aaaaaaa",
        }),
        UIGradientGauge({
            width: 100,
            height: 8,
            updateMode: "real-time",
        }),
    ]
})
);