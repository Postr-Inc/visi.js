function nav() {
    let version = 'v1.8.8'
    let [lang, setLang] =  useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en-US')
    var logo = "./assets/images/visilogo.png";
    let generalization = <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path d="M363,176,246,464h47.24l24.49-58h90.54l24.49,58H480ZM336.31,362,363,279.85,389.69,362Z"></path><path d="M272,320c-.25-.19-20.59-15.77-45.42-42.67,39.58-53.64,62-114.61,71.15-143.33H352V90H214V48H170V90H32v44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-32.68-43.44-47.14-75.88-47.33-76.22L143,152l-38,22,6.87,13.86c.89,1.56,17.19,37.9,54.71,86.57.92,1.21,1.85,2.39,2.78,3.57-49.72,56.86-89.15,79.09-89.66,79.47L64,368l23,36,19.3-11.47c2.2-1.67,41.33-24,92-80.78,24.52,26.28,43.22,40.83,44.3,41.67L255,362Z"></path></svg>
    
   
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown" style={{ zIndex: '9999' }}>
                    <label tabIndex={0} className="lg:invisible xl:invisible">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content   mt-3 p-2 shadow bg-base-100 rounded-box ">
                        <li><a href={`#/docs/ ${lang}/${version}/intro`}>Documentation</a></li>
                        <li tabIndex={0}>
                            <a href="#/team"> Team </a>
                        </li>
                        <li><a href="#/releases">Releases</a></li>
                    </ul>
                </div>
                <a className="normal-case  font-bold mx-5"> <img src={logo} className="h-7 w-7 rounded" alt="logo" />

                </a>
                <p className="text-lg   text-slate-700 text-black mx-2">Visi.js</p>
            </div>
            <div>

            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="#/" className=" hover:bg-transparent">Home</a></li>
                    <li tabIndex={0}
                        style={{ zIndex: '9999' }}
                    >
                        <details>
                            <summary>About</summary>
                            <ul className="p-2">
                                <li><a href="#/team">Team</a></li>
                                <li><a href="#/releases">Releases</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a href={`#/docs/${lang}/${version}/intro`} className=" hover:bg-transparent">Docs</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <details className="dropdown  dropdown-end  ">
                    <summary className="m-1 btn">{generalization}</summary>
                    <ul className="p-2 shadow menu dropdown-content bg-base-200 rounded-box w-52">
                        <li><a
                         onClick={() => {
                            setLang('en-US')
                            localStorage.setItem('lang', 'en-US')
                            window.location.reload()
                        }}
                        
                        >  <img class="drop-shadow" loading="lazy" width="20" height="20" alt="English" src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1ec-1f1e7.svg"/>
                         English</a></li>
                         
                        <li><a
                          disabled
                        onClick={() => {
                            setLang('es-ES')
                            localStorage.setItem('lang', 'es-ES')
                            window.location.reload()
                        }}
                        >
                        <img class="drop-shadow" loading="lazy" width="20" height="20" alt="Español" src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1ea-1f1f8.svg"/>
                        Español</a></li>
                        <li><a
                        disabled
                        onClick={() => {
                            setLang('fr-FR')
                            localStorage.setItem('lang', 'fr-FR')
                            window.location.reload()
                        }}
                        >
                        <img class="drop-shadow" loading="lazy" width="20" height="20" alt="Français" src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1eb-1f1f7.svg"/>
                        Français</a></li>
                        <li><a
                          disabled
                        onClick={() => {
                            setLang('pt-BR')
                            localStorage.setItem('lang', 'pt-BR')
                            window.location.reload()
                        }}
                        >
                        <img class="drop-shadow" loading="lazy" width="20" height="20" alt="Português" src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1f5-1f1f9.svg"/>
                        Português</a></li>
                        <li><a
                          disabled
                        onClick={() => {
                            setLang('ru-RU')
                            localStorage.setItem('lang', 'ru-RU')
                            window.location.reload()

                        }}
                        >
                        <img class="drop-shadow" loading="lazy" width="20" height="20" alt="Русский" src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1f7-1f1fa.svg"/>
                        Русский</a></li>
                        <li><a>
                        <img class="drop-shadow" loading="lazy" width="20" height="20" alt="中文" src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1e8-1f1f3.svg"/>
                        中文</a></li>


                    </ul>
                </details>

            </div>
        </div >



    )
}