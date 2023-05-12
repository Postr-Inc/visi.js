const dispose = (path, props = {}) => {
  document.body.style.visibility = 'hidden';
  const cacheEntry = cache[path];
  if (cacheEntry) {
    const { type, data, componentName } = cacheEntry;
    if (type === 'tsx' || type === 'jsx') {
      const func = new Function(
        'props',
        `
          return function(props1){
            ${data}
            return React.createElement(${componentName}, { ...props, ...props1 })
          }
        `
      );
      const component = func(props);
      return Promise.resolve(component);
    } else if (type === 'ts') {
      const component = new Function(`return ${data}`)();
      return Promise.resolve(component);
    }
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      URL.createObjectURL(
        new Blob([`(${workerFunction.toString()})()`], {
          type: 'application/javascript',
        })
      )
    );

    const extension = path.split('.').pop();
    const presets =
      extension === 'tsx' || extension === 'jsx'
        ? ['react']
        : ['react', 'typescript'];

    fetch(path)
      .then((response) => response.text())
      .then((code) => {
        const componentName = path.split('/').pop().split('.')[0];
        if (extension === 'ts') {
          cache[path] = { type: extension, data: code, componentName };
          const component = data(props);
          resolve(component);
          worker.terminate();
          return;
        }
        worker.postMessage({ type: 'compile', code, presets });
        
      });

    worker.onmessage = async (event) => {
      const { type, data } = event.data;
      if (type === 'code') {
        const compiledCode = data;
        const componentName = path.split('/').pop().split('.')[0];
        const type = path.split('.').pop();
        const cacheEntry = { type, data: compiledCode, componentName };
        cache[path] = cacheEntry;
        const func = new Function(
          'props',
          `
            return function(props1){
              ${compiledCode}
              return React.createElement(${componentName}, { ...props, ...props1 })
            }
          `
        );

        const component = func(props);
        resolve(component);
        document.body.style.visibility = 'visible';
        worker.terminate();
      }
    };
  });
};

const workerFunction = () => {
  onmessage = (event) => {
    importScripts('https://unpkg.com/@babel/standalone/babel.min.js');
    const { type, code, presets } = event.data;
    if (type === 'compile') {
      const compiledCode = Babel.transform(code, { presets }).code;
      postMessage({ type: 'code', data: compiledCode });
    }
  };
};

window.dispose = dispose;
