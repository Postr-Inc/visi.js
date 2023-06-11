const graphstore = () => {
  const lang = localStorage.getItem('lang') || 'en-US';
  window.postMessage(
    {
      page: 'filesystem',
      lang: lang,
      pageContent: [
        {
          title: 'graphStore',
          mainContent: 'GraphStore',
          subContent: ['createTable', 'getTable', 'removeTable', 'insertRow', 'getRow'],
        },
      ],
    },
    '*'
  );

  return (
    <div className="w-full">
      <h1 data-scroll-target="GraphStore" className="text-4xl text-slate-800 font-bold">
        graphStore Class
      </h1>
      <div className="divider"></div>
      <p className="mt-5">
        The `graphStore` class provides methods to manage data in a table stored as a cookie.
      </p>
      <div className="divider"></div>

      <h2 data-scroll-target="createTable" className="text-2xl text-slate-800 font-bold">
        createTable(tableName)
      </h2>
      <p>
        Creates a new table (cookie) with the given `tableName`.
      </p>
      <p className="mt-5">Parameters:</p>
      <ul>
        <li>
          <code>tableName</code> (string): The name of the table to create.
        </li>
      </ul>
      <p className="mt-5">Example:</p>
      <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
        <pre data-prefix="1">
          <code className="mx-5 py-5">const store = new graphStore();</code>
        </pre>
        <pre data-prefix="2">
          <code className="mx-5 py-5">store.createTable('myTable');</code>
        </pre>
      </div>

      <h2 data-scroll-target="getTable" className="text-2xl mt-5  mb-5 text-slate-800 font-bold">
        getTable(tableName)
      </h2>
      <p>
        Retrieves the table (cookie) with the given `tableName`.
      </p>
      <p className="mt-5">Parameters:</p>
      <ul>
        <li>
          <code>tableName</code> (string): The name of the table to retrieve.
        </li>
      </ul>
      <p className="mt-5">Returns:</p>
      <ul>
        <li>
          The table object if it exists, or <code>null</code> if the table doesn't exist.
        </li>
      </ul>
      <p className="mt-5">Example:</p>
      <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
        <pre data-prefix="1">
          <code className="mx-5 py-5">const table = store.getTable('myTable');</code>
        </pre>
      </div>

      <h2 data-scroll-target="removeTable" className="text-2xl mt-5  mb-5 text-slate-800 font-bold">
        removeTable(tableName)
      </h2>
      <p>
        Removes the table (cookie) with the given `tableName`.
      </p>
      <p className="mt-5">Parameters:</p>
      <ul>
        <li>
          <code>tableName</code> (string): The name of the table to remove.
        </li>
      </ul>
      <p className="mt-5">Example:</p>
      <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
        <pre data-prefix="1">
          <code className="mx-5 py-5">store.removeTable('myTable');</code>
        </pre>
      </div>

      <h2 data-scroll-target="insertRow" className="text-2xl mt-5  mb-5 text-slate-800 font-bold">
        insertRow(tableName, rowKey, rowData)
      </h2>
      <p>
        Inserts a new row into the table (cookie) with the given `tableName`, `rowKey`, and `rowData`.
      </p>
      <p className="mt-5">Parameters:</p>
      <ul>
        <li>
          <code>tableName</code> (string): The name of the table to insert the row.
        </li>
        <li>
          <code>rowKey</code> (string): The key for the new row.
        </li>
        <li>
          <code>rowData</code> (object): The data to be stored in the new row.
        </li>
      </ul>
      <p className="mt-5">Example:</p>
      <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
        <pre data-prefix="1">
          <code className="mx-5 py-5">
            store.insertRow('myTable', 'row1', {'{'} name: 'John Doe', age: 25 {'}'});
          </code>
        </pre>
      </div>

      <h2 data-scroll-target="getRow" className="text-2xl mt-5  mb-5 text-slate-800 font-bold">
        getRow(tableName, rowKey)
      </h2>
      <p>
        Retrieves a specific row from the table (cookie) based on the `tableName` and `rowKey`.
      </p>
      <p className="mt-5">Parameters:</p>
      <ul>
        <li>
          <code>tableName</code> (string): The name of the table to retrieve the row from.
        </li>
        <li>
          <code>rowKey</code> (string): The key of the row to retrieve.
        </li>
      </ul>
      <p className="mt-5">Returns:</p>
      <ul>
        <li>
          The data of the specified row, or <code>undefined</code> if the row doesn't exist.
        </li>
      </ul>
      <p className="mt-5">Example:</p>
      <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
        <pre data-prefix="1">
          <code className="mx-5 py-5">const row = store.getRow('myTable', 'row1');</code>
        </pre>
      </div>
      <div className="flex flex-row  mt-5 gap-2">
        <a
          href={`#/docs/${lang}/v1.8.8/filesystem`}
          className="btn    mt-5"
         
        >
           Previous: FileSystem
        </a>
        <a
     
          href={`#/docs/${lang}/v1.8.8/sqlstore`}
          className="btn    mt-5"
         
        >
          Next: API Reference - SqlStore()
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
 
