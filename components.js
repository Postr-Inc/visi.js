window.require = (path) => {
  if (!path.endsWith('.jsx') && !path.endsWith('.scss')) {
    throw new Error('include only supports jsx and scss files!');
  }

  if(path.endsWith('.scss')){
      const req = new XMLHttpRequest();
      req.open('GET', path, false);
      req.send(null);
    
      let styles = req.responseText;
    
      // Replace the nested selectors with "&" to represent the parent selector
      styles = styles.replace(/([.#][^{]+\s*){/g, (match, selector) => {
        const nestedSelector = selector.trim().replace(/\s+/g, ' ');
        const parentSelector = nestedSelector.replace(/([.#][^,]+)/g, '& $1');
        return `${parentSelector} {\n`;
      });
      console.log(`stylesheet size is ${styles.length} bytes`)
      // create stylesheet
      const stylesheet = new CSSStyleSheet();
      stylesheet.replaceSync(styles);
      
    
      // insert stylesheet
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
      return styles;
  }else{
      const req = new XMLHttpRequest();
      req.open('GET', path, false);
      req.send(null);
    
      const source = req.responseText;
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

 
}

