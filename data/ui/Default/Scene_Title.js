Design(
//==============================================================================
// 
//------------------------------------------------------------------------------
//==============================================================================
UIScene({
    class: "Scene_Title",
    contents: [
        UIWindow({
            class: "Window_TitleCommand",
            rect: Script("scene.commandWindowRect()"), }),
        UIWindow({
            alignment: "bottom-left",
            contents: [
                UIText({ text: "Ver: 0.1.0" }),
            ]
        })
    ],
})
);