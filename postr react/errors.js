function ErrorTrace(){
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.log(msg, url, lineNo, columnNo, error);
    document.title = "Error" + msg;
    document.head.innerHTML =  `
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
      <style>
      body {
        background-color: white;
        color: black;
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
      }
      
      .dark-mode {
        background-color: #1f1f1f;
        color: white;
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
      }
      .code-block {
        background: #050505;
   
        color: #d4d4d4;
        font-size: 14px;
        font-family: 'Courier New', Courier, monospace;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
   
      }
      
      .line-number {
        display: inline-block;
        width: 30px;
        text-align: right;
        margin-right: 10px;
        color: #999;
      }
      
      .line-content {
        display: inline-block;
        margin-left: 10px;
      }
      
      </style>
   
      `;

    let xhml = new XMLHttpRequest();
    xhml.open("GET", url, false);
    xhml.send();
    
    let content = xhml.responseText;
    let lines = content.split("\n");
    let highlightedLine = lines[lineNo - 1];
    let line_no = lineNo;
    if (highlightedLine.length > 80) {
      highlightedLine = highlightedLine.substring(0, 80) + "...";
    }
    let column_no = columnNo;
    let errorType = error.name;
    let stack = error.stack;
    
    // Generate code block
    let codeBlock = "";
    for (let i = Math.max(0, line_no - 5); i < Math.min(lines.length, line_no + 5); i++) {
      let lineNumber = i + 1;
      let lineContent = lines[i];
      let lineClass = "";
      if (i == line_no) {
        lineClass = "text-danger";
        codeBlock += `<span class="rounded bg-danger">${lineNumber}: ${highlightedLine}</span><br>`;
      } else {
        codeBlock += `<span>${lineNumber}: ${lineContent}</span><br>`;
      }
    }
  
    document.body.innerHTML = `
      <div class="container" style="padding: 50px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 class="text-danger">Error ${msg} occurred</h2>
          <i id="toggle-dark-mode-btn" class="bi bi-moon-fill" style="cursor: pointer; font-size: 2rem;"></i>

        </div>
        <p class="text-secondary">${url}:${lineNo}:${columnNo}</p>
        <p class="text-secondary">${errorType}</p>
        <p class="text-secondary">${stack}</p>
        <p class="text-secondary">${column_no}</p>
        <div class="code-block">${codeBlock}</div>
      </div>
    `;
    
    // Add dark mode toggle functionality
    const toggleDarkModeBtn = document.querySelector("#toggle-dark-mode-btn");
    const body = document.querySelector("body");
    
    toggleDarkModeBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      body.classList.toggle("text-white");
      document.querySelectorAll(".code-block ").forEach((span) => {
        span.classList.toggle("text-white");
        span.classList.toggle("bg-secondary");
      });
    });
  }
  console.log("ErrorTrace loaded")
 }
 
 
export default ErrorTrace;
window.ErrorTrace = ErrorTrace;