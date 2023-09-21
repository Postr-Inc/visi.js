import { ReactRouter } from "./assets/visi.js/visi.min.js"

const app = new ReactRouter()
console.log(app)
window.app = app
lib("@tailwind/daisyui@3.0.20")
app.bindRoot("app")
 
updateCacheVersion(4)
app.root("/", (req, res) =>{
    dispose('./views/main.jsx', (Main) =>{
        res.title("Home")
        res.return()
        res.jsx(<Main/>)
      
    })
})

app.on('/team', (req, res)=>{
    dispose('./views/team.jsx', (Team) =>{
        res.title("Team")
        res.return()
        res.jsx(<Team/>)
    })
})

app.on('/', (req, res)=>{
    dispose('./views/main.jsx', (Main) =>{
        res.title("Home")
        res.return()
        res.jsx(<Main/>)
    })
})

app.on("/releases", (req, res) =>{
    dispose('./views/releases.jsx', (Releases) =>{
        res.title("Releases")
        res.return()
        res.jsx(<Releases/>)
    })
})

app.get('/releases', (req, res) =>{
    dispose('./views/releases.jsx', (Releases) =>{
        res.title("Releases")
        res.return()
        res.jsx(<Releases/>)
    })
})
app.get('/team', (req, res) =>{
    dispose('./views/team.jsx', (Team) =>{
        res.title("Team")
        res.return()
        res.jsx(<Team/>)
    })
})
app.get('/', (req, res) =>{
    dispose('./views/main.jsx', (Main) =>{
        res.title("Home")
        res.return()
        res.jsx(<Main/>)
    })
})

app.get('/docs/:lang/:version/:page', (req, res) =>{
    let page = req.params.page
    dispose(`./views/docs/docs.jsx`, (Docs) =>{
        res.title("Docs")
        res.return()
        res.jsx(<Docs/>)
    },{
        page: page,
        lang: req.params.lang,
        version: req.params.version
        
    
    })
})

app.on('/docs/:lang/:version/:page', (req, res) =>{
    let page = req.params.page
    dispose(`./views/docs/docs.jsx`, (Docs) =>{
        res.title(page)
        res.return()
        res.jsx(<Docs/>)
    },{
        page: page,
        lang: req.params.lang,
        version: req.params.version
    
    })
    res.return()
})
app.error((res) =>{
    res.send("404")
})
