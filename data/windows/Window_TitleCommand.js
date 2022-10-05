Design(
//==============================================================================
// 
//------------------------------------------------------------------------------
//==============================================================================
CommandWindow({
    //--------------------------------------------------------------------------
    // 必須設定
    //--------------------------------------------------------------------------
    class: "Window_TitleCommand",

    //--------------------------------------------------------------------------
    // Window の外観に関する設定
    //--------------------------------------------------------------------------
    transitions: [
        Transition({property: "x", duration: 0.5, delay: 0.0, easing: "easeOutQuad"}),
    ],
    styles: [
        Style({
            state: "Opening",
            x: 600,
        })
    ],

    //--------------------------------------------------------------------------
    // Window の内容に関する設定
    //--------------------------------------------------------------------------
    itemTemplate: CommandItem({
        background: "#FF000077",
        transitions: [
            Transition({property: "x", duration: 0.5, delay: 0.0, easing: "easeOutQuad"}),
        ],
        styles: [
            Style({
                state: "Opening",
                x: -10,
            })
        ],
    }),
    items: [
        CommandItem({
            text: "\\I[10]おまけ",
            symbol: "newGame",
            script: "$gameVariables.setValue(1, 1);",
        }),
    ]
})
);

/*
data = Window({
    class: "Window_TitleCommand",
    itemTemplate: ListItem({}),
    transitions: [
        Transition({property: "x", duration: 0.5, delay: 0.0, easing: "easeOutQuad"}),
    ],
    styles: [
        Style({
            state: "Opening",
            x: -10,
        })
    ],
    children: [
        //ContentPresenter({}),
        ListItem({
            text: "\\I[10]おまけ",
            script: "$gameVariables.setValue(1, 1);",
            symbol: "newGame",
            x: 0,   // default
            y: 0,   // default
            transitions: [
                //Transition({property: "x", duration: 0.5, delay: 0.5, easing: "easeOutQuad"}),
            ],
            styles: [
                Style({
                    state: "opening",
                    x: -10,
                    // transitions: [
                    //     Transition({property: "opacity", start: -10, end: 0, duration: 0.5, delay: 0.5, easing: "easeOutQuad"}),
                    // ]
                })
            ]
        }),
        // ListItem({
        //     text: "New Game",
        //     symbol: "newGame",
        // }),
        // ListItem({
        //     text: "Load Game",
        //     symbol: "continue",
        // }),
        // ListItem({
        //     text: "TextManager.options",
        //     symbol: "options",
        // }),
        //----------------------------------------
        // Picture({
        //     rect: [0, 0, 640, 480],
        //     styles: [
        //         Style({
        //             state: "Default",
        //             x: 10,
        //             rotation: EasingAnimation({start: 0.0, end: Math.PI, duration: 10, func: "linear" })
        //         }),
        //         // Style({
        //         //     state: "${active}",
        //         //     x: KeyFrameAnimation([
        //         //         { time: 0, value: 10 },
        //         //         { time: 1, value: 20 },
        //         //         { time: 2, value: 30 },
        //         //     ]),
        //         //     x: KeyFrameAnimation([
        //         //         { time: 0, value: 10 },
        //         //         { time: 1, value: 20 },
        //         //         { time: 2, value: 30 },
        //         //     ]),
        //         // })
        //     ],
        //     "children": [
        //     ]
        // }),
    ]
});
*/
// "behaviors": [
//     {
//     }
// ],
// "children": [
//     {
//         "class": "Window_TitleCommand",
//         "x-rect": [0, 0, 640, 480],
//         "behaviors": [
//             {
//                 "class": ""
//             }
//         ],
//         "children": [
//         ]
//     },
    
//]

