var logo = "./assets/images/visilogo.png";

function releases() {
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
                                    <h1 className="lg:text-2xl md:text-6xl font-bold mx-auto text-black">
                                       Release Cycle
                                    </h1>
                                    <p className="mt-6 lg:w-[80%] md:w-[70%] w-50 prose text-slate-500">
                                      Visi.js does not have a specific release cycle but follows a rolling release model. This means that new features are added as soon as they are ready and tested.

                                      Below you can find the different release types and what they mean.
                                    </p>
                                    <ul className="mt-6 lg:w-[80%] md:w-[70%] w-50 prose text-slate-500">
                                        <li className="mt-5"><div className="badge bg-green-500 border-none">Stable</div> - these releases are ready for production.</li>
                                        <li><div className="badge bg-red-600 border-none mt-5">Canary</div> - these releases are not ready for production.
                                        Canary releases are new implementations that we will not  guarantee to be stable. They are released to get feedback from the community and to test new features.
                                        </li>
                                        <li className="mt-5"><div className="badge bg-blue-500 border-none">Beta</div>
                                           - Beta releases are semi stable releases that are ready for production but may have some bugs. We will try to fix these bugs as soon as possible.
                                        </li>
                                        </ul>
                                    <div className="flex justify-center mt-10">
                                        <hr />
                                    </div>
                                </div>
                            </div>
                             
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}