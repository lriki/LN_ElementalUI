Design(
//==============================================================================
// 
//------------------------------------------------------------------------------
//==============================================================================
UIScene({
    class: "Scene_Map",
    contents: [
        // 中身は VPlayerStatusWindow.js
        UIPart({
            class: "VPlayerStatusWindow",
            data: Script("$gameParty.members()[0]"),
        }),
        // UIPart({
        //     class: "VPlayerStatusWindow",
        //     data: Script("$gameParty.members()[1]"),
        //     left: 200,
        // }),
    ],
})
);