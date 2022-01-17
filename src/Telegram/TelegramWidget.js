import React from 'react';
import { connect } from 'react-redux';
import store from 'store';
import ImHead from './ImHead';
import ImBody from './ImBody';
import ImLogin from './ImLogin';
import ImLogout from './ImLogout';
import ChatLoader from './ChatLoader';
import samples from './samples';
import APIUtils from './../APIUtils';
import './../../App.css';
// TODO: this is in App.css for now, figure out if there's a different
// way to add it
// import 'react-medium-image-zoom/dist/styles.css'
import {
  log,
  getChannelMeta,
  setReadingNewMessages,
  loadSampleMessages,
  signInTelegram,
  sendCode,
  sendTelegramMessage,
  initializeTelegram,
  getTelegramUser,
  getChannelMessages,
  setTelegramUsers,
  getTelegramState,
  checkOrJoinChat,
  logoutTelegram,
} from './../reduxStore';

class TelegramWidget extends React.Component {
  constructor( props ) {
    super( props );
    this.toggleLoginPanel = this.toggleLoginPanel.bind( this );
    this.toggleLogoutPanel = this.toggleLogoutPanel.bind( this );
    this.initialize = this.initialize.bind( this );
    this.loadMoreMessages = this.loadMoreMessages.bind( this );
    this.loadSampleMessages = this.loadSampleMessages.bind( this );
    this.initializeWhenChatMaximized = this.initializeWhenChatMaximized.bind( this );
    this.logoutTelegram = this.logoutTelegram.bind( this );
    this.toggleChat = this.toggleChat.bind( this );
    this.state = {
      isChatMaximized: store.get( 'isChatMaximized' ) || store.get( 'isChatMaximized' ) === undefined,
      isLoggingin: false,
      isLoggingout: false,
    };
  }

  toggleLoginPanel() {
    this.setState( { isLoggingin: !this.state.isLoggingin } );
  }

  toggleLogoutPanel() {
    this.setState( { isLoggingout: !this.state.isLoggingout } );
  }

  componentDidMount() {
    const { channelUsername, telegramApiId, telegramApiHash } = this.props;
    const { isChatMaximized } = this.state;
    this.initialize(telegramApiId, telegramApiHash);
    if (isChatMaximized) {
      this.initializeWhenChatMaximized(channelUsername);
    }
  }

  loadSampleMessages(fn) {
    this.props.loadSampleMessages(fn)
  }

  initializeWhenChatMaximized(channelUsername) {
    this.setState( { isInitialized: true } );
    this.loadSampleMessages()
    this.props.getTelegramUser();

    setInterval( () => {
      const { chat } = this.props;
      if ( chat ) {
        this.props.getChannelMessages( true );
      }
    }, 10000 );
  }

  toggleChat() {
    const { isChatMaximized, isInitialized } = this.state;
    const { channelUsername } = this.props;
    if (!isChatMaximized && !isInitialized) {
      this.initializeWhenChatMaximized(channelUsername);
    }
    store.set( 'isChatMaximized', !isChatMaximized );
    this.setState( { isChatMaximized: !isChatMaximized } );
  }

  initialize(telegramApiId, telegramApiHash) {
    const { channelUsername } = this.props;
    this.props.initializeTelegram(channelUsername, telegramApiId, telegramApiHash);
    this.props.getChannelMeta()
  }

  loadMoreMessages( fn ) {
    this.props.getChannelMessages( false, fn );
  }

  logoutTelegram() {
    this.setState( { isChatMaximized: false, isLoggingout: false, isInitialized: false } );
    this.props.logoutTelegram();
  }

  render() {
    const {
      user, 
      chat, 
      api, 
      messages = [],
    } = this.props;
    const { 
      isChatMaximized, 
      isLoggingin, 
      isLoggingout 
    } = this.state;
    const className = isChatMaximized ? 'telegram-chat' : 'telegram-chat-sm';
    if ( !api ) {
      return null;
    }

    const calculateViewPort = () => {
      if (isLoggingout && user) {
        return <ImLogout { ...this.props } logoutTelegram={this.logoutTelegram} />
      }
      if (isLoggingin && !user) {
        return <ImLogin { ...this.props } />
      }
      if (user) {
        return <div>
          <ChatLoader />
          {isChatMaximized && messages.length > 0 ? <ImBody loadMoreMessages={ this.loadMoreMessages } isLoggedin { ...this.props } /> : null}
        </div>
      } else {
        return <div>
          {isChatMaximized && messages.length > 0 ? <ImBody loadMoreMessages={ this.loadSampleMessages } toggleLoginPanel={ this.toggleLoginPanel } { ...this.props } /> : null}
        </div>
      }
    }

    return (
      <div style={{ all: 'initial' }}>
        <div className={ `${ className } telegram shadow round-corner-5` } style={ { overflow: 'hidden' } }>
          <div onClick={ this.toggleChat }>
            <ImHead chat={ chat } toggleLogoutPanel={ isChatMaximized && user ? this.toggleLogoutPanel : null } />
          </div>
          {calculateViewPort()}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  log,
  getChannelMeta,
  setReadingNewMessages,
  loadSampleMessages,
  signInTelegram,
  sendCode,
  sendTelegramMessage,
  getChannelMessages,
  setTelegramUsers,
  initializeTelegram,
  getTelegramUser,
  getTelegramState,
  checkOrJoinChat,
  logoutTelegram,
};

const mapStateToProps = state => ( {
  updateState: state.telegram.updateState,
  hasNewMessages: state.telegram.hasNewMessages,
  messages: state.telegram.messages,
  users: state.telegram.users,
  chat: state.telegram.chat,
  user: state.telegram.user,
  api: state.telegram.api,
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)( TelegramWidget );
