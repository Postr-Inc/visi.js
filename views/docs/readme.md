# Documentation contributions
This folder contains documentation   for the Visi framework.

## How to contribute
1. Fork this repository
2. Make changes to the documentation & and follow the folder structure, naming conventions and file formats
3. Submit a pull request

## How to run the documentation locally
1. Clone this repository
2. load the index.html file and navigate  to url#/docs/lang/page-name
4. disable cfr in the html tag of the index.html file - this disables cache and allows you to see changes made to the documentation 
be sure to enable cfr when you are done - this is not optional
5. done :)

## Folder structure
```
docs
├───pages
│   ├───language
│   │   ├───views

``` 
## Naming conventions
### Pages
Pages should be named in the following format:
```
<page-name>.jsx
```
# Updated & by who
make sure to update when the last change was made and who made changes to the file
```

## File formats
### Pages
Pages should be written in JSX format.

Pages should have proper comments documentation, and sidebar navigation.
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
 
