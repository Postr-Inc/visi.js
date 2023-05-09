ErrorTrace()
const app = new ReactRouter()
app.bindRoot("app")
lib('@tailwindcss/typography') // require tailwind css
lib('./components/static/styles/app.css')
app.root("/", async function(req, res) {
    res.title('Visi.js')
    res.return()
    dispose('./components/App.jsx',(App)=>{
        res.jsx(<App />)
     }, null)
    res.return()
})

app.on("/", async function(req, res) {
    res.title('Visi.js')
    res.return()
    dispose('./components/App.jsx',(App)=>{
        res.jsx(<App />)
     }, null)
    res.return()
})

app.on("/release-cycle",async  function(req, res) {
    res.title('Visi.js - releases')
    res.return()
    dispose('./components/Releases.jsx',(Release)=>{
        res.jsx(<Release />)
     }, null)
    res.return()
})

 
 