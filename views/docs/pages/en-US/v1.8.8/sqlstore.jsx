const sqlstore = () => {
    const lang = localStorage.getItem('lang') || 'en-US';
    window.postMessage(
        {
          page: 'sqlstore',
          lang: lang,
          pageContent: [
            {
              title: 'SQLStore',
              mainContent: 'SQLStore',
              subContent: [
                'createTable',
                'getTable',
                'removeTable',
                'insertRow',
                'getRow',
                'updateRows',
                'deleteRows',

              ]
            }
          ]
        },
        '*'
      );
      
  
      return (
        <div className="w-full">
          <h1 data-scroll-target="SQLStore" className="text-4xl text-slate-800 font-bold">
            SQLStore Class
          </h1>
          <div className="divider"></div>
          <p className="mt-5">
            The `SQLStore` class provides methods to manage data in a table stored in the browser's local storage.
          </p>
          <div className="divider"></div>
      
          <h2 data-scroll-target="createTable" className="text-2xl text-slate-800 font-bold">
            createTable(tableName, schema)
          </h2>
          <p>
            Creates a new table (cookie) with the given `tableName` and `schema`.
          </p>
          <p className="mt-5">Parameters:</p>
          <ul>
            <li>
              <code>tableName</code> (string): The name of the table to create.
            </li>
            <li>
              <code>schema</code> (object): The schema of the table, defining column names and types.
            </li>
          </ul>
          <p className="mt-5">Example:</p>
          <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
            <pre data-prefix="1">
              <code className="mx-5 py-5">SQLStore.createTable('myTable', {'{'} name: 'text', age: 'number' {'}'});</code>
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
              <code className="mx-5 py-5">const table = SQLStore.getTable('myTable');</code>
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
              <code className="mx-5 py-5">SQLStore.removeTable('myTable');</code>
            </pre>
          </div>
      
          <h2 data-scroll-target="insertRow" className="text-2xl mt-5  mb-5 text-slate-800 font-bold">
            insertRow(tableName, rowData)
          </h2>
          <p>
            Inserts a new row into the table (cookie) with the given `tableName` and `rowData`.
          </p>
          <p className="mt-5">Parameters:</p>
          <ul>
            <li>
              <code>tableName</code> (string): The name of the table to insert the row.
            </li>
            <li>
              <code>rowData</code> (object): The data to be stored in the new row.
            </li>
          </ul>
          <p className="mt-5">Example:</p>
          <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
            <pre data-prefix="1">
              <code className="mx-5 py-5">SQLStore.insertRow('myTable', {'{'} name: 'John Doe', age: 25 {'}'})</code>
            </pre>
          </div>
      
          <h2 data-scroll-target="getRow" className="text-2xl mt-5  mb-5 text-slate-800 font-bold">
            getRow(tableName, condition)
          </h2>
          <p>
            Retrieves rows from the table (cookie) based on the `tableName` and `condition`.
          </p>
          <p className="mt-5">Parameters:</p>
          <ul>
            <li>
              <code>tableName</code> (string): The name of the table to retrieve rows from.
            </li>
            <li>
              <code>condition</code> (string): The condition to filter the rows (optional).
            </li>
          </ul>
          <p className="mt-5">Returns:</p>
          <ul>
            <li>
              An array of rows that match the condition, or all rows if no condition is provided.
            </li>
          </ul>
          <p className="mt-5">Example:</p>
          <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
            <pre data-prefix="1">
              <code className="mx-5 py-5">const rows = SQLStore.getRow('myTable', "age &lt; 20");</code>
            </pre>
          </div>
      
          <h2 data-scroll-target="updateRows" className="text-2xl mt-5  mb-5 text-slate-800 font-bold">
            updateRows(tableName, condition, updates)
          </h2>
          <p>
            Updates rows in the table (cookie) based on the `tableName`, `condition`, and `updates`.
          </p>
          <p className="mt-5">Parameters:</p>
          <ul>
            <li>
              <code>tableName</code> (string): The name of the table to update rows.
            </li>
            <li>
              <code>condition</code> (string): The condition to filter the rows (optional).
            </li>
            <li>
              <code>updates</code> (object): The data to update in the matching rows.
            </li>
          </ul>
          <p className="mt-5">Example:</p>
          <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
            <pre data-prefix="1">
              <code className="mx-5 py-5">SQLStore.updateRows('myTable', "age &lt; 20",  {'{'} age: 20 {'}'});</code>
            </pre>
          </div>
      
          <h2 data-scroll-target="deleteRows" className="text-2xl mt-5  mb-5 text-slate-800 font-bold">
            deleteRows(tableName, condition)
          </h2>
          <p>
            Deletes rows from the table (cookie) based on the `tableName` and `condition`.
          </p>
          <p className="mt-5">Parameters:</p>
          <ul>
            <li>
              <code>tableName</code> (string): The name of the table to delete rows.
            </li>
            <li>
              <code>condition</code> (string): The condition to filter the rows (optional).
            </li>
          </ul>
          <p className="mt-5">Example:</p>
          <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
            <pre data-prefix="1">
              <code className="mx-5 py-5">SQLStore.deleteRows('myTable', "age  &lt; 20");</code>
            </pre>
          </div>
      
          <div className="flex flex-row  mt-5 gap-2">
            <a
              href={`#/docs/${lang}/v1.8.8/graphstore`}
              className="btn    mt-5"
            >
              Previous: GraphStore()
            </a>
            <a
            
              href={`#/docs/${lang}/v1.8.8/ReactRouter`}
              className="btn    mt-5"
            >
              Next:  ReactRouter
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
   
  