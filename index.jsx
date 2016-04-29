import {element} from 'deku';

export default {
  render: function ({ props, id }) {
    const loaded = typeof props.loaded === 'undefined' ? true : props.loaded;
    const autoplay = !!props.autoplay;
    const thumbnailSrc = props.thumbnailSrc || '';
    const src = `https://player.vimeo.com/video/${props['vimeoId']}${autoplay ? '?autoplay=1' : ''}`;

    const content = loaded
    /* eslint-disable */
      ? <iframe class='vimeo-video__frame' src={src} frameborder='0'
        webkitallowfullscreen mozallowfullscreen allowfullscreen id={elementId(id)} />
    /* eslint-enable */
      : <div>
          <div class='vimeo-video__image' style={`background-image: url(${thumbnailSrc});`}></div>
          <div class='vimeo-video__play-btn vimeo-video__play-btn--hover'>
            <div class='vimeo-video__play-btn__image'></div>
          </div>
          <div class='vimeo-video__play-btn'>
            <div class='vimeo-video__play-btn__image'></div>
          </div>
        </div>;

    const className = loaded ? 'vimeo-video vimeo-video--opened' : 'vimeo-video';
    return <div class={className} onClick={props.onClick}>{content}</div>;
  }
};

function elementId (id) {
  return `vimeo-video__frame--video-id-${id}`;
}
