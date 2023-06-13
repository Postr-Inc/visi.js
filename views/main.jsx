function main(props) {
  var logo = "./assets/images/visilogo.png";
  let version =  props.version ? props.version : 'v1.8.8'
  let lang = props.lang ? props.lang : 'en-US'
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
                href={`#/docs/${lang}/${version}/intro`}
                
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


