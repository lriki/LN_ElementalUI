UIElement
==========

ここではデザインファイルの重要な構成要素である `UIElement` について説明します。

UIElement
----------

ウィンドウや文字列、アイコンなど、 UI を構築するための個々の部品のことを `UIElement` （UI要素）と呼びます。

以下に Tutorial の Scene_Title.js を再掲します。

```js
UIScene({
    class: "Scene_Title",
    contents: [
        UIWindow({
            class: "Window_TitleCommand",
            left: 500,
            top: 384,
            windowskin: "img/Window1",
        }),
        UIWindow({
            alignment: "bottom-left",
            contents: [
                UIText({ text: "Ver: 0.1.0, Theme: Tutorial" }),
            ]
        })
    ],
})
```

先頭が `UI` で始まる名前は全て UIElement を示しています。

このタイトル画面には、合計4つの UIElement が存在していることになります。

TODO: 画像

UIElement は一般的な GUI フレームワークと同様に親子関係を持ち、親要素からの相対座標によってレイアウトを行います。（レイアウトについては次のページで説明します）

プロパティ
----------

UIElement に続く `({` ～ `})` の中に、この要素の各種設定を書いていきます。（個々の設定の事を `プロパティ` と呼びます）

```js
【UIElement名】({
    【プロパティ名】: 値,
    【プロパティ名】: 値,
    ...
});
```

### 指定できるプロパティ

[UITextのリファレンスページ](../../3-reference/UIText.md) を見てみましょう。

「プロパティ」に、指定できるプロパティの一覧が書かれています。

また、「継承: UIElement」とありますが、これは UIText が UIElement そのものを表現する機能を継承していることを示し、
[UIElementのリファレンスページ](../../3-reference/UIElement.md) に書かれているプロパティもすべて使用できることを意味しています。

例えば次のように、不透明度 `opacity` を指定してみましょう。

```js
UIScene({
    class: "Scene_Title",
    contents: [
        UIWindow({
            【略】
        }),
        UIWindow({
            alignment: "bottom-left",
            contents: [
                UIText({
                    text: "Ver: 0.1.0, Theme: Tutorial",
                    opacity: 127,   // ここに追加する。
                }),
            ]
        })
    ],
})
```

opacity の最大は 255 です。その半分の 127 を指定したことで、文字列が半透明になって表示されます。

![](img/uielement-3.png)
