レイアウト
==========

ここではそれぞれの UIElement の座標やサイズがどのように計算されるのかを説明します。

位置の計算
----------

RPGツクールでは通常、左上を原点とした X, Y 座標と、幅(width)、高さ(height) によってウィンドウや画像を配置します。

一方 ElementalUI では、まず最初に原点を決めて、そこからの相対的な距離によって位置を計算します。

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
            alignment: "bottom-left",   // 原点の指定
            contents: [
                UIText({ text: "Ver: 0.1.0, Theme: Tutorial" }),
            ]
        })
    ],
})
```

`alignment: "bottom-left"` は、ウィンドウの原点を画面 (親の UIScene) の左下とする設定です。
これによって座標を設定しなくてもウィンドウ位置は自動計算され、ウィンドサイズ変更等に伴う柔軟なレイアウトができるようになります。

![](img/layout-1.png)

続いて原点からの距離を変更してみましょう。

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
            left: 100,      // 左側
            bottom: 50,     // 下側
            contents: [
                UIText({ text: "Ver: 0.1.0, Theme: Tutorial" }),
            ]
        })
    ],
})
```

![](img/layout-2.png)

`left` と `bottom` によって、それぞれ左側と下側の幅をしていし、ウィンドウの位置を調整しました。


!!! note
    位置は alignment と left, top, right, bottom によって設定できます。

    UIWindow には alignment がありませんが、これは UIWindow の alignment のデフォルト値が "top-left" (左上) であるためです。

  
サイズの計算
----------

次のようなルールで計算されます。

1. class プロパティによって、RPGツクール標準のウィンドウを制御する場合、その元々のサイズが使われます。
2. `width`, `height` プロパティが指定されている場合、そのサイズが使われます。
3. 上記いずれでもない場合、子 UIElement のサイズによって自動的に計算します。

例えば Scene_Title.js では、

- 1つめの UIWindow はツクール標準のタイトル画面コマンドウィンドウを使っているため元のサイズが使われます。
- 2つめの UIWindow は独自ウィンドウですが、width, height が指定されていないため、その子要素、つまり `contents` に指定された UIText が表示する文字列のサイズを元に計算されます。

