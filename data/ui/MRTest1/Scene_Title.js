Design(
//==============================================================================
// 
//------------------------------------------------------------------------------
//==============================================================================
UIScene({
    class: "Scene_Title",
    contents: [
        // タイトル画面のコマンドウィンドウ
        UIWindow({
            class: "Window_TitleCommand",

            // Item 4 つ分を包含できるだけの高さにする
            height: Script("scene.calcWindowHeight(4, true)"),

            left: 480,

        }),
        // テスト用ウィンドウ。中身は VPlayerStatusWindow.js
        UIPart({
            class: "VPlayerStatusWindow",
        }),
        // 左下にバージョン表示
        UIWindow({
            alignment: "bottom-left",
            contents: [
                UIText({ text: "Ver: 0.1.0, Theme: MRTest1" }),
            ]
        })
    ],
})
);