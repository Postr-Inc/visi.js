import "./errors.js"
import "./router.js"
import "./components.js"
import "./lazy.js"
window.useState = React.useState
window.useEffect = React.useEffect
window.useContext = React.useContext
window.useReducer = React.useReducer
window.useRef = React.useRef
window.ReactRouter = ReactRouter
window.Lazy = Lazy;
window.JsonHandler = JsonHandler;
window.ErrorTrace = ErrorTrace;

window.React._render = (component) => {
    let root = null;
    return(container) => {
        const el = document.getElementById(container);
        if (!root) {
            root =  ReactDOM.createRoot(el); // createRoot(container!) if you use TypeScript
        }
        root.render(component);
    }
}
