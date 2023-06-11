var logo = "./assets/images/visilogo.png";

function releases() {
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