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
            rect: Script("scene.commandWindowRect()"), }),
        Window({
            alignment: "bottom-left",
            children: [
                Text({ text: "Ver: 0.1.0" }),
            ]
        })
    ],
})
);