# otho

[![Build Status](https://travis-ci.org/ljbc1994/otho.svg?branch=master)](https://travis-ci.org/fulhamcrazy/otho)

Otho is a tiny vanilla js library that simplifies managing and manipulating image loading.


## Install

Coming soon...


## Quick Start!

Coming soon...


## To Do

* Various Sychronous Capabilities
    * ~~Specify how many images to load per time, i.e. `perLoad: 2`~~
    * ~~Specify a delay (using a number, function) between each image(s) load, i.e. `delay: 1000`~~
    * Specify the order of which images to load first
    * ~~Specify a matrix to load the images using a pattern~~
* Further Unit Tests
* Responsive Support, i.e. `<picture>, <source>`
* Documentation
* Advanced Examples
* Dedicated Site
* Add flow.js for type checking


## Documentation

### Programmatic Options

You can configure Otho by passing options to `Otho.load`. These are the default options:

```js
// Global options
{
    els: document.getElementsByTagName('img'),
    error: '',
    placehold: '', 
    forcePlacehold: false, 
    inView: false, 
    background: false,
    sync: false,
    imageLoaded: 'o-image-loaded',
    imageLoading: 'o-image-loading'
}

// Sync options
{
    perLoad: 1,
    delay: 0
}
```

#### els (Array|Function|NodeList|Object)

The elements that have or contain a reference to an image element. If `background: true` has been selected, Otho will look for the `background-image` of the element. 

```js
Otho.load({  
    els: document.getElementsByClassName('otho-image')
})
```

#### error (String|null)

The image source to be used if the desired image cannot be loaded.

```js
Otho.load({
    error: 'http://show-on-error.dntwrk'
})
```

#### placehold (String|null)

The image source to be used whilst loading the desired image.

```js
Otho.load({
    placehold: 'http://placehold.it/200x200'
})
```

#### forcePlacehold (Boolean)

Ensure that both the placehold and error images have loaded before loading the desired images.

```js
Otho.load({
    forcePlacehold: true
})
```

#### inView (Boolean)

Only load images that are visible within the browser window.

```js
Otho.load({
    inView: true
})
```

#### background (Boolean)

If you wish to load images that are background images, this is the option for you!

```js
Otho.load({
    background: true
})
```


#### imageLoaded (String|null)

When the image has loaded, add the `imageLoaded` class to the element.

```js
Otho.load({
    imageLoaded: 'i-have-loaded'
})
```

#### imageLoading (String|null)

When the desired image is loading, add the `imageLoading` class to the element.

```js
Otho.load({
    imageLoading: 'i-am-loading'
})
```

#### success (Function|null)

When all the images have loaded, the `success` callback will be executed with a list of `watchers`.

```js
Otho.load({
    success: function(watchers) {
        console.log(':D Success!');
    }
})
```

#### fail (Function|null)

When an image has failed to load, the `fail` callback will be executed with the failed `watcher`.

```js
Otho.load({
    fail: function(failed) {
        console.log(':( Failed!');
    }
})
```

#### progress (Function|null)

When an image has loaded (success or fail), the `progress` callback will be executed with the watcher and some stats.

```js
Otho.load({
    progress: function(watcher, stats) {
        console.log(':S May or may not have failed!');
    }
})
```

### Synchronous Options

#### perLoad (Number)

The number of images to load before loading the next lot of images.

```js
Otho.load({
    sync: {
        perLoad: 2
    }
})
```

#### delay (Number)

The delay (in ms) before loading the next lot of images.

```js
Otho.load({
    sync: {
        delay: 1000
    }
})
```

#### matrix (Array|Function)

Define a matrix that will be used to load the images in a specified order. **Note: the matrix
array must contain the same number of items as the number of images being loaded.**

```js
Otho.load({
    sync: {
        matrix: [
            3, 3, 3, 3, 3, 3, 3,
            3, 2, 2, 2, 2, 2, 3,
            3, 2, 2, 1, 2, 2, 3,
            3, 2, 2, 2, 2, 2, 3,
            3, 3, 3, 3, 3, 3, 3
        ]
    }
})
```

Or... you can use a callback. The callback is given the watchers so that you can generate a
matrix of image ordering!

```js
Otho.load({
    sync: {
        matrix: function(watchers) {
            return watchers.reverse().map(function(watcher, index) {
                return index;
            });
        }
    }
})
```

### Markup Options

You can override programmatic options by setting `data-o-*` attributes on the element containing the image.

#### data-o-placehold (String)

Specify which image will be shown whilst the desired image is being loaded.

The following example ensures that the first image will display `http://usethis.instead` as the placehold image as opposed to the others which will use `http://placehold.it/200x200`. 

```js
// Default placehold used if data-o-placehold is not specified.
Otho.load({
    placehold: 'http://placehold.it/200x200'
})
```

```html
<img data-o-placehold="http://usethis.instead" data-o-src="http://pretty.image"/>
<img data-o-src="http://pretty.image1"/>
<img data-o-src="http://pretty.image2"/>
```

See [placehold](#placehold-stringnull).

#### data-o-error (String)

Specify which image will be shown if an error occurs.

The following example ensures that the first image will display `http://usethis.forerror` as the error image as opposed to the others which will use `http://placehold.it/200x200`. 

```js
// Default placehold used if data-o-placehold is not specified.
Otho.load({
    error: 'http://placehold.it/200x200'
})
```

```html
<img data-o-error="http://usethis.forerror" data-o-src="http://pretty.image"/>
<img data-o-src="http://pretty.image1"/>
<img data-o-src="http://pretty.image2"/>
```

See [error](#error-stringnull).

#### data-o-background (Boolean)

Specify whether Otho should look for and load the background image of the element. 

```css
.el {
   background: url('http://pretty.image1');
}
```

```html
<div class="el" data-o-background="true" data-o-placehold="http://placehold.it/200x200"/>
```

See [background](#background-boolean).

#### data-o-loaded

Specify which class to apply to the element when the image has successfully loaded.

The following example ensures that the first image will have `special-loaded` applied to the element as opposed to the others which will have `i-have-loaded` applied. 

```js
Otho.load({
    imageLoaded: 'i-have-loaded'
})
```

```html
<img data-o-loaded="special-loaded" data-o-src="http://pretty.image"/>
<img data-o-src="http://pretty.image1"/>
<img data-o-src="http://pretty.image2"/>
```

See [loaded](#imageloaded-stringnull)

#### data-o-loading

Specify which class to apply to the element when the image is loading.

The following example ensures that the first image will have `special-loading` applied to the element as opposed to the others which will have `i-am-loading` applied. 

```js
Otho.load({
    imageLoading: 'i-am-loading'
})
```

```html
<img data-o-loading="special-loading" data-o-src="http://pretty.image"/>
<img data-o-src="http://pretty.image1"/>
<img data-o-src="http://pretty.image2"/>
```

See [loading](#imageloading-stringnull)

## Issues

If you are encountering bugs or you think otho is missing an awesome feature, please raise an issue in this repo! 


## Contributors

Get your name 'ere for fixing bugs and adding features!


## License

MIT License. Do what the hell you want with it.

