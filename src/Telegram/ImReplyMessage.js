import React from 'react';
import { connect } from 'react-redux';
import { getChannelMessage } from './../reduxStore';

class ImReplyMessage extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }
  componentDidMount() {
    const { reply_to_msg_id } = this.props;
    this.props.getChannelMessage( reply_to_msg_id ).then( d => {
      this.setState( { replyMessage: d.messages[ 0 ] } );
    } );
  }

  render() {
    const { replyMessage, users } = this.state;
    if ( !replyMessage ) {
      return null;
    }
    // const user = users && users[replyMessage.from_id.user_id] || {}
    // const name = user.first_name ? (user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name) : user.last_name;

    return (
      <a className='im_message_reply_wrap' ng-if='::historyMessage.reply_to_mid'>
        <div className='im_message_reply_wrap'>
          <div className='im_message_reply'>
            <div className='im_message_reply_border' />
            <div className='im_message_reply_author ng-scope'>
              {/* <span>{name}</span> */}
            </div>
            <div className='im_message_reply_body ng-scope' style={ { height: 28, paddingTop: 5, paddingLeft: 10 } }>
              <span className='im_short_message_text ng-binding ng-scope'>{replyMessage.message}</span>
            </div>
          </div>
        </div>
      </a>

    );
  }
}

const mapDispatchToProps = {
  getChannelMessage,
};

const mapStateToProps = state => ( {
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)( ImReplyMessage );
