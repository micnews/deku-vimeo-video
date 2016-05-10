import test from 'tape';
import element from 'virtual-element';
import VimeoVideo from './index.jsx';
import {tree, renderString} from 'deku';
import tsml from 'tsml';

test('VimeoVideo embed state', t => {
  const html = renderString(tree(<VimeoVideo vimeoId='156236882' />));

  t.equal(html, tsml`
    <div class="vimeo-video vimeo-video--opened">
      <iframe class="vimeo-video__frame" src="https://player.vimeo.com/video/156236882?api=1&player_id=vimeo-video__frame--video-id-default" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" id="vimeo-video__frame--video-id-default"></iframe>
    </div>`);
  t.end();
});

test('VimeoVideo embed state autoplay', t => {
  const html = renderString(tree(<VimeoVideo vimeoId='156236882' autoplay={true} />));

  t.equal(html, tsml`
    <div class="vimeo-video vimeo-video--opened">
      <iframe class="vimeo-video__frame" src="https://player.vimeo.com/video/156236882?api=1&player_id=vimeo-video__frame--video-id-default&autoplay=1" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" id="vimeo-video__frame--video-id-default"></iframe>
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

test('VimeoVideo client rendering with ID', t => {
  const props = {
    vimeoId: '156236882',
    loaded: true,
    thumbnailSrc: '//example.com/image.jpg'
  };

  const id = 12345;
  const html = renderString(tree(VimeoVideo.render({ props, id })));

  t.equal(html, tsml`
    <div class="vimeo-video vimeo-video--opened">
      <iframe class="vimeo-video__frame" src="https://player.vimeo.com/video/156236882?api=1&player_id=vimeo-video__frame--video-id-12345" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" id="vimeo-video__frame--video-id-12345"></iframe>
    </div>`);
  t.end();
});

test('VimeoVideo client API', t => {
  t.plan(7);

  const props = {
    vimeoId: '156236882',
    loaded: true,
    thumbnailSrc: '//example.com/image.jpg',
    onPlay: () => t.pass('play'),
    onPause: () => t.pass('pause'),
    onFinish: () => t.pass('finish')
  };

  const id = 12345;
  const playerId = 'vimeo-video__frame--video-id-12345';
  renderString(tree(VimeoVideo.render({ props, id })));
  VimeoVideo.afterMount({ props, id });

  global.document = {
    getElementById: id => {
      t.equal(id, playerId);

      return {
        contentWindow: {
          postMessage: data => {
            if (data === JSON.stringify({method: 'addEventListener', value: 'play'})) {
              t.pass('setup play');
              return;
            }

            if (data === JSON.stringify({method: 'addEventListener', value: 'pause'})) {
              t.pass('setup pause');
              return;
            }

            if (data === JSON.stringify({method: 'addEventListener', value: 'finish'})) {
              t.pass('setup finish');
              return;
            }

            t.fail();
          }
        }
      };
    }
  };

  global.vimeoApiMessageReceived({
    origin: 'https://player.vimeo.com',
    data: JSON.stringify({ event: 'ready', player_id: playerId })
  });

  global.vimeoApiMessageReceived({
    origin: 'https://player.vimeo.com',
    data: JSON.stringify({ event: 'play', player_id: playerId })
  });

  global.vimeoApiMessageReceived({
    origin: 'https://player.vimeo.com',
    data: JSON.stringify({ event: 'pause', player_id: playerId })
  });

  global.vimeoApiMessageReceived({
    origin: 'https://player.vimeo.com',
    data: JSON.stringify({ event: 'finish', player_id: playerId })
  });

  delete global.document;
});
