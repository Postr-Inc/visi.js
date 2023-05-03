import "./errors.js"
import "./router.js"
import "./components.js"
import "./lazy.js"
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
window.Lazy = Lazy;
window.JsonHandler = JsonHandler;
window.ErrorTrace = ErrorTrace;
let root = null;
window.React._render = (component) => {
    
    return(container) => {
        const el = document.getElementById(container);
        if (!root) {
            root =  ReactDOM.createRoot(el); // createRoot(container!) if you use TypeScript
        }
        root.render(component);
    }
}

