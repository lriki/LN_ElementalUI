Design(
//==============================================================================
// 
//------------------------------------------------------------------------------
//==============================================================================
Scene({
    class: "Scene_Title",
    contents: [
        Window({
            class: "Window_TitleCommand",
            rect: Script("scene.commandWindowRect()"), }),
        Window({
            alignment: "bottom-left",
            contents: [
                Text({ text: "Ver: 0.1.0" }),
            ]
        })
    ],
})
);