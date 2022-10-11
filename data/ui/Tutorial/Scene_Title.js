Design(
//==============================================================================
// タイトル画面のデザインファイル
//==============================================================================
UIScene({
    class: "Scene_Title",
    contents: [
        // コマンドウィンドウの位置とウィンドウスキンを変更する
        UIWindow({
            class: "Window_TitleCommand",
            left: 480,
            top: 380,
            windowskin: "img/Window1",
        }),
        // 左下にバージョン情報のウィンドウを表示する
        UIWindow({
            alignment: "bottom-left",
            contents: [
                UIText({ text: "Ver: 0.1.0, Theme: Tutorial" }),
            ]
        }),
    ],
})
);