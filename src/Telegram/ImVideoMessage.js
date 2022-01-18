import React from 'react';
import LazyLoad from 'react-lazy-load';
import Zoom from 'react-medium-image-zoom';
import { connect } from 'react-redux';
import { getChannelMessage } from './../reduxStore';
import photoManager from './photoManager';
const bytesToBase64 = photoManager.bytesToBase64;

class ImVideoMessage extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }
  componentDidMount() {
    const { message, media, api } = this.props;

    const video = message && message.media && message.media.video;
    if (video && video.imageUrl) {
      this.setState( { url: video.imageUrl, width: 150 } );
      return;
    }
    console.log(video)

    const location = video.access_hash && video.file_reference ? {
      file_reference: video.file_reference,
      access_hash: video.access_hash,
      id: video.id,
      thumb_size: video.sizes[ 2 ].type,
      // peer: {
      //   '_': 'inputPeerUser',
      //   user_id: d.id,
      //   access_hash: d.access_hash
      // },
      // local_id: 72967,
      // secret: d.video.photo_small,
      // volume_id: "851322367",
      _: 'inputPhotoFileLocation',
    } : {
      ...video.sizes[ 2 ].location,
      peer: {
        _: 'inputPeerUser',
        user_id: message.from_id.user_id,
        access_hash: video.access_hash,
      },
      _: 'inputPhotoFileLocation',
    };

    api.call( 'upload.getFile', {
      offset: 0,
      limit: 1024 * 1024,
      cdn_supported: true,
      precise: false,
      location,
    } ).then( d => {
      const url = `data:image/jpg;base64,${ bytesToBase64( d.bytes ) }`;
      this.setState( { url, width: video.sizes[ 1 ].w, height: video.sizes[ 1 ].h } );
    } );
  }

  render() {
    const { url, width, height } = this.state;
    // const user = users && users[replyMessage.from_id.user_id] || {}
    // const name = user.first_name ? (user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name) : user.last_name;

    return (
      <a className='im_message_media'>
        <div className='im_message_photo_thumb'>
          {url ? <Zoom><LazyLoad height={ height }><img className='round-corner-5' src={ url } style={ { width, height } } /></LazyLoad></Zoom> : <div style={ { height }} />}
        </div>
      </a>

    );
  }
}

const mapDispatchToProps = {
  getChannelMessage,
};

const mapStateToProps = state => ( {
  api: state.telegram.api,
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)( ImVideoMessage );
