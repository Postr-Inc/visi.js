var logo = "./assets/images/visilogo.png";

function team() {
    return (
        <div>

            <div className="navbar  ">
                <div className="">
                    <div className="dropdown">
                        <label tabIndex={0} className="lg:invisible xl:invisible">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content   mt-3 p-2 shadow bg-base-100 rounded-box ">
                            <li><a href="https://postr-inc.gitbook.io/visi.js-docs/">Documentation</a></li>
                            <li tabIndex={0}>
                                <a href="#/team"> Team </a>
                            </li>
                            <li><a href="#/releases">Releases</a></li>
                        </ul>
                    </div>
                    <a href="#/" className="normal-case  font-bold mx-5"> <img src={logo} className="h-7 w-7 rounded" alt="logo" />

                    </a>
                    <p className="text-lg   text-slate-700 text-black mx-2">Visi.js</p>
                </div>
                <div className="hidden lg:flex flex-2">
                    <ul className="menu menu-horizontal hover:bg-transparent px-1">
                        <li><a href="https://postr-inc.gitbook.io/visi.js-docs/" className=" hover:bg-transparent"> Documentation</a></li>
                        <li   ><a className=" hover:bg-transparent"> Team</a></li>

                        <li><a href="#/releases" className=" hover:bg-transparent"> Releases</a></li>
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
                                        Meet the <span className="bg-gradient-to-r from-cyan-500 text-transparent to-blue-500 bg-clip-text">Team</span>!
                                    </h1>
                                    <p className="mt-6 lg:w-[80%] md:w-[70%] w-50 prose text-slate-500">
                                        The development of visi js was curated by a single developer aiming to enhance the way SPA were built!
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
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
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
            <footer className="footer py-3 p-5 text-base-content" style={{ position: 'fixed', bottom: 0 }}>
                <div className="items-center grid-flow-col">
                    <a href="#/" className="text-lg font-bold text-black">Visi.js</a>
                    <p>Copyright © 2023 - All right reserved</p>
                </div>
                <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                    </a>
                    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a>
                    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
                </div>
            </footer>
        </div>
    );
}


