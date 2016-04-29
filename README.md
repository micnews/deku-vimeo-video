# deku-vimeo-video

Vimeo video component for [deku](https://github.com/dekujs/deku).

## Usage

```shell
npm install deku-vimeo-video
```

```js
import VimeoVideo from 'deku-vimeo-video';

export default {
  render: function () {
    return <VimeoVideo vimeoId='156236882'/>;
  }
}
```

### Attributes

* `vimeoId=[vimeo-video-id]` - Set vimeo video ID to use.
* `onClick=[function]` - _Optional_ Function to run when video is clicked on.
* `loaded=[boolean]` -  _Optional_ Show video thumbnail image if false, otherwise load actual video embed. Defaults to true.
* `autoplay=[boolean]` -  _Optional_ Set autoplay on the embed. Defaults to false.
* `thumbnailSrc=[string]` - _Optional_ Set thumbnail image URL.

## index.css

Import css using [postcss](https://github.com/postcss/postcss).
```css
@import 'deku-vimeo-video';
```
