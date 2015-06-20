# Markdown ファイルを PDF に変換する。

Markdown ファイルを PDF に変換するツールがあるらしい。

- [alanshaw/markdown-pdf](https://github.com/alanshaw/markdown-pdf)
- [markdown-pdf - MarkdownをPDFに変換 MOONGIFT](http://www.moongift.jp/2015/05/markdown-pdf-markdown%E3%82%92pdf%E3%81%AB%E5%A4%89%E6%8F%9B/)
- [Node.js - markdown-pdf で .mdを.pdfに変換してみた - Qiita](http://qiita.com/tukiyo3/items/25b47cfed8f7b6e8c9bf)

[markdown-pdf]: https://github.com/alanshaw/markdown-pdf "alanshaw/markdown-pdf"
[node.js]: https://nodejs.org/ "Node.js"

さっそく [markdown-pdf] を `-g` オプションを付けて導入してみる。

```shell
C:>npm install -g markdown-pdf
npm WARN engine markdown-pdf@5.3.0: wanted: {"node":"~0.10.0"} (current: {"node":"0.12.4","npm":"2.10.1"})

> phantomjs@1.9.17 install C:\Users\username\AppData\Roaming\npm\node_modules\markdown-pdf\node_modules\phantomjs
> node install.js

Downloading https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-windows.zip
Saving to C:\Users\username\AppData\Local\Temp\phantomjs\phantomjs-1.9.8-windows.zip
Receiving...
  [=================================-------] 82% 0.0s
Received 7292K total.
Extracting zip contents
Removing C:\Users\username\AppData\Roaming\npm\node_modules\markdown-pdf\node_modules\phantomjs\lib\phantom
Copying extracted folder C:\Users\username\AppData\Local\Temp\phantomjs\phantomjs-1.9.8-windows.zip-extract-1434805144463\phantomjs-1.9.8-windows -> C:\Users\username\AppData\Roaming\npm\node_modules\markdown-pdf\node_modules\phantomjs\lib\phantom
Writing location.js file
Done. Phantomjs binary available at C:\Users\username\AppData\Roaming\npm\node_modules\markdown-pdf\node_modules\phantomjs\lib\phantom\phantomjs.exe
C:\Users\username\AppData\Roaming\npm\markdown-pdf -> C:\Users\username\AppData\Roaming\npm\node_modules\markdown-pdf\bin\markdown-pdf
markdown-pdf@5.3.0 C:\Users\username\AppData\Roaming\npm\node_modules\markdown-pdf
├── duplexer@0.1.1
├── extend@2.0.1
├── tmp@0.0.24
├── commander@2.8.1 (graceful-readlink@1.0.1)
├── through2@0.6.5 (xtend@4.0.0, readable-stream@1.0.33)
├── stream-from-to@1.4.2 (series-stream@1.0.1, async@0.9.2, mkdirp@0.5.1, concat-stream@1.5.0)
├── highlight.js@8.6.0
├── remarkable@1.6.0 (autolinker@0.15.3, argparse@0.1.16)
└── phantomjs@1.9.17 (which@1.0.9, progress@1.1.8, kew@0.4.0, request-progress@0.3.1, adm-zip@0.4.4, npmconf@2.1.1, request@2.42.0, fs-extra@0.18.4)
```

[node.js] のバージョンが新しすぎると怒られたが `C:\Users\username\AppData\Roaming\npm` フォルダにちゃんと `markdown-pdf.cmd` ができてたので大丈夫だろう。コマンドを起動してみる。

```shell
C:>markdown-pdf --version
5.3.0

C:>markdown-pdf --help

  Usage: markdown-pdf [options] <markdown-file-path>

  Options:

    -h, --help                               output usage information
    -V, --version                            output the version number
    <markdown-file-path>                     Path of the markdown file to convert
    -c, --cwd [path]                         Current working directory
    -p, --phantom-path [path]                Path to phantom binary
    -h, --runnings-path [path]               Path to runnings (header, footer)
    -s, --css-path [path]                    Path to custom CSS file
    -z, --highlight-css-path [path]          Path to custom highlight-CSS file
    -m, --remarkable-options [json-options]  Options to pass to remarkable
    -f, --paper-format [format]              'A3', 'A4', 'A5', 'Legal', 'Letter' or 'Tabloid'
    -r, --paper-orientation [orientation]    'portrait' or 'landscape'
    -b, --paper-border [measurement]         Supported dimension units are: 'mm', 'cm', 'in', 'px'
    -d, --render-delay [millis]              Delay before rendering the PDF
    -t, --load-timeout [millis]              Timeout before the page is rendered in case `page.onLoadFinished` isn't fired
    -o, --out [path]                         Path of where to save the PDF
```

では，これを使って以前書いた「[Windows 版 GnuPG 2.1.x を使ってみる](https://gist.github.com/spiegel-im-spiegel/f177c02af04d3b34ade0)」というドキュメントを PDF に変換してみる。（同じものを [Qiita にも貼ってある](http://qiita.com/spiegel-im-spiegel/items/8c60e63e7d00c5805427)）

```shell
C:>markdown-pdf -o using-gnupg-2.1.x.pdf using-gnupg-2.1.x.md
```

Windows 環境で実行しているせいか，フォントが MSUIGothic になってたりして微妙な感じだが全く見れないほどではないので，まぁよかろう。細かいコントロールは `-s` または `-z` オプションを使って CSS でコントロールすることになるのであろう。

[node.js] で駆動しているので，当然 JavaScript でもコントロールできる。

まずは [markdown-pdf] をローカルにインストールして，以下のコードを用意する。

```javascript:makepdf.js
var markdownpdf = require("markdown-pdf")

markdownpdf().from("using-gnupg-2.1.x.md").to("using-gnupg-2.1.x.pdf", function () {
  console.log("Done")
})
```

これで

```shell
C:>node makepdf.js
Done
```

とすれば全く同じ出力になる。

あるいは

```javascript:makepdf2.js
var markdownpdf = require("markdown-pdf")
  , fs = require("fs")

  fs.createReadStream("using-gnupg-2.1.x.md")
    .pipe(markdownpdf())
    .pipe(fs.createWriteStream("using-gnupg-2.1.x.pdf"))
```

のように Stream を pipe で繋ぐこともできる。

`markdownpdf()` の引数にオプションを指定することも可能。また複数の markdown ファイルを指定することもできるらしい。この辺はおいおい。
