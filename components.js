var totalSize = 0;

let precached = false;
let cache = {}; // cache for require() callsa
window.require = (path) => {
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
    
      let script = document.createElement('script');
      script.src = `https://cdn.tailwindcss.com?plugins=${path}`;
      script.id = 'tailwindcss';
    
      if (!document.getElementById("tailwindcss")) {
        document.head.appendChild(script);
      }
      document.body.style.visibility = "hidden";
    
      script.onload = () => {
        document.head.removeChild(script);
        console.log(`Tailwind CSS loaded with plugins ${path}`)
        document.body.style.visibility = "visible";
      }
    } else {
      let script = document.createElement('script');
      script.src = `https://cdn.tailwindcss.com`;
    
      script.id = 'tailwindcss';
      if (!document.getElementById("tailwindcss")) {
        document.head.appendChild(script);
      }
      document.body.style.visibility = "hidden";
    
      script.onload = () => {
        document.head.removeChild(script);
        console.log('Tailwind CSS loaded')
        document.body.style.visibility = "visible";
         
      }
    }



    return
  }
  if(path.startsWith("@react-bootstrap")){
     
      let script = document.createElement("script")
    script.src  = "https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
    script.id="react-bootstrap"
    let style = document.createElement("link")
    style.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
    style.rel = "stylesheet"
    style.integrity = "sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
    style.crossOrigin = "anonymous"
    document.body.style.visibility = "hidden"
    if(!document.getElementById("react-bootstrap")){
      document.head.appendChild(script)
      document.head.appendChild(style)
    }

    script.onload = () =>{
      console.log("React BootStrap loaded")
      document.head.removeChild(script)
      document.body.style.visibility = "visible"
    }
  
    return;
  }

  if (path.endsWith('.css')) {
    if(!cache[path]){
      const req = new XMLHttpRequest();
      req.open('GET', path, false);
      req.send(null);
      cache[path] = req.responseText;
      totalSize += cache[path].length;

      const source = cache[path];
      const stylesheet = new CSSStyleSheet();
      stylesheet.replaceSync(source);
      document.body.style.visibility = "hidden";
      // Add the stylesheet to the adoptedStyleSheets array
    
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
      document.onload = () => {
        document.body.style.visibility = "visible";
      }
    }else{
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





  if (path.endsWith('.tsx')) {
    let req = new XMLHttpRequest();
    req.open('GET', path, false);
    req.send(null);
    const source = req.responseText;
    totalSize += source.length;
    const transpile = Babel.transform(source, { presets: ['typescript', 'react'], filename: 'app.tsx' }).code;
    if (!document.head.getAttribute('data-tsx')) {
      document.head.setAttribute('data-tsx', 'true')
    }


    const componentName = path.split('/').pop().split('.tsx')[0];
    const createComponent = new Function(`
          return function(props){
            ${transpile}
            return React.createElement(${componentName}, props);
          }
        `);
    return createComponent();
  }
  if (path.endsWith('.ts')) {
    if(!cache[path]){
      let req = new XMLHttpRequest();
      req.open('GET', path, false);
      req.send(null);
      cache[path] = req.responseText;
      totalSize += cache[path].length;
      let source = cache[path];
      const transpile = Babel.transform(source, { presets: ['typescript', 'react'], filename: 'app.ts' }).code;
      if (!document.head.getAttribute('data-ts')) {
        document.head.setAttribute('data-ts', 'true')
      }
      return new Function(transpile)();
    }else{
      let source = cache[path];
      totalSize += source.length;
      const transpile = Babel.transform(source, { presets: ['typescript', 'react'], filename: 'app.ts' }).code;
      if (!document.head.getAttribute('data-ts')) {
        document.head.setAttribute('data-ts', 'true')
      }
      return new Function(transpile)();
    }
 
    
 
    
  }



  if (!path.endsWith('.jsx') && !path.endsWith('.json') && !path.endsWith('.ts') && !path.endsWith('.tsx')) {
    throw new Error('Unknown file type or component');
  }





  if(!cache[path]){
    let req = new XMLHttpRequest();
    req.open('GET', path, false);
    req.send(null);
    const source = req.responseText;
    totalSize += source.length;
    const componentName = path.split('/').pop().split('.jsx')[0];
    const transpile = Babel.transform(source, { presets: ['es2015','react'], filename: 'app.jsx' }).code;
    cache[path] = transpile;
    const createComponent = new Function(`
          return function(props){
            ${transpile}
            return React.createElement(${componentName}, props);
          }
        `);
        return createComponent();
  }
  if(cache[path]){
    console.log("cached")
    const componentName = path.split('/').pop().split('.jsx')[0];
    const createComponent = new Function(`
          return function(props){
            ${cache[path]}
            return React.createElement(${componentName}, props);
          }
        `);
        return createComponent();
  }





}


window.tailwind = {
  config: (object) => {
    if (!object) throw new Error('Tailwind  config is required')
    if (!document.getElementById("tailwindcss")) {
      throw new Error('Tailwind CSS not loaded please use |  require("@tailwind")')
      return
    }

    tailwind.config = object
  },
  registerComponent: (path) => {
    if (!path) throw new Error('Component path is required')
    if (!path.endsWith('.css')) throw new Error('Component must be a css file')
    if (!document.getElementById("tailwindcss")) {
      throw new Error('Tailwind CSS not loaded please use |  require("@tailwind")')
      return
    }
    const req = new XMLHttpRequest();
    req.open('GET', path, false);
    req.send(null);

    totalSize += req.responseText.length
    const source = req.responseText;
    const style = new CSSStyleSheet()
    style.replace(source)
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
    console.log("css file imported!")


  },

}



window.getBundleSize = () => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  console.log(cache)
  let size = cache
  let totalSize = size
  let i = 0
  while (size > 1024) {
    size = size / 1024
    i++
  }
  
  return `
    Bundle Size: ${Math.round(totalSize)} ${units[i]}
     
  `
}




