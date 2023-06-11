function intro() {
    let lang = window.location.hash.split('/')[2];
    
    window.postMessage({ page: 'intro', lang: lang, pageContent:[
        {
            title: 'Introduction',
            mainContent: 'Why visi?',
            subContent: [
                'create a visi app'

            ]
        }
     ]}, '*');
    return (
      <div className="w-full">
        <h1 
        data-scroll-target="Why visi?"
        className="text-4xl text-slate-800 font-bold">Introduction</h1>
        <p className="text-slate-600 text-lg mt-5"
         
        >Why visi?</p>
        <div className="divider"></div>
        <p>
          Visi provides a lightweight and flexible approach to web development. It allows you to build websites and web applications without the overhead of a heavy framework. With Visi, you have the freedom to choose the tools and libraries that best suit your needs, making it a versatile option for developers of all levels.
        </p>
        <p className="mt-2">
          Whether you're building a simple personal blog or a complex e-commerce platform, Visi can handle it all. Its performance optimizations ensure fast and responsive user experiences, while its intuitive API allows for easy development and maintenance.
        </p>
        <p>
          So why choose Visi? With its simplicity, flexibility, and performance, it empowers you to create web projects with ease, without being tied down by rigid frameworks. Experience the freedom and power of Visi for your next web development endeavor.
        </p>
        <div className="divider"></div>
        <h1 className="text-4xl text-slate-800 font-bold mt-10"
        data-scroll-target="create a visi app"
        >Creating  a Visi App</h1>

        <p className="mt-5">
            Creating a Visi app is easy. Just run the following command in your terminal:
        </p>
        <div className="mockup-code bg-slate-100 text-slate-900 w-54 border-0 rounded  text-sm mt-5">
        <pre data-prefix=">" className="text-sky-500"><code>npx visiapp@latest create &lt;name&gt;</code></pre>
        </div>

        <p className="mt-5">
            Visi app also provides a server method for running your app in a development environment. To start the server, run the following command:
        </p>

        <div className="mockup-code bg-slate-100 text-slate-900 w-54 border-0 rounded  text-sm mt-5">
        <pre data-prefix=">" className="text-sky-500"><code>visiapp serve</code></pre>
        </div>
        <p className="mt-5">
            This will start a development server you can also add -p or -https to specify a port or use https.
        </p>
        {/** next page */}
        <div className="divider"></div>
        <a 
        href={`#/docs/${lang}/v1.8.8/essentials`}
        className="btn  mt-5">Next: Creating an Application</a> 

        <p className="fixed bottom-5 right-5 text-slate-300 flex">
          <img src="https://avatars.githubusercontent.com/u/65188863?v=4" className="w-5 h-5 rounded-full me-5" alt="avatar" />
          Last Edited 6/7/23
        </p>
      </div>
    );
  }
  