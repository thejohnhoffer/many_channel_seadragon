### Dependencies

Currently, we depend on modified versions of [OpenSeadragon][OSD] and [UPNG.js][UPNG].

As this project is being developed, we're improving [an OpenSeadragon plugin][via_pr].

[OSD]: http://openseadragon.github.io/
[UPNG]: https://github.com/photopea/UPNG.js/
[via_pr]: https://github.com/thejohnhoffer/viaWebGL/pull/6

### Building

Install dependencies, build the website, watch for changes:

```
npm i
npm run build
```

The website is built in the `docs` folder, which is read by github pages.

### URL parameters

By default, we show [these sources](/src/defaults.js). 2-channel red, green rendering is the default:

```
#/0,FF0000,0,1/1,00FF00,0,1
```

To render only the red channel from red.png, the url parameters should be:

```
?src=red.png#/0,FF0000,0,1
```

To activate green.png in the second channel with default 2-channel rendering:
```
?1src=green.png&active=1
```
