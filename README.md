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
?0src=images/bw_red.png&1src=images/bw_green.png&active=0#/0,FF0000,0,1/0,00FF00,0,1
```

To render only the red channel from red.png, the url parameters should be:

```
?src=red.png#/0,FF0000,0,1
```

To activate green.png in the second channel with default 2-channel rendering:
```
?1src=green.png&active=1
```
