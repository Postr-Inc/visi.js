function dispose() {
  let lang = window.location.hash.split('/')[2];
  window.postMessage(
    {
      page: 'intro',
      lang: lang,
      pageContent: [
        {
          title: 'Dispose and Why We Use It',
          mainContent: 'Underlying Use of Dispose',
          subContent: ['parameters', 'return value', 'examples'],
        },
      ],
    },
    '*'
  );
  return (
    <div className="w-full">
      <h1
        data-scroll-target="Underlying Use of Dispose"
        className="text-4xl text-slate-800 font-bold"
      >
        Underlying Use of Dispose
      </h1>
      <div className="divider"></div>
      <p>
        Dispose is a global/ importable function that compiles your code outside of the main thread.
        <br />
        Before we get into the details, let's talk about the problem we are trying to solve with dispose.
        <br />
        <br />
        Upon building visi, our initial idea was to make importing, compiling, and using components feasible and easy. We wanted to enable developers to simply require('component') at first. However, we encountered several challenges. Firstly, using synchronous xhr to fetch the component went against web standards. Additionally, compiling only on the main thread would block the execution of further code, resulting in significant delays of up to 200ms in our initial release versions (v1.00-1.4.4).

        This is why the "dispose" feature became crucial for us. To understand its necessity and the history behind its development,
        let's delve into how it works. When you call "dispose," it does more than just fetching the component. It also derives the component name from the filename and props aswell as  checks if "cfr" (
        component first rendering) is enabled,  it looks for the component in cache , reupdates it if necessary, or compiles it.
        The component is then stored in a cache, and finally, it is returned to the user.

        To handle the arduous task of handling libraries and rendering the component, all of these processes are offloaded to a service worker, allowing the main thread to focus on its primary responsibilities.

        <br />

      </p>
      <div className="divider"></div>
      <h1 className="text-4xl text-slate-800 font-bold mt-10"
        data-scroll-target="parameters"
      >Parameters</h1>
      <p className="mt-5">
        Dispose takes two parameters: the component name and props.
      </p>
      <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded  text-sm mt-5">
        <pre data-prefix=">" ><code>dispose('./path/to/component', &#123;props&#125;)</code></pre>
      </div>
      <p className="mt-5">
        <ul className="list-disc ml-5">
          <li> <span className="badge bg-slate-300 text-black py-2 px-2">component name</span> - The component name is the path to the component. It can be a relative or absolute path. </li>
          <li> <span className="badge bg-slate-300 text-black py-2 px-2">props</span> - The props are the props you want to pass to the component. </li>
        </ul>


      </p>
      <div className="divider"></div>
      <h1 className="text-4xl text-slate-800 font-bold mt-10"
        data-scroll-target="return value"
      >Return Value</h1>
      <p className="mt-5">
        Dispose returns the component.
      </p>
      <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded  text-sm mt-5">
        <pre data-prefix=">" ><code>dispose('./path/to/component', &#123;props&#125;)</code></pre>
      </div>
      <p>
        To use the component, you can use useState and useEffect to set the component to a variable.

      </p>

      <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
        <pre data-prefix="1"><code className="mx-5 py-5">let [component, setComponent] = useState(null)</code></pre>
        <br></br>
        <pre data-prefix="2"><code className="mx-5 py-5">useEffect(() =&gt; &#123;</code></pre>
        <pre data-prefix="3"><code className="mx-5 py-5">setComponent(dispose('./path/to/component', &#123;props&#125;))</code></pre>
        <pre data-prefix="4"><code className="mx-5 py-5">&#125;, [])</code></pre>
        <br></br>
        <pre data-prefix="5"><code className="mx-5 py-5 text-slate-500">// use the component by doing &#123;component&#125;</code></pre>
      </div>
      <div className="divider"></div>
      <h1 className="text-4xl text-slate-800 font-bold mt-10"
        data-scroll-target="examples"
      >Examples</h1>
      <p className="mt-5">
        Here are some examples of dispose in action.
      </p>
      <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded  text-sm mt-5">
         
        <pre data-prefix="1" ><code>function App(props) &#123;</code></pre>
        <pre data-prefix="2" ><code>let [nav, setNav] = useState(null)</code></pre>
        <pre data-prefix="3" ><code>useEffect(() =&gt; &#123;</code></pre>
        <pre data-prefix="4" ><code>dispose('./components/nav',(component) =&gt; &#123;</code></pre>
        <pre data-prefix="5" ><code>setNav(component)</code></pre>
        <pre data-prefix="6" ><code>&#125;)</code></pre>
        <pre data-prefix="7" ><code>&#125;, [])</code></pre>
        <pre data-prefix="8" ><code>return( &#60;div&#62;&#123;nav&#125;

          &#60;p&#62;
          hello world
          &#60;&#47;p&#62;


          &#60;/div&#62;)
        </code></pre>
      </div>


      <p className="mt-5">
        output:
      </p>
      <div className="mt-5 mockup-window border bg-slate-100">
        <div className="flex justify-center px-4 py-16 bg-base-200"> Hello World </div>
        <div className="navbar flex absolute  top-[0] bg-slate-200">
          <a className="btn btn-ghost normal-case text-xl"><img src='./assets/images/visilogo.png'
            className="h-7 w-7 rounded"
          ></img>Visijs</a>
        </div>
      </div>
      <div className="flex flex-row  mt-5 gap-2">
        <a
          href={`#/docs/${lang}/v1.8.8/essentials`}
          className="btn    mt-5"
         
        >
           Previous: Creating an Application 
        </a>
        <a
        
          href={`#/docs/${lang}/v1.8.8/lib`}
          className="btn    mt-5"
         
        >
          Next: API Reference - lib()
        </a>
        </div>
  
        <p className="fixed bottom-5 right-5 text-slate-300 flex">
          <img
            src="https://avatars.githubusercontent.com/u/65188863?v=4"
            className="w-5 h-5 rounded-full me-5"
            alt="avatar"
          />
          Last Edited 6/10/23
        </p>
      
    
    </div>

  )
}