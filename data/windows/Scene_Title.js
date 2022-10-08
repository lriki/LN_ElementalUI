Design(
Scene({
    class: "Scene_Title",
    //background: "EW-Carnation/Background1",
    children: [
        Part({class: "Window_TitleCommand", rect: Script("scene.commandWindowRect()")  /*, x: 100, y: 200, width: 200, height: 200*/ }),
        Window({
            width: 500,
            height: 200,
            children: [
                Text({ text: "Ver: 0.1.0" }),
                Image({ alignment: "top-right" }),
            ]
        })
    ],
})
);
/*
data = Scene({
    class: "Scene_Title",
    rect: [0, 0, 640, 480],
    children: [
        //----------------------------------------
        Picture({
            rect: [0, 0, 640, 480],
            styles: [
                Style({
                    state: "Default",
                    x: 10,
                    rotation: EasingAnimation({start: 0.0, end: Math.PI, duration: 10, func: "linear" })
                }),
                // Style({
                //     state: "${active}",
                //     x: KeyFrameAnimation([
                //         { time: 0, value: 10 },
                //         { time: 1, value: 20 },
                //         { time: 2, value: 30 },
                //     ]),
                //     x: KeyFrameAnimation([
                //         { time: 0, value: 10 },
                //         { time: 1, value: 20 },
                //         { time: 2, value: 30 },
                //     ]),
                // })
            ],
            "children": [
            ]
        }),
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

