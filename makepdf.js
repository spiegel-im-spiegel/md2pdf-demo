var markdownpdf = require("markdown-pdf")

markdownpdf().from("using-gnupg-2.1.x.md").to("using-gnupg-2.1.x.pdf", function () {
  console.log("Done")
})
