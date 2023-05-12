// lazy js


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
      saveFn(this.cache);
    }
    saveShardSessions(filename) {
        const json = JSON.stringify(this.shardSessions);
        fs.writeFileSync(filename, json);
      }
    
      
     
    
      async reloadShards() {
        const shardResults = await Promise.all(this.shards.map((shard) => this.queryParallel(shard)));
        const results = shardResults.flat();
        return results;
      }
}

window.lib = (path) => {
  if (!path) throw new Error('require() must be called with a path!');
  if (path.startsWith("@tailwind/") || path.startsWith("@tailwind")) {
    // remove @tailwind from path
    if (document.getElementById("tailwindcss")) {
      throw new Error('Tailwind CSS already loaded please remove duplicate require("@tailwind")')
      return
    }
    if (path.startsWith("@tailwind/")) {
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
    } else {
      let script = document.createElement('script');
      script.src = `https://cdn.tailwindcss.com`;
      document.body.style.visibility = "hidden";
      script.id = 'tailwindcss';
      if (!document.getElementById("tailwindcss")) {
        document.head.appendChild(script);
      }
      

      script.onload = () => {
        document.head.removeChild(script);
        console.log('Tailwind CSS loaded')
        setTimeout(() => {
          document.body.style.visibility = "visible";
        },100);

      }
    }



    return
  }
  if (path.startsWith("@react-bootstrap")) {

    let script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
    script.id = "react-bootstrap"
    let style = document.createElement("link")
    style.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
    style.rel = "stylesheet"
    style.integrity = "sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
    style.crossOrigin = "anonymous"
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

  if (path.endsWith('.css')) {
    if (!cache[path]) {
      fetch(path).then((res) => {
        res.text().then((text) => {
          cache[path] = text;
          totalSize += text.length;
          const stylesheet = new CSSStyleSheet();
          stylesheet.replaceSync(text);
           
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
  }






}


export default  { Lazy, JsonHandler}

window.Lazy = Lazy;
window.JsonHandler = JsonHandler;

//  React Router

export class ReactRouter {
    constructor() {
      this.routes = {};
      this.currentUrl = '';
      this.store = {};
      this.rootElement = null;
      this.hashChangeListener = null;
      let storedroutes = []
    }
  
    route(path) {
      this.routes[path] = true;
    }
    root(path, callback) {
      const paramNames = [];
      const queryNames = [];
      window.location.hash = path;
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
            // save the current route in history
            if (window.sessionStorage.getItem(route)) {
              window.location.hash = window.sessionStorage.getItem(route);
            } else {
              window.sessionStorage.setItem(route, route);
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
              document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
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
              } else if (file.endsWith(".json")) {
                fetch(file)
                  .then(response => response.json())
                  .then(data => {
                    const jsonData = JSON.stringify(data);
                    const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                    document.getElementById(element).innerHTML = html;
                  })
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
                    document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
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
                    } else if (file.endsWith(".json")) {
                      fetch(file)
                        .then(response => response.json())
                        .then(data => {
                          const jsonData = JSON.stringify(data);
                          const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                          document.getElementById(element).innerHTML = html;
                        })
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
  
      return false;
    }
  
  
  
    bindRoot(element) {
      this.rootElement = element
    }
  
    onload(callback) {
      window.onload = () => {
        // domcontentloaded
        window.addEventListener("DOMContentLoaded", callback())
      }
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
              document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
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
              } else if (file.endsWith(".json")) {
                fetch(file)
                  .then(response => response.json())
                  .then(data => {
                    const jsonData = JSON.stringify(data);
                    const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                    document.getElementById(element).innerHTML = html;
                  })
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
                    document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
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
                compress: (data) => {
                  if (hooked) {
                    throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                  }
                   let compressed = new CompressionStream( 'gzip' );
                    let encoder = new TextEncoder();
                    let input = encoder.encode( data );
                    let output = compressed.encode( input );
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
                document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
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
                } else if (file.endsWith(".json")) {
                  console.log("json")
                  fetch(file)
                    .then(response => response.json())
                    .then(data => {
                      const jsonData = JSON.stringify(data);
                      const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                      document.getElementById(element).innerHTML = html;
                    })
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
  
  
    error(callback) {
      window.onhashchange = (e) => {
        const path = e.newURL.split("#")[1];
        if (!this.routes[path]) {
          callback();
        }
      }
    }
  }
  
  
  window.ReactRouter = ReactRouter;
 
   
// Components.js


var totalSize = 0;

let precached = false;
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
  if (document.querySelector("html").getAttribute("data-env") === "production") {
    // Wrap the prefetching logic inside a setTimeout call to delay it slightly
    setTimeout(() => {
      // Prefetch script files
      document.querySelectorAll('script').forEach((script) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = script.src;
        link.as = "script";
        document.head.appendChild(link);
      });

      // Preconnect to and lazy load images
      document.querySelectorAll('img').forEach((img) => {
        const link = document.createElement("link");
        const isLink = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/.test(img.src);
        if (isLink) {
          link.rel = "preconnect"; 
          link.href = img.src;
          link.as = "image";
          document.head.appendChild(link);
          img.setAttribute("loading", "lazy");
        } else {
          link.rel = "prefetch";
          link.href = img.src;
          link.as = "image";
          document.head.appendChild(link);
          img.setAttribute("loading", "lazy");
        }
      });

      // Preload stylesheets
      document.querySelectorAll('link').forEach((styleSheet) => {
        if (styleSheet.href && styleSheet.href.endsWith(".css")) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.href = styleSheet.href;
          link.as = "style";
          link.onload = () => link.setAttribute("rel", "stylesheet"); // Use onload event to set the rel attribute
          link.setAttribute("crossorigin", "anonymous"); // Add crossorigin attribute for correct CORS headers
          document.head.appendChild(link);
        }
      });
    }, 0);
  } else {
    console.warn("%cVisijs Development mode + please do not use development mode in production!", "color: violet; font-size: 20px;");
  }
};





 

 

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
 
console.log("%cvisi.js v1.5.7 loaded", "color: violet;   border-radius:5px; font-size: 20px; padding: 10px;")


window.ErrorTrace = () =>{
  window.onmessageerror = function (event) {
    console.log(event)
  }
    window.onerror = function (msg, url, lineNo, columnNo, error) {
      console.log(msg, url, lineNo, columnNo, error);
      document.title = "Error" + msg;
      document.head.innerHTML =  `
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
        <style>
        body {
          background-color: white;
          color: black;
          transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        
        .dark-mode {
          background-color: #1f1f1f;
          color: white;
          transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        .code-block {
          background: #050505;
     
          color: #d4d4d4;
          font-size: 14px;
          font-family: 'Courier New', Courier, monospace;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
     
        }
        
        .line-number {
          display: inline-block;
          width: 30px;
          text-align: right;
          margin-right: 10px;
          color: #999;
        }
        
        .line-content {
          display: inline-block;
          margin-left: 10px;
        }
        
        </style>
     
        `;
  
      let xhml = new XMLHttpRequest();
      xhml.open("GET", url, true);
      xhml.send();
      xhml.onreadystatechange = function () {
        if (xhml.readyState == 4 && xhml.status == 200) {
          let content = xhml.responseText;
          let lines = content.split("\n");
          let highlightedLine = lines[lineNo - 1];
          let line_no = lineNo;
          let column_no = columnNo;
          let errorType = error.name
          let stack = error.stack;
          
          // Generate code block
          let codeBlock = "";
          for (let i = Math.max(0, line_no - 5); i < Math.min(lines.length, line_no + 5); i++) {
            let lineNumber = i + 1;
            let lineContent = lines[i];
            let lineClass = "";
            if (i == line_no) {
              lineClass = "text-danger";
              codeBlock += `<span class="rounded bg-danger">${lineNumber}: ${highlightedLine}</span><br>`;
            } else {
              codeBlock += `<span>${lineNumber}: ${lineContent}</span><br>`;
            }
          }
        
          // remove stylesheets
          document.adoptedStyleSheets = [];
          document.body.innerHTML = `
            <div class="container" style="padding: 50px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 class="text-danger">Error ${msg} occurred</h2>
                <i id="toggle-dark-mode-btn" class="bi bi-moon-fill" style="cursor: pointer; font-size: 2rem;"></i>
      
              </div>
              <p class="text-secondary">${url}:${lineNo}:${columnNo}</p>
              <p class="text-secondary">${errorType}</p>
              <p class="text-secondary">${stack}</p>
              <p class="text-secondary">${column_no}</p>
              <div class="code-block">${codeBlock}</div>
            </div>
          `;
          
          // Add dark mode toggle functionality
          const toggleDarkModeBtn = document.querySelector("#toggle-dark-mode-btn");
          const body = document.querySelector("body");
          
          toggleDarkModeBtn.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            body.classList.toggle("text-white");
            document.querySelectorAll(".code-block ").forEach((span) => {
              span.classList.toggle("text-white");
              span.classList.toggle("bg-secondary");
            });
          });
        }
        console.log("ErrorTrace loaded")
        }
      }
     
   }
   
   let display = true;
   let loadingCount = 0;
   
   const workerFunction = () => {
    onmessage = (event) => {
      importScripts('https://unpkg.com/@babel/standalone/babel.min.js');
      const code = event.data;
      const compiledCode = Babel.transform(code, { presets: ['react', 'typescript'] }).code;
      postMessage({ type: 'code', data: compiledCode });
    };
  };
 
const dispose = (path, callback, props = {}) => {
     
    const cacheEntry = cache[path];
    if (cacheEntry) {
      const { type, data, componentName } = cacheEntry;
      if (type === 'tsx' || type === 'jsx') {
        const func = new Function('props', `
          return function(props1){
            ${data}
            return React.createElement(${componentName}, { ...props, ...props1 })
          }
        `);
        const component = func(props);
        callback(component);
      } else if (type === 'ts') {
        const func = new Function(data);
   
        const component = func()(props)
        console.log(component)
        callback(component);
      }
      return;
    }
  
    const worker = new Worker(
      URL.createObjectURL(
        new Blob([`(${workerFunction.toString()})()`], {
          type: 'application/javascript',
        })
      )
    );
  
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
        }
        const cacheEntry = { type: extension, data: compiledCode, componentName };
        if (extension !== 'ts') {
          cache[path] = cacheEntry;
        }
        const func = new Function('props',`
          return function(){
            ${compiledCode}
            return React.createElement(${componentName}, props)
          }
        `);
        const component = func(props)
       
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
  };
  
 
  
  window.dispose = dispose;