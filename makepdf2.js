var markdownpdf = require("markdown-pdf")
  , fs = require("fs")

  fs.createReadStream("using-gnupg-2.1.x.md")
    .pipe(markdownpdf())
    .pipe(fs.createWriteStream("using-gnupg-2.1.x.pdf"))
