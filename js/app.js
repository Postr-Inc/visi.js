ErrorTrace()
const app = new ReactRouter()
app.bindRoot("app")
 
require('@tailwindcss/typography') // require tailwind css
require('./components/static/styles/app.css')
app.root("/", async function(req, res) {
    res.title('Visi.js')
    res.return()
    dispose('./components/App.jsx',(App)=>{
        res.jsx(<App />)
   })
    res.return()
})

app.on("/home", async function(req, res) {
    res.title('Visi.js')
    res.return()
    dispose('./components/App.jsx',(App)=>{
         res.jsx(<App />)
    })
    res.return()
})

app.on("/release-cycle",async  function(req, res) {
    res.title('Visi.js - releases')
    res.return()
    dispose('./components/Releases.jsx',(Releases)=>{
        res.jsx(<Releases />)
    })
    res.return()
})

 
app.on('/', async function(req, res) {
    res.title('Visi.js')
    res.return()
    dispose('./components/App.jsx',(App)=>{
        res.jsx(<App />)
    })
    res.return()
})