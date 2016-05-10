import element from 'virtual-element';

const eventHandlers = {};
const eventsReady = {};

if (process.browser) {
  if (window.addEventListener) {
    window.addEventListener('message', onMessageReceived, false);
  } else {
    window.attachEvent('onmessage', onMessageReceived);
  }
} else {
  global.vimeoApiMessageReceived = onMessageReceived;
}

function setupEvent (element, ev) {
  element.contentWindow.postMessage(JSON.stringify({
    method: 'addEventListener',
    value: ev
  }), '*');
}

function onMessageReceived (event) {
  if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
    return false;
  }

  let data = {};
  let method = '';

  try {
    data = JSON.parse(event.data);
    method = data.event || data.method;
  } catch (e) {
    return false;
  }

  if (method === 'ready') {
    if (eventsReady[data.player_id]) {
      return;
    }

    eventsReady[data.player_id] = true;
    const element = global.document.getElementById(data.player_id);
    if (!element || !element.contentWindow || !element.contentWindow.postMessage) {
      return;
    }

    setupEvent(element, 'play');
    setupEvent(element, 'pause');
    setupEvent(element, 'finish');
  }

  if (!eventHandlers[data.player_id]) {
    return;
  }

  const handlers = eventHandlers[data.player_id];
  if (method === 'play' && handlers.onPlay) {
    handlers.onPlay();
  }

  if (method === 'pause' && handlers.onPause) {
    handlers.onPause();
  }

  if (method === 'finish' && handlers.onFinish) {
    handlers.onFinish();
  }
}

function afterMountUpdate ({ props, id }) {
  const elementId = getElementId(id);

  if (props.loaded) {
    eventHandlers[elementId] = {
      onPlay: props.onPlay,
      onPause: props.onPause,
      onFinish: props.onFinish
    };
  } else {
    eventHandlers[elementId] = null;
  }
}

export default {
  render: function ({ props, id = 'default' }) {
    const loaded = typeof props.loaded === 'undefined' ? true : props.loaded;
    const autoplay = !!props.autoplay;
    const thumbnailSrc = props.thumbnailSrc || '';
    const elementId = getElementId(id);
    const src = `https://player.vimeo.com/video/${props['vimeoId']}?api=1&player_id=${elementId}${autoplay ? '&autoplay=1' : ''}`;

    const thumbnail = props.customThumbnail || (<div>
      <div class='vimeo-video__image' style={`background-image: url(${thumbnailSrc});`}></div>
      <div class='vimeo-video__play-btn vimeo-video__play-btn--hover'>
        <div class='vimeo-video__play-btn__image'></div>
      </div>
      <div class='vimeo-video__play-btn'>
        <div class='vimeo-video__play-btn__image'></div>
      </div>
    </div>);

    const content = loaded
    /* eslint-disable */
      ? <iframe class='vimeo-video__frame' src={src} frameborder='0'
        webkitallowfullscreen mozallowfullscreen allowfullscreen id={elementId} />
    /* eslint-enable */
      : thumbnail;

    const className = loaded ? 'vimeo-video vimeo-video--opened' : 'vimeo-video';
    return <div class={className} onClick={props.onClick}>{content}</div>;
  },
  afterMount: afterMountUpdate,
  afterUpdate: afterMountUpdate
};

function getElementId (id) {
  return `vimeo-video__frame--video-id-${id}`;
}
