# Documentation contributions
This folder contains documentation for the Visi Library.

## How to contribute
1. Fork this repository
2. Make changes to the documentation & and follow the folder structure, naming conventions and file formats - also update files to use new version of the page if applicable.
3. Submit a pull request

## How to run the documentation locally
1. Clone this repository
2. load the index.html file and navigate  to url#/docs/lang/version-number/page-name
4. disable cfr in the html tag of the index.html file - this disables cache and allows you to see changes made to the documentation 
be sure to enable cfr when you are done - this is not optional
5. done :)

## Folder structure
```
docs
├───pages
│   ├───language
│   │   ├───version
│   │   │   ├───views
│   │   │   │   ├───page-name

``` 
## Naming conventions
Pages should be named in the following format:
```
<page-name>.jsx
```
# Updated & by who
make sure to update when the last change was made and who made changes to the file
this should be placed at the bottom of each file - avatars are not optional and must be served from github! - do not change sizing follow the example below
```html
 <p className="fixed bottom-5 right-5 text-slate-300 flex">
          <img
            src="github-avatar.png"
            className="w-5 h-5 rounded-full me-5"
            alt="avatar"
          />
          Last Edited  ${date} 
    </p>
```

```

## File formats
### Pages
Pages should be written in JSX format.

Pages should have proper  documentation, and sidebar navigation.
```
Example of setting page title and sidebar navigation
```js
 
 window.postMessage({ page: 'intro', lang: lang, pageContent:[
        {
            title: 'Introduction',
            mainContent: 'Why visi?',
            subContent: [
                'create a visi app'

            ]
        }
     ]}, '*');
```
 
