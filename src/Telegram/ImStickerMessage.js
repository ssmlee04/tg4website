import React from 'react';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazy-load';
import Zoom from 'react-medium-image-zoom';
import { getChannelMessage } from './../reduxStore';
import photoManager from './photoManager';
const bytesToBase64 = photoManager.bytesToBase64;

class ImStickerMessage extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }
  componentDidMount() {
    const { message, media, api } = this.props;
    // this.props.getChannelMessage(message.id)
    // .then(d => {
    //   console.log({d})
    // })

    // return api.call('channels.getMessages', {
    //   channel: {
    //     access_hash: chatAccessHash,
    //     channel_id: earningsflyChannelId,
    //     _: "inputChannel"
    //   },
    //   id: [{id: id, _: 'inputMessageID'}]
    // })

    const photo = message && message.media && message.media.document
    if (photo && photo._thumb) {
      // this.setState( { url: photo.imageUrl, width: photo._thumb._width, height: photo._thumb._height } );
      this.setState( { url: photo.imageUrl, width: 100, height: 100, isWebp: (photo.imageUrl || '').indexOf('.webp') > -1 } );
      return;
    }

    const location = photo.access_hash && photo.file_reference ? {
      file_reference: photo.file_reference,
      access_hash: photo.access_hash,
      id: photo.id,
      // thumb_size: photo.thumbs[ 1 ].size,
      // peer: {
      //   '_': 'inputPeerUser',
      //   user_id: d.id,
      //   access_hash: d.access_hash
      // },
      // local_id: 72967,
      // secret: d.photo.photo_small,
      // volume_id: "851322367",
      _: 'inputDocumentFileLocation',
    } : {
      ...photo.thumbs[ 1 ].location,
      peer: {
        _: 'inputPeerUser',
        user_id: message.from_id.user_id,
        access_hash: photo.access_hash,
      },
      _: 'inputDocumentFileLocation',
    };

    if (photo.mime_type === 'application/x-tgsticker') {
      const url = `https://i.imgur.com/iNkyqhY.png`;
      this.setState( { url, width: 50, height: 50 } );
      return;
    }

    if (photo.mime_type === 'video/mp4') {
      const url = `https://i.imgur.com/iNkyqhY.png`;
      this.setState( { url, width: 50, height: 50 } );
      return;
    }

    api.call( 'upload.getFile', {
      offset: 0,
      limit: 1024 * 1024,
      cdn_supported: true,
      precise: false,
      location,
    } ).then( d => {
      const url = `data:image/jpg;base64,${ bytesToBase64( d.bytes ) }`;
      this.setState( { url, width: 100, height: 100 } );
      // this.setState( { url, width: photo.thumbs[ 1 ].w, height: photo.thumbs[ 1 ].h } );
    } );
  }

  render() {
    const { url, width, height, isWebp } = this.state;
    if ( !url ) {
      return null;
    }
    // const user = users && users[replyMessage.from_id.user_id] || {}
    // const name = user.first_name ? (user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name) : user.last_name;

    return (
      <a className='im_message_media'>
        <div className='im_message_photo_thumb'>
          {isWebp ? <picture>
            <source srcSet={ url } type="image/webp" />
            <img src={ url } src={ url } style={ { width, height } } />
          </picture> : <LazyLoad><img src={ url } style={ { width, height } } /></LazyLoad>
          }
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
)( ImStickerMessage );
