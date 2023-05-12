 
import "./errors.js"
import "./router.js"
import "./components.js"
import "./lazy.js"
import "./disposable.js"
window.useState = React.useState
window.useEffect = React.useEffect
window.useContext = React.useContext
window.useReducer = React.useReducer
window.useRef = React.useRef
window.useCallback = React.useCallback
window.lazy = React.lazy
window.forwardRef = React.forwardRef
window.createContext = React.createContext
window.startTransition  = React.startTransition
window.useSyncExternalStore = React.useSyncExternalStore
window.useMemo = React.useMemo
window.useLayoutEffect = React.useLayoutEffect
window.useInsertionEffect = React.useInsertionEffect
window.useImperativeHandle = React.useImperativeHandle
window.useId = React.useId
window.useDeferredValue = React.useDeferredValue
window.useTransition = React.useTransition
window.ReactRouter = ReactRouter
window.Lazy  = new React.lazy
window.JsonHandler = JsonHandler;
window.ErrorTrace = ErrorTrace;
let root = null;
window.multiThread = (threads, data, callback) => {
    const workers = [];
    const results = [];
  
    // create a pool of workers
    for (let i = 0; i < threads; i++) {
      workers.push(new Worker(function() {
        self.onmessage = function(e) {
          const id = e.data.id;
          const result = callback(e.data.data[id], id);
          self.postMessage({ id, result });
        };
      }));
    }
  
    // execute each iteration in parallel
    const promises = Array.from({ length: data.length }, (_, i) => {
      return new Promise((resolve, reject) => {
        workers[i % threads].onmessage = function(e) {
          const id = e.data.id;
          const result = e.data.result;
          console.log(`Worker ${id} returned ${result}`);
          results[id] = result;
          resolve();
        };
  
        workers[i % threads].onerror = function(e) {
          console.error(`Worker ${i % threads} encountered an error:`, e);
          reject(e);
        };
  
        workers[i % threads].postMessage({ id: i % threads, data: data, index: i });
      });
    });
  
    // wait for all promises to resolve
    return Promise.all(promises).then(() => {
      // terminate workers
      workers.forEach((worker) => worker.terminate());
  
      // return results
      return results;
    });
  };
  
 
window.React._render = (component) => {
    
    return(container) => {
        const el = document.getElementById(container);
        el.style.visibility  = "hidden"
        if (!root) {
            root =  ReactDOM.createRoot(el); // createRoot(container!) if you use TypeScript
        }
         
        root.render(component);
        el.style.visibility  = "visible"
    }
}
 

console.log("%cvisi.js v1.4.2 loaded", "color: black;   border-radius:5px; font-size: 20px; padding: 10px;")


 

if(document.querySelector('html').getAttribute("data-env") == "production") {
      // remove whitespaces 
        document.body.innerHTML = document.body.innerHTML.replace(/\s{2,}/g, ' ');
  }
  