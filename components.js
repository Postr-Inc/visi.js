let totalSize = 0;

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

  if (path.endsWith('.css')) {
    const req = new XMLHttpRequest();
    req.open('GET', path, false);
    req.send(null);
   
    const source = req.responseText;
    totalSize += source.length
    const stylesheet = new CSSStyleSheet();

    stylesheet.replaceSync(source);

    // Add the stylesheet to the adoptedStyleSheets array
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
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
    let req = new XMLHttpRequest();
    req.open('GET', path, false);
    req.send(null);
    totalSize += req.responseText.length;
    const source = req.responseText;
    const transpile = Babel.transform(source, { presets: ['typescript', 'react'], filename: 'app.ts' }).code;
    if (!document.head.getAttribute('data-ts')) {
      document.head.setAttribute('data-ts', 'true')
    }
    return new Function(transpile)();
  }



  if (!path.endsWith('.jsx') && !path.endsWith('.json') && !path.endsWith('.ts') && !path.endsWith('.tsx')) {
    throw new Error('Unknown file type or component');
  }





  const req = new XMLHttpRequest();
  req.open('GET', path, false);
  req.send(null);

  const source = req.responseText;
  totalSize += source.length
  if (path.endsWith('.json')) {
    return JSON.parse(source);
  }
  const transpile = Babel.transform(source, { presets: ['es2015', 'react'] }).code;

  const componentName = path.split('/').pop().split('.jsx')[0];
  const createComponent = new Function(`
        return function(props){
          ${transpile}
          return React.createElement(${componentName}, props);
        }
      `);

  return createComponent();




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
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const base = 1024;
  let i = 0;
  while (totalSize > base && i < units.length - 1) {
    totalSize /= base;
    i++;
  }
  return totalSize.toFixed(1) + ' ' + units[i];
}


