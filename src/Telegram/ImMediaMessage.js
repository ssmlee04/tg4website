import React from 'react';
import LazyLoad from 'react-lazy-load';
import Zoom from 'react-medium-image-zoom';
import { connect } from 'react-redux';
import { getChannelMessage } from './../reduxStore';
import photoManager from './photoManager';
const bytesToBase64 = photoManager.bytesToBase64;

class ImMediaMessage extends React.Component {
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

    const photo = message && message.media && message.media.photo;
    if (photo && photo[ 1 ]) {
      this.setState( { url: photo[ 1 ].imageUrl, width: photo[ 1 ]._width, height: photo[ 1 ]._height } );
      return;
    }

    this.setState( { width: photo.sizes[ 2 ].w, height: photo.sizes[ 2 ].h } );
    const location = photo.access_hash && photo.file_reference ? {
      file_reference: photo.file_reference,
      access_hash: photo.access_hash,
      id: photo.id,
      thumb_size: photo.sizes[ 2 ].type,
      // peer: {
      //   '_': 'inputPeerUser',
      //   user_id: d.id,
      //   access_hash: d.access_hash
      // },
      // local_id: 72967,
      // secret: d.photo.photo_small,
      // volume_id: "851322367",
      _: 'inputPhotoFileLocation',
    } : {
      ...photo.sizes[ 2 ].location,
      peer: {
        _: 'inputPeerUser',
        user_id: message.from_id.user_id,
        access_hash: photo.access_hash,
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
      this.setState( { url, width: photo.sizes[ 1 ].w, height: photo.sizes[ 1 ].h } );
    } );
  }

  render() {
    const { url, width, height } = this.state;
    // const user = users && users[replyMessage.from_id.user_id] || {}
    // const name = user.first_name ? (user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name) : user.last_name;

    return (
      <a className='im_message_media'>
        <div className='im_message_photo_thumb'>
          {url ? <Zoom><LazyLoad><img className='round-corner-5' src={ url } style={ { width, height } } /></LazyLoad></Zoom> : <div style={ { height }} />}
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
)( ImMediaMessage );
