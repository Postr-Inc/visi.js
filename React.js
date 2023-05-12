 
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
window.multiThread = (threads, callback) => {
    for(let i = 0; i < threads; i++){
        const worker = new Worker(function() {
            self.onmessage = function(e) {
                const id = e.data.id;
                const result = callback(id);
                self.postMessage({ id, result });
            };
        });
        worker.postMessage({id: i});
        worker.onmessage = function(e) {
            console.log(`Worker ${e.data.id} returned ${e.data.result}`);
        }
     }
 }
 
 
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
  