class Lazy {
  
    constructor(arr) {
      this.arr = arr;
      this.subscribers = [];
      this.store = {};
      this.totalSize = 0;
      this.cache = {};
    }
  
    map(fn) {
        const newArr = this.arr.map(fn);
        this.notifySubscribers('map', [fn]);
        return new Lazy(newArr);
      }
      
      
      filter(fn) {
        const newArr = this.arr.filter(fn);
        this.notifySubscribers('filter', [fn]);
        return new Lazy(newArr);
      }
      
      reduce(fn, initialValue) {
        const result = this.arr.reduce(fn, initialValue);
        this.notifySubscribers('reduce', [fn, initialValue]);
        return result;
      }
      
  
    subscribe(subscriber) {
      this.subscribers.push(subscriber);
    }
  
    setStore(key, value) {
      this.store[key] = value;
      const sizeInBytes = JSON.stringify(this.store).length;

      this.totalSize += sizeInBytes;
      this.notifySubscribers('setStore', [key, value])
    }
  
    getStore(key) {
      this.notifySubscribers('getStore', [key]);
      return this.store[key];

    }
  
    sort(comparator) {
      const newArr = this.arr.slice().sort(comparator);
      this.notifySubscribers( 'sort', [comparator])
      return new Lazy(newArr);
    }
  
    reverse() {
      const newArr = this.arr.slice().reverse();
      this.notifySubscribers('reverse', [])
      return new Lazy(newArr);
    }
  
    find(fn) {
      // return res or log param cant be found
        this.notifySubscribers('find', [fn]);
        return this.arr.find(fn);
      
    }
  
    some(fn) {
      this.notifySubscribers('some', [fn]);
      return this.arr.some(fn);
    }
  
    every(fn) {
        this.notifySubscribers('every', [fn]);
      
      return this.arr.every(fn);
    }
  
    concat(...args) {
    this.notifySubscribers('concat', args);
      const newArr = this.arr.concat(...args);
      this.notifySubscribers();
      return new Lazy(newArr);
    }
  
    slice(start, end) {
      this.notifySubscribers('slice', [start, end]);
      const newArr = this.arr.slice(start, end);
      this.notifySubscribers();
      return new Lazy(newArr);
    }
  
    splice(start, deleteCount, ...items) {
      this.notifySubscribers('splice', [start, deleteCount, ...items]);
      this.arr.splice(start, deleteCount, ...items);
      this.notifySubscribers();
      return this;
    }
  
    push(...items) {
      this.notifySubscribers('push', items);
      this.arr.push(...items);
      this.notifySubscribers();
      return this;
    }
  
    pop() {
      this.notifySubscribers('pop', []);
      const result = this.arr.pop();
       
      return result;
    }
  
    shift() {
      this.notifySubscribers('shift', []);
      const result = this.arr.shift();
      this.notifySubscribers();
      return result;
    }
  
    unshift(...items) {
     this.notifySubscribers('unshift', items);
      this.arr.unshift(...items);
      this.notifySubscribers();
      return this;
    }
  
    forEach(fn) {
        this.notifySubscribers('forEach', [fn]);
      this.arr.forEach(fn);
      return this;
    }
  
    includes(item) {
      this.notifySubscribers('includes', [item]);
      return this.arr.includes(item);
    }
  
    indexOf(item) {
      this.notifySubscribers('indexOf', [item]);
      return this.arr.indexOf(item);
    }
  
    lastIndexOf(item) {
        this.notifySubscribers('lastIndexOf', [item]);
      return this.arr.lastIndexOf(item);
    }
  
    join(separator) {
        this.notifySubscribers('join', [separator]);
      return this.arr.join(separator);
    }
  
    toString() {
        this.notifySubscribers('toString', []);
      return this.arr.toString();
    }
  
    notifySubscribers(fnName, args) {
        function formatSize(sizeInBytes) {
            if (sizeInBytes < 1024) {
                return `dataset is ${sizeInBytes} bytes`;
            } else if (sizeInBytes < 1024 * 1024) {
                return `${(sizeInBytes / 1024).toFixed(2)} KB`;
            } else if (sizeInBytes < 1024 * 1024 * 1024) {
                return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
            } else {
                return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
            }
        }
        const sizeInBytes = JSON.stringify(this.store).length;
        this.totalSize += sizeInBytes;
      
        this.subscribers.forEach((subscriber) => {
          subscriber({
            functionName: fnName,
            arguments: args,
            size: formatSize(this.totalSize)
          });
        });
      }
      
}

class JsonHandler   {
   constructor(){
        this.cache = {};
        this.subscribers = new Set();
        this.shards = 0
        this.shardsessions = [];
    }
    
  
    async query(queryFn) {
        const cachedResult = this.getCachedResult(queryFn);
        if (cachedResult) {
          return cachedResult;
        }
      
        try {
            const result = await queryFn();
          this.cacheResult(queryFn, Array.from(arguments), result);
          return result;
        } catch (error) {
          console.error(`Error executing query: ${error}`);
          throw error;
        }
      }
      
  
    subscribe(subscriber) {
      this.subscribers.add(subscriber);
    }
  
    unsubscribe(subscriber) {
      this.subscribers.delete(subscriber);
    }
    getCacheSizePerNode() {
        const nodeSizes = {};
        Object.entries(this.cache).forEach(([node, cache]) => {
          let size = 0;
          Object.values(cache).forEach((cacheItem) => {
            size += JSON.stringify(cacheItem).length;
          });
          nodeSizes[node] = `${size} bytes`;
        });
        return nodeSizes;
      }
          
     
      notifySubscribers(fnName, args, result) {
        this.subscribers.forEach((subscriber) => {
          subscriber({
            functionName: fnName,
            arguments: args,
            result: result,
          });
        });
      }
  
      getCachedResult(queryFn) {
        try {
          const cacheKey = this.getCacheKey(queryFn);
          const cacheItem = this.cache[cacheKey];
      
          if (!cacheItem) {
            return null;
          }
      
          if (cacheItem.expiry && Date.now() > cacheItem.expiry) {
            this.evictCache(cacheKey);
            return null;
          }
      
          return cacheItem.result;
        } catch (error) {
          console.error(`Error getting cached result: ${error.message}`);
          throw error;
        }
      }
      
    
      cacheResult(queryFn, args, result, expiryTime) {
        const cacheKey = this.getCacheKey(queryFn, args);
        const cacheItem = { result };
        if (expiryTime) {
          cacheItem.expiry = Date.now() + expiryTime;
        }
        this.cache[cacheKey] = cacheItem;
      
        // Evict cache if cache size limit is reached
        if (this.cacheSizeLimit && Object.keys(this.cache).length > this.cacheSizeLimit) {
          const oldestCacheItem = Object.values(this.cache).reduce((a, b) => a.expiry < b.expiry ? a : b);
          this.evictCache(this.getCacheKey(oldestCacheItem));
        }
      
        this.notifySubscribers(queryFn, args, result);
      }
      
  
    getCacheKey(queryFn, args) {
      return queryFn.toString() + JSON.stringify(args);
    }
  
    async queryParallel(queryFns) {
      const results = await Promise.all(queryFns.map((queryFn) => this.query(queryFn)));
      return results;
    }
    evictCache(cacheKey) {
        delete this.cache[cacheKey];
    }
    async queryWithSharding(queryFns, shardCount) {
        try {
          const shardSize = Math.ceil(queryFns.length / shardCount);
          const shards = [];
          for (let i = 0; i < shardCount; i++) {
            const start = i * shardSize;
            const end = start + shardSize;
            shards.push(queryFns.slice(start, end));
          }
      
          this.shards = shards;
          const shardResults = await Promise.all(shards.map((shard) => this.queryParallel(shard)));
          const results = shardResults.flat();
      
          // Save the shard sessions
          const shardSessions = shards.map((shard) => {
            const shardQueryFns = shard.map((queryFn) => {
              const cacheKey = this.getCacheKey(queryFn);
              const cacheItem = this.cache[cacheKey];
              return {
                query: queryFn.toString(),
                result: cacheItem ? cacheItem.result : null,
              };
            });
            return { queries: shardQueryFns };
          });
      
          console.log(shardSessions); // Debugging statement
      
          this.shardsessions = shardSessions;
      
          return results;
        } catch (error) {
          console.error(`Error executing query with sharding: ${error}`);
          throw error;
        }
      }
      
      
      
      
  
    saveCache(saveFn) {
      try {
        saveFn(this.cache);
      } catch (error) {
        console.error(`Error saving cache: ${error.message}`);
        throw error;
      }
    }
    saveShardSessions(filename, type, url = null, callback = null) {
        const json = JSON.stringify(this.shardSessions);
        const blob = new Blob([json], { type: 'application/json' });
        if(type == "local"){
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
        }
        else if(type == "server"){
           fetch(url, {
            method: 'POST',
            body: blob,
          }).then((response) => {
            if (!response.ok) {
              throw new Error('Error saving shard sessions');
            }
            if (callback) {
              callback();
            }
          });

        }else if(type == "store"){
          localStorage.setItem(filename, json);
        }

      } 
    
      
     
    
      async reloadShards() {
        const shardResults = await Promise.all(this.shards.map((shard) => this.queryParallel(shard)));
        const results = shardResults.flat();
        return results;
      }
}

window.help = {
  "lib":{
    "description":"Load a library",
    "usage":"lib(\"@tailwind/daisyui\")",
    "libraries":{
      "@tailwind/daisyui":"https://daisyui.com/docs/installation",
      "@tailwind/core": "https://tailwindcss.com/docs/installation",
      "@tailwind/plugin": "https://tailwindcss.com/docs/installation#installing-additional-presets",
      "@react-bootstrap":"https://react-bootstrap.github.io/getting-started/introduction",
      "@mui/material":"https://material-ui.com/getting-started/installation/",
      "@d3.js":"https://www.npmjs.com/package/d3",
      "@chart.js":"https://www.chartjs.org/docs/latest/getting-started/installation.html",
      "@three.js":"https://threejs.org/docs/index.html#manual/en/introduction/Installation",
      "@mastercss":"https://mastercss.js.org/docs/installation",
   
        "frameworks":{
           "@lit-js":"https://lit.dev/docs/getting-started/",
        },
 
      
      
    }
  }  
}
 // Define the wrapper object
export const SQLStore = {
  tables: {},

  // Table constructor function
  Table: function(tableName) {
    if (!this.tables[tableName]) {
      this.tables[tableName] = {
        name: tableName,
        schema: {},
        hooks: []
      };
    }
    return this.tables[tableName];
  },

  // Hook method to register callbacks for a table
  hook: function(tableName, callback) {
    const table = this.Table(tableName);
    table.hooks.push(callback);
  },

  // Create a table with schema
  createTable: function(tableName, schema) {
    const tableKey = `${tableName}_table`;
    if (!localStorage.getItem(tableKey)) {
      localStorage.setItem(tableKey, JSON.stringify(schema));
      console.log(`Table '${tableName}' created successfully.`);
      this.triggerHooks(tableName, 'tableCreated', { schema });
    } else {
      console.log(`Table '${tableName}' already exists.`);
    }
  },

  // Insert a row into a table
  insertRow: function(tableName, rowData) {
    const tableKey = `${tableName}_table`;
    const schema = JSON.parse(localStorage.getItem(tableKey));
  
    if (schema) {
      const row = {};
      const errors = [];
  
      for (let column in schema) {
        const columnType = schema[column];
        if (rowData.hasOwnProperty(column)) {
          const value = rowData[column];
  
          if (typeof value === columnType.toLowerCase()) {
            row[column] = value;
          } else {
            errors.push(`Invalid value type for column '${column}'. Expected '${columnType}'.`);
          }
        } else {
          errors.push(`Missing value for column '${column}'.`);
        }
      }
  
      if (errors.length === 0) {
        const dataKey = `${tableName}_data`;
        const tableData = JSON.parse(localStorage.getItem(dataKey)) || [];
        tableData.push(row);
        localStorage.setItem(dataKey, JSON.stringify(tableData));
  
        console.log(`Row inserted successfully into '${tableName}'.`);
        this.triggerHooks(tableName, 'rowInserted', { row });
      } else {
        console.error(`Failed to insert row into '${tableName}':`, errors);
      }
    } else {
      console.log(`Table '${tableName}' does not exist.`);
    }
  }
,  
removeRow: function(tableName, conditions) {
  const tableKey = `${tableName}_table`;
  const schema = JSON.parse(localStorage.getItem(tableKey));

  if (schema) {
    const dataKey = `${tableName}_data`;
    let tableData = JSON.parse(localStorage.getItem(dataKey)) || [];

    const filteredData = tableData.filter(row => {
      for (let column in conditions) {
        if (row[column] !== conditions[column]) {
          return true;
        }
      }
      return false;
    });

    if (filteredData.length !== tableData.length) {
      localStorage.setItem(dataKey, JSON.stringify(filteredData));
      console.log(`Removed row(s) from '${tableName}'.`);
      this.triggerHooks(tableName, 'rowRemoved', { conditions });
    } else {
      console.log(`No matching rows found in '${tableName}'.`);
    }
  } else {
    console.log(`Table '${tableName}' does not exist.`);
  }
},

// Remove a table
removeTable: function(tableName) {
  const tableKey = `${tableName}_table`;
  if (localStorage.getItem(tableKey)) {
    localStorage.removeItem(tableKey);
    localStorage.removeItem(`${tableName}_data`);
    delete this.tables[tableName];
    console.log(`Table '${tableName}' and associated data removed.`);
    this.triggerHooks(tableName, 'tableRemoved', {});
  } else {
    console.log(`Table '${tableName}' does not exist.`);
  }
},

  // Select rows from a table based on conditions
  selectRows: function(tableName, conditions) {
    const tableKey = `${tableName}_table`;
    const schema = JSON.parse(localStorage.getItem(tableKey));

    if (schema) {
      const dataKey = `${tableName}_data`;
      const tableData = JSON.parse(localStorage.getItem(dataKey)) || [];

      const matchedRows = tableData.filter(row => {
        for (let column in conditions) {
          if (row[column] !== conditions[column]) {
            return false;
          }
        }
        return true;
      });

      console.log(`Selected ${matchedRows.length} rows from '${tableName}'.`);
      this.triggerHooks(tableName, 'rowsSelected', { rows: matchedRows });
    } else {
      console.log(`Table '${tableName}' does not exist.`);
    }
  },

  // View the schema of a table
  viewSchema: function(tableName) {
    const tableKey = `${tableName}_table`;
    const schema = JSON.parse(localStorage.getItem(tableKey));

    if (schema) {
      console.log(`Schema of table '${tableName}':`, schema);
    } else {
      console.log(`Table '${tableName}' does not exist.`);
    }
  },
  // Update rows in a table based on conditions
updateRows: function(tableName, conditions, newData) {
  const tableKey = `${tableName}_table`;
  const schema = JSON.parse(localStorage.getItem(tableKey));

  if (schema) {
    const dataKey = `${tableName}_data`;
    let tableData = JSON.parse(localStorage.getItem(dataKey)) || [];

    let updatedRows = 0;

    tableData = tableData.map(row => {
      let isMatched = true;
      for (let column in conditions) {
        if (row[column] !== conditions[column]) {
          isMatched = false;
          break;
        }
      }

      if (isMatched) {
        for (let column in newData) {
          if (schema.hasOwnProperty(column)) {
            const columnType = schema[column];
            const value = newData[column];

            if (typeof value === columnType.toLowerCase()) {
              row[column] = value;
            } else {
              console.error(`Invalid value type for column '${column}'. Expected '${columnType}'.`);
            }
          } else {
            console.error(`Column '${column}' does not exist in table '${tableName}'.`);
          }
        }
        updatedRows++;
      }

      return row;
    });

    if (updatedRows > 0) {
      localStorage.setItem(dataKey, JSON.stringify(tableData));
      console.log(`Updated ${updatedRows} row(s) in '${tableName}'.`);
      this.triggerHooks(tableName, 'rowsUpdated', { conditions, newData });
    } else {
      console.log(`No matching rows found in '${tableName}'.`);
    }
  } else {
    console.log(`Table '${tableName}' does not exist.`);
  }
},

  triggerHooks: function(tableName, event, data) {
    const table = this.tables[tableName];
    if (table) {
      table.hooks.forEach(callback => callback(event, data));
    }
  },
}

// Listen for postMessage events
window.addEventListener('message', function(event) {
  const { eventType, data } = event.data;
  if (eventType && data) {
    const { tableName } = data;
    if (tableName) {
      SQLStore.triggerHooks(tableName, eventType, data);
    }
  }
});

window.SQLStore = SQLStore;
 
export const fs = {
   
  read: (path, compress = false) => {
    return new Promise((resolve, reject) => {
      if (compress) {
        import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
          const compressedData = localStorage.getItem(path);
          if (compressedData) {
            const compressedUint8Array = new Uint8Array(JSON.parse(compressedData));
            const decompressedUint8Array = pako.inflate(compressedUint8Array);
            const result = new TextDecoder().decode(decompressedUint8Array);
            console.log(`Read file: ${path}`);
            resolve(result);
          } else {
            console.error(`File not found: ${path}`);
            reject();
          }
        });
      } else {
        const content = localStorage.getItem(path);
        if (content) {
          console.log(`Read file: ${path}`);
          resolve(content);
        } else {
          console.error(`File not found: ${path}`);
          reject();
        }
      }
    });
  },

  write: (path, content, compress = false) => {
    return new Promise((resolve, reject) => {
      const directoryPath = path.substring(0, path.lastIndexOf('/'));
      if (!fs.exists(directoryPath)) {
        console.error(`Directory does not exist: ${directoryPath}`);
        reject();
        return;
      }

      if (compress) {
        import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
          const inputUint8Array = new TextEncoder().encode(content);
          const compressedUint8Array = pako.gzip(inputUint8Array);
          const compressedData = JSON.stringify(Array.from(compressedUint8Array));
          localStorage.setItem(path, compressedData);
          localStorage.setItem(`__fs_watch_${path}`, Date.now()); // Set modified time
          console.log(`Write file: ${path}`);
          resolve();
        });
      } else {
        localStorage.setItem(path, content);
        localStorage.setItem(`__fs_watch_${path}`, Date.now()); // Set modified time
        console.log(`Write file: ${path}`);
        resolve();
      }
    });
  },

  exists: (path) => {
    return localStorage.getItem(path) !== null;
  },

  mkdir: (path) => {
    if (fs.exists(path)) {
      console.error(`Directory already exists: ${path}`);
      return;
    }

    const directories = path.split('/').filter(directory => directory !== '');
    let currentPath = '/root';
    directories.forEach((directory) => {
      currentPath += `/${directory}`;
      if (!fs.exists(currentPath)) {
        localStorage.setItem(currentPath, '{}');
        console.log(`Created directory: ${currentPath}`);
      }
    });
  },
  watch: (path, callback) => {
    let lastModifiedTime = localStorage.getItem(`__fs_watch_${path}`);
    
    setInterval(() => {
      const currentModifiedTime = localStorage.getItem(`__fs_watch_${path}`);
      if (currentModifiedTime !== lastModifiedTime) {
        lastModifiedTime = currentModifiedTime;
        callback({ event: 'change', path });
      }
    }, 1000); // Check every second for changes
  },
  rmrf: (path) => {
    const directoryPath = path.substring(0, path.lastIndexOf('/'));
    if (!fs.exists(directoryPath)) {
      console.error(`Directory does not exist: ${directoryPath}`);
      return;
    }

    const directories = path.split('/').filter(directory => directory !== '');
    let currentPath = '/root';
    directories.forEach((directory) => {
      currentPath += `/${directory}`;
      if (fs.exists(currentPath)) {
        localStorage.removeItem(currentPath);
        console.log(`Removed directory: ${currentPath}`);
      }
    });
  },
  ls: (path) => {
    const directoryPath = path.substring(0, path.lastIndexOf('/'));
    if (!fs.exists(directoryPath)) {
      console.error(`Directory does not exist: ${directoryPath}`);
      return;
    }

    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(path)) {
        files.push(key);
      }
    }
    return files;
  },
  cp: (source, destination) => {
    if (!fs.exists(source)) {
      console.error(`File does not exist: ${source}`);
      return;
    }

    const content = localStorage.getItem(source);
    localStorage.setItem(destination, content);
    console.log(`Copied file: ${source} -> ${destination}`);
  },
  mv: (source, destination) => {
    if (!fs.exists(source)) {
      console.error(`File does not exist: ${source}`);
      return;
    }

    const content = localStorage.getItem(source);
    localStorage.setItem(destination, content);
    localStorage.removeItem(source);
    console.log(`Moved file: ${source} -> ${destination}`);
  },
  cat: (path) => {
    if (!fs.exists(path)) {
      console.error(`File does not exist: ${path}`);
      return;
    }

    return localStorage.getItem(path);
  },
  pwd: () => {
    return '/root';
  },
  cd: (path) => {
    if (!fs.exists(path)) {
      console.error(`Directory does not exist: ${path}`);
      return;
    }

    localStorage.setItem('current_directory', path);
  },
  clear: () => {
    localStorage.clear();
  },
  size: (path) => {
    if (!fs.exists(path)) {
      console.error(`File does not exist: ${path}`);
      return;
    }
    let content = localStorage.getItem(path);
    let units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = content.length;
    let unit = 0;
    while (size > 1024) {
      size /= 1024;
      unit++;
    }
    return `${size.toFixed(2)} ${units[unit]}`;
  },
  rename: (path, newPath) => {
    if (!fs.exists(path)) {
      console.error(`File does not exist: ${path}`);
      return;
    }

    const content = localStorage.getItem(path);
    localStorage.setItem(newPath, content);
    localStorage.removeItem(path);
    console.log(`Renamed file: ${path} -> ${newPath}`);
  },
  help: () => {
    return 'Available commands: ls, pwd, cd, cat, mkdir, rmrf, cp, mv, clear, help, watch, write, read, rename, exists';
  }

};
 
window.fs = fs;

export const os = {
  cpus: () => {
    return navigator.hardwareConcurrency;
  },
  hostname: () => {
    return navigator.userAgent;
  },
  platform: () => {
     let plat = navigator.userAgent 
    switch (plat) {
      case plat.includes("Win"):
        return "Windows";
        break;
      case plat.includes("Mac"):
        return "MacOS";
        break;
      case plat.includes("Linux"):
        return "Linux";
        break;
      case plat.includes("Android"):
        return "Android";
        break;
      case plat.includes("iOS"):
        return "iOS";
        break;
      default:
        return "Unknown";
        break;
    }
  },

  hardware: async () => {
    const adapter = await navigator.gpu.requestAdapter();
    let units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let ram = navigator.deviceMemory;
    let unit = 0;
    while (ram > 1024) {
      ram /= 1024;
      unit++;
    }
    ram = `${ram.toFixed(2)} ${units[unit]}`;
    let data = {
      gpu: await adapter.requestDevice(),
      cpu: navigator.hardwareConcurrency + " Cores",
      ram: ram,
    }
    return data;
  },
  arch: () => {
    let platform = navigator.userAgentData 
    console.log(platform);
  
    if (platform === "Win64" || platform === "x86_64" || platform === "x64") {
      return "x64";
    } else if (platform === "Win32" || platform === "x86") {
      return "x32";
    } else {
      return "Unknown";
    }
  }
  
}
const notifier = {
  subscribers:  [],

  send: async (message, options) => {
    if (!("Notification" in window)) {
      console.error("Notifications are not supported in this browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const noti = new Notification(message, options);
        Object.values(notifier.subscribers).forEach((subscribers) => {
          subscribers.forEach((subscriber) => {
            subscriber(noti);
          });
        });
      } else {
        console.error("Notification permission denied.");
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
    }
  },

  sendPostNotification: async (url, data, options) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Failed to send POST notification.");
      }

      const notificationData = await response.json();
      const message = notificationData.message;
      notifier.send(message, options);
    } catch (error) {
      console.error("Failed to send POST notification:", error);
    }
  },

  subscribe: (eventType, subscriber) => {
    if (!notifier.subscribers[eventType]) {
      notifier.subscribers[eventType] = new Set();
    }
    notifier.subscribers[eventType].add(subscriber);
  },

  unsubscribe: (eventType, subscriber) => {
    if (notifier.subscribers[eventType]) {
      notifier.subscribers[eventType].delete(subscriber);
      if (notifier.subscribers[eventType].size === 0) {
        delete notifier.subscribers[eventType];
      }
    }
  },

  handleNotificationClick: (event, clickCallback) => {
    if (typeof clickCallback === "function") {
      event.notification.close();
      clickCallback(event);
    }
  },

  handleNotificationClose: (event, closeCallback) => {
    if (typeof closeCallback === "function") {
      closeCallback(event);
    }
  }
};



window.os = os; 

const containers = {};

export let contained = {
  newContainer: (id) => {
    if (containers[id]) {
      console.error(`Container with ID '${id}' already exists.`);
      return;
    }

    const containerWorker = new Worker(URL.createObjectURL(new Blob([`
    // Worker code
    self.onmessage = (event) => {
      const { event: eventType, id, code, callbackId } = event.data;
      const container = ${JSON.stringify(containers[id])};
      
      if (eventType === 'run') {
        try {
          // Execute the code within the container
          const result = eval(code);
          self.postMessage(JSON.stringify({ result, callbackId }));
        } catch (error) {
          self.postMessage(JSON.stringify({ error: error.message, callbackId }));
        }
      } else if (eventType === 'postMessage') {
        // Handle custom messages sent from the main thread
        container.onMessage(event.data.message);
      } else if (eventType === 'exit') {
        // Clean up the container
         ${JSON.stringify(containers[id])} = null;
         console.log("Container with ID '${id}' exited.");
        self.close();
        delete containers[id];
      }
    };
  `])));

    const container = {
      id,
      worker: containerWorker,
      onMessage: () => {},
      onDestroy: () => {},
    };

    containerWorker.onmessage = (event) => {
      // Handle messages received from the containerized worker
      const { result, error, callbackId } = JSON.parse(event.data);
      if (error) {
        containerWorker.postMessage({ event: 'exit', id });
        const callback = container.callbacks[callbackId];
        if (callback) {
          delete container.callbacks[callbackId];
          callback(error);
        }
      } else {
        const callback = container.callbacks[callbackId];
        if (callback) {
          delete container.callbacks[callbackId];
          callback(null, result);
        }
      }
    };

    container.callbacks = {};

    containers[id] = container;
  },

  run: (id, code, callback) => {
    const container = containers[id];
    if (!container) {
      console.error(`Container with ID '${id}' does not exist.`);
      return;
    }

    const callbackId = Math.random().toString(36).substring(7);
    container.callbacks[callbackId] = callback;
    container.worker.postMessage({ event: 'run', id, code, callbackId });
  },

  postMessage: (id, message) => {
    const container = containers[id];
    if (!container) {
      console.error(`Container with ID '${id}' does not exist.`);
      return;
    }

    container.worker.postMessage({ event: 'postMessage', id, message });
  },

  exit: (id) => {
    const container = containers[id];
    if (!container) {
      console.error(`Container with ID '${id}' does not exist.`);
      return;
    }

    container.worker.postMessage({ event: 'exit', id });
  },

  onMessage: (id, callback) => {
    const container = containers[id];
    if (!container) {
      console.error(`Container with ID '${id}' does not exist.`);
      return;
    }

    container.onMessage = callback;
  },

  onDestroy: (id, callback) => {
    const container = containers[id];
    if (!container) {
      console.error(`Container with ID '${id}' does not exist.`);
      return;
    }

   
  },
}
 
window.contained = contained;

window.lib = (path) => {
  if (!path) throw new Error('lib() must be called with a path!');
   
    if(path.startsWith("@tailwind/daisyui")){
      path = path.replace("@tailwind/daisyui", "");
      path = path.replace("/", ",");
      let link = document.createElement('link');
      link.rel = "preload";
      link.as = "script";
      link.href = `https://cdn.tailwindcss.com?plugins=${path}`;
      document.head.appendChild(link);
      
      let daisylink = document.createElement('link');
      daisylink.rel = "preload";
      document.body.style.visibility = "hidden";
      daisylink.as = "style";
      daisylink.href = `https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css`;
      document.head.appendChild(daisylink);
      let script = document.createElement('script');
      script.src = `https://cdn.tailwindcss.com?plugins=${path}`;
      script.id = 'tailwindcss';
      document.head.appendChild(script);
      let daisy = document.createElement('link');
      daisy.rel = "stylesheet";
      daisy.href = `https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css`;
      document.head.appendChild(daisy);
      if (!document.getElementById("tailwindcss")) {
        document.head.appendChild(script);
      }
      script.onload = () => {
        document.head.removeChild(script);
        console.log(`Tailwind CSS & Daisy Ui loaded with plugins ${path}`)
        document.body.style.visibility = "visible";
       
    }
  
 
  }
  if(path.startsWith("@tailwind/core")){
    let link = document.createElement('link');
    link.rel = "preload";
    link.as = "script";
    link.href = `https://cdn.tailwindcss.com`;
    document.head.appendChild(link);
    document.body.style.visibility = "hidden";
    let script = document.createElement('script');
    script.src = `https://cdn.tailwindcss.com`;
    script.id = 'tailwindcss';
    
    if (!document.getElementById("tailwindcss")) {
      document.head.appendChild(script);
    }
    script.onload = () => {
      document.head.removeChild(script);
      console.log(`Tailwind CSS loaded `)
      setTimeout(() => {
        document.body.style.visibility = "visible";
      },100);
      
    }
  }
  
  if (path.startsWith("@tailwind")) {
    path = path.replace("@tailwind/", "");
    path = path.replace("/", ",");
    let link = document.createElement('link');
    link.rel = "preload";
    link.as = "script";
    link.href = `https://cdn.tailwindcss.com?plugins=${path}`;
    document.head.appendChild(link);
    document.body.style.visibility = "hidden";
    let script = document.createElement('script');
    script.src = `https://cdn.tailwindcss.com?plugins=${path}`;
    script.id = 'tailwindcss';
     
    if (!document.getElementById("tailwindcss")) {
      document.head.appendChild(script);
    }
    

    script.onload = () => {
      document.head.removeChild(script);
      console.log(`Tailwind CSS loaded with plugins ${path}`)
      setTimeout(() => {
        document.body.style.visibility = "visible";
      },100);
       
    }

  } 
  
  if (path.startsWith("@react-bootstrap")) {

    let script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
    script.id = "react-bootstrap"
    let style = document.createElement("link")
    style.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
    style.rel = "stylesheet"
    style.integrity = "sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
    style.crossOrigin = "anonymous"
    document.body.style.visibility = "hidden";
    const preload = document.createElement('link');
    preload.rel = "preload";
    preload.as = "script";

    document.body.style.visibility = "hidden";
    if (!document.getElementById("react-bootstrap")) {
      document.head.appendChild(script)
      document.head.appendChild(style)
    }

    script.onload = () => {
      console.log("React BootStrap loaded")
      document.head.removeChild(script)
      setTimeout(() => {
        document.body.style.visibility = "visible";
      },100);
      
    }


    return;
  }
  if(path.startsWith('@d3.js')){
    let link = document.createElement('link');
    link.rel = "preload";
    link.as = "script";
    link.href = `https://d3js.org/d3.v7.min.js`;
    document.head.appendChild(link);
    let script = document.createElement('script');
    script.src = `https://d3js.org/d3.v7.min.js`;
    script.id = 'd3.js';
    if (!document.getElementById("d3.js")) {
      document.head.appendChild(script);
    }
    script.onload = () => {
      document.head.removeChild(script);
      console.log(`D3.js loaded`)
      setTimeout(() => {
        document.body.style.visibility = "visible";
      },100);
       
    }
    return;
  }
  if(path.startsWith('@chart.js')){
    let link = document.createElement('link');
    link.rel = "preload";
    link.as = "script";
    link.href = `https://cdn.jsdelivr.net/npm/chart.js`;
    document.head.appendChild(link);
    let script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/npm/chart.js`;
    script.id = 'chart.js';
    if (!document.getElementById("chart.js")) {
      document.head.appendChild(script);
    }
    script.onload = () => {
      document.head.removeChild(script);
      console.log(`Chart.js loaded`)
      setTimeout(() => {
        document.body.style.visibility = "visible";
      },100);
       
    }
  }
  if(path.startsWith('@three.js')){
    let link = document.createElement('link');
    link.rel = "preload";
    link.as = "script";
    link.href = `https://cdn.jsdelivr.net/npm/three`;
    document.head.appendChild(link);
    let script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/npm/three`;
    script.id = 'three.js';
    if (!document.getElementById("three.js")) {
      document.head.appendChild(script);
    }
    script.onload = () => {
      document.head.removeChild(script);
      console.log(`Three.js loaded`)
      setTimeout(() => {
        document.body.style.visibility = "visible";
      },100);
       
    }
  }
  if (path.startsWith('@mastercss')) {
    // preload
    let link = document.createElement('link');
    link.rel = "preload";
    link.as = "script";
    link.href = `https://cdn.master.co/css`;
    let mastersheet = document.createElement('link');
    mastersheet.href = `https://cdn.master.co/normal.css`;
    mastersheet.rel = "preload";
    mastersheet.as = "style";
    document.head.appendChild(mastersheet);
    let stylesheet = document.createElement('link');
    stylesheet.href = `https://cdn.master.co/normal.css`;
    stylesheet.rel = "stylesheet";
    document.head.appendChild(stylesheet);
    document.head.appendChild(link);
    document.body.style.visibility = "hidden";
    let script = document.createElement('script');
    script.defer = true;
    script.src = `https://cdn.master.co/css`;
    script.id = 'mastercss';
    if (!document.getElementById("mastercss")) {
      document.head.appendChild(script);
    }
    script.onload = () => {
      document.head.removeChild(script);
      console.log(`Master CSS loaded`)
      setTimeout(() => {
        document.body.style.visibility = "visible";
      },100);
    }

    return;
  }
  if(path.startsWith("@mui/material")){
    mui = true;
    if(muiprod == true){
      let link = document.createElement('link');
      link.rel = "preload";
      link.as = "script";
      link.href = `https://unpkg.com/@mui/material/umd/material-ui.production.min.js`;
      document.head.appendChild(link);
      let script = document.createElement('script');
      script.src = `https://unpkg.com/@mui/material/umd/material-ui.production.min.js`;
      script.id = 'mui';
      if (!document.getElementById("mui")) {
        document.head.appendChild(script);
      }
      script.onload = () => {
        document.head.removeChild(script);
        console.log(`MUI production loaded`)
        setTimeout(() => {
          document.body.style.visibility = "visible";
        },100);
      }
    }else{
      let link = document.createElement('link');
      link.rel = "preload";
      link.as = "script";
      link.href = `https://unpkg.com/@mui/material@latest/umd/material-ui.development.js`;
      document.head.appendChild(link);
      let script = document.createElement('script');
      script.src = `https://unpkg.com/@mui/material@latest/umd/material-ui.development.js`;
      script.id = 'mui';
      if (!document.getElementById("mui")) {
        document.head.appendChild(script);
      }
      script.onload = () => {
        document.head.removeChild(script);
        console.log(`MUI dev loaded`)
        setTimeout(() => {
          document.body.style.visibility = "visible";
        },100);
      }
    }
  }
  if(path.startsWith('@lit-js')){
    let link = document.createElement('link');
    link.rel = "preload";
    link.as = "script";
    link.href = `https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js`;

    document.head.appendChild(link);
    let script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js`;
    script.id = 'lit-js';
    script.type = "module";
    script.defer = true;
    
    document.body.style.visibility = "hidden";
    if (!document.getElementById("lit-js")) {
      document.head.appendChild(script);
    }
     

    script.onload = () => {
      document.head.removeChild(script);
      console.log(`Lit JS loaded`)
      setTimeout(() => {
        document.body.style.visibility = "visible";
      },100);
    }

  }

 
 else  if (path.endsWith('.css')) {
    if (!cache[path]) {
      fetch(path).then((res) => {
        res.text().then((text) => {
          cache[path] = text;
          totalSize += text.length;
          const stylesheet = new CSSStyleSheet();
          stylesheet.replaceSync(text);
          document.body.style.visibility = "hidden";
          // Add the stylesheet to the adoptedStyleSheets array
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
           
        });
      });
    } else {
      let source = cache[path];
      totalSize += source.length;
      const stylesheet = new CSSStyleSheet();
      stylesheet.replaceSync(source);
      document.body.style.visibility = "hidden";
      // Add the stylesheet to the adoptedStyleSheets array

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
      document.onload = () => {
        document.body.style.visibility = "visible";
      }
    }
    return;
  }else if(path.endsWith('.js')){
    let script = document.createElement('script');
    script.src = path;
    script.type = "module";
    script.id = path;
    document.body.style.visibility = "hidden";
    if (!document.getElementById(path)) {
      document.head.appendChild(script);
    }
    script.onload = () => {
      document.head.removeChild(script);
      console.log(`${path} loaded`)
      setTimeout(() => {
        document.body.style.visibility = "visible";
      },100);
    }
  }

   







}


export default  { Lazy, JsonHandler}

window.Lazy = Lazy;
window.JsonHandler = JsonHandler;

//  React Router

export class ReactRouter {
    constructor() {
      this.routes = {};
      this.currentUrl =   ''
      this.store = {};
      this.rootElement = null;
      this.hashChangeListener = null;
      this.listeners =  {}
      this.storedroutes = []
      this.errorcheck = null;
      this.headers = {}
    }
  
    get(path, callback) {
       
      const paramNames = [];
      const queryNames = [];
      const parsedPath = path.split('/').map(part => {
        if (part.startsWith(':')) {
          paramNames.push(part.substring(1));
          return '([^/]+)';
        }
        if (part.startsWith('*')) {
          paramNames.push(part.substring(1));
          return '(.*)';
        }
        if (part.startsWith('?')) {
          queryNames.push(part.substring(1));
          return '([^/]+)';
        }
        return part;
      }).join('/');
      const regex = new RegExp('^' + parsedPath + '(\\?(.*))?$');
       

     
      if (window.location.hash.substring(1).match(regex)) {
        this.storedroutes.push( window.location.hash.substring(1))
        this.routes[path] = true
        const matches = window.location.hash.substring(1).match(regex);
        const params = {};
         
        for (let i = 0; i < paramNames.length; i++) {
          para.ms[paramNames[i]] = matches[i + 1];
        }
        if (path.includes(":") && window.location.hash.substring(1).split("?")[1]) {
          console.error("Cannot use query params with path params", path, window.location.hash.substring(1).split("?")[1]);
          return false;
        }
        const query = {};
  
        const queryString = window.location.hash.substring(1).split('?')[1];
        if (queryString) {
          const queryParts = queryString.split('&');
          for (let i = 0; i < queryParts.length; i++) {
            const queryParam = queryParts[i].split('=');
            query[queryParam[0]] = queryParam[1];
          }
        }
  
        const req = {
          "params": params,
          "query": query,
          "url": window.location.hash.substring(1),
          "method": "GET",
        }
  
  
        let hooked = false;
        const res = {
          json: (data) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            try {
              const jsonData = JSON.stringify(data);
              const html = `<pre>${jsonData}</pre>`;
              document.getElementById(this.rootElement).innerHTML = html;
              hooked = true;
            } catch (e) {
              throw new Error("Invalid JSON data");
            }
          },
  
          setCookie: (name, value, options) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            let cookieString = `${name}=${value};`;
            if (options) {
              if (options.path) {
                cookieString += `path=${options.path};`;
              }
              if (options.domain) {
                cookieString += `domain=${options.domain};`;
              }
              if (options.maxAge) {
                cookieString += `max-age=${options.maxAge};`;
              }
              if (options.httpOnly) {
                cookieString += `httpOnly=${options.httpOnly};`;
              }
              if (options.secure) {
                cookieString += `secure=${options.secure};`;
              }
              if (options.sameSite) {
                cookieString += `sameSite=${options.sameSite};`;
              }
            }
            document.cookie = cookieString;
  
          },
          getCookie: (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              const cookieName = cookie.split('=')[0];
              if (cookieName === name) {
                const cookieValue = cookie.split('=')[1];
                const cookieOptions = cookie.split(';').slice(1).map(option => {
                  const [key, value] = option.split('=').map(str => str.trim());
                  return { [key]: value };
                }).reduce((acc, curr) => Object.assign(acc, curr), {});
                return {
                  name: cookieName,
                  value: cookieValue
                };
              }
            }
            return null;
          },
          title: (title) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            document.title = title;
            hooked = true;
          },
          saveState: () => {
            if (hooked) {
              throw new Error("State has already been saved cannot save again");
            }
            const route = window.location.hash.substring(1);
            // save the current route in history
            if (window.sessionStorage.getItem(route)) {
              window.location.hash = window.sessionStorage.getItem(route);
            } else {
              window.sessionStorage.setItem(route, route);
            }
            hooked = true;
  
          },
          restoreState: () => {
            if (hooked) {
              throw new Error("State has already been restored cannot restore again");
            }
            // restore the current route in history
            let route = window.location.hash.substring(1);
            if (window.sessionStorage.getItem(route)) {
              window.location.hash = window.sessionStorage.getItem(route);
            } else {
              window.location.hash = this.currentUrl;
            }
            hooked = true;
          },
          send: (data) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            document.getElementById(this.rootElement).innerHTML = data;
            hooked = true;
          },
          jsx: (data) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
           
                   
                  window.React._render(data)(this.rootElement);
                
                  hooked = true;
          },
          compress : async (data) => {
            
            const promise = new Promise((resolve, reject) => {
             import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
               console.log("pako loaded");
               const inputUint8Array = new TextEncoder().encode(data);
               const compressedUint8Array = pako.gzip(inputUint8Array);
               resolve(compressedUint8Array);
              
             });
            
              
            });
             return promise;
           },
           
           // Decompress data using pako
            decompress : async (data) => {
             return new Promise((resolve, reject) => {
               import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
                 const compressedUint8Array = new Uint8Array(data);
                 const decompressedUint8Array = pako.inflate(compressedUint8Array);
                 const result = new TextDecoder().decode(decompressedUint8Array);
                 resolve(result);
               });
           
             });
           },
          ip: () => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            hooked = true;
          
            return fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => {
              return data.ip;
            });
          },
          return: () => {
            if (hooked) {
              hooked = false;
            }
            if (this.hashChangeListener) {
              window.removeEventListener("hashchange", this.hashChangeListener);
              this.hashChangeListener = null;
              console.log("removed last event listener")
            }
          },
          sendStatus: (msg, code) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
  
            if (typeof code === 'number') {
              document.getElementById(this.rootElement).innerHTML =   JSON.stringify({msg, code});
              hooked = true;
            } else {
              throw new Error("Invalid status code");
            }
  
  
  
          },
          redirect: (url) => {
  
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            window.location.hash = url;
            hooked = true;
  
          },
          compress : async (data) => {
            const inputUint8Array = new TextEncoder().encode(data);
            const compressedUint8Array = pako.gzip(inputUint8Array);
            return compressedUint8Array;
          },
          
          // Decompress data using pako
           decompress : async (data) => {
            const compressedUint8Array = new Uint8Array(data);
            const decompressedUint8Array = pako.inflate(compressedUint8Array);
            const result = new TextDecoder().decode(decompressedUint8Array);
            return result;
          },
          markdown: (data, type = null) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            if(type == "path"){
                fetch(data)
                .then(response => response.text())
                .then(text => {
                    document.getElementById(this.rootElement).innerHTML = marked.parse(text);
                });
            }else{
                document.getElementById(this.rootElement).innerHTML = marked.parse(data);
            }
          },
          sendFile: (file) => {
            let element = this.rootElement
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
  
            let xhr = new XMLHttpRequest();
                  xhr.open('GET', file);
                  xhr.responseType = 'blob';
                  xhr.onload = function () {
                    if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
                      document.getElementById(element).innerHTML = `<img src="${file}" />`;
                    } else if (file.endsWith(".json") ) {
                      fetch(file)
                        .then(response => response.json())
                        .then(data => {
                          const jsonData = JSON.stringify(data);
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".js") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".css") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".html") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                      }else if (file.endsWith(".img") || file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".svg") || file.endsWith(".ico")) {
                        document.getElementById(element).innerHTML =    `
                        <img src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                      }else if(file.endsWith(".pdf")){
                        document.getElementById(element).innerHTML =    `
                        <embed src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                      }else if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg')) {
                        let video = document.createElement('video');
                        video.src = file;
                        video.controls = true;
                        document.getElementById(element).appendChild(video);
                      }else{
                        let audio = document.createElement('audio');
                        audio.src = file;
                        audio.controls = true;
                        document.getElementById(element).appendChild(audio);
                      }
                    let a = document.createElement('a');
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = file;
                    a.click();
                  };
                  xhr.send();
          }
  
        }
        if (!this.hashChangeListener) {
          this.hashChangeListener = () => {
            if (window.location.hash.substring(1).match(regex)) {
              const matches = window.location.hash.substring(1).match(regex);
              const params = {};
              for (let i = 0; i < paramNames.length; i++) {
                params[paramNames[i]] = matches[i + 1];
              }
  
              const req = {
                params: params,
                rootUrl: this.currentUrl,
                url: window.location.hash.substring(1),
              };
  
              const res = {
                json: (data) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  try {
                    const jsonData = JSON.stringify(data);
                    const html = `<pre>${jsonData}</pre>`;
                    document.getElementById(this.rootElement).innerHTML = html;
                    hooked = true;
                  } catch (e) {
                    throw new Error("Invalid JSON data");
                  }
                },
                setCookie: (name, value, options) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  let cookieString = `${name}=${value};`;
                  if (options) {
                    if (options.path) {
                      cookieString += `path=${options.path};`;
                    }
                    if (options.domain) {
                      cookieString += `domain=${options.domain};`;
                    }
                    if (options.maxAge) {
                      cookieString += `max-age=${options.maxAge};`;
                    }
                    if (options.httpOnly) {
                      cookieString += `httpOnly=${options.httpOnly};`;
                    }
                    if (options.secure) {
                      cookieString += `secure=${options.secure};`;
                    }
                    if (options.sameSite) {
                      cookieString += `sameSite=${options.sameSite};`;
                    }
                  }
                  document.cookie = cookieString;
  
                },
                ip: () => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  hooked = true;
                  return fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => {
              return data.ip;
            });
                },
                getCookie: (name) => {
                  const cookies = document.cookie.split(';');
                  for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    const cookieName = cookie.split('=')[0];
                    if (cookieName === name) {
                      const cookieValue = cookie.split('=')[1];
                      const cookieOptions = cookie.split(';').slice(1).map(option => {
                        const [key, value] = option.split('=').map(str => str.trim());
                        return { [key]: value };
                      }).reduce((acc, curr) => Object.assign(acc, curr), {});
                      return {
                        name: cookieName,
                        value: cookieValue
                      };
                    }
                  }
                  return null;
                },
                title: (title) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  document.title = title;
                  hooked = true;
                },
                saveState: () => {
                  if (hooked) {
                    throw new Error("State has already been saved cannot save again");
                  }
                  const route = window.location.hash.substring(1);
                  // save the current route in history
                  if (window.sessionStorage.getItem(route)) {
                    window.location.hash = window.sessionStorage.getItem(route);
                  } else {
                    window.sessionStorage.setItem(route, route);
                  }
                  hooked = true;
  
                },
                restoreState: () => {
                  if (hooked) {
                    throw new Error("State has already been restored cannot restore again");
                  }
                  // restore the current route in history
                  let route = window.location.hash.substring(1);
                  if (window.sessionStorage.getItem(route)) {
                    window.location.hash = window.sessionStorage.getItem(route);
                  } else {
                    window.location.hash = this.currentUrl;
                  }
                  hooked = true;
                },
                send: (data) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  document.getElementById(this.rootElement).innerHTML = data;
                  hooked = true;
                },
                jsx: (data) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                 
                  
                  window.React._render(data)(this.rootElement);
                  
                  hooked = true;
                },
                return: () => {
                  if (hooked) {
                    hooked = false;
                  }
                  if (this.hashChangeListener) {
                    window.removeEventListener("hashchange", this.hashChangeListener);
                    this.hashChangeListener = null;
                    console.log("removed last event listener")
                  }
                },
                sendStatus: (msg, code) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
        
                  if (typeof code === 'number') {
                    document.getElementById(this.rootElement).innerHTML =   JSON.stringify({msg, code});
                    hooked = true;
                  } else {
                    throw new Error("Invalid status code");
                  }
        
        
        
                },
                compress : async (data) => {
            
                  const promise = new Promise((resolve, reject) => {
                   import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
                     console.log("pako loaded");
                     const inputUint8Array = new TextEncoder().encode(data);
                     const compressedUint8Array = pako.gzip(inputUint8Array);
                     resolve(compressedUint8Array);
                    
                   });
                  
                    
                  });
                   return promise;
                 },
                 
                 // Decompress data using pako
                  decompress : async (data) => {
                   return new Promise((resolve, reject) => {
                     import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
                       const compressedUint8Array = new Uint8Array(data);
                       const decompressedUint8Array = pako.inflate(compressedUint8Array);
                       const result = new TextDecoder().decode(decompressedUint8Array);
                       resolve(result);
                     });
                 
                   });
                 },
                redirect: (url) => {
  
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  window.location.hash = url;
                  hooked = true;
  
                },
                markdown: (data, type = null) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  import('https://cdn.jsdelivr.net/npm/marked/marked.min.js').then(module => {
                    if(type == "path"){
                      fetch(data)
                      .then(response => response.text())
                      .then(text => {
                          document.getElementById(this.rootElement).innerHTML = marked.parse(text);
                      });
                  }else{
                      document.getElementById(this.rootElement).innerHTML = marked.parse(data);
                  }
                  });
                  
                },
                sendFile: (file) => {
                  let element = this.rootElement
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
  
                  let xhr = new XMLHttpRequest();
                  xhr.open('GET', file);
                  xhr.responseType = 'blob';
                  xhr.onload = function () {
                    if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
                      document.getElementById(element).innerHTML = `<img src="${file}" />`;
                    } else if (file.endsWith(".json") ) {
                      fetch(file)
                        .then(response => response.json())
                        .then(data => {
                          const jsonData = JSON.stringify(data);
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".js") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".css") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".html") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                      }else if (file.endsWith(".img") || file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".svg") || file.endsWith(".ico")) {
                        document.getElementById(element).innerHTML =    `
                        <img src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                      }else if(file.endsWith(".pdf")){
                        document.getElementById(element).innerHTML =    `
                        <embed src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                      }else if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg')) {
                        let video = document.createElement('video');
                        video.src = file;
                        video.controls = true;
                        document.getElementById(element).appendChild(video);
                      }else{
                        let audio = document.createElement('audio');
                        audio.src = file;
                        audio.controls = true;
                        document.getElementById(element).appendChild(audio);
                      }
                    let a = document.createElement('a');
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = file;
                    a.click();
                  };
                  xhr.send();
                }
  
              }
  
              callback(req, res);
            }
          };
  
          window.addEventListener("hashchange", this.hashChangeListener);
        }
  
        callback(req, res);
  
        return true;
      }
      console.log("Router is already initialized");
      return false;
    }
    error(callback) {
    let hooked = false;
     window.onhashchange = () => {
      if(!this.storedroutes.includes(window.location.hash.substring(1))){
         const res = {
            sendStatus: (msg, code) => {
              if(hooked) throw new Error("Cannot send file after headers have already been sent");
              if (typeof code === 'number') {
                document.getElementById(this.rootElement).innerHTML =   JSON.stringify({msg, code});
                hooked = true;
              } else {
                throw new Error("Invalid status code");
              }
            },
            send: (data) => {
              if(hooked) throw new Error("Cannot send file after headers have already been sent");
              document.getElementById(this.rootElement).innerHTML = data;
              hooked = true;
            },
            jsx: (data) => {
              if(hooked) throw new Error("Cannot send file after headers have already been sent");
              window.React._render(data)(this.rootElement);
              hooked = true;
            },
            sendFile: (file) => {
              if(hooked) throw new Error("Cannot send file after headers have already been sent");
              if(!file.endsWith('.html'))  throw new Error("Cannot send file that is not html");
              fetch(file)
                .then(response => response.text())
                .then(data => {
                  document.getElementById(this.rootElement).innerHTML = data;
                }
                )
                hooked = true;
              },

              return: () => {
                if (hooked) {
                  hooked = false;
                }
                if (this.hashChangeListener) {
                  window.removeEventListener("hashchange", this.hashChangeListener);
                  this.hashChangeListener = null;
                  console.log("removed last event listener")
                }
              },
             
            
              
         }
         callback(res)
        
      }
      
     }
     if(!this.storedroutes.includes(window.location.hash.substring(1))){
      callback()
    }

      
    }
    root(path, callback) {
      const paramNames = [];
      const queryNames = [];
      const currentPath = window.location.hash.substring(1);
      this.storedroutes.forEach(route => {
        route  == currentPath ? this.routes[route] = true  ? this.errorcheck = null :  this.errorcheck = true :  window.location.hash = path
        
      })
      const parsedPath = path.split('/').map(part => {
        if (part.startsWith(':')) {
          paramNames.push(part.substring(1));
          return '([^/]+)';
        }
        if (part.startsWith('*')) {
          paramNames.push(part.substring(1));
          return '(.*)';
        }
        if (part.startsWith('?')) {
          queryNames.push(part.substring(1));
          return '([^/]+)';
        }
        return part;
      }).join('/');
      const regex = new RegExp('^' + parsedPath + '(\\?(.*))?$');
  
      this.routes[path] = true;
  
      this.currentUrl = path;
  
      if (window.location.hash.substring(1).match(regex)) {
        const matches = window.location.hash.substring(1).match(regex);
        const params = {};
  
        for (let i = 0; i < paramNames.length; i++) {
          params[paramNames[i]] = matches[i + 1];
        }
        if (path.includes(":") && window.location.hash.substring(1).split("?")[1]) {
          console.error("Cannot use query params with path params", path, window.location.hash.substring(1).split("?")[1]);
          return false;
        }
        const query = {};
  
        const queryString = window.location.hash.substring(1).split('?')[1];
        if (queryString) {
          const queryParts = queryString.split('&');
          for (let i = 0; i < queryParts.length; i++) {
            const queryParam = queryParts[i].split('=');
            query[queryParam[0]] = queryParam[1];
          }
        }
        const req = {
          "params": params,
          "query": query,
          "url": window.location.hash.substring(1),
          "method": "ROOT_GET",
        }
  
  
  
  
        let hooked = false;
        const res = {
          json: (data) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            try {
              const jsonData = JSON.stringify(data);
              const html = `<pre>${jsonData}</pre>`;
              document.getElementById(this.rootElement).innerHTML = html;
              hooked = true;
            } catch (e) {
              throw new Error("Invalid JSON data");
            }
          },
           
          setCookie: (name, value, options) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            let cookieString = `${name}=${value};`;
            if (options) {
              if (options.path) {
                cookieString += `path=${options.path};`;
              }
              if (options.domain) {
                cookieString += `domain=${options.domain};`;
              }
              if (options.maxAge) {
                cookieString += `max-age=${options.maxAge};`;
              }
              if (options.httpOnly) {
                cookieString += `httpOnly=${options.httpOnly};`;
              }
              if (options.secure) {
                cookieString += `secure=${options.secure};`;
              }
              if (options.sameSite) {
                cookieString += `sameSite=${options.sameSite};`;
              }
            }
            document.cookie = cookieString;
  
          },
          getCookie: (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              const cookieName = cookie.split('=')[0];
              if (cookieName === name) {
                const cookieValue = cookie.split('=')[1];
                const cookieOptions = cookie.split(';').slice(1).map(option => {
                  const [key, value] = option.split('=').map(str => str.trim());
                  return { [key]: value };
                }).reduce((acc, curr) => Object.assign(acc, curr), {});
                return {
                  name: cookieName,
                  value: cookieValue
                };
              }
            }
            return null;
          },
  
  
          title: (title) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            document.title = title;
            hooked = true;
          },
          saveState: () => {
            if (hooked) {
              throw new Error("State has already been saved cannot save again");
            }
            const route = window.location.hash.substring(1);
            console.log(route);
            // save the current route in history
            if (window.sessionStorage.getItem(route)) {
              window.location.hash = window.sessionStorage.getItem(route);
              console.log(window.sessionStorage.getItem(route));
            } else {
              window.sessionStorage.setItem(route, route);
              console.log(window.sessionStorage.getItem(route));
            }
            hooked = true;
  
          },
          ip: () => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            hooked = true;
            return fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => {
      
              return data.ip;
            });
          },
          restoreState: () => {
            if (hooked) {
              throw new Error("State has already been restored cannot restore again");
            }
            // restore the current route in history
            let route = window.location.hash.substring(1);
            if (window.sessionStorage.getItem(route)) {
              window.location.hash = window.sessionStorage.getItem(route);
              console.log('restoring route', window.sessionStorage.getItem(route));
            } else {
              window.location.hash = this.currentUrl;
              console.log("no route found");
            }
            hooked = true;
          },
          send: (data) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            document.getElementById(this.rootElement).innerHTML = data;
            hooked = true;
          },
          jsx: (data) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
              
            window.React._render(data)(this.rootElement);
            hooked = true;
          },
          return: () => {
            if (hooked) {
              hooked = false;
            }
            if (this.hashChangeListener) {
              window.removeEventListener("hashchange", this.hashChangeListener);
              this.hashChangeListener = null;
              console.log("removed last event listener")
            }
          },
          sendStatus: (msg, code) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
  
            if (typeof code === 'number') {
              document.getElementById(this.rootElement).innerHTML =   JSON.stringify({msg, code});
              hooked = true;
            } else {
              throw new Error("Invalid status code");
            }
  
  
  
          },
          markdown: (data, type = null) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            import('https://cdn.jsdelivr.net/npm/marked/marked.min.js').then(module => {
              if(type == "path"){
                fetch(data)
                .then(response => response.text())
                .then(text => {
                    document.getElementById(this.rootElement).innerHTML = marked.parse(text);
                });
            }else{
                document.getElementById(this.rootElement).innerHTML = marked.parse(data);
            }
            });
            
          },
          redirect: (url) => {
  
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            window.location.hash = url;
            hooked = true;
  
          },
          compress : async (data) => {
            
           const promise = new Promise((resolve, reject) => {
            import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
              console.log("pako loaded");
              const inputUint8Array = new TextEncoder().encode(data);
              const compressedUint8Array = pako.gzip(inputUint8Array);
              resolve(compressedUint8Array);
             
            });
           
             
           });
            return promise;
          },
          
          // Decompress data using pako
           decompress : async (data) => {
            return new Promise((resolve, reject) => {
              import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
                const compressedUint8Array = new Uint8Array(data);
                const decompressedUint8Array = pako.inflate(compressedUint8Array);
                const result = new TextDecoder().decode(decompressedUint8Array);
                resolve(result);
              });
          
            });
          },
           
          sendFile: (file) => {
            let element = this.rootElement
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
  
            let xhr = new XMLHttpRequest();
                  xhr.open('GET', file);
                  xhr.responseType = 'blob';
                  xhr.onload = function () {
                    if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
                      document.getElementById(element).innerHTML = `<img src="${file}" />`;
                    } else if (file.endsWith(".json") ) {
                      fetch(file)
                        .then(response => response.json())
                        .then(data => {
                          const jsonData = JSON.stringify(data);
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".js") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".css") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".html") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                      }else if (file.endsWith(".img") || file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".svg") || file.endsWith(".ico")) {
                        document.getElementById(element).innerHTML =    `
                        <img src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                      }else if(file.endsWith(".pdf")){
                        document.getElementById(element).innerHTML =    `
                        <embed src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                      }else if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg')) {
                        let video = document.createElement('video');
                        video.src = file;
                        video.controls = true;
                        document.getElementById(element).appendChild(video);
                      }else{
                        let audio = document.createElement('audio');
                        audio.src = file;
                        audio.controls = true;
                        document.getElementById(element).appendChild(audio);
                      }
                    let a = document.createElement('a');
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = file;
                    a.click();
                  };
                  xhr.send();
          }
  
        }
        if (!this.hashChangeListener) {
          this.hashChangeListener = () => {
            if (window.location.hash.substring(1).match(regex)) {
              const matches = window.location.hash.substring(1).match(regex);
              const params = {};
              for (let i = 0; i < paramNames.length; i++) {
                params[paramNames[i]] = matches[i + 1];
              }
  
              const req = {
                params: params,
                rootUrl: this.currentUrl,
                url: window.location.hash.substring(1),
              };
  
              const res = {
                json: (data) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  try {
                    const jsonData = JSON.stringify(data);
                    const html = `<pre>${jsonData}</pre>`;
                    document.getElementById(this.rootElement).innerHTML = html;
                    hooked = true;
                  } catch (e) {
                    throw new Error("Invalid JSON data");
                  }
                },
                title: (title) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  document.title = title;
                  hooked = true;
                },
                saveState: () => {
                  if (hooked) {
                    throw new Error("State has already been saved cannot save again");
                  }
                  const route = window.location.hash.substring(1);
                  // save the current route in history
                  if (window.sessionStorage.getItem(route)) {
                    window.location.hash = window.sessionStorage.getItem(route);
                  } else {
                    window.sessionStorage.setItem(route, route);
                  }
                  hooked = true;
  
                },
                compress : async (data) => {
            
                  const promise = new Promise((resolve, reject) => {
                   import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
                     console.log("pako loaded");
                     const inputUint8Array = new TextEncoder().encode(data);
                     const compressedUint8Array = pako.gzip(inputUint8Array);
                     resolve(compressedUint8Array);
                    
                   });
                  
                    
                  });
                   return promise;
                 },
                 
                 // Decompress data using pako
                  decompress : async (data) => {
                   return new Promise((resolve, reject) => {
                     import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
                       const compressedUint8Array = new Uint8Array(data);
                       const decompressedUint8Array = pako.inflate(compressedUint8Array);
                       const result = new TextDecoder().decode(decompressedUint8Array);
                       resolve(result);
                     });
                 
                   });
                 },
                 markdown: (data, type = null) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  import('https://cdn.jsdelivr.net/npm/marked/marked.min.js').then(module => {
                    if(type == "path"){
                      fetch(data)
                      .then(response => response.text())
                      .then(text => {
                          document.getElementById(this.rootElement).innerHTML = marked.parse(text);
                      });
                  }else{
                      document.getElementById(this.rootElement).innerHTML = marked.parse(data);
                  }
                  });
                  
                },
                restoreState: () => {
                  if (hooked) {
                    throw new Error("State has already been restored cannot restore again");
                  }
                  // restore the current route in history
                  let route = window.location.hash.substring(1);
                  if (window.sessionStorage.getItem(route)) {
                    window.location.hash = window.sessionStorage.getItem(route);
                  } else {
                    window.location.hash = this.currentUrl;
                  }
                  hooked = true;
                },
                send: (data) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  document.getElementById(this.rootElement).innerHTML = data;
                  hooked = true;
                },
                jsx: (data) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                   
                  window.React._render(data)(this.rootElement);
                 
                  hooked = true;
                },
                return: () => {
                  if (hooked) {
                    hooked = false;
                  }
                  if (this.hashChangeListener) {
                    window.removeEventListener("hashchange", this.hashChangeListener);
                    this.hashChangeListener = null;
                    console.log("removed last event listener")
                  }
                },
                sendStatus: (msg, code) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
        
                  if (typeof code === 'number') {
                    document.getElementById(this.rootElement).innerHTML =   JSON.stringify({msg, code});
                    hooked = true;
                  } else {
                    throw new Error("Invalid status code");
                  }
        
        
        
                },
                redirect: (url) => {
  
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  window.location.hash = url;
                  hooked = true;
  
                },
                sendFile: (file) => {
                  let element = this.rootElement
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                  let xhr = new XMLHttpRequest();
                  xhr.open('GET', file);
                  xhr.responseType = 'blob';
                  xhr.onload = function () {
                    if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
                      document.getElementById(element).innerHTML = `<img src="${file}" />`;
                    } else if (file.endsWith(".json") ) {
                      fetch(file)
                        .then(response => response.json())
                        .then(data => {
                          const jsonData = JSON.stringify(data);
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".js") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".css") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                    }else if (file.endsWith(".html") ) {
                      fetch(file)
                        .then(response => response.text())
                        .then(data => {
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
                      }else if (file.endsWith(".img") || file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".svg") || file.endsWith(".ico")) {
                        document.getElementById(element).innerHTML =    `
                        <img src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                      }else if(file.endsWith(".pdf")){
                        document.getElementById(element).innerHTML =    `
                        <embed src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                      }else if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg')) {
                        let video = document.createElement('video');
                        video.src = file;
                        video.controls = true;
                        document.getElementById(element).appendChild(video);
                      }else{
                        let audio = document.createElement('audio');
                        audio.src = file;
                        audio.controls = true;
                        document.getElementById(element).appendChild(audio);
                      }
                    let a = document.createElement('a');
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = file;
                    a.click();
                  };
                  xhr.send();
                  hooked = true;
                 
                }
  
              }
  
              callback(req, res);
            }
          };
  
          window.addEventListener("hashchange", this.hashChangeListener);
        }
  
        callback(req, res);
  
        return true;
      }
  
      return false;
    }
    
    post(path, callback) {
      if (!this.routes[path]) {
        throw new Error(`No listener registered for route ${path}`);
      }
  
      let hooked = false;
      this.sendContent = null
      const res = {
        set: (name, value) => {
           let accepted = [
            "Accept",
            "Accept-Charset",
            "Accept-Encoding",
            "Accept-Language",
            "Accept-Datetime",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
            "Authorization",
            "Cache-Control",
            "Connection",
            "Cookie",
            "Content-Length",
            "Content-MD5",
            "Content-Type",
            "Date",
           ]
            if(!accepted.includes(name)){
              throw new Error({
                message: "Invalid header name",
                name: name,
                accepted_headers: accepted
              })
            }
            if (typeof value !== 'string') {
              throw new Error("Invalid header value");
            }
            this.headers[name] = value;
          

        },
        json: (data) => {
          if(this.headers["Content-Type"] == "application/json"){
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          try {
            const jsonData = JSON.stringify(data);
            this.sendContent = jsonData
            hooked = true;
          } catch (e) {
            throw new Error("Invalid JSON data");
          }
        }else{
          throw new Error("Content-Type header must be set to application/json")
        }
        },
        text: (data) => {
          if(this.headers["Content-Type"] == "text/plain"){
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          try {
            const textData = data;
           this.sendContent = textData
            hooked = true;
          } catch (e) {
            throw new Error("Invalid text data");
          }
        }
      },
      return: () => {
        if (hooked) {
          hooked = false;
        }
        if (this.hashChangeListener) {
          window.removeEventListener("hashchange", this.hashChangeListener);
          this.hashChangeListener = null;
          console.log("removed last event listener")
        }
      },

     }
      
    
      callback(res)
       
      const  message = {
        path: path,
        data: this.sendContent,
        headers: this.headers
      }
      window.postMessage(message, "*");
    }
    
     
     
  
    listen(path, callback) {
      if (this.listeners[path]) {
        throw new Error(`Listener already registered for route ${path}`);
      }
  
      const listener = (event) => {
        const messagePath = event.data.path;
        const data = event.data.data;
        const headers = event.data.headers;
  
        if (messagePath === path) {
           callback({
            "data": data,
            "headers": headers,
            "method": "POST"
           })
        }
      };
  
      window.addEventListener("message", listener);
      this.listeners[path] = listener;
    }
  
    stopListening(path) {
      const listener = this.listeners[path];
  
      if (listener) {
        window.removeEventListener("message", listener);
        delete this.listeners[path];
      }
    }
    use(path) {
      
      const paramNames = [];
      const queryNames = [];
      const parsedPath = path.split('/').map(part => {
        if (part.startsWith(':')) {
          paramNames.push(part.substring(1));
          return '([^/]+)';
        }
        if (part.startsWith('*')) {
          paramNames.push(part.substring(1));
          return '(.*)';
        }
        if (part.startsWith('?')) {
          queryNames.push(part.substring(1));
          return '([^/]+)';
        }
        return part;
      }
      ).join('/');
      const regex = new RegExp('^' + parsedPath + '(\\?(.*))?$');
       path = parsedPath;
      this.routes[path] = true;
      this.storedroutes.push(path);
    }
   
  
  
    bindRoot(element) {
      this.rootElement = element
    }
  
    onload(callback) {
      window.onload = () => {
       
        window.addEventListener("DOMContentLoaded", callback())
      }
    }
   
  
    on(path, callback) {
      window.addEventListener('hashchange', () => {
        const paramNames = [];
        const queryNames = [];
        const parsedPath = path.split('/').map(part => {
          if (part.startsWith(':')) {
            paramNames.push(part.substring(1));
            return '([^/]+)';
          }
          if (part.startsWith('*')) {
            paramNames.push(part.substring(1));
            return '(.*)';
          }
          if (part.startsWith('?')) {
            queryNames.push(part.substring(1));
            return '([^/]+)';
          }
          return part;
        }).join('/');
        const regex = new RegExp('^' + parsedPath + '(\\?(.*))?$');
  
        this.routes[path] = true;
  
        this.currentUrl = path;
  
        if (window.location.hash.substring(1).match(regex)) {
          this.storedroutes.push( window.location.hash.substring(1))
          this.routes[path] = true
          const matches = window.location.hash.substring(1).match(regex);
          const params = {};
  
          for (let i = 0; i < paramNames.length; i++) {
            params[paramNames[i]] = matches[i + 1];
          }
          if (path.includes(":") && window.location.hash.substring(1).split("?")[1]) {
            console.error("Cannot use query params with path params", path, window.location.hash.substring(1).split("?")[1]);
            return false;
          }
          const query = {};
  
          const queryString = window.location.hash.substring(1).split('?')[1];
          if (queryString) {
            const queryParts = queryString.split('&');
            for (let i = 0; i < queryParts.length; i++) {
              const queryParam = queryParts[i].split('=');
              query[queryParam[0]] = queryParam[1];
            }
          }
          const req = {
            "params": params,
            "query": query,
            "url": window.location.hash.substring(1),
            "method": "POST",
          }
  
  
          let hooked = false;
          const res = {
            json: (data) => {
              if (hooked) {
                throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
              }
              try {
                const jsonData = JSON.stringify(data);
                const html = `<pre>${jsonData}</pre>`;
                document.getElementById(this.rootElement).innerHTML = html;
                hooked = true;
              } catch (e) {
                throw new Error("Invalid JSON data");
              }
            },
            
            title: (title) => {
              if (hooked) {
                throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
              }
              document.title = title;
              hooked = true;
            },
            
            setCookie: (name, value, options) => {
              if (hooked) {
                throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
              }
              let cookieString = `${name}=${value};`;
              if (options) {
                if (options.path) {
                  cookieString += `path=${options.path};`;
                }
                if (options.domain) {
                  cookieString += `domain=${options.domain};`;
                }
                if (options.maxAge) {
                  cookieString += `max-age=${options.maxAge};`;
                }
                if (options.httpOnly) {
                  cookieString += `httpOnly=${options.httpOnly};`;
                }
                if (options.secure) {
                  cookieString += `secure=${options.secure};`;
                }
                if (options.sameSite) {
                  cookieString += `sameSite=${options.sameSite};`;
                }
              }
              document.cookie = cookieString;
  
            },
            getCookie: (name) => {
              const cookies = document.cookie.split(';');
              for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                const cookieName = cookie.split('=')[0];
                if (cookieName === name) {
                  const cookieValue = cookie.split('=')[1];
                  const cookieOptions = cookie.split(';').slice(1).map(option => {
                    const [key, value] = option.split('=').map(str => str.trim());
                    return { [key]: value };
                  }).reduce((acc, curr) => Object.assign(acc, curr), {});
                  return {
                    name: cookieName,
                    value: cookieValue
                  };
                }
              }
              return null;
            },
            saveState: () => {
              if (hooked) {
                throw new Error("State has already been saved cannot save again");
              }
              const route = window.location.hash.substring(1);
              // save the current route in history
              if (window.sessionStorage.getItem(route)) {
                window.location.hash = window.sessionStorage.getItem(route);
              } else {
                window.sessionStorage.setItem(route, route);
              }
              hooked = true;
  
            },
            restoreState: () => {
              if (hooked) {
                throw new Error("State has already been restored cannot restore again");
              }
              // restore the current route in history
              let route = window.location.hash.substring(1);
              if (window.sessionStorage.getItem(route)) {
                window.location.hash = window.sessionStorage.getItem(route);
              } else {
                window.location.hash = this.currentUrl;
              }
              hooked = true;
            },
            send: (data) => {
              if (hooked) {
                throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
              }
              document.getElementById(this.rootElement).innerHTML = data;
              hooked = true;
            },
            jsx: (data) => {
              if (hooked) {
                throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
              } 
                  window.React._render(data)(this.rootElement);
                
                  hooked = true;
            },
            return: () => {
              if (hooked) {
                hooked = false;
              }
              if (this.hashChangeListener) {
                window.removeEventListener("hashchange", this.hashChangeListener);
                this.hashChangeListener = null;
                console.log("removed last event listener")
              }
            },
            sendStatus: (msg, code) => {
              if (hooked) {
                throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
              }
    
              if (typeof code === 'number') {
                document.getElementById(this.rootElement).innerHTML =   JSON.stringify({msg, code});
                hooked = true;
              } else {
                throw new Error("Invalid status code");
              }
    
    
    
            },
            ip: () => {
              if (hooked) {
                throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
              }
              hooked = true;
              return fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => {
                return data.ip;
              });
            },
            redirect: (url) => {
  
              if (hooked) {
                throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
              }
              window.location.hash = url;
              hooked = true;
  
            },
            compress : async (data) => {
            
              const promise = new Promise((resolve, reject) => {
               import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
                 console.log("pako loaded");
                 const inputUint8Array = new TextEncoder().encode(data);
                 const compressedUint8Array = pako.gzip(inputUint8Array);
                 resolve(compressedUint8Array);
                
               });
              
                
              });
               return promise;
             },
             
             // Decompress data using pako
              decompress : async (data) => {
               return new Promise((resolve, reject) => {
                 import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
                   const compressedUint8Array = new Uint8Array(data);
                   const decompressedUint8Array = pako.inflate(compressedUint8Array);
                   const result = new TextDecoder().decode(decompressedUint8Array);
                   resolve(result);
                 });
             
               });
             },
              markdown: (data, type = null) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                import('https://cdn.jsdelivr.net/npm/marked/marked.min.js').then(module => {
                  if(type == "path"){
                    fetch(data)
                    .then(response => response.text())
                    .then(text => {
                        document.getElementById(this.rootElement).innerHTML = marked.parse(text);
                    });
                }else{
                    document.getElementById(this.rootElement).innerHTML = marked.parse(data);
                }
                });
                
              },
            sendFile: (file) => {
              let element = this.rootElement
              if (hooked) {
                throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
              }
  
              let xhr = new XMLHttpRequest();
              xhr.open('GET', file);
              xhr.responseType = 'blob';
              xhr.onload = function () {
                if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
                  document.getElementById(element).innerHTML = `<img src="${file}" />`;
                } else if (file.endsWith(".json") ) {
                  fetch(file)
                    .then(response => response.json())
                    .then(data => {
                      const jsonData = JSON.stringify(data);
                      const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                      document.getElementById(element).innerHTML = html;
                    })
                }else if (file.endsWith(".js") ) {
                  fetch(file)
                    .then(response => response.text())
                    .then(data => {
                      const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                      document.getElementById(element).innerHTML = html;
                    })
                }else if (file.endsWith(".css") ) {
                  fetch(file)
                    .then(response => response.text())
                    .then(data => {
                      const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                      document.getElementById(element).innerHTML = html;
                    })
                }else if (file.endsWith(".html") ) {
                  fetch(file)
                    .then(response => response.text())
                    .then(data => {
                      const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                      document.getElementById(element).innerHTML = html;
                    })
                  }else if (file.endsWith(".img") || file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".svg") || file.endsWith(".ico")) {
                    document.getElementById(element).innerHTML =    `
                    <img src="${file}" 
                    
                    style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                     
                    />
                    `
                  }else if(file.endsWith(".pdf")){
                    document.getElementById(element).innerHTML =    `
                    <embed src="${file}" 
                    
                    style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                     
                    />
                    `
                  }else if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg')) {
                    let video = document.createElement('video');
                    video.src = file;
                    video.controls = true;
                    document.getElementById(element).appendChild(video);
                  }else{
                    let audio = document.createElement('audio');
                    audio.src = file;
                    audio.controls = true;
                    document.getElementById(element).appendChild(audio);
                  }
                let a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response);
                a.download = file;
                a.click();
              };
              xhr.send();
            }
            
  
          }
          
  
          callback(req, res);
        }
      });
    }
  
    // Remove the current hash change event listener
  
  
 
  }
export  class   ReactRouter_v2 {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.eventListeners = {};
    this.init();
    this.rootElement = ''
  }

  init(element) {
    this.rootElement = document.querySelector(element)
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
     
    });
  }

  use(path, callback) {
    let el = this.rootElement
    let hooked  = false;

    const res = {
      send: (data) => {
        if (hooked) {
          throw new Error('Cannot send headers after they have already been sent use res.end() to send next response')
        }
        el.innerHTML = data;
        hooked = true;
      },
      end: () => {
        if (hooked) {
          hooked = false;
        }
        window.history.replaceState(null, null, window.location.pathname);
      },
      redirect: (path) => {
        if (hooked) {
          throw new Error('Cannot send headers after they have already been sent use res.end() to send next response')
        }
        window.history.pushState(null, null, path);
        this.handleRouteChange();
        hooked = true;
      },
      json: (data) => {
        if (hooked) {
          throw new Error('Cannot send headers after they have already been sent use res.end() to send next response')
        }
        const jsonData = JSON.stringify(data);
        el.innerHTML = `<pre>${jsonData}</pre>`;
        hooked = true;
      },
      sendStatus: (msg, code) => {
        if (hooked) {
          throw new Error('Cannot send headers after they have already been sent use res.end() to send next response')
        }
        if (typeof code === 'number') {
          el.innerHTML = JSON.stringify({ msg, code });
          hooked = true;
        } else {
          throw new Error('Invalid status code');
        }
      },
      render: (data) => {
        if (hooked) {
          throw new Error('Cannot send headers after they have already been sent use res.end() to send next response')
        }
        window.React._render(data)(el);
        hooked = true;
      }


    }
    const route = {
      path,
      callback,
      paramNames: []
    };

   

    // Extract parameter names from the path
    const pathSegments = path.split('/');
    pathSegments.forEach(segment => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1);
        route.paramNames.push(paramName);
      }
    });

    const req = {
      params: route.paramNames.reduce((acc, curr) => {
        acc[curr] = null;
        return acc;
      }, {}),
      query: {},
      url: window.location.pathname,
      method: 'GET'
    };
    callback(req, res);
    this.routes.push(route);
  }

  navigateTo(path) {
    window.history.pushState(null, null, path);
    this.handleRouteChange();
  }

  handleRouteChange() {
    const currentPath = window.location.pathname;
    const matchingRoute = this.matchRoute(currentPath);

    if (matchingRoute) {
      const { path, callback, paramNames } = matchingRoute;
      const params = this.extractParams(path, currentPath, paramNames);
      this.currentRoute = path;
      callback(params);
      this.triggerEvent('routeChange', path, params);
    } else {
      console.log('404: Route not found');
    }
  }

  on(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = new Set();
    }
    this.eventListeners[event].add(handler);
  }

  off(event, handler) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].delete(handler);
    }
  }

  triggerEvent(event, route, params) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(handler => {
        handler(route, params);
      });
    }
  }

  matchRoute(currentPath) {
    for (const route of this.routes) {
      const { path } = route;
      const regex = this.buildRegex(path);
      if (regex.test(currentPath)) {
        return route;
      }
    }
    return null;
  }

  buildRegex(path) {
    const paramNames = [];
    const pattern = path.replace(/:[a-zA-Z0-9]+/g, match => {
      const paramName = match.slice(1);
      paramNames.push(paramName);
      return '([^/]+)';
    });
    const regexString = `^${pattern}$`;
    return new RegExp(regexString);
  }

  extractParams(routePath, currentPath, paramNames) {
    const routeSegments = routePath.split('/');
    const currentSegments = currentPath.split('/');
    const params = {};

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      const currentSegment = currentSegments[i];

      if (routeSegment.startsWith(':')) {
        const paramName = routeSegment.slice(1);
        params[paramName] = currentSegment;
      }
    }

    return params;
  }
}


  

window.ReactRouter_v2 = ReactRouter_v2;
  
  
  window.ReactRouter = ReactRouter;
 
   
// Components.js


var totalSize = 0;
let cache = {}; // cache for require() callsa
 
window.getBundleSize = () => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  for(var i in cache){
    totalSize += cache[i].length
  }
  let documentsize = document.documentElement.innerHTML.length
  let size = totalSize + documentsize
  let l = 0, n = parseInt(size, 10) || 0;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return (`Bundle Size: ${n.toFixed(n >= 10 || l < 1 ? 0 : 1)} ${units[l]}`);
}

 

window.onload = () => {
     
   setTimeout(() => {
    if (document.querySelector("html").getAttribute("data-env") === "production") {
      
      document.querySelectorAll('script[src]').forEach(script => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = script.src;
        link.as = "script";
        document.head.appendChild(link);
      });
    
     
      // Lazy load images
      document.querySelectorAll('img[src]').forEach(img => {
        
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            const src = img.dataset.src;
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "image";
            link.href =  img.src
            document.head.appendChild(link);
            if (src) {
              img.src = src;
              img.removeAttribute('src');
              observer.disconnect();
               

            }
          }
        });
        observer.observe(img);
      });
    
       
      // Preload stylesheets
      document.querySelectorAll('link[rel="stylesheet"]').forEach(styleSheet => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = styleSheet.href;
        link.as = "style";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      });
   
    } else {
      console.warn("Not in production mode, skipping asset optimization.");
      console.log(getBundleSize())
    }
    
    }, 20); // wait 4 second before running
      
        
    
    
  
}

window.JsonWebToken = {
  sign: (payload, secret, exp = '2h') => {
    const expDate = new Date();
    expDate.setHours(expDate.getHours() + parseInt(exp));

    payload.exp = expDate.getTime();

    const encodedPayload = window.btoa(JSON.stringify(payload));
    const signature = window.btoa(secret);
    const token = `${encodedPayload}.${signature}`;
    
    localStorage.setItem('jwtToken', token); // Save the token to localStorage
    return token;
  },
  verify: (token, secret) => {
    const [encodedPayload, signature] = token.split('.');
    const decodedPayload = JSON.parse(window.atob(encodedPayload));
    const decodedSignature = window.atob(signature);

    if (decodedSignature === secret) {
      return decodedPayload;
    } else {
      throw new Error('Invalid token signature');
    }
  },
  decode: (token) => {
    const [encodedPayload] = token.split('.');
    const decodedPayload = JSON.parse(window.atob(encodedPayload));

    return decodedPayload;
  },
  get: () => {
    return localStorage.getItem('jwtToken');
  },
  remove: () => {
    localStorage.removeItem('jwtToken');
  }
};
  
window.router_path = null;

const useRouter = (entryFolder) => {
  const fetchAndRenderContent = (url) => {
    fetch(url)
      .then((res) => res.text())
      .then((content) => {
        // Render the content or perform other actions
        console.log(content);
      })
      .catch((error) => {
        console.error(`Failed to fetch content: ${error}`);
      });
  };

  const traverseFolder = (folderPath) => {
    const folderUrl = `${entryFolder}${folderPath}`;

    fetch(folderUrl)
      .then((res) => res.text())
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const links = doc.querySelectorAll('a');

        links.forEach((link) => {
          const subPath = link.getAttribute('href');
          const subFolderPath = `${folderPath}${subPath}`;

          if (subPath.endsWith('.md')) {
            const mdUrl = `${entryFolder}${subFolderPath}`;
            const hashRoute = `#/${subFolderPath}`;

            if (hashRoute === window.location.hash) {
              fetchAndRenderContent(mdUrl);
            }
          } else {
            traverseFolder(subFolderPath);
          }
        });
      });
  };

  traverseFolder('');
};



export const bcrypt = {
  hash: (password, saltRounds = 10) => {
    return new Promise((resolve, reject) => {
      if (typeof password !== 'string') { 
        reject(new Error('Password must be a string'));
      }
      if (typeof saltRounds !== 'number') {
        reject(new Error('Salt rounds must be a number'));
      }
      if (saltRounds < 10) {
        reject(new Error('Salt rounds must be >= 10'));
      }
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)).then((hash) => {
        resolve({
          hash: window.btoa(String.fromCharCode(...new Uint8Array(hash))),
          salt: window.btoa(String.fromCharCode(...salt)),
        });
      });
    });
  },
  compare: (password, hash, salt) => {
    return new Promise((resolve, reject) => {
      if (typeof password !== 'string') {
        reject(new Error('Password must be a string'));
      }
      if (typeof hash !== 'string') {
        reject(new Error('Hash must be a string'));
      }
      if (typeof salt !== 'string') {
        reject(new Error('Salt must be a string'));
      }
      window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)).then((newHash) => {
        const newHashString = window.btoa(String.fromCharCode(...new Uint8Array(newHash)));
        resolve(newHashString === hash);
      });
    });
  },
};
window.bcrypt = bcrypt;

window.useState = React.useState
window.useEffect = React.useEffect
window.useContext = React.useContext
window.useReducer = React.useReducer
window.useRef = React.useRef
window.useCallback = React.useCallback
window.lazy = React.lazy
window.forwardRef = React.forwardRef
window.createContext = React.createContext
window.startTransition  = React.startTransition
window.useSyncExternalStore = React.useSyncExternalStore
window.useMemo = React.useMemo
window.useLayoutEffect = React.useLayoutEffect
window.useInsertionEffect = React.useInsertionEffect
window.useImperativeHandle = React.useImperativeHandle
window.useId = React.useId
window.useDeferredValue = React.useDeferredValue
window.useTransition = React.useTransition
window.ReactRouter = ReactRouter
window.Lazy  = new React.lazy
window.React = React
window.ReactDOM = ReactDOM
window.ReactRouter = ReactRouter
window.JsonHandler = JsonHandler;
let root = null;
window.React._render = (component) => {
    
    return(container) => {
        const el = document.getElementById(container);
        if (!root) {
         
            root =  ReactDOM.createRoot(el); // createRoot(container!) if you use TypeScript
        }
         
        root.render(component);
      
    }
}
 
window.visiVersion = "1.7.6-stable"
 fetch('https://registry.npmjs.org/visi.js').then(res => res.json()).then(json => {
    if(json['dist-tags'].latest !== visiVersion){
       console.assert(false, `You are using an outdated version of Visi.js. Please update to ${json['dist-tags'].latest} by running npx visiapp@latest create <your_app_name>`, {
        current: visiVersion,
        latest: json['dist-tags'].latest,
       })
    }
 }).catch(err => {
    console.error("Failed to check for updates. Error: " + err)
 })
 
 
 
 

  // check if head has icon
  const head = document.getElementsByTagName('head')[0];
  if(!head.querySelector('link[rel="icon"]')){
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'https://github.com/Postr-Inc/visi.js/blob/main/assets/visilogo.png?raw=true';
    head.appendChild(link);
  }

  let mainhtmlel = document.querySelector("html");
let renderingtype = mainhtmlel.getAttribute("data-render");
window.CACHE_EXPIRATION_TIME = 3600000; // 1 hour
let CACHE_VERSION = localStorage.getItem('dispose_cache_version')  
window.CACHE_VERSION = CACHE_VERSION;

export const updateCacheVersion = (newVersion) => {
  if (window.localStorage) {
    const currentVersion = parseInt(localStorage.getItem('dispose_cache_version'));
    if (!isNaN(currentVersion) && newVersion > currentVersion) {
      console.log('Clearing cache...');
      // Clear the entire cache
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dispose_cache_')) {
          localStorage.removeItem(key);
        }
      }

      // Update the cache version
      localStorage.setItem('dispose_cache_version', newVersion.toString());
      window.CACHE_VERSION = newVersion;
      console.log('Cache cleared.');
    } else {
      console.log('Cache version is up to date');
    }
  }
};

window.updateCacheVersion = updateCacheVersion;
const workerFunction = () => {
  onmessage = (event) => {
    importScripts('https://unpkg.com/@babel/standalone/babel.min.js');
    const code = event.data;
    const compiledCode = Babel.transform(code, { presets: ['react', 'typescript'] }).code;
    postMessage({ type: 'code', data: compiledCode });
  };
};


const worker = new Worker(
  URL.createObjectURL(
    new Blob([`(${workerFunction.toString()})()`], {
      type: 'application/javascript',
    })
  )
);
 


export const dispose = (path, callback, props = {}) => {
  if (renderingtype === 'cfr' && window.localStorage) {
    const cachedCode = localStorage.getItem(path);
    if (cachedCode) {
      const { type, data, componentName, timestamp, version } = JSON.parse(cachedCode);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (currentTime - timestamp < window.CACHE_EXPIRATION_TIME && version === CACHE_VERSION) {
        if (type === 'tsx' || type === 'jsx') {
          const func = new Function('props', `
            return function() {
              ${data}
              return React.createElement(${componentName}, props)
            }
          `);
          const component = func(props);
          callback(component);
        } else if (type === 'ts') {
          const func = new Function(data);
          const component = func()(props);
          callback(component);
        }
        return;
      }
    }
  }

  

  const extension = path.split('.').pop();
  const presets = ['react'];

  fetch(path)
    .then((response) => response.text())
    .then((code) => {
      const componentName = path.split('/').pop().split('.')[0];
      let compiledCode;
      if (extension === 'ts') {
        compiledCode = `return (${code})`;
      } else {
        compiledCode = Babel.transform(code, { presets }).code;
        if (renderingtype == 'cfr' && window.localStorage) {
          const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
          const cacheData = { type: extension, data: compiledCode, componentName, timestamp: currentTime, version: CACHE_VERSION};
          localStorage.setItem(path, JSON.stringify(cacheData));
          console.log('Saved to cache');
        }
      }
      const cacheEntry = { type: extension, data: compiledCode, componentName };
      const func = new Function('props', `
        return function() {
          ${compiledCode}
          return React.createElement(${componentName}, props)
        }
      `);
      const component = func(props);
      callback(component);
      if (extension === 'ts') {
        cache[path] = cacheEntry;
        worker.postMessage(code);
      }
    });

  worker.onmessage = (event) => {
    const { type, data } = event.data;
    if (type === 'code') {
      cache[path] = { type: 'ts', data, componentName: cache[path].componentName };
    }
  };

}
   
 
  window.dispose = dispose;
  
 
 