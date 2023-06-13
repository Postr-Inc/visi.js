let logo = './assets/images/logo.svg'
function docs(props){
 
  let [page, setPage] = useState('')
  let [screenS, setScreen] = useState({width:window.innerWidth, height:window.innerHeight})
  let [pageContent, setPageContent] = useState('')
  let [open, setOpen] = useState(false)
  let version  =  props.version ? props.version : 'v1.8.8'
  
  useEffect(() => {
    dispose(`./views/docs/pages/${props.lang}/${version}/${props.page}.jsx`, (Page) => {
        setPage(<Page />)
        
    })
    window.onresize = () => {
        setScreen({width: window.innerWidth, height: window.innerHeight})
      }    
      window.onmessage = (e) => {
        if(e.data.page){
            setPageContent(e.data.pageContent)
            console.log(e.data.pageContent)
        }

    }    

    let scrollable = document.querySelectorAll('[data-scroll]')
    scrollable.forEach((item) => {
        item.addEventListener('click', () => {
            let target = document.querySelector(`[data-scroll-target="${item.dataset.scroll}"]`)
            target.scrollIntoView({behavior: 'smooth'})
        })
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
     <div className="navbar border-slate-200 border h-[10px ]  ">
       <div className="">
          
           <label for="my-drawer-2"   className="lg:invisible xl:invisible">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
           </label>
           
          
         <a className="normal-case  font-bold mx-5"> <img src={logo}  className="h-7 w-7 rounded" alt="logo" />

         </a>
         <p className="text-lg   text-slate-700 text-black mx-2">Visi.js</p>
       </div>
       <div className="hidden lg:flex flex-2">
         <ul className="menu menu-horizontal hover:bg-transparent px-1">
           <li><a href="#/" className=" hover:bg-transparent">Home</a></li>
         

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
     <div class={`${screenS.width > 1024 ? 'drawer-open drawer' : ''}  `}>
     
     <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content   xl:w-[50vw]  w-full  h-full  py-5  px-5 xl:mx-16 mb-16 ">
    
     {page}
  
  </div> 
  <div class="drawer-side">
    <label for="my-drawer-2" class="drawer-overlay"></label> 
    <ul class="menu p-4 flex w-54 h-full bg-base-100 border  font-medium border-t-0 border-slate-200 rounded  text-base-content">
     <li>
    <details open="false"
      {...window.location.hash ===  `#/docs/${props.lang}/${version}/intro`   || `#/${props.lang}/${version}/essentials`   ? {open:true} : {}  }
      
    >
      <summary>Getting Started</summary>
      <ul>
        <li><a
        href={`#/docs/en-US/${version}/intro`}
        {...window.location.hash ===  `#/docs/${props.lang}/${version}/intro`  ? {className:'text-sky-500'} : {}}
        >Introduction</a></li>
        <li>
        <a
        href={`#/docs/en-US/${version}/essentials`}
        {...window.location.hash ===  `#/docs/${props.lang}/${version}/essentials`  ? {className:'text-sky-500'} : {}}
        >Creating An Application</a> 
        </li>
         
      </ul>
      
    </details>
    
    <details
    open="false" 
    {...window.location.hash ===  `#/docs/${props.lang}/dispose`  || `#/docs/${props.lang}/filesystem`   
    || `#/docs/${props.lang}/${version}/graphStore`   || `#/docs/${props.lang}/${version}/SQLStore`   || `#/docs/${props.lang}/${version}/ReactRouter`   
    || `#/docs/${props.lang}/${version}/ReactRouterV2`   ? {open:true} : {}  }>
      <summary>visi.js@1.8.8</summary>
      <ul>
       
        <li><a
        href={ `#/docs/${props.lang}/${version}/dispose`}
        {...window.location.hash ===  `#/docs/${props.lang}/${version}/dispose`  ? {className:'text-sky-500'} : {}}
        >dispose()</a></li>
          <li> <a 
        href={`#/docs/${props.lang}/${version}/lib`}
        {...window.location.hash ===  `#/docs/${props.lang}/${version}/lib`  ? {className:'text-sky-500'} : {}}
        >lib()</a></li>
        <li><a
        {...window.location.hash ===  `#/docs/${props.lang}/${version}/filesystem`  ? {className:'text-sky-500'} : {}
        }
        href={`#/docs/${props.lang}/${version}/filesystem`}
        >filesystem</a></li>
        <li><a
        href={`#/docs/${props.lang}/${version}/graphstore`}
        {...window.location.hash ===  `#/docs/${props.lang}/${version}/graphstore`  ? {className:'text-sky-500'} : {}}

        >graphStore</a></li>
        <li><a
        
         href={`#/docs/${props.lang}/${version}/sqlstore`}
          {...window.location.hash ===  `#/docs/${props.lang}/${version}/sqlstore`  ? {className:'text-sky-500'} : {}}

         
        >SQLStore</a></li>
        <li><a
        href={`#/docs/${props.lang}/${version}/ReactRouter`}
        {
            ...window.location.hash ===  `#/docs/${props.lang}/${version}/ReactRouter`  ? {className:'text-sky-500'} : {}
        }
        >
         
        ReactRouter</a></li>
        <li><a>
        
        ReactRouterV2</a></li>
      </ul>
    </details>
  </li>
    
    </ul>
  
  </div>
  <div class="drawer-end fixed right-0 hidden xl:block lg:block">
    <label for="my-drawer-2" class="drawer-overlay"></label> 
    <ul class="menu p-4 flex w-54 h-full bg-base-100 border  font-medium border-t-0 border-slate-200 rounded  text-base-content">
     <li>
    <details  open  >
      <summary> 
         {
            pageContent ? pageContent.map((item) => {
                return item.title
            }) : ''
         }
    </summary>
      <ul>
        <li>
          <details open className="hover:cursor-pointer" >
             
            <ul>
                <li>
                {
            pageContent ? pageContent.map((item) => {
                return  <a
                 onClick={(e) => {
                    let target = document.querySelector(`[data-scroll-target="${item.mainContent}"]`)
                    target.scrollIntoView({behavior: 'smooth'})
                    e.target.classList.toggle('text-sky-500')
                    window.onscroll = () => {
                        if(window.scrollY  > target.getBoundingClientRect().top){
                            if(e.target.classList.contains('text-sky-500')){
                                e.target.classList.remove('text-sky-500')
                            }
                        }
                    }
                }}
                >{item.mainContent}</a>
            }) : ''
         }
                </li>
                
               {
                     pageContent ? pageContent.map((item) => {
                        return item.subContent.map((subItem) => {
                            return <li><a
                            onClick={(e) => {
                                console.log(e.target, subItem)
                                let target = document.querySelector(`[data-scroll-target="${subItem}"]`)
                                target.scrollIntoView({behavior: 'smooth'})
                                e.target.classList.toggle('text-sky-500')
                                window.onscroll = () => {
                                    if(window.scrollY  > target.getBoundingClientRect().top){
                                        if(e.target.classList.contains('text-sky-500')){
                                            e.target.classList.remove('text-sky-500')
                                        }
                                    }
                                }
                            }}
                            >{subItem}</a></li>
                        })
                    }) : ''
               }
            </ul>
          </details>
        </li>
      </ul>
    </details>
  </li>
    </ul>
  
  </div>
</div>

    </div>
  )
}