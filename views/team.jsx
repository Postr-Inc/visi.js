var logo = "./assets/images/visilogo.png";

function team() {
  let version = props.version ? props.version : "v1.8.8";
  let [nav, setNav] = useState(false)
  useEffect(() => {
    dispose(`./views/components/nav.jsx`, (Page) =>{
        setNav(<Page />)
        
    })
  }, [])
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
     {nav}

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


