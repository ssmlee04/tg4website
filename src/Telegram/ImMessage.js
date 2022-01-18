import React from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import ImMediaMessage from './ImMediaMessage';
import ImVideoMessage from './ImVideoMessage';
import ImStickerMessage from './ImStickerMessage';
import ImReplyMessage from './ImReplyMessage';

const numInitial = ( initial ) => {
  const char = initial[ 0 ].toLowerCase();
  if ( char < 'd' ) {
    return 1;
  }
  if ( char < 'g' ) {
    return 2;
  }
  if ( char < 'k' ) {
    return 3;
  }
  if ( char < 'n' ) {
    return 4;
  }
  if ( char < 'r' ) {
    return 5;
  }
  if ( char < 't' ) {
    return 6;
  }
  if ( char < 'v' ) {
    return 7;
  }
  return 8;
};

function isUrl(s) {
   var regexp1 = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   var regexp2 = /^\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp1.test(s) || regexp2.test(s);
}

const replaceUrls = (str) => {
  return <React.Fragment>{str.replace(/\n/g, ' ').split(' ').map((token, i) => {
    if (isUrl(token)) {
      return <a key={i} href={token} target='_blank'>{token}</a>
    }
    return <span key={i}>{token} </span>
  })}</React.Fragment>
}
class ImMessage extends React.Component {
  render() {
    const { message, users, isMessageOut } = this.props;
    if (!message.from_id) return null;
    const user = users[ message.from_id.user_id ] || {};
    const initial = user.last_name && user.first_name ? user.first_name[ 0 ] + user.last_name[ 0 ] : ( user.first_name && user.first_name[ 0 ] || 'User' );
    const name = user.first_name ? ( user.last_name ? `${ user.first_name } ${ user.last_name }` : user.first_name ) : user.last_name;
    
    return (
      <div className='im_message_outer_wrap'>
        <div className='im_message_wrap clearfix' ng-switch="::historyMessage._ == 'messageService'">

          {/* <div className="im_content_message_wrap ng-scope im_message_in">
            <div className="im_bot_intro_message_wrap">
              <div className="im_bot_intro_message_header"></div>
              <div className="im_bot_intro_message"></div>
            </div>
            <div className="im_service_message">
              <a className="im_message_author" ng-if="::historyMessage.fromID > 0" my-peer-link="historyMessage.fromID" short="historyMessage.peerID > 0" color="historyMessage.peerID < 0" no-watch="true"></a>
              <span className="im_message_service" my-service-message="historyMessage"></span>
            </div>
          </div> */}

          <div className={ `im_content_message_wrap ng-scope ${ isMessageOut ? 'im_message_out' : 'im_message_in' }` }>
            <a className='im_message_from_photo pull-left peer_photo_init'>
              {user.photo_url ? <img src={ user.photo_url } className='peer_photo_init im_message_from_photo pull-left' /> : <span className={ `peer_initials nocopy im_message_from_photo pull-left user_bgcolor_${ numInitial( initial ) }` }>{initial}</span>}
            </a>

            <div className='im_message_meta'>
              <span className='im_message_date'>
                <span className='im_message_date_text'>
                  <span>{dayjs.unix( message.date ).format( 'h:mm a' ) }</span>
                </span>
              </span>
            </div>

            <div my-message-body='historyMessage'>
              <div className={ message.media && message.media.photo ? '' : 'im_message_body' } >

                <a className={ `im_message_author user_color_${ numInitial( initial ) }` }>{`${ name }`}</a>
                {message.reply_to ? <ImReplyMessage users={ users } reply_to_msg_id={ message.reply_to.reply_to_msg_id } /> : null}

                {message.message ? <div className='im_message_text' style={ { overflowWrap: 'break-word' } }>{replaceUrls(message.message)}</div> : null}
                {message.media && message.media.photo ? <ImMediaMessage users={ users } message={ message } /> : null}
                {message.media && message.media.video ? <ImVideoMessage users={ users } message={ message } /> : null}
                {message.media && message.media.document ? <ImStickerMessage users={ users } message={ message } /> : null}
                <div className='im_message_sign' />

              </div>

              <div className='im_message_keyboard' />

            </div>

          </div>
        </div>

      </div>

    );
  }
}

export default ImMessage;
