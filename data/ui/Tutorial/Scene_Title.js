Design(
//==============================================================================
// 
//------------------------------------------------------------------------------
//==============================================================================
Scene({
    class: "Scene_Title",
    children: [
        Window({
            class: "Window_TitleCommand",
            windowskin: "img/Window1",
        }),
        Window({
            alignment: "bottom-left",
            children: [
                Text({ text: "Ver: 0.1.0, Theme: Tutorial" }),
            ]
        })
    ],
})
);