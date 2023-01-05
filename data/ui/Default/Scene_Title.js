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
            //rect: Script("scene.commandWindowRect()"),
            height: Script("scene.calcWindowHeight(4, true)"),

            left: 480,

        }),
        UIWindow({
            alignment: "bottom-left",
            contents: [
                UIStaticText({ text: "Ver: 0.1.0, Theme: Default" }),
            ]
        })
    ],
})
);