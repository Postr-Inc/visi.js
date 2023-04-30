window.require = function (path) {
     const script = document.createElement('script');
     script.src = path;
     script.id = path;

     script.type = 'text/babel';
     if(!document.getElementById(path)){
       document.body.appendChild(script);
     }
      document.getElementById(path).remove();
    }
  
    window.React._render = (component) => {
      const roots = {};
      return (container) => {
        const el = document.getElementById(container);
        if (!roots[container]) {
          roots[container] = ReactDOM.createRoot(el);
          roots[container].render(component);
        } else {
          roots[container].render(component);
        }
      };
    };
    