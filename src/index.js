import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import createStore from './reduxStore';
import TelegramWidget from './Telegram/TelegramWidget';

const store = createStore();

class Tg4Web extends React.Component {
  render() {
    return (
      <ReduxProvider store={ store }>
        <TelegramWidget channelUsername={this.props.channelUsername} telegramApiId={this.props.telegramApiId} telegramApiHash={this.props.telegramApiHash} />
      </ReduxProvider>
    );
  }
}

export default Tg4Web;
