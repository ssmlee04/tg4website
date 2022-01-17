import React from 'react';
import ImMessage from './ImMessage';

let _scrollTop = 0;

class ImBody extends React.Component {
  constructor( props ) {
    super( props );
    this.onChangeSubmit = this.onChangeSubmit.bind( this );
    this.submit = this.submit.bind( this );
    this.scrollToBottom = this.scrollToBottom.bind( this );
    this.handleScroll = this.handleScroll.bind( this );
    this.keyPress = this.keyPress.bind( this );
    
    this.state = {
    };
  }

  componentDidMount() {
    setTimeout( () => {
      this.scrollToBottom();
    }, 0 );
    if ( this.scrollWrap ) {
      this.scrollWrap.addEventListener( 'scroll', this.handleScroll );
    }
  }

  componentWillUnmount() {
    if ( this.scrollWrap ) {
      this.scrollWrap.removeEventListener( 'scroll', this.handleScroll );
    }
  }

  onChangeSubmit( e ) {
    this.setState( { text: e.target.value } );
  }

  handleScroll( e ) {
    const { hasNewMessages } = this.props;
    const scrollTop = this.scrollWrap.scrollTop;
    const scrollHeight = this.scrollWrap.scrollHeight;
    const clientHeight = this.scrollWrap.clientHeight;
    if ( scrollTop > _scrollTop && hasNewMessages && _scrollTop > 0 ) {
      this.props.setReadingNewMessages();
    }
    if ( scrollTop < 10 ) {
      this.loadMoreMessages();
    }
    _scrollTop = scrollTop;
  }

  keyPress( e ) {
    const { text } = this.state;
    if ( e.keyCode == 13 ) {
      this.props.sendTelegramMessage( text, () => {
        this.scrollToBottom()
      } );
      this.props.log( { type: 'telegram_send_msg' } );
      this.setState( { text: '' } );
    }
  }

  submit() {
    const { text } = this.state;
    this.props.sendTelegramMessage( text, () => {
      this.scrollToBottom()
    } );
    this.props.log( { type: 'telegram_send_msg' } );
    this.setState( { text: '' } );
  }

  loadMoreMessages() {
    const previousScrollHeight = this.scrollWrap.scrollHeight;
    this.props.loadMoreMessages( () => {
      this.scrollWrap.scrollTop = this.scrollWrap.scrollHeight - previousScrollHeight;
    } );
  }

  scrollToBottom() {
    // if ( this.messagesEnd ) {
    //   this.messagesEnd.scrollIntoViewIfNeeded();
    // }
    if ( this.scrollWrap ) {
      this.scrollWrap.scrollTop = 99999999;
    }
  }

  render() {
    const {
      messages = [], users, isLoggedin, user, hasNewMessages,
    } = this.props;
    const { text } = this.state;

    return (
      <React.Fragment>
        <div ref={ ( ref ) => this.scrollWrap = ref } className='mobile_scrollable_wrap height-400'>

          <div className='im_history_messages im_history_messages_group'>
          <div className='im_history_messages_peer'>      
          {messages.map( message => (
            <div className='im_history_message_wrap' key={ message.id }>
              <ImMessage message={ message } users={ users } isMessageOut={ user && user.user && user.user.id && message.from_id && message.from_id.user_id && message.from_id.user_id === user.user.id } />
            </div>
          ) )}
          <div
              style={ { float: 'left', clear: 'both', height: 0 } }
              ref={ ( el ) => {
              this.messagesEnd = el;
            } }
          />
          </div>
          </div>

          <div className='im_edit_panel_wrap' />
        </div>

        {hasNewMessages ? <div className='has-new-messages'>Scroll Down for New Messages...</div> : null}
        <audio controls autoPlay ref={(ref) => {
              window.audio = ref
          }}>
          <source src='https://gget.it/u1urz3zh/popsound.mp3' type="audio/mp4"/>
        </audio>

        <div className='im_send_field_panel p-2 form-inline'>
          {isLoggedin ? <input type='text' onKeyDown={ this.keyPress } value={ text } onChange={ this.onChangeSubmit } className='inline form-control im_message_field no_outline im_message_input' /> : <div onClick={ this.props.toggleLoginPanel } style={ { width: '90%', backgroundColor: '#5682a3' } } className='btn white start-btn'>Login To Telegram and Start Chatting</div>}
          <div className='inline-block' >
            <img
              className='tg-send-img'
              onClick={ isLoggedin ? this.submit : this.props.toggleLoginPanel }
              src='https://i.imgur.com/eUOdD98.png' 
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ImBody;
