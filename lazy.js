
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
 
  
 
 
 export  { Lazy, JsonHandler}

 