const markdownpdf = require('markdown-pdf');
const split = require('split');
const through = require('through');
const duplexer = require('duplexer');

function preProcessMd() {
  // Split the input stream by lines
  var splitter = split();

  // Replace occurences of "foo" with "bar"
  var replacer = through(function(data) {
    this.queue(data.replace(/\\n/g, '<br />') + '\n');
  });
  splitter.pipe(replacer);
  return duplexer(splitter, replacer);
}

markdownpdf({
  cssPath: './assets/index.css',
  remarkable: { html: true },
  paperBorder: '1cm',
  paperFormat: 'A4',
  preProcessMd: preProcessMd,
})
  .from('./index.md')
  .to('./out.pdf', function() {
    console.log('Done');
  });
