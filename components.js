window.lib = (path) => {
  if (!path) throw new Error('require() must be called with a path!');
  if (path.startsWith("@tailwind/") || path.startsWith("@tailwind")) {
    // remove @tailwind from path
    if (document.getElementById("tailwindcss")) {
      throw new Error('Tailwind CSS already loaded please remove duplicate require("@tailwind")')
      return
    }
    if (path.startsWith("@tailwind/")) {
      path = path.replace("@tailwind/", "");
      path = path.replace("/", ",");
      let link = document.createElement('link');
      link.rel = "preload";
      link.as = "script";
      link.href = `https://cdn.tailwindcss.com?plugins=${path}`;
      document.head.appendChild(link);
      let script = document.createElement('script');
      script.src = `https://cdn.tailwindcss.com?plugins=${path}`;
      script.id = 'tailwindcss';

      if (!document.getElementById("tailwindcss")) {
        document.head.appendChild(script);
      }
      

      script.onload = () => {
        document.head.removeChild(script);
        console.log(`Tailwind CSS loaded with plugins ${path}`)
         
      }
    } else {
      let script = document.createElement('script');
      script.src = `https://cdn.tailwindcss.com`;

      script.id = 'tailwindcss';
      if (!document.getElementById("tailwindcss")) {
        document.head.appendChild(script);
      }
      

      script.onload = () => {
        document.head.removeChild(script);
        console.log('Tailwind CSS loaded')
        

      }
    }



    return
  }
  if (path.startsWith("@react-bootstrap")) {

    let script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
    script.id = "react-bootstrap"
    let style = document.createElement("link")
    style.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
    style.rel = "stylesheet"
    style.integrity = "sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
    style.crossOrigin = "anonymous"
     
    if (!document.getElementById("react-bootstrap")) {
      document.head.appendChild(script)
      document.head.appendChild(style)
    }

    script.onload = () => {
      console.log("React BootStrap loaded")
      document.head.removeChild(script)
      
    }

    return;
  }

  if (path.endsWith('.css')) {
    if (!cache[path]) {
      fetch(path)
        .then((response) => response.text())
        .then((code) => {
          cache[path] = code;
          totalSize += code.length;
          const stylesheet = new CSSStyleSheet();
          stylesheet.replaceSync(code);
          document.body.style.visibility = "hidden";
          // Add the stylesheet to the adoptedStyleSheets array
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
          document.onload = () => {
            document.body.style.visibility = "visible";
          }
        });
        
    } else {
      let source = cache[path];
      totalSize += source.length;
      const stylesheet = new CSSStyleSheet();
      stylesheet.replaceSync(source);
      document.body.style.visibility = "hidden";
      // Add the stylesheet to the adoptedStyleSheets array

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
      document.onload = () => {
        document.body.style.visibility = "visible";
      }
    }
    return;
  }






}
