function filesystem(){
    const lang = localStorage.getItem('lang') || 'en-US';
    window.postMessage(
    {
        page: 'filesystem',
        lang: lang,
        pageContent: [
          {
            title: 'FileSystem',
            mainContent: 'fs function',
            subContent: ['fs-read', 'fs-write', 'fs-exists', 'fs-mkdir', 'fs-watch', 'fs-rmrf', 'fs-ls', 'fs-cp', 'fs-mv', 'fs-cat', 'fs-pwd', 'fs-cd', 'fs-clear', 'fs-size', 'fs-rename', 'fs-help'],
          },
        ],
      },
      '*'
    );
    return (
        <div className="w-full">
          <h1 data-scroll-target="fs-function" className="text-4xl text-slate-800 font-bold">
            fs function
          </h1>
          <div className="divider"></div>
          <p className="mt-5">
            The fs function is a function that allows you to use CRUD operations in the browser with similar functionality to the Node.js fs module.
            The fs function uses localStorage to store data and offers methods to compress the data before saving and decompressing it upon reading.
          </p>
          <div className="divider"></div>
      
          <h2 data-scroll-target="fs-read" className="text-2xl text-slate-800 font-bold">
            fs-read(path, compress = false)
          </h2>
          <p>
            Reads the content of a file at the specified path.
          </p>
          <p className="mt-5">Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path of the file to read.</li>
            <li><code>compress</code> (boolean, optional): If <code>true</code>, the data will be decompressed before returning the result. Default is <code>false</code>.</li>
          </ul>
          <p className="mt-5">Returns:</p>
          <ul>
            <li>A Promise that resolves with the content of the file if it exists, or rejects if the file does not exist.</li>
          </ul>
      
          <h2 data-scroll-target="fs-write" className="mt-5 text-2xl text-slate-800 font-bold">
            fs-write(path, content, compress = false)
          </h2>
          <p>
            Writes content to a file at the specified path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path of the file to write to.</li>
            <li><code>content</code> (string): The content to write to the file.</li>
            <li><code>compress</code> (boolean, optional): If <code>true</code>, the data will be compressed before saving. Default is <code>false</code>.</li>
          </ul>
          <p>Returns:</p>
          <ul>
            <li>A Promise that resolves if the write operation is successful, or rejects if there was an error.</li>
          </ul>
      
          <h2 data-scroll-target="fs-exists" className="text-2xl text-slate-800 font-bold">
            fs-exists(path)
          </h2>
          <p>
            Checks if a file or directory exists at the specified path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path to check for existence.</li>
          </ul>
          <p>Returns:</p>
          <ul>
            <li><code>true</code> if a file or directory exists at the specified path, <code>false</code> otherwise.</li>
          </ul>
      
          <h2 data-scroll-target="fs-mkdir" className="text-2xl text-slate-800 font-bold">
            fs-mkdir(path)
          </h2>
          <p>
            Creates a new directory at the specified path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path of the directory to create.</li>
          </ul>
      
          <h2 data-scroll-target="fs-watch" className="text-2xl text-slate-800 font-bold">
            fs-watch(path, callback)
          </h2>
          <p>
            Watches for changes in a file at the specified path and calls the callback function when a change occurs.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path of the file to watch.</li>
            <li><code>callback</code> (function): The callback function to be called when a change occurs. It receives an object with the <code>event</code> (string) and <code>path</code> (string) properties.</li>
          </ul>
      
          <h2 data-scroll-target="fs-rmrf" className="text-2xl text-slate-800 font-bold">
            fs-rmrf(path)
          </h2>
          <p>
            Removes a file or directory at the specified path recursively.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path of the file or directory to remove.</li>
          </ul>
      
          <h2 data-scroll-target="fs-ls" className="text-2xl text-slate-800 font-bold">
            fs-ls(path)
          </h2>
          <p>
            Lists the files in a directory at the specified path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path of the directory to list the files.</li>
          </ul>
          <p>Returns:</p>
          <ul>
            <li>An array of strings representing the file names in the directory.</li>
          </ul>
      
          <h2 data-scroll-target="fs-cp" className="text-2xl text-slate-800 font-bold">
            fs-cp(source, destination)
          </h2>
          <p>
            Copies a file from the source path to the destination path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>source</code> (string): The path of the source file.</li>
            <li><code>destination</code> (string): The path of the destination file.</li>
          </ul>
      
          <h2 data-scroll-target="fs-mv" className="text-2xl text-slate-800 font-bold">
            fs-mv(source, destination)
          </h2>
          <p>
            Moves a file from the source path to the destination path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>source</code> (string): The path of the source file.</li>
            <li><code>destination</code> (string): The path of the destination file.</li>
          </ul>
      
          <h2 data-scroll-target="fs-cat" className="text-2xl text-slate-800 font-bold">
            fs-cat(path)
          </h2>
          <p>
            Reads the content of a file at the specified path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path of the file to read.</li>
          </ul>
          <p>Returns:</p>
          <ul>
            <li>The content of the file if it exists, or <code>undefined</code> otherwise.</li>
          </ul>
      
          <h2 data-scroll-target="fs-pwd" className="text-2xl text-slate-800 font-bold">
            fs-pwd()
          </h2>
          <p>
            Returns the current working directory path.
          </p>
          <p>Returns:</p>
          <ul>
            <li>The current working directory path as a string.</li>
          </ul>
      
          <h2 data-scroll-target="fs-cd" className="text-2xl text-slate-800 font-bold">
            fs-cd(path)
          </h2>
          <p>
            Changes the current working directory to the specified path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path of the directory to set as the current working directory.</li>
          </ul>
      
          <h2 data-scroll-target="fs-clear" className="text-2xl text-slate-800 font-bold">
            fs-clear()
          </h2>
          <p>
            Clears all data stored in the file system.
          </p>
      
          <h2 data-scroll-target="fs-size" className="text-2xl text-slate-800 font-bold">
            fs-size(path)
          </h2>
          <p>
            Returns the size of a file at the specified path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The path of the file.</li>
          </ul>
          <p>Returns:</p>
          <ul>
            <li>The size of the file formatted as a string with the appropriate unit (e.g., "10 KB", "2.5 MB").</li>
          </ul>
      
          <h2 data-scroll-target="fs-rename" className="text-2xl text-slate-800 font-bold">
            fs-rename(path, newPath)
          </h2>
          <p>
            Renames a file or directory from the current path to the new path.
          </p>
          <p>Parameters:</p>
          <ul>
            <li><code>path</code> (string): The current path of the file or directory.</li>
            <li><code>newPath</code> (string): The new path of the file or directory.</li>
          </ul>
      
          <h2 data-scroll-target="fs-help" className="text-2xl text-slate-800 font-bold">
            fs-help()
          </h2>
          <p>
            Returns a string with the available commands for the fs function.
          </p>
          <p>Returns:</p>
          <ul>
            <li>A string with the available commands.</li>
          </ul>
      
          <p>Here is an example code block demonstrating the usage of the fs module:</p>
      
          <div className="mockup-code bg-slate-100 text-slate-900 w-54 border-0 rounded text-sm mt-5">
            <pre data-prefix="2" className="text-slate-900">
              <code>// Example usage</code>
            </pre>
            <pre data-prefix="3" className="text-slate-900">
              <code>fs-write('file.txt', 'Hello, world!');</code>
            </pre>
            <pre data-prefix="4" className="text-slate-900">
              <code>fs-mkdir('directory');</code>
            </pre>
            <pre data-prefix="5" className="text-slate-900">
              <code>fs-ls('.').forEach((file) =&gt; {'{'}</code>
            </pre>
            <pre data-prefix="6" className="text-slate-900">
              <code>  console.log(file);</code>
            </pre>
            <pre data-prefix="7" className="text-slate-900">
              <code>{'}'});</code>
            </pre>
          </div>
          <div className="flex flex-row  mt-5 gap-2">
        <a
          href={`#/docs/${lang}/v1.8.8/dispose`}
          className="btn    mt-5"
         
        >
           Previous: dispose()
        </a>
        <a
         
          href={`#/docs/${lang}/v1.8.8/graphstore`}
          className="btn    mt-5"
         
        >
          Next: API Reference -  graphstore()
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
      );
      

}