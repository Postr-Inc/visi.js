window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.log(msg, url, lineNo, columnNo, error);
  document.title = "Error" + msg;
  document.head.innerHTML =  `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  `;

  let xhml = new XMLHttpRequest();
  xhml.open("GET", url, false);
  xhml.send();
  
  let content = xhml.responseText;
  let lines = content.split("\n");
  let line = lines[lineNo - 1];
  let line_no = lineNo - 1;
  let column = columnNo - 1;
  let column_no = columnNo - 1;
  console.log(line, line_no, column, column_no);
  let start = column;
  let end = start + line.length - 1;
  let highlightedLine = line.slice(start, end);
  
  // Generate code block
  let codeBlock = "";
  for (let i = Math.max(0, line_no - 5); i < Math.min(lines.length, line_no + 5); i++) {
    let lineNumber = i + 1;
    let lineContent = lines[i];
    let lineClass = "";
    if (i == line_no) {
      lineClass = "text-danger";
      codeBlock += `<span class="bg-danger">${lineNumber}: ${highlightedLine}</span><br>`;
    } else {
      codeBlock += `<span>${lineNumber}: ${lineContent}</span><br>`;
    }
  }

  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div class="container bg-dark" style="padding: 50px; border-radius: 10px; color: white; text-align: center;">
        <h1 style="font-size: 3rem;">Error ${msg} occurred</h1>
        <p class="text-muted" style="font-size: 1.5rem;">${url} line ${lineNo} column ${columnNo} error</p>   
        <div class="container py-5 mt-5" style="color:red; font-size: 1.5rem; text-align: left;">
          <span>
             ${codeBlock}
          </span>
        </div>
      </div>
    </div>
  `;
}