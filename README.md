Minimalistic browserSync Gulp React Devstack
============================================

Simple react starter devstack

<br>

### Requirements

1. **nodejs** - you can install it through some package manager, on macOs use [homebrew](http://brew.sh/) and then install it with `brew install node`
2. **npm** package manager
3. **gulp** - it is prefered way to have it installed like this -> `npm install -g gulp` to install it globally

### Configuration Files

- **gulpfile.js** - main file, where resides all the logic behind this devstack
- **package.json** - node package file


### Source files

- **./assets/css/index.scss** - main css file, few assets added just for the explanation, how the file structure can work
- **.assets/js/index.js** - main js file, but as you know .js imports are not supported in browsers, so if you would like to work with some file structure check **browserify** or simply concat the files with **gulp-concat**, the second option need to be configured in the gulpfile.js 


