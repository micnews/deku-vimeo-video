import test from 'tape';
import element from 'virtual-element';
import VimeoVideo from './index.jsx';
import {tree, renderString} from 'deku';
import tsml from 'tsml';

test('VimeoVideo embed state', t => {
  const html = renderString(tree(<VimeoVideo vimeoId='156236882' />));

  t.equal(html, tsml`
    <div class="vimeo-video vimeo-video--opened">
      <iframe class="vimeo-video__frame" src="https://player.vimeo.com/video/156236882" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" id="vimeo-video__frame--video-id-undefined"></iframe>
    </div>`);
  t.end();
});

test('VimeoVideo embed state autoplay', t => {
  const html = renderString(tree(<VimeoVideo vimeoId='156236882' autoplay={true} />));

  t.equal(html, tsml`
    <div class="vimeo-video vimeo-video--opened">
      <iframe class="vimeo-video__frame" src="https://player.vimeo.com/video/156236882?autoplay=1" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" id="vimeo-video__frame--video-id-undefined"></iframe>
    </div>`);
  t.end();
});

test('VimeoVideo thumbnail state', t => {
  const html = renderString(tree(<VimeoVideo vimeoId='156236882' loaded={false} thumbnailSrc='//example.com/image.jpg' />));

  t.equal(html, tsml`
    <div class="vimeo-video">
      <div>
        <div class="vimeo-video__image" style="background-image: url(//example.com/image.jpg);"></div>
        <div class="vimeo-video__play-btn vimeo-video__play-btn--hover">
          <div class="vimeo-video__play-btn__image"></div>
        </div>
        <div class="vimeo-video__play-btn">
          <div class="vimeo-video__play-btn__image"></div>
        </div>
      </div>
    </div>`);
  t.end();
});

test('VimeoVideo custom thumbnail', function (t) {
  const customThumbnail = <div>OK</div>;
  var html = renderString(tree(<VimeoVideo customThumbnail={customThumbnail} loaded={false} vimeoId='156236882' />));

  t.equal(html, tsml`
    <div class="vimeo-video"><div>OK</div></div>`);
  t.end();
});
