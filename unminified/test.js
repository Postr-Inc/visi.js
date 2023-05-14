import { ReactRouter } from "./unminified.js";
 
const app = new ReactRouter();
lib('@tailwind/core')
app.bindRoot("app")


app.root("/", (req, res) =>{
    dispose('./test.jsx', (Test) =>{
       
        res.jsx(<Test/>)
    }) 
})