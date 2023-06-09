window.onload = () => {
   let debugOn = document.querySelector("html").hasAttribute("debug");
   const head = document.getElementsByTagName('head')[0];
   if (!head.querySelector('link[rel="icon"]')) {
     const link = document.createElement('link');
     link.rel = 'icon';
     link.href = 'https://github.com/Postr-Inc/visi.js/blob/main/assets/visilogo.png?raw=true';
     head.appendChild(link);
   }
  if (!document.querySelector('html').hasAttribute('data-env')) {
    if (debugOn) {
      console.warn('⚠️ you are in development mode please set data-env="production" to enable production mode')
    }
  }
  let cache_names = ['lib_cache', 'pako_cache', 'dispose_cache', 'react_cache']
   
  

    
    let performanceObserver = new PerformanceObserver((list) => {
      const performanceEntries = [];
  
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          performanceEntries.push({ Metric: 'Contentful Paint', Value: `${entry.startTime} ms` });
        } else if (entry.entryType === 'layout-shift') {
          performanceEntries.push({ Metric: 'Layout Shift', Value: entry.value });
        } else if (entry.entryType === 'largest-contentful-paint') {
          performanceEntries.push({ Metric: 'Largest Contentful Paint', Value: `${entry.startTime} ms` });
  
        } else {
          performanceEntries.push({ Metric: entry.name, Value: `${entry.startTime} ms` });
        }
      }
      if (debug.enabled) {
        console.log('Performance metrics:');
        console.table(performanceEntries);
      }
    });
  
    performanceObserver.observe({ entryTypes: ['paint', 'layout-shift', 'largest-contentful-paint'] });
 
  
      if (document.querySelector("html").getAttribute("data-env") === "production") {
  
        document.querySelectorAll('script[src]').forEach(script => {
          const link = document.createElement("link");
          link.rel = "preload";
          link.href = script.src;
          link.as = "script";
          document.head.appendChild(link);
          if(debugOn){
            console.log(`[VISI] ${script.src} loaded`);
          }
        });
  
  
        // Lazy load images
        document.querySelectorAll('img[src]').forEach(img => {
  
          const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
              const src = img.dataset.src;
              const link = document.createElement("link");
              link.rel = "preload";
              link.as = "image";
              link.href = img.src
              document.head.appendChild(link);
              if (src) {
                img.src = src;
                img.removeAttribute('src');
                observer.disconnect();
               if(debugOn){
                console.log(`[VISI] ${img.src} loaded`);
               }
  
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
      
    }

    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
           
          caches.open(name) 
        });
      })
    }
    
   
 
  async function lib(path = null) {
    let promise = new Promise(async (resolve, reject) => {
      if (!path) throw new Error("[Library Manager]: No path provided");
  
      // Check if CFR is enabled
      const isCFREnabled = document.querySelector("html").getAttribute("data-render") === "cfr";
  
      // Open the cache
      const cache = await caches.open('lib_cache');
      const cachedResponse = await cache.match('lib_modules');
      const cached = cachedResponse ? await cachedResponse.json() : {};
      if (path.startsWith("@tailwind/daisyui")) {
        let version = path.split("/daisyui@")[1];
        console.log(version);
  
        if (isCFREnabled) {
          // Check if daisyui is in cache
          
  
          if (!cached.daisyui || cached.daisyuiVersion !== version) {
            let script = document.createElement('script');
            let link = document.createElement('link');
            document.body.style.display = "none";
            link.rel = "preload";
            link.as = "script";
            link.href = `https://cdn.tailwindcss.com`;
            script.src = `https://cdn.tailwindcss.com`;
            script.id = 'tailwindcss';
            let style = document.createElement('link');
            style.rel = "stylesheet";
            style.href = `https://cdn.jsdelivr.net/npm/daisyui@${version}/dist/full.css`;
            document.head.appendChild(style);
            document.head.appendChild(script);
            script.onload = () => {
              setTimeout(() => {
                document.body.style.display = "block";
              }, 20);
              document.head.removeChild(script);
            }
  
            fetch('https://cdn.jsdelivr.net/npm/visi.js@1.8.6-stable/modules/tailwind.min.js')
              .then(response => response.text())
              .then(data => {
                cached.tailwindcss = data;
                cached.tailwindcssVersion = version;
                cache.put('lib_modules', new Response(JSON.stringify(cached)));
                let script = document.createElement('script');
                script.innerHTML = data;
                document.head.appendChild(script);
              })
              .catch(error => {
                console.log(error);
              });
  
            fetch(`https://cdn.jsdelivr.net/npm/daisyui@${version}/dist/full.css`).then(
              res => res.text()
            ).then(
              data => {
                document.body.style.display = "none";
                cached.daisyui = data;
                cached.daisyuiVersion = version;
                cache.put('lib_modules', new Response(JSON.stringify(cached)));
                let style = document.createElement('style');
                style.innerHTML = data;
                document.head.appendChild(style);
                style.onload = () => {
                  setTimeout(() => {
                    document.body.style.display = "block";
                  }, 20);
                }

              }
            );
          } else {
            document.body.style.display = "none";
            let style = document.createElement('style');
            style.innerHTML = cached.daisyui;
            let script = document.createElement('script');
            script.innerHTML = cached.tailwindcss;
            document.body.style.display = "none";
            document.head.appendChild(script);
            document.head.appendChild(style);
            style.onload = () => {
              if (debug.enabled) {
                setTimeout(() => {
                  document.body.style.display = "block";
                }, 40);
              } else {
                document.body.style.display = "block";
              }
            }
            
          }
        }
      }else if(path.startsWith("@tailwind/core")){
         if(isCFREnabled){
           if(!cached.tailwindcss){
              let script = document.createElement('script');
              script.innerHTML = await fetch('https://cdn.jsdelivr.net/npm/visi.js@latest/modules/tailwind.min.js').then(res => res.text());
              document.head.appendChild(script);
              cached.tailwindcss = await fetch('https://cdn.jsdelivr.net/npm/visi.js@latest/modules/tailwind.min.js').then(res => res.text());
              cache.put('lib_modules', new Response(JSON.stringify(cached)));
           }else{
            
              let script = document.createElement('script');
              script.innerHTML = cached.tailwindcss;
              document.head.appendChild(script);
           }
         }else{
            document.body.style.display = "none";
            let script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/visi.js@latest/modules/tailwind.min.js'
            document.head.appendChild(script);
            script.onload = () => {
              setTimeout(() => {
                document.body.style.display = "block";
              }, 20);
            }


         }
      }else if(path.startsWith("@bootstrap")){
        let version = path.split("/bootstrap@")[1] || "latest"
        if(isCFREnabled){
          if(!cached.bootstrap || cached.bootstrapVersion !== version){
            let script = document.createElement('script');
            let style = document.createElement('style');
            script.innerHTML = await fetch(`https://cdn.jsdelivr.net/npm/bootstrap@${version}/dist/js/bootstrap.bundle.min.js`).then(res => res.text());
             
            style.innerHTML = await fetch(`https://cdn.jsdelivr.net/npm/bootstrap@${version}/dist/css/bootstrap.min.css`).then( res => {
              let data = res.text();
              console.log(data);
              return data;
            })
            document.head.appendChild(script);
            document.head.appendChild(style);
            cached.bootstrap =  {
              script: script.innerHTML,
              style: style.innerHTML
            }
            cached.bootstrapVersion = version;
            cache.put('lib_modules', new Response(JSON.stringify(cached)));
          }else{
            document.body.style.display = "none";
            let script = document.createElement('script');
            script.innerHTML = cached.bootstrap.script;
            let style = document.createElement('style');
            style.innerHTML = cached.bootstrap.style;
            document.head.appendChild(script);
            document.head.appendChild(style );
           style.onload = () => {
              setTimeout(() => {
                document.body.style.display = "block";
              }, 20);
            }

          }
        }else{
          document.body.style.display = "none";
          let script = document.createElement('script');
          script.src = `https://cdn.jsdelivr.net/npm/bootstrap@${version}/dist/js/bootstrap.bundle.min.js`;
          let style = document.createElement('link');
          style.rel = "stylesheet";
          style.href = `https://cdn.jsdelivr.net/npm/bootstrap@${version}/dist/css/bootstrap.min.css`;
          document.head.appendChild(style);
          document.head.appendChild(script);
          script.onload = () => {
            setTimeout(() => {
              document.body.style.display = "block";
            }, 20);
          }
        }
       
      }
  
      // Resolve the promise
      resolve();
    });
  
    return await promise;
  }
  
  
 
async function loadReactFromUnpkg(version) {
  let env = document.querySelector("html").getAttribute("data-env") || "development";

  try {
    const response = env === "development"
      ? await fetch(`https://unpkg.com/react@${version}/umd/react.development.js`)
      : await fetch(`https://unpkg.com/react@${version}/umd/react.production.min.js`);
    const reactScript = await response.text();

    const domResponse = env === "development"
      ? await fetch(`https://unpkg.com/react-dom@${version}/umd/react-dom.development.js`)
      : await fetch(`https://unpkg.com/react-dom@${version}/umd/react-dom.production.min.js`);
    const domScript = await domResponse.text();

    console.log(`[VISI] React version: ${version} loaded from unpkg`);

    const script = document.createElement("script");
    script.innerHTML = reactScript;
    document.head.appendChild(script);

    const domScriptElement = document.createElement("script");
    domScriptElement.innerHTML = domScript;
    document.head.appendChild(domScriptElement);

    const React_Cache = await getReactCache();
    React_Cache.push({ key: "react", version: version, data: reactScript });
    React_Cache.push({ key: "react-dom", version: version, data: domScript });
    await saveReactCache(React_Cache);

    window.ReactDOM = ReactDOM;
    window.React = React;
  } catch (error) {
    console.error("Failed to load React from unpkg:", error);
  }
}

async function clearReactCache() {
  try {
    if ('caches' in window) {
      await caches.delete('react_cache');
    }
  } catch (error) {
    console.error("Failed to clear React cache:", error);
  }
}

async function getReactCache() {
  try {
    if ('caches' in window) {
      const cache = await caches.open('react_cache');
      const response = await cache.match('react');
      const domResponse = await cache.match('react-dom');

      if (response && domResponse) {
        const reactScript = await response.text();
        const domScript = await domResponse.text();

        return [
          { key: 'react', data: reactScript },
          { key: 'react-dom', data: domScript }
        ];
      }
    }

    return [];
  } catch (error) {
    console.error("Failed to get React cache:", error);
    return [];
  }
}

async function saveReactCache(cache) {
  try {
    if ('caches' in window) {
      const cacheStorage = await caches.open('react_cache');
      await cacheStorage.put('react', new Response(cache[0].data));
      await cacheStorage.put('react-dom', new Response(cache[1].data));
    }
  } catch (error) {
    console.error("Failed to save React cache:", error);
  }
}

async function loadReact() {
  const debugOn = document.querySelector("html").hasAttribute("debug");
  const cfr = document.querySelector("html").getAttribute("data-render") === "cfr";
  const react_version = document.querySelector("html").getAttribute("data-react-version") || "18.2.0";

  if (debugOn) {
    console.log(`[VISI] React version: ${react_version} loaded`);
    console.log('[VISI] Environment:', document.querySelector("html").getAttribute("data-env") || 'production (default)');
  }

  if (cfr) {
    const latestVersionRes = await fetch("https://registry.npmjs.org/react");
    const latestVersionData = await latestVersionRes.json();
    const latestVersion = latestVersionData['dist-tags'].latest;

    if (react_version !== latestVersion) {
      await clearReactCache();
      await loadReactFromUnpkg(latestVersion);
    } else {
      if (debugOn) {
        console.log(`[VISI] React version: ${react_version} is up to date`);
      }
    }

    const version = "18.2.0" || document.querySelector("html").getAttribute("data-react-version");
    const React_Cache = await getReactCache();

    const react = React_Cache.find((item) => item.key === "react");
    const dom = React_Cache.find((item) => item.key === "react-dom");

    if (react && dom) {
      let script = document.createElement("script");
      script.innerHTML = react.data;
      document.head.appendChild(script);

      let domScriptElement = document.createElement("script");
      domScriptElement.innerHTML = dom.data;
      document.head.appendChild(domScriptElement);

      window.ReactDOM = ReactDOM;
      window.React = React;
    } else {
      await loadReactFromUnpkg(version);
    }
  }
}


async function loadPako() {
  const debugOn = document.querySelector("html").hasAttribute("debug");
  const cfr = document.querySelector("html").getAttribute("data-render") === "cfr";
  const pako_version =  "2.1.0";
  
  if (debugOn) {
    console.log(`[VISI] Pako version: ${pako_version} loaded`);
    console.log('[VISI] Environment:', document.querySelector("html").getAttribute("data-env") || 'production (default)' );
  }

  if (cfr) {
    const latestVersionRes = await fetch("https://registry.npmjs.org/pako");
    const latestVersionData = await latestVersionRes.json();
    const latestVersion = latestVersionData['dist-tags'].latest;

    if (pako_version !== latestVersion) {
      await clearPakoCache();
      await loadPakoFromUnpkg(latestVersion);
    } else {
      if (debugOn) {
        console.log(`[VISI] Pako version: ${pako_version} is up to date`);
      }
    }

    const version = "2.1.0" || document.querySelector("html").getAttribute("data-pako-version");
    const Pako_Cache = await getPakoCache();

    const pako = Pako_Cache.find((item) => item.key === "pako");

    if (pako) {
      let script = document.createElement("script");
      script.innerHTML = pako.data;
      document.head.appendChild(script);
    } else {
      await loadPakoFromUnpkg(version);
    }
  }
}

async function loadPakoFromUnpkg(version) {
  let env = document.querySelector("html").getAttribute("data-env") || "development";

  try {
    const response = env === "development"
      ? await fetch(`https://unpkg.com/pako@${version}/dist/pako.js`)
      : await fetch(`https://unpkg.com/pako@${version}/dist/pako.min.js`);

    const pakoScript = await response.text();
    const pakoCache = await getPakoCache();

    pakoCache.push({ key: "pako", version: version, data: pakoScript });
    await savePakoCache(pakoCache);

    let script = document.createElement("script");
    script.innerHTML = pakoScript;
    document.head.appendChild(script);
  } catch (error) {
    console.error("Failed to load Pako from unpkg:", error);
  }
}

async function clearPakoCache() {
  try {
    if ('caches' in window) {
      await caches.delete('pako_cache');
    }
  } catch (error) {
    console.error("Failed to clear Pako cache:", error);
  }
}

async function getPakoCache() {
  try {
    if ('caches' in window) {
      const cache = await caches.open('pako_cache');
      const response = await cache.match('pako');

      if (response) {
        const pakoScript = await response.text();
        return [{ key: 'pako', data: pakoScript }];
      }
    }

    return [];
  } catch (error) {
    console.error('Failed to get Pako cache:', error);
    return [];
  }
}

async function savePakoCache(cache) {
  try {
    if ('caches' in window) {
      const cacheStorage = await caches.open('pako_cache');
      await cacheStorage.put('pako', new Response(cache[0].data));
    }
  } catch (error) {
    console.error("Failed to save Pako cache:", error);
  }
}

 


await loadPako();
class Lazy {
  constructor(data) {
    this.data = data;
    this.subscribers = new Set();
    this.store = {};
    this.totalSize = 0;
  }

  map(fn) {
    const newData = this.data.map(fn);
    this.notifySubscribers('map', [fn]);
    return new Lazy(newData);
  }

  filter(fn) {
    const newData = this.data.filter(fn);
    this.notifySubscribers('filter', [fn]);
    return new Lazy(newData);
  }

  reduce(fn, initialValue) {
    const result = this.data.reduce(fn, initialValue);
    this.notifySubscribers('reduce', [fn, initialValue]);
    return result;
  }

  // ...other existing methods

  set(key, value) {
    const newData = this.data.map((item) => ({ ...item, [key]: value }));
    this.notifySubscribers('set', [key, value]);
    return new Lazy(newData);
  }

  unset(key) {
    const newData = this.data.map((item) => {
      const { [key]: deletedKey, ...rest } = item;
      return rest;
    });
    this.notifySubscribers('unset', [key]);
    return new Lazy(newData);
  }

  update(key, updater) {
    const newData = this.data.map((item) => {
      const updatedValue = updater(item[key]);
      return { ...item, [key]: updatedValue };
    });
    this.notifySubscribers('update', [key, updater]);
    return new Lazy(newData);
  }

  subscribe(subscriber) {
    this.subscribers.add(subscriber);
  }

  notifySubscribers(fnName, args) {
    const sizeInBytes = JSON.stringify(this.store).length;
    this.totalSize += sizeInBytes;

    this.subscribers.forEach((subscriber) => {
      subscriber({
        functionName: fnName,
        arguments: args,
        size: this.formatSize(this.totalSize),
      });
    });
  }

  formatSize(sizeInBytes) {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} bytes`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }
}
class JsonHandler {
  constructor() {
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
      if (debug.enabled) {
        debug.log([`
        Query failed: ${error.message}`], "error");
      }
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
      if (debug.enabled) {
        debug.log([`
        Query failed: ${error.message}`], "error");
      }
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

      if (debug.enabled) {
        debug.log([`
        Query with sharding: ${shardSessions}`], "log");
      }

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
    if (type == "local") {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    }
    else if (type == "server") {
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

    } else if (type == "store") {
      localStorage.setItem(filename, json);
    }

  }




  async reloadShards() {
    const shardResults = await Promise.all(this.shards.map((shard) => this.queryParallel(shard)));
    const results = shardResults.flat();
    return results;
  }
}

let debug = {
  enabled: document.querySelector('html').hasAttribute('debug'),
  log: (args, type) => {
    if (debug.enabled) {
      if (type === 'logs') {
        args = args[0].replace(/\s+/g, ' ').trim();
        console.log(args)
      } else if (type === 'warn') {
        console.warn(args)
      } else if (type === 'error') {
        args = args[0].replace(/\s+/g, ' ').trim();
        console.error(args)
      } else if (type === 'info') {
        args = args[0].replace(/\s+/g, ' ').trim();
        console.info(args)
      } else if (type === 'assert') {
        //  evenly spaced
        args[0] = args[0].replace(/\s+/g, ' ').trim();
        console.assert(false, args[0])
      }

    }
  },
  init: () => {
    if (debug.enabled) {
      debug.log(["Debug mode enabled"], "log");
    }
  },

}
debug.init();

export const SQLStore = {
  tables: {},

  run: function (query) {
    const queryParts = query.split(' ');
    const queryType = queryParts[0].toLowerCase();

    switch (queryType) {
      case 'create':
        this.createTable(queryParts[2], JSON.parse(queryParts[4]));
        break;
      case 'insert':
        this.insertRow(queryParts[2], JSON.parse(queryParts[4]));
        break;
      case 'remove':
        this.removeRow(queryParts[2], JSON.parse(queryParts[4]));
        break;
      case 'drop':
        this.removeTable(queryParts[2]);
        break;
      case 'select':
        return this.selectRows(queryParts[3], JSON.parse(queryParts[5]));
      default:

    }
  },
  driver: function (store) {
    if (!store || typeof store !== 'object') {
      console.assert(false, `SQLStore -> ${Date.now()}: Invalid store object.`);
      return;
    }

    this.store = store;
  },

  Table: function (tableName) {
    if (!this.tables[tableName]) {
      this.tables[tableName] = {
        name: tableName,
        schema: {},
        hooks: []
      };
    }
    return this.tables[tableName];
  },

  hook: function (tableName, callback) {
    const table = this.Table(tableName);
    table.hooks.push(callback);
  },

  createTable: function (tableName, schema) {
    const tableKey = `${tableName}_table`;
    if (!this.store.getItem(tableKey)) {
      this.store.setItem(tableKey, JSON.stringify(schema));
      console.log(`SQLStore: Table '${tableName}' created with schema:`, schema);
      this.triggerHooks(tableName, 'tableCreated', { schema });
    } else {
      console.assert(false, `SQLStore -> ${Date.now()} : Table '${tableName}' already exists.`);
    }
  },

  insertRow: function (tableName, rowData) {
    const tableKey = `${tableName}_table`;
    const schema = JSON.parse(this.store.getItem(tableKey));

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
        const tableData = JSON.parse(this.store.getItem(dataKey)) || [];
        tableData.push(row);
        this.store.setItem(dataKey, JSON.stringify(tableData));
        console.log(`SQLStore -> ${Date.now()}: Row inserted successfully into '${tableName}'.`);
        this.triggerHooks(tableName, 'rowInserted', { row });
      } else {
        console.error(`Failed to insert row into '${tableName}':`, errors);
      }
    } else {
      console.assert(false, `SQLStore -> ${Date.now()}: Table '${tableName}' does not exist.`);
    }
  },

  removeRow: function (tableName, conditions) {
    const tableKey = `${tableName}_table`;
    const schema = JSON.parse(this.store.getItem(tableKey));

    if (schema) {
      const dataKey = `${tableName}_data`;
      let tableData = JSON.parse(this.store.getItem(dataKey)) || [];

      const filteredData = tableData.filter(row => {
        for (let column in conditions) {
          if (row[column] !== conditions[column]) {
            return true;
          }
        }
        return false;
      });

      if (filteredData.length !== tableData.length) {
        this.store.setItem(dataKey, JSON.stringify(filteredData));
        console.log(`SQLStore -> ${Date.now()}: Removed row(s) from '${tableName}'.`);
        this.triggerHooks(tableName, 'rowRemoved', { conditions });
      } else {
        console.assert(false, `SQLStore -> ${Date.now()}: No matching rows found in '${tableName}'.`);
      }
    } else {
      console.assert(false, `SQLStore -> ${Date.now()}: Table '${tableName}' does not exist.`);
    }
  },

  removeTable: function (tableName) {
    const tableKey = `${tableName}_table`;
    if (this.store.getItem(tableKey)) {
      this.store.removeItem(tableKey);
      this.store.removeItem(`${tableName}_data`);
      delete this.tables[tableName];
      console.log(`SQLStore -> ${Date.now()}: Table '${tableName}' and associated data removed.`);
      this.triggerHooks(tableName, 'tableRemoved', {});
    } else {
      console.assert(false, `SQLStore -> ${Date.now()}: Table '${tableName}' does not exist.`);
    }
  },

  selectRows: function (tableName, conditions) {
    const tableKey = `${tableName}_table`;
    const schema = JSON.parse(this.store.getItem(tableKey));

    if (schema) {
      const dataKey = `${tableName}_data`;
      const tableData = JSON.parse(this.store.getItem(dataKey)) || [];

      const matchedRows = tableData.filter(row => {
        for (let column in conditions) {
          if (row[column] !== conditions[column]) {
            return false;
          }
        }
        return true;
      });

      console.log(`SQLStore -> ${Date.now()}: Selected ${matchedRows.length} rows from '${tableName}'.`);
      this.triggerHooks(tableName, 'rowsSelected', { rows: matchedRows });
    } else {
      console.assert(false, `SQLStore -> ${Date.now()}: Table '${tableName}' does not exist.`);
    }
  },

  viewSchema: function (tableName) {
    const tableKey = `${tableName}_table`;
    const schema = JSON.parse(this.store.getItem(tableKey));

    if (schema) {
      console.log(`SQLStore -> ${Date.now()}: Schema of table '${tableName}':`, schema);
    } else {
      console.assert(false, `SQLStore -> ${Date.now()}: Table '${tableName}' does not exist.`);
    }

    return schema;
  },

  updateRows: function (tableName, conditions, newData) {
    const tableKey = `${tableName}_table`;
    const schema = JSON.parse(this.store.getItem(tableKey));

    if (schema) {
      const dataKey = `${tableName}_data`;
      let tableData = JSON.parse(this.store.getItem(dataKey)) || [];

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
                console.assert(false, `SQLStore -> ${Date.now()}: Invalid value type for column '${column}'. Expected '${columnType}'.`);
              }
            } else {
              console.assert(false, `SQLStore -> ${Date.now()}: Column '${column}' does not exist in table '${tableName}'.`);
            }
          }
          updatedRows++;
        }

        return row;
      });

      if (updatedRows > 0) {
        this.store.setItem(dataKey, JSON.stringify(tableData));
        console.log(`SQLStore -> ${Date.now()}: Updated ${updatedRows} row(s) in '${tableName}'.`);
        this.triggerHooks(tableName, 'rowsUpdated', { conditions, newData });
      } else {
        console.assert(false, `SQLStore -> ${Date.now()}: No matching rows found in '${tableName}'.`);
      }
    } else {
      console.assert(false, `SQLStore -> ${Date.now()}: Table '${tableName}' does not exist.`);
    }
  },

  triggerHooks: function (tableName, event, payload) {
    const table = this.Table(tableName);
    table.hooks.forEach(callback => callback(event, payload));
  }
};
window.addEventListener('message', function (event) {
  let origin = event.origin || event.originalEvent.origin;
  if (origin !== window.location.origin) {
    return;
  }
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
            if (debug.enabled) {
              debug.log([`
              Read file: ${path}`], "log");
            }


            resolve(result);
          } else {
            if (debug.enabled) {
              debug.log([`
              File not found: ${path}`], "assert");
            }

            reject();
          }
        });
      } else {
        const content = localStorage.getItem(path);
        if (content) {
          if (debug.enabled) {
            debug.log([`
            Read file: ${path}`], "log");
          }
          resolve(content);
        } else {
          if (debug.enabled) {
            debug.log([`
            File not found: ${path}`], "assert");
          }

          reject();
        }
      }
    });
  },

  write: (path, content, compress = false) => {
    return new Promise((resolve, reject) => {
      const directoryPath = path.substring(0, path.lastIndexOf('/'));
      if (!fs.exists(directoryPath)) {
        if (debug.enabled) {
          debug.log([`
          FileSystem: Directory does not exist: ${directoryPath}`], "assert");
        }


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
          if (debug.enabled) {
            debug.log([`
            Write file: ${path}`], "log");
          }

          resolve();
        });
      } else {
        localStorage.setItem(path, content);
        localStorage.setItem(`__fs_watch_${path}`, Date.now()); // Set modified time
        if (debug.enabled) {
          debug.log([`
         FileSystem:  Write file: ${path}`], "log");
        }

        resolve();
      }
    });
  },

  exists: (path) => {
    return localStorage.getItem(path) !== null;
  },

  mkdir: (path) => {
    if (fs.exists(path)) {
      if (debug.enabled) {
        debug.log([`
        FileSystem: Directory  already exists: ${path}`], "assert");
      }

      return;
    }

    const directories = path.split('/').filter(directory => directory !== '');
    let currentPath = '/root';
    directories.forEach((directory) => {
      currentPath += `/${directory}`;
      if (!fs.exists(currentPath)) {
        localStorage.setItem(currentPath, '{}');
        if (debug.enabled) {
          debug.log([`
          FileSystem: Created directory: ${currentPath}`], "log");
        }

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
      if (debug.enabled) {
        debug.log([`
        FileSystem: Directory does not exist: ${directoryPath}`], "assert");
      }

      return;
    }

    const directories = path.split('/').filter(directory => directory !== '');
    let currentPath = '/root';
    directories.forEach((directory) => {
      currentPath += `/${directory}`;
      if (fs.exists(currentPath)) {
        localStorage.removeItem(currentPath);
        if (debug.enabled) {
          debug.log([`
          FileSystem: Removed directory: ${currentPath}`], "log");
        }

      }
    });
  },
  ls: (path) => {
    const directoryPath = path.substring(0, path.lastIndexOf('/'));
    if (!fs.exists(directoryPath)) {
      if (debug.enabled) {
        debug.log([`
        FileSystem: Directory does not exist: ${directoryPath}`], "assert");
      }

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
      if (debug.enabled) {
        debug.log([`
        File does not exist: ${source}`], "assert");
      }

      return;
    }

    const content = localStorage.getItem(source);
    localStorage.setItem(destination, content);
    if (debug.enabled) {
      debug.log([`
      Copied file: ${source} -> ${destination}`], "log");
    }

  },
  mv: (source, destination) => {
    if (!fs.exists(source)) {
      if (debug.enabled) {
        debug.log([`
        File does not exist: ${source}`], "assert");
      }

      return;
    }

    const content = localStorage.getItem(source);
    localStorage.setItem(destination, content);
    localStorage.removeItem(source);
    if (debug.enabled) {
      debug.log([`
      Moved file: ${source} -> ${destination}`], "log");
    }

  },
  cat: (path) => {
    if (!fs.exists(path)) {
      if (debug.enabled) {
        debug.log([`
        File does not exist: ${path}`], "assert");
      }

      return;
    }

    return localStorage.getItem(path);
  },
  pwd: () => {
    return '/root';
  },
  cd: (path) => {
    if (!fs.exists(path)) {
      if (debug.enabled) {
        debug.log([`
        FileSystem: Directory does not exist: ${directoryPath}`], "assert");
      }

      return;
    }

    localStorage.setItem('current_directory', path);
  },
  clear: () => {
    localStorage.clear();
  },
  size: (path) => {
    if (!fs.exists(path)) {
      if (debug.enabled) {
        debug.log([`
        File does not exist: ${path}`], "assert");
      }

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
      if (debug.enabled) {
        debug.log([`
        File does not exist: ${path}`], "assert");
      }

      return;
    }

    const content = localStorage.getItem(path);
    localStorage.setItem(newPath, content);
    localStorage.removeItem(path);
    if (debug.enabled) {
      debug.log([`
      Renamed file: ${path} -> ${newPath}`], "log");
    }

  },
  help: () => {
    return 'Available commands: ls, pwd, cd, cat, mkdir, rmrf, cp, mv, clear, help, watch, write, read, rename, exists';
  }

};

export class graphStore {
  constructor(tableName) {
    this.tableName = tableName;
  }

  createTable() {
    // Create a new table (cookie) with the given tableName
    // You can set any additional properties or metadata for the table as needed
    // For example, you can set an expiration date or other options for the cookie
    document.cookie = `${this.tableName}=; path=/`;
  }

  insertRow(rowKey, rowData) {
    // Insert a new row into the table (cookie) with the given rowKey and rowData
    // Serialize the rowData to a string or JSON format as per your requirement
    const tableData = this.getTableData();
    tableData[rowKey] = rowData;
    this.updateTableData(tableData);
  }

  getRow(rowKey) {
    // Retrieve a specific row from the table (cookie) based on the rowKey
    const tableData = this.getTableData();
    return tableData[rowKey];
  }

  getAllRows() {
    // Retrieve all rows from the table (cookie)
    return this.getTableData();
  }

  deleteRow(rowKey) {
    // Delete a specific row from the table (cookie) based on the rowKey
    const tableData = this.getTableData();
    delete tableData[rowKey];
    this.updateTableData(tableData);
  }

  deleteTable() {
    // Delete the entire table (cookie)
    document.cookie = `${this.tableName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  getTableData() {
    // Retrieve the data stored in the table (cookie) and parse it
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${this.tableName}=`))
      .split("=")[1];
    return cookieValue ? JSON.parse(cookieValue) : {};
  }

  updateTableData(tableData) {
    // Update the table (cookie) with the updated tableData
    document.cookie = `${this.tableName}=${JSON.stringify(tableData)}; path=/`;
  }
}



window.graphStore = graphStore;

window.fs = fs;

export const os = {
  cpus: () => {
    return  navigator.hardwareConcurrency + " Cores";
  },
  hostname: () => {
    return  window.location.hostname;
  },
  platform: () => {
    let plat = navigator.s
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
    let platform = navigator.userAgent

    if (platform === "Win64" || platform === "x86_64" || platform === "x64") {
      return "x64";
    } else if (platform === "Win32" || platform === "x86") {
      return "x32";
    } else {
      return "Unknown";
    }
  }

}
export const notifier = {
  subscribers: [],

  send: async (message, options) => {
    if (!("Notification" in window)) {
      if (debug.enabled) {
        console.error("[VISI NOTIFIER] This browser does not support desktop notification");
      }
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
        if (debug.enabled) {
          debug.log([`
          Notification permission denied.`], "assert");
        }
      }
    } catch (error) {
      if (debug.enabled) {
        debug.log([`
        Failed to request notification permission:${error}`], "assert");
      }
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
      if (debug.enabled) {
        debug.log([`
        Failed to send POST notification: ${error}`], "assert");
      }
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

window.notifier = notifier;

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
      onMessage: () => { },
      onDestroy: () => { },
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
      debug.log([`
      Container with ID '${id}' does not exist.`], "assert");
      return;
    }



    const callbackId = Math.random().toString(36).substring(7);
    container.callbacks[callbackId] = callback;
    container.worker.postMessage({ event: 'run', id, code, callbackId });
  },

  postMessage: (id, message) => {
    const container = containers[id];
    if (!container) {
      if (debug.enabled) {
        debug.log([`
        Container with ID '${id}' does not exist.`], "assert");
      }
      return;
    }

    container.worker.postMessage({ event: 'postMessage', id, message });
  },

  exit: (id) => {
    const container = containers[id];
    if (!container) {
      if (debug.enabled) {
        debug.log([`
        Container with ID '${id}' does not exist.`], "assert");
      }
      return;
    }

    container.worker.postMessage({ event: 'exit', id });
  },

  onMessage: (id, callback) => {
    const container = containers[id];
    if (!container) {
      if (debug.enabled) {
        debug.log([`
        Container with ID '${id}' does not exist.`], "assert");
      }
      return;
    }

    container.onMessage = callback;
  },

  onDestroy: (id, callback) => {
    const container = containers[id];
    if (!container) {
      if (debug.enabled) {
        debug.log([`
        Container with ID '${id}' does not exist.`], "assert");
      }
      return;
    }


  },
}
window.contained = contained;


 const libManager = {
  modules:  localStorage.getItem('lib_modules') || '{}',
  listModules: () => {
    let cache = JSON.parse(localStorage.getItem('lib_modules') || '{}');
    console.log(Object.keys(cache));

  },
  clearAll: () => {
    localStorage.removeItem('lib_modules');
  },
  clearModule: (module) => {
    let cache = JSON.parse(localStorage.getItem('lib_modules') || '{}');
    delete cache[module];
    localStorage.setItem('lib_modules', JSON.stringify(cache));
  },
}
window.libManager = libManager;

window.lib = lib;
export default { Lazy, JsonHandler, lib, libManager}

window.Lazy = Lazy;
window.JsonHandler = JsonHandler;

//  React Router

export class ReactRouter {
  constructor() {
    this.routes = {};
    this.currentUrl = ''
    this.store = {};
    this.rootElement = null;
    this.hashChangeListener = null;
    this.listeners = {}
    this.storedroutes = []
    this.errorcheck = null;
    this.headers = {}
    this.customerror = null;
    this.hooked = false;
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
      this.storedroutes.push(window.location.hash.substring(1))
      this.hooked = true;
      this.routes[path] = true
      const matches = window.location.hash.substring(1).match(regex);
      const params = {};

      for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = matches[i + 1];
      }
      if (path.includes(":") && window.location.hash.substring(1).split("?")[1]) {
        if (debug.enabled) {
          debug.log([`
            Cannot use query params with path params ${path} ${window.location.hash.substring(1).split("?")[1]}`], "assert");
        }

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
        setMeta: (name, content) => {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
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
            if (debug.enabled) {
              debug.log([`
                Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client`], "assert");
            }
          }
          document.title = title;
          hooked = true;
        },
        saveState: () => {
          if (hooked) {
            if (debug.enabled) {
              debug.log([`
                State has already been saved cannot save again`], "assert");
            }
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
            if (debug.enabled) {
              debug.log([`
                State has already been restored cannot restore again`], "assert");
            }
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
            if (debug.enabled) {
              debug.log([`
                Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client`], "assert");
            }
          }
          document.getElementById(this.rootElement).innerHTML = data;
          hooked = true;
        },
        jsx: (data) => {
          if (hooked) {
            if (debug.enabled) {
              debug.log([`
                Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client`], "assert");
            }
          }


          window.React._render(data)(this.rootElement);

          hooked = true;
        },
        compress: async (data) => {

          const promise = new Promise((resolve, reject) => {
            import("https://unpkg.com/pako@2.1.0/dist/pako.min.js").then(module => {
              if (debug.enabled) {
                debug.log([`
                Pako loaded`], "log");
              }

              const inputUint8Array = new TextEncoder().encode(data);
              const compressedUint8Array = pako.gzip(inputUint8Array);
              resolve(compressedUint8Array);

            });


          });
          return promise;
        },

        // Decompress data using pako
        decompress: async (data) => {
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
            if (debug.enabled) {
              debug.log([`
                Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client`], "assert");
            }
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
            if (debug.enabled) {
              debug.log([`
               ReactRouter: last listener removed`], "log");
            }

          }
        },
        sendStatus: (msg, code) => {
          if (hooked) {
            if (debug.enabled) {
              debug.log([`
                Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client`], "assert");
            }
          }

          if (typeof code === 'number') {
            document.getElementById(this.rootElement).innerHTML = JSON.stringify({ msg, code });
            hooked = true;
          } else {
            if (debug.enabled) {
              debug.log([`
                Invalid status code`], "assert");
            }
          }



        },
        redirect: (url) => {

          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          window.location.hash = url;
          hooked = true;

        },
        compress: async (data) => {
          const inputUint8Array = new TextEncoder().encode(data);
          const compressedUint8Array = pako.gzip(inputUint8Array);
          return compressedUint8Array;
        },

        // Decompress data using pako
        decompress: async (data) => {
          const compressedUint8Array = new Uint8Array(data);
          const decompressedUint8Array = pako.inflate(compressedUint8Array);
          const result = new TextDecoder().decode(decompressedUint8Array);
          return result;
        },
        markdown: (data, type = null) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          if (type == "path") {
            fetch(data)
              .then(response => response.text())
              .then(text => {
                document.getElementById(this.rootElement).innerHTML = marked.parse(text);
              });
          } else {
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
              document.getElementById(element).style = `
              position: fixed;
             top: 0;
            left: 0;
           width: 100%;
         height: 100%;
        background-color: black;
              
              `;
              document.getElementById(element).innerHTML = ` 
      <img src="${file}" style="resize: none; border: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"/>`
            } else if (file.endsWith(".json")) {
              fetch(file)
                .then(response => response.json())
                .then(data => {
                  const jsonData = JSON.stringify(data);
                  const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                  document.getElementById(element).innerHTML = html;
                })
            } else if (file.endsWith(".js")) {
              fetch(file)
                .then(response => response.text())
                .then(data => {
                  const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                  document.getElementById(element).innerHTML = html;
                })
            } else if (file.endsWith(".css")) {
              fetch(file)
                .then(response => response.text())
                .then(data => {
                  const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                  document.getElementById(element).innerHTML = html;
                })
            } else if (file.endsWith(".html")) {
              fetch(file)
                .then(response => response.text())
                .then(data => {
                  const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                  document.getElementById(element).innerHTML = html;
                })
            } else if (file.endsWith(".img") || file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".svg") || file.endsWith(".ico")) {
              document.getElementById(element).innerHTML = `
                        <img src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
            } else if (file.endsWith(".pdf")) {
              document.getElementById(element).innerHTML = `
                        <embed src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
            } else if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg')) {
              let video = document.createElement('video');
              video.src = file;
              video.controls = true;
              document.getElementById(element).appendChild(video);
            } else {
              let audio = document.createElement('audio');
              audio.src = file;
              audio.controls = true;
              document.getElementById(element).appendChild(audio);
            }

          };
          xhr.send();
        }

      }
    

      callback(req, res);

      return true;
    }
    

    this.hooked = false;
    return false;
  }
  error(callback) {
    let hooked = false;
    this.errorcheck = true;

    const handleHashChange = () => {
      if (!this.storedroutes.includes(window.location.hash.substring(1))) {
        const res = {
          sendStatus: (msg, code) => {
            this.customerror = true
            if (hooked) throw new Error("Cannot send file after headers have already been sent");
            if (typeof code === 'number') {
              document.getElementById(this.rootElement).innerHTML = JSON.stringify({ msg, code });
              hooked = true;
            } else {
              throw new Error("Invalid status code");
            }
          },
          send: (data) => {
            this.customerror = true;
            if (hooked) throw new Error("Cannot send file after headers have already been sent");
            document.getElementById(this.rootElement).innerHTML = data;
            hooked = true;
          },
          jsx: (data) => {
            this.customerror = true
            if (hooked) throw new Error("Cannot send file after headers have already been sent");
            window.React._render(data)(this.rootElement);
            hooked = true;
          },
          sendFile: (file) => {
            this.customerror = tru
            if (hooked) throw new Error("Cannot send file after headers have already been sent");
            if (!file.endsWith('.html')) throw new Error("Cannot send file that is not HTML");
            fetch(file)
              .then(response => response.text())
              .then(data => {
                document.getElementById(this.rootElement).innerHTML = data;
              });
            hooked = true;
          },
          return: () => {
            if (hooked) {
              hooked = false;
            }
            if (this.hashChangeListener) {
              window.removeEventListener("hashchange", this.hashChangeListener);
              this.hashChangeListener = null;
              console.log("removed last event listener");
            }
          }
        };

        if (this.customerror === null) {
          const el = React.createElement("code", null, `Cannot GET ${window.location.hash.substring(1)}`);
          React._render(el)(this.rootElement);
        } else {
          callback(res);
        }
      }
    };

    window.onhashchange = handleHashChange;

    const res = {
      sendStatus: (msg, code) => {
        this.customerror = true;
        if (hooked) throw new Error("Cannot send file after headers have already been sent");
        if (typeof code === 'number') {
          document.getElementById(this.rootElement).innerHTML = JSON.stringify({ msg, code });
          hooked = true;
        } else {
          throw new Error("Invalid status code");
        }
      },
      send: (data) => {
        this.customerror = true;
        if (hooked) throw new Error("Cannot send file after headers have already been sent");
        document.getElementById(this.rootElement).innerHTML = data;
        hooked = true;
      },
      jsx: (data) => {
        this.customerror = true;
        if (hooked) throw new Error("Cannot send file after headers have already been sent");
        window.React._render(data)(this.rootElement);
        hooked = true;
      },
      sendFile: (file) => {
        this.customerror = true;
        if (hooked) throw new Error("Cannot send file after headers have already been sent");
        if (!file.endsWith('.html')) throw new Error("Cannot send file that is not HTML");
        fetch(file)
          .then(response => response.text())
          .then(data => {
            document.getElementById(this.rootElement).innerHTML = data;
          });
        hooked = true;
      },
      return: () => {
        if (hooked) {
          hooked = false;
        }
        if (this.hashChangeListener) {
          window.removeEventListener("hashchange", this.hashChangeListener);
          this.hashChangeListener = null;
          console.log("removed last event listener");
        }
      }
    };

    if (!this.storedroutes.includes(window.location.hash.substring(1))) {
      if (!this.customerror) {
        document.getElementById(this.rootElement).innerHTML = `<code>Cannot GET ${window.location.hash.substring(1)}</code>`;
      } else {
        callback(res);
      }
    }
  }

  root(path, callback) {
    const paramNames = [];
    const queryNames = [];
    const currentPath = window.location.hash.substring(1);

    if (!this.hooked && !this.storedroutes.includes(currentPath)) {
      this.storedroutes.push(currentPath);
      window.location.hash = currentPath;
    }

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

    if (currentPath === '') {
      if (paramNames.length === 0) {
        window.location.hash = path;
      } else {
        const updatedPath = path.split('/').map(part => {
          if (part.startsWith(':')) {
            return '';
          }
          return part;
        }).join('/');
        window.location.hash = updatedPath;
      }
    } else {
      const match = currentPath.match(regex);
      if (match) {
        const params = {};
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        const updatedPath = path.split('/').map(part => {
          if (part.startsWith(':')) {
            return params[part.substring(1)];
          }
          return part;
        }).join('/');
        window.location.hash = updatedPath;
      }
    }

    this.routes[path] = true;

    this.currentUrl = path;

    if (window.location.hash.substring(1).match(regex)) {
      const matches = window.location.hash.substring(1).match(regex);
      const params = {};

      for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = matches[i + 1];
      }
      if (path.includes(":") && window.location.hash.substring(1).split("?")[1]) {
        if (debug.enabled) {
           console.error(`
           [ReactRouter]: Cannot use query params with path params ${path} ${window.location.hash.substring(1).split("?")[1]}
          `)
        }
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
            if (debug.enabled) {
               console.error(`
                [ReactRouter]: Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client
              `)
            }

          }
          try {
            const jsonData = JSON.stringify(data);
            const html = `<pre>${jsonData}</pre>`;
            document.getElementById(this.rootElement).innerHTML = html;
            hooked = true;
          } catch (e) {
            if (debug.enabled) {
                console.error(`
                  [ReactRouter]: Invalid JSON data
                `)
            }

          }
        },
        setMeta: (name, content) => {

          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        },
        setCookie: (name, value, options) => {
          if (hooked) {
            if (debug.enabled) {
                console.error(`
                  [ReactRouter]: Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client
                `)
            }
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
            if (debug.enabled) {
                console.error(`
                  [ReactRouter]: Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client
                `)
            }
          }
          document.title = title;
          hooked = true;
        },
        saveState: () => {
          if (hooked) {
            if (debug.enabled) {
              debug.log([`
                ReactRouter: State has already been saved cannot save again`], "assert");
            }
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
            if (debug.enabled) {
              debug.log([`
                ReactRouter: Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client`], "assert");
            }
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
            if (debug.enabled) {
              debug.log([`
                ReactRouter: Restored state`], "assert");
            }
          } else {
            window.location.hash = this.currentUrl;
            if (debug.enabled) {
              debug.log([`
                ReactRouter: no state was found`], "assert");
            }
          }
          hooked = true;
        },
        send: (data) => {
          if (hooked) {
            if (debug.enabled) {
              debug.log([`
                ReactRouter: Invalid JSON data`], "assert");
            }
          }
          document.getElementById(this.rootElement).innerHTML = data;
          hooked = true;
        },
        jsx: (data) => {
          if (hooked) {
            if (debug.enabled) {
              debug.log([`
                ReactRouter: Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client`], "assert");
            }
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
            if (debug.enabled) {
              debug.log([`
                ReactRouter: removed last event listener`], "assert");
            }
          }
        },
        sendStatus: (msg, code) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }

          if (typeof code === 'number') {
            document.getElementById(this.rootElement).innerHTML = JSON.stringify({ msg, code });
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
            if (type == "path") {
              fetch(data)
                .then(response => response.text())
                .then(text => {
                  document.getElementById(this.rootElement).innerHTML = marked.parse(text);
                });
            } else {
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
        compress: async (data) => {

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
        decompress: async (data) => {
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
              document.getElementById(element).style = `
                      position: fixed;
                     top: 0;
                    left: 0;
                   width: 100%;
                 height: 100%;
                background-color: black;
                      
                      `;
              document.getElementById(element).innerHTML = ` 
              <img src="${file}" style="resize: none; border: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"/>`
            } else if (file.endsWith(".json")) {
              fetch(file)
                .then(response => response.json())
                .then(data => {
                  const jsonData = JSON.stringify(data);
                  const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                  document.getElementById(element).innerHTML = html;
                })
            } else if (file.endsWith(".js")) {
              fetch(file)
                .then(response => response.text())
                .then(data => {
                  const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                  document.getElementById(element).innerHTML = html;
                })
            } else if (file.endsWith(".css")) {
              fetch(file)
                .then(response => response.text())
                .then(data => {
                  const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                  document.getElementById(element).innerHTML = html;
                })
            } else if (file.endsWith(".html")) {
              fetch(file)
                .then(response => response.text())
                .then(data => {
                  const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                  document.getElementById(element).innerHTML = html;
                })
            } else if (file.endsWith(".img") || file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".svg") || file.endsWith(".ico")) {
              document.getElementById(element).innerHTML = `
                        <img src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
            } else if (file.endsWith(".pdf")) {
              document.getElementById(element).innerHTML = `
                        <embed src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
            } else if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg')) {
              let video = document.createElement('video');
              video.src = file;
              video.controls = true;
              document.getElementById(element).appendChild(video);
            } else {
              let audio = document.createElement('audio');
              audio.src = file;
              audio.controls = true;
              document.getElementById(element).appendChild(audio);
            }

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
              compress: async (data) => {

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
              decompress: async (data) => {
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
                  if (type == "path") {
                    fetch(data)
                      .then(response => response.text())
                      .then(text => {
                        document.getElementById(this.rootElement).innerHTML = marked.parse(text);
                      });
                  } else {
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
                  document.getElementById(this.rootElement).innerHTML = JSON.stringify({ msg, code });
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
                    document.getElementById(element).style = `
                    position: fixed;
                   top: 0;
                  left: 0;
                 width: 100%;
               height: 100%;
              background-color: black;
                    
                    `;
                    document.getElementById(element).innerHTML = ` 
            <img src="${file}" style="resize: none; border: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"/>`
                  } else if (file.endsWith(".json")) {
                    fetch(file)
                      .then(response => response.json())
                      .then(data => {
                        const jsonData = JSON.stringify(data);
                        const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                        document.getElementById(element).innerHTML = html;
                      })
                  } else if (file.endsWith(".js")) {
                    fetch(file)
                      .then(response => response.text())
                      .then(data => {
                        const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                        document.getElementById(element).innerHTML = html;
                      })
                  } else if (file.endsWith(".css")) {
                    fetch(file)
                      .then(response => response.text())
                      .then(data => {
                        const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                        document.getElementById(element).innerHTML = html;
                      })
                  } else if (file.endsWith(".html")) {
                    fetch(file)
                      .then(response => response.text())
                      .then(data => {
                        const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                        document.getElementById(element).innerHTML = html;
                      })
                  } else if (file.endsWith(".img") || file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".svg") || file.endsWith(".ico")) {
                    document.getElementById(element).innerHTML = `
                        <img src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                  } else if (file.endsWith(".pdf")) {
                    document.getElementById(element).innerHTML = `
                        <embed src="${file}" 
                        
                        style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                         
                        />
                        `
                  } else if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg')) {
                    let video = document.createElement('video');
                    video.src = file;
                    video.controls = true;
                    document.getElementById(element).appendChild(video);
                  } else {
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
        if (!accepted.includes(name)) {
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
        if (this.headers["Content-Type"] == "application/json") {
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
        } else {
          throw new Error("Content-Type header must be set to application/json")
        }
      },
      jsonp: (data) => {
        if (this.headers["Content-Type"] == "application/json") {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          try {
            const jsonData = JSON.stringify(data);
            this.sendContent = `callback(${jsonData})`
            hooked = true;
          } catch (e) {
            throw new Error("Invalid JSON data");
          }
        } else {
          throw new Error("Content-Type header must be set to application/json")
        }

      },

      text: (data) => {
        if (this.headers["Content-Type"] == "text/plain") {
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

    const message = {
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
        this.storedroutes.push(window.location.hash.substring(1))
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
              document.getElementById(this.rootElement).innerHTML = JSON.stringify({ msg, code });
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
          compress: async (data) => {

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
          decompress: async (data) => {
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
              if (type == "path") {
                fetch(data)
                  .then(response => response.text())
                  .then(text => {
                    document.getElementById(this.rootElement).innerHTML = marked.parse(text);
                  });
              } else {
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
                document.getElementById(element).style = `
                position: fixed;
               top: 0;
              left: 0;
             width: 100%;
           height: 100%;
          background-color: black;
                
                `;
                document.getElementById(element).innerHTML = ` 
        <img src="${file}" style="resize: none; border: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"/>`
              } else if (file.endsWith(".json")) {
                fetch(file)
                  .then(response => response.json())
                  .then(data => {
                    const jsonData = JSON.stringify(data);
                    const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                    document.getElementById(element).innerHTML = html;
                  })
              } else if (file.endsWith(".js")) {
                fetch(file)
                  .then(response => response.text())
                  .then(data => {
                    const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                    document.getElementById(element).innerHTML = html;
                  })
              } else if (file.endsWith(".css")) {
                fetch(file)
                  .then(response => response.text())
                  .then(data => {
                    const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                    document.getElementById(element).innerHTML = html;
                  })
              } else if (file.endsWith(".html")) {
                fetch(file)
                  .then(response => response.text())
                  .then(data => {
                    const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${data}</textarea>`
                    document.getElementById(element).innerHTML = html;
                  })
              } else if (file.endsWith(".img") || file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".svg") || file.endsWith(".ico")) {
                document.getElementById(element).innerHTML = `
                    <img src="${file}" 
                    
                    style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                     
                    />
                    `
              } else if (file.endsWith(".pdf")) {
                document.getElementById(element).innerHTML = `
                    <embed src="${file}" 
                    
                    style="width:100%;height:100%; resize:none; border:none; position:absolute; top:0; left:0;"
                     
                    />
                    `
              } else if (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg')) {
                let video = document.createElement('video');
                video.src = file;
                video.controls = true;
                document.getElementById(element).appendChild(video);
              } else {
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
class Middleware {
  constructor() {
    this.middlewareFunctions = [];
  }

  use(callback) {
    this.middlewareFunctions.push(callback);
  }

  execute(req, res, callback) {
    let index = 0;

    const next = () => {
      if (index < this.middlewareFunctions.length) {
        const middleware = this.middlewareFunctions[index];
        index++;
        middleware(req, res, next);
      } else {
        callback();
      }
    };

    next();
  }
}
export class ReactRouter_v2 {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.eventListeners = {};
    this.init();
    this.rootElement = '';
    this.middleware = new Middleware();
  }

  init(element) {
    this.rootElement = document.querySelector(element);
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  use(path, callback) {
    let el = this.rootElement;
    let hooked = false;

    const res = {
      send: (data) => {
        if (hooked) {
          throw new Error(
            'Cannot send headers after they have already been sent. Use res.end() to send the next response.'
          );
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
      redirect: (path, queryParams) => {
        if (hooked) {
          throw new Error(
            'Cannot send headers after they have already been sent. Use res.end() to send the next response.'
          );
        }
        window.history.pushState(
          null,
          null,
          this.buildPathWithQueryParams(path, queryParams)
        );
        this.handleRouteChange();
        hooked = true;
      },
      json: (data) => {
        if (hooked) {
          throw new Error(
            'Cannot send headers after they have already been sent. Use res.end() to send the next response.'
          );
        }
        const jsonData = JSON.stringify(data);
        el.innerHTML = `<pre>${jsonData}</pre>`;
        hooked = true;
      },
      sendStatus: (msg, code) => {
        if (hooked) {
          throw new Error(
            'Cannot send headers after they have already been sent. Use res.end() to send the next response.'
          );
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
          throw new Error(
            'Cannot send headers after they have already been sent. Use res.end() to send the next response.'
          );
        }
        window.React._render(data)(el);
        hooked = true;
      },
    };

    const route = {
      path,
      callback,
      paramNames: [],
      queryNames: [],
    };

    // Extract parameter names and query names from the path
    const pathSegments = path.split('/');
    pathSegments.forEach((segment) => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1);
        route.paramNames.push(paramName);
      } else if (segment.startsWith('?')) {
        const queryNames = segment.substring(1).split('&');
        route.queryNames.push(queryNames);
      } else {
        route.queryNames.push(null);
      }
    });

    const req = {
      params: route.paramNames.reduce((acc, curr) => {
        acc[curr] = null;
        return acc;
      }, {}),
      query: {},
      url: window.location.pathname,
      method: 'GET',
    };

    callback(req, res);

    this.routes.push(route);
  }


  navigateTo(path, queryParams) {
    window.history.pushState(
      null,
      null,
      this.buildPathWithQueryParams(path, queryParams)
    );
    this.handleRouteChange();
  }

  handleRouteChange() {
    const currentPath = window.location.pathname;
    const matchingRoute = this.matchRoute(currentPath);

    if (matchingRoute) {
      const { path, middleware, callback, paramNames, queryNames } = matchingRoute;

      // Extract query parameters from the current path
      const currentQuery = window.location.search.substring(1);
      const queryParams = {};
      if (currentQuery) {
        currentQuery.split('&').forEach((param) => {
          const [key, value] = param.split('=');
          queryParams[key] = decodeURIComponent(value);
        });
      }

      const params = this.extractParams(path, currentPath, paramNames);
      this.currentRoute = path;

      const req = {
        params,
        query: queryParams,
        url: window.location.pathname,
        method: 'GET',
      };

      this.middleware.execute(req, {}, () => {
        callback(req, {});
      });

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
      this.eventListeners[event].forEach((handler) => {
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
    const pattern = path.replace(/:[a-zA-Z0-9]+/g, (match) => {
      const paramName = match.slice(1);
      paramNames.push(paramName);
      return '([^/]+)';
    });
    const queryNames = [];
    const queryPattern = path.replace(/\?[a-zA-Z0-9]+/g, (match) => {
      const queryName = match.slice(1);
      queryNames.push(queryName);
      return '([^/]+)';
    });
    return new RegExp(`^${pattern}(\\?(.*))?$`);

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


  buildPathWithQueryParams(path, queryParams) {
    const query = new URLSearchParams(queryParams).toString();
    if (query) {
      return `${path}?${query}`;
    } else {
      return path;
    }
  }


}
window.ReactRouter_v2 = ReactRouter_v2;
window.ReactRouter = ReactRouter;

export const JsonWebToken = {
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
window.jsonwebtoken = JsonWebToken;
window.router_path = null;
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
let root = null;

window.visiVersion = "1.9.1-stable"
fetch('https://registry.npmjs.org/visi.js').then(res => res.json()).then(json => {
  if (json['dist-tags'].latest !== visiVersion && debug.enabled) {
    console.warn(`You are using an outdated version of Visi.js. Please update to ${json['dist-tags'].latest} by running npx visiapp@latest create <your_app_name>`, {
      current: visiVersion,
      latest: json['dist-tags'].latest,
    })
  }
}).catch(err => {
  console.error("Failed to check for updates. Error: " + err)
})
 

let mainhtmlel = document.querySelector("html");
let renderingtype = mainhtmlel.getAttribute("data-render");
const CACHE_NAME = 'dispose_cache';
const CACHE_EXPIRATION_TIME = 3600000; // 1 hour

let cacheVersion = parseInt(localStorage.getItem('dispose_cache_version')) || 0;

const clearCache = async () => {
  if (debug.enabled) {
    console.log('Clearing cache...');
  }
  const cacheNames = await caches.keys();
  for (const name of cacheNames) {
    if (name === CACHE_NAME) {
      await caches.delete(name);
      if (debug.enabled) {
        console.log('Cache cleared');
      }
    }
  }
};

const updateCacheVersion = (newVersion) => {
  if (newVersion > cacheVersion) {
    clearCache();
    localStorage.setItem('dispose_cache_version', newVersion.toString());
    cacheVersion = newVersion;
  }
};
window.updateCacheVersion = updateCacheVersion;

const tsWorkerFunction = () => {
  onmessage = (event) => {
    importScripts('https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js');
    const { code, filename } = event.data;
    const compiledCode = Babel.transform(code, { presets: ['react', 'typescript'], filename: filename }).code;
    postMessage({ type: 'code', data: compiledCode, start: Date.now(), filename });
  };
};

const tsworker = new Worker(
  URL.createObjectURL(
    new Blob([`(${tsWorkerFunction.toString()})()`], {
      type: 'application/javascript',
    })
  )
);

const EXPORTS_STORAGE_KEY = 'exportsData';

const include = (filename) => {
  return new Promise((resolve, reject) => {
    fetch(filename)
      .then((response) => response.text())
      .then((code) => {
        tsworker.onmessage = (event) => {
          const { type, data, filename, start } = event.data;
          if (type === 'code') {
            const script = document.createElement('script');
            script.innerHTML = data;
            script.type = 'module';
            document.head.appendChild(script);

            // Delay resolving the promise to ensure the module is fully loaded
            setTimeout(() => resolve(filename), 0);
            if (debug.enabled) {
              console.log({
                filename,
                message: `Compiled in ${Date.now() - start}ms`,
              });
            }
          }
        };
        tsworker.postMessage({ code, filename });
      })
      .catch(reject);
  });
};

const initializeExports = () => {
  window.exports = JSON.parse(localStorage.getItem(EXPORTS_STORAGE_KEY)) || [];
};

const _export = (exports, filename) => {
  initializeExports();

  window.postMessage({ type: 'export', data: { filename, exports } }, '*');
};

const compile = (filename) => {
  include(filename);
};

const require = (filename) => {
  compile(filename);
  const data = new Promise((resolve, reject) => {
    window.onmessage = (event) => {
      if (event.data.type === 'export') {
        const { exports } = event.data.data;

        resolve(exports);
      }
    };
  });

  return data.then((exports) => {
    return exports;
  });
};

window.addEventListener('beforeunload', () => {
  window.onmessage = (event, origin) => {
    if(origin !== window.location.origin) return;
    if (event.data.type === 'dispose') {
      clearCache();
    }
  };
});

window._export = _export;
window.require = require;
export { _export, require };

const workerFunction = () => {
  onmessage =  (event) => {
     
    importScripts('https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js');

    const { code } = event.data;
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

const dispose = async (path, callback, props = {}) => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(path);
  
  if (renderingtype === 'cfr' && cachedResponse) {
    const compressedCode = await cachedResponse.blob();
    const arrayBuffer = await new Response(compressedCode).arrayBuffer();
    const decompressedCode = pako.ungzip(new Uint8Array(arrayBuffer), { to: 'string' });
    const { type, data, componentName, timestamp, version, start } = JSON.parse(decompressedCode);
    
     

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (currentTime - timestamp < CACHE_EXPIRATION_TIME && version === cacheVersion) {
      if (type === 'tsx' || type === 'jsx') {
        const func = new Function('props', `
          return function() {
            ${data}
            return React.createElement(${componentName}, props)
          }
        `);
        if (debug.enabled) {
          console.log('Component from ' + path + ' loaded from cache' + ' in ' + (Date.now() - start) + 'ms');
        }
        const component = func(props);
        callback(component);
      }
      return;
    }
  }

  const extension = path.split('.').pop();
  const presets = ['react'];

  fetch(path)
    .then((response) => response.text())
    .then((code) => {
      
      const componentName = path.split('/').pop().split('.')[0];
      let compiledCode;

      compiledCode = Babel.transform(code, { presets }).code;

      if (renderingtype === 'cfr' && cache) {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        let start = Date.now();
        const cacheData = {
          type: extension,
          data: compiledCode,
          componentName,
          timestamp: currentTime,
          version: cacheVersion,
          start:   Date.now()
        };
        const compressedData = pako.gzip(JSON.stringify(cacheData));
        cache.put(path, new Response(compressedData));

        if (debug.enabled) {
          console.log('Cache updated');
        }
      }

      const func = new Function('props', `
        return function() {
          ${compiledCode}
          return React.createElement(${componentName}, props)
        }
      `);

      
      const component = func(props);
      callback(component);
    });

  worker.onmessage = (event) => {
    const { type, data } = event.data;
    if (type === 'code') {
       cache.put(path, new Response( pako.gzip(data)));
    }
  };
};

window.dispose = dispose;

export { dispose, updateCacheVersion };

await loadReact();
window.ReactDOM = ReactDOM
window.useState = React.useState
window.useEffect = React.useEffect
window.useContext = React.useContext
window.useReducer = React.useReducer
window.useRef = React.useRef
window.useCallback = React.useCallback
window.lazy = React.lazy
window.forwardRef = React.forwardRef
window.createContext = React.createContext
window.startTransition = React.startTransition
window.useSyncExternalStore = React.useSyncExternalStore
window.useMemo = React.useMemo
window.useLayoutEffect = React.useLayoutEffect
window.useInsertionEffect = React.useInsertionEffect
window.useImperativeHandle = React.useImperativeHandle
window.useId = React.useId
window.useDeferredValue = React.useDeferredValue
window.useTransition = React.useTransition
window.React = React
window.React._render = (component) => {

  return (container) => {
    const el = document.getElementById(container);
    if (!root) {

      root = ReactDOM.createRoot(el);  
    }

    root.render(component);

  }
}