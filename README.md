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
#/0,FF0000,0,1/0,00FF00,0,1?0src=images/bw_red.png&1src=images/bw_green.png&active=0
```

To load only a specific image into the red channel, the url parameters should be:

```
#/0,FF0000,0,1?src=image.png
```

To activate green.png in the second channel (green by default)
```
#?0src=red.png&1src=green.png&active=1
```
