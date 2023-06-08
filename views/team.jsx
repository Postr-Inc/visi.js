var logo = "./assets/images/visilogo.png";

function team() {
    return (
        <div>
<div className="flex px-5 py-3  justify-center bg-sky-500 text-white   mx-auto
     
     ">
       <span className="flex  hover:underline hover:cursor-pointer ">
         <a
           href="https://opensource.fb.com/support-ukraine/"
         >
           Support Ukraine 🇺🇦
         </a>
       </span>
     </div>
     <div className="navbar border-slate-200 border h-[10px ]  ">
        <div className="">
          <div className="dropdown" style={{ zIndex: '9999' }}>
            <label tabIndex={0} className="lg:invisible xl:invisible">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </label>
            <ul tabIndex={0} className="menu menu-compact dropdown-content   mt-3 p-2 shadow bg-base-100 rounded-box ">
              <li><a href="#/docs/en-US/intro">Documentation</a></li>
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
        <div className="hidden lg:flex flex-2">
          <ul className="menu menu-horizontal hover:bg-transparent px-1">
            <li><a href="#/docs/en-US/intro" className=" hover:bg-transparent"> Documentation</a></li>
          

            <li>
            <details style={{zIndex:'9999'}}>
            <summary>About</summary>
            <ul className="text-slate-700">
              <li><a href="#/team">Team</a></li>
              <li><a href="#/releases">Releases</a></li>
              <li><a href="#/faq">faq</a></li>
            </ul>
          </details>
            </li>
          </ul>
        </div>

      </div>

            <div className="flex inline mx-auto py-2 justify-start text-dark lg:mx-[20%] md:mx-[15%] mt-10">
                <div className="">
                    <div className="hero-content ">
                        <div className="flex flex-wrap">
                            <div className="w-full md:w-1/2">
                                <div className="mx-auto lg:ml-0">
                                    <h1 className="lg:text-2xl text-6xl md:text-6xl text-slate-500 font-bold mx-auto text-black">
                                        Meet the team
                                    </h1>
                                    <p className="mt-6 lg:w-[80%] md:w-[70%] w-50 prose text-slate-500">
                                        The development of visi js is curated by a single developer based in the US!
                                    </p>
                                    <div className="flex justify-center mt-10">
                                        <hr />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2">
                                <div className="mx-auto lg:ml-0">
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-1/2 md:w-1/3 lg:w-5/6">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-24 h-24 rounded-full   flex items-center justify-center">
                                                    <img src="https://avatars.githubusercontent.com/u/65188863?v=4" className="w-20 h-20 rounded-full" alt="avatar" />
                                                </div>
                                                <div className="mt-4">
                                                    <a href="https://github.com/MalikWhitten67">
                                                        <h3 className="text-xl flex text-center font-bold text-black bg-gradient-to-r from-blue-500 to-red-300 bg-clip-text text-transparent">
                                                            Malik
                                                        </h3>
                                                    </a>
                                                    <p className="text-slate-500">Creator @ Visi.js</p>
                                                    <p>&lt;&gt; <a href="" className="text-[17px] text-accent">Visi</a> </p>
                                                    <p>📍 United States </p>
                                                    <p>🗺️ English </p>
                                                </div>
                                                <div className="flex justify-center mt-4">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}


