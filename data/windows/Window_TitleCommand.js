data = Window({
    class: "Window_TitleCommand",
    rect: [0, 0, 640, 480],
    itemTemplate: ListItem({}),
    children: [
        ContentPresenter({}),
        ListItem({
            text: "\\I[10]おまけ",
            script: "$gameVariables.setValue(1, 1);",
            symbol: "newGame",
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

