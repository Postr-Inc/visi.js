function main() {
  var logo = "./assets/images/visilogo.png";

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


      <div className="flex   mx-auto   text-white justify-center mt-10">
        <div className="hero  ">
          <div className="hero-content text-center">
            <div className="">
              <h1 className="lg:text-5xl font-bold       w-full text-3xl  mx-auto text-black">Not a Framework, Just A <span className="bg-gradient-to-r from-cyan-500 text-transparent to-blue-500 bg-clip-text">library</span>!</h1>
              <p className=" mt-6 text-lg px-5 py-5 prose border-slate-200  border border-dashed border-slate-300 shadow-xs text-slate-500">
                Visi.js enables you to build large scale single page static applications.
              </p>
              <div className="flex justify-center mt-10">
                <a
                href="#/docs/en-US/intro"
                
                className="btn bg-slate-800 text-slate-100 shadow shadow-2xl hover:bg-slate-800  btn-md">Learn More</a>
                <button className=" mx-2 btn btn-md btn-outline btn-neutral   hover:text-slate-500 hover:bg-transparent">Get Started</button>
                <br></br>


              </div>

              <div className="flex inline justify-center mt-6">
                <code className="text-xs text-slate-500 mt-">
                  <img src={logo} className="inline ms-3 h-5 w-5 rounded" alt="logo" />

                  &nbsp; npx visiapp@latest create &lt;name&gt;</code>
              </div>
              
            </div>



          </div>
        </div>
      </div>
    </div>

  );
}


