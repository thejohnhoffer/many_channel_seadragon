### Building

Install dependencies, build the website, watch for changes:

```
npm i
npm run build
```

The website is built in the `docs` folder, which is read by github pages.

### URL parameters

Here are the default values for url parameters:

```
#/0,FF0000,0,1/0,00FF00,0,1?0src=images/bw_red.png&1src=images/bw_green.png
```

To load only the red channel with the default image, the url parameters should be:

```
#/0,FF0000,0,1
```

To load only a specific image into the red channel, the url parameters should be:

```
#/0,FF0000,0,1?src=image.png
```
