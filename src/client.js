import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import TelegramWidget from './Telegram/TelegramWidget';
import createStore from './reduxStore';

const store = createStore();

const render = (channelUsername, telegramApiId, telegramApiHash) => {
  const jsx = (
    <ReduxProvider store={ store }>
      <TelegramWidget channelUsername={channelUsername} telegramApiId={telegramApiId} telegramApiHash={telegramApiHash} />
    </ReduxProvider>
  );
  const el = document.createElement('div')
  document.body.append(el)
  ReactDOM.hydrate( jsx, el );
}

window.Tg4Web = (function(){
    var _args = {}; // private

    return {
        init: function(_channelUsername, _telegramApiId, _telegramApiHash) {
            const channelUsername = _channelUsername || process.env.REACT_APP_TG_CHANNEL_USERNAME;
            const telegramApiId = _telegramApiId || process.env.REACT_APP_TG_API_ID;
            const telegramApiHash = _telegramApiHash || process.env.REACT_APP_TG_API_HASH;
            render(channelUsername, telegramApiId, telegramApiHash);
        },
    };
}());
