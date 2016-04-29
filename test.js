import test from 'tape';
import VimeoVideo from './index.jsx';
import {string, element} from 'deku';
import tsml from 'tsml';

test('VimeoVideo embed state', t => {
  const html = string.render(<VimeoVideo vimeoId='156236882' />);

  t.equal(html, tsml`
    <div class="vimeo-video vimeo-video--opened">
      <iframe class="vimeo-video__frame" src="https://player.vimeo.com/video/156236882" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" id="vimeo-video__frame--video-id-undefined"></iframe>
    </div>`);
  t.end();
});

test('VimeoVideo embed state autoplay', t => {
  const html = string.render(<VimeoVideo vimeoId='156236882' autoplay={true} />);

  t.equal(html, tsml`
    <div class="vimeo-video vimeo-video--opened">
      <iframe class="vimeo-video__frame" src="https://player.vimeo.com/video/156236882?autoplay=1" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" id="vimeo-video__frame--video-id-undefined"></iframe>
    </div>`);
  t.end();
});

test('VimeoVideo thumbnail state', t => {
  const html = string.render(<VimeoVideo vimeoId='156236882' loaded={false} thumbnailSrc='//example.com/image.jpg' />);

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
