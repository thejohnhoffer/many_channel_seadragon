### Dependencies

We depend on [an OpenSeadragon plugin][via_pr] and a modified version of [OpenSeadragon][OSD].

[OSD]: http://openseadragon.github.io/
[via_pr]: https://github.com/thejohnhoffer/viaWebGL/pull/8


### Getting a token

Install and configure the AWS CLI

```
pip install awscli
aws configure
```

Then run `python dotenv.py` to write temporary credentials to a .env file.


### Building

Install dependencies and start a server:

```
npm i && npm run start
```

### URL parameters

By default, we show [these sources](/src/defaults.js). 2-channel red, green rendering is the default:

```
#/0,FF0000,0,1/1,00FF00,0,1
```

To render b.png to blue and y.png to yellow, use url parameters:

```
?type=image&src0=b.png&src1=y.png#/0,0000FF,0,1/0,FFFF00,0,1
```

### Multi-Channel API

To render channel 3 to blue and 4 to yellow from `http://example.com/tiles`, use url parameters:

```
?src=http://example.com/tiles#/3,0000FF,0,1/4,FFFF00,0,1
```

This assumes that `http://example.com/tiles` holds png tiles named like this:

```javascript
"C" + channel + "-T0-Z0-L" + level + "-Y" + y + "-X" + x + ".png"
```

So, this png must store channel 3 at full resolution:

```
http://example.com/tile/C3-T0-Z0-L0-Y0-X0.png
```

Each png must be a square, except for those in the bottom and/or right of the image.
Currently we support only 1024x1024 pngs with a full image size of _exactly_ 4080x7220.
