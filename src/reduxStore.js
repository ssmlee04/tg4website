/* eslint-disable camelcase */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import React from 'react';
import store from 'store';
import thunkMiddleware from 'redux-thunk';
import APIUtils from './APIUtils';
const _merge = (obj1, obj2) => {
  return {...obj1, ...obj2}
}

const uniqBy = (arr, predicate) => {
  const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];
  
  return [...arr.reduce((map, item) => {
    const key = (item === null || item === undefined) ? 
      item : cb(item);
    
    map.has(key) || map.set(key, item);
    
    return map;
  }, new Map()).values()];
};

const wsUrl = process.env.REACT_APP_WS_URL;
const MTProto = require('@mtproto/core/envs/browser');
require("regenerator-runtime/runtime");
import photoManager from './Telegram/photoManager.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const initializeTelegram = (channelUsername, telegramApiId, telegramApiHash) => ( dispatch, getState ) => {
  dispatch( {
    type: 'TELEGRAM_API_SET',
    payload: { channelUsername, telegramApiId, telegramApiHash },
  } );

  const mtproto = new MTProto({
    api_id: telegramApiId,
    api_hash: telegramApiHash,
  });

  mtproto.updateInitConnectionParams({
    app_version: '10.0.0',
  });

  mtproto.call('help.getNearestDc').then(result => {
    console.log(`country:`, result.country);
  });

  mtproto.updates.on('updates', message => {
    if (!message) return;
    const { updates = [] } = message;
    const newMessages = updates.filter(d => d._ === 'updateNewChannelMessage').map(d => d.message)
    const deleteMessages = updates.filter(d => d._ === 'updateDeleteChannelMessages')

    if (deleteMessages.length > 0) {
      const messageIds = deleteMessages[0].messages
       dispatch( {
        type: 'TELEGRAM_DELETE_MESSAGES',
        payload: { messageIds },
      } );

    } else {
      if (!message.chats || !message.chats[0]) return;
      if (message.chats[0].username !== channelUsername) return;
      if (newMessages.length === 0) return;
      const users = message.users;

      if (window.audio) {
        window.audio.play()
      }

      dispatch( {
        type: 'TELEGRAM_GET_NEW_MESSAGES',
        payload: { messages: newMessages, users },
      } );
    }
  });

  const api = {
    call(method, params, options = {}) {
      return mtproto.call(method, params, options)
      .catch(async error => {
        console.log(`${method} error:`, error);

        const { error_code, error_message } = error;

        if (error_code === 420) {
          const seconds = +error_message.split('FLOOD_WAIT_')[1];
          const ms = seconds * 1000;

          await sleep(ms);

          return this.call(method, params, options);
        }

        if (error_code === 303) {
          const [type, dcId] = error_message.split('_MIGRATE_');

          // If auth.sendCode call on incorrect DC need change default DC, because call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
          if (type === 'PHONE') {
            await mtproto.setDefaultDc(+dcId);
          } else {
            options = {
              ...options,
              dcId: +dcId,
            };
          }

          return this.call(method, params, options);
        }

        return Promise.reject(error);
      });
    },
  };

  dispatch( {
    type: 'TELEGRAM_API_SET',
    payload: { api },
  } );

  setInterval(() => {
    if (photoManager.hasNew()) {
      const images = photoManager.fetch();
      const users = Object.keys(images).reduce((t, id) => {
        if (t[id]) {
          t[id].photo_url = images[id]
        }
        return t;
      }, JSON.parse(JSON.stringify(getState().telegram.users)))
      dispatch( {
        type: 'TELEGRAM_USER_SET',
        payload: { users },
      } );
    }
  }, 500)
}

export const getTelegramUser = ( ) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  if ( !api ) {
    return;
  }
  api.call('users.getFullUser', {
    id: {
      _: 'inputUserSelf',
    },
  }).then(user => {
    dispatch( {
      type: 'TELEGRAM_USER_SET',
      payload: { user, userAccessHash: user.access_hash },
    } );
  }).catch(err => {
    dispatch( {
      type: 'TELEGRAM_USER_SET_ERROR',
    } );
  })
};

export const log = ( msg ) => ( dispatch, getState ) => {
  // APIUtils.post( getState().users.token, '/logs', { msg } );
};

export const checkOrJoinChat = ( fn ) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  if ( !api ) {
    return;
  }
  const chatOld = getState().telegram.chat;
  const channelUsername = getState().telegram.channelUsername;
  
  api.call('contacts.resolveUsername', {
    username: channelUsername
  }).then(c => {
    const chat = c.chats[0]
    const chatAccessHash = chat.access_hash
    const chatId = chat.id
    dispatch( {
      type: 'TELEGRAM_SET',
      payload: { chatAccessHash, chatId },
    } );

    Promise.resolve()
    .then(() => {
      if (chat.left) {
        return api.call('channels.joinChannel', {
          channel: {
            access_hash: chatAccessHash,
            channel_id: chatId,
            _: "inputChannel"
          }
        });
      }
    }).then(() => {
      return api.call('channels.getFullChannel', {
        channel: {
          access_hash: chatAccessHash,
          channel_id: chatId,
          _: "inputChannel"
        },
      })
    }).then(chat => {
      chat.title = chat && chat.chats && chat.chats[0] && chat.chats[0].title
      chat.numberOfUsers = chat && chat.full_chat && chat.full_chat.participants_count
      dispatch( {
        type: 'TELEGRAM_SET',
        payload: { chat: _merge(chatOld, chat) },
      } );
      if (fn) fn()
    })
  })
};

export const getTelegramState = ( ) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  if ( !api ) {
    return;
  }
  api.call('updates.getState', {
  }).then(updateState => {
    dispatch( {
      type: 'TELEGRAM_SET',
      payload: { updateState },
    } );
  })
};

export const sendCode = ( phone ) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  const telegramApiId = getState().telegram.telegramApiId;
  const telegramApiHash = getState().telegram.telegramApiHash;
  if ( !api ) {
    return;
  }
  return api.call('auth.sendCode', {
    phone_number: phone,
    api_id: telegramApiId,
    api_hash: telegramApiHash,
    settings: {
      _: 'codeSettings',
    },
  });
};

export const logoutTelegram = () => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  if ( !api ) {
    return;
  }
  dispatch( {
    type: 'TELEGRAM_USER_SET',
    payload: { user: null, messages: [], users: {} },
  } );
  return api.call('auth.logOut', {});
};

export const signInTelegram = ({ code, phone, phone_code_hash }) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  if ( !api ) {
    return;
  }
  return api.call('auth.signIn', {
    phone_code: code,
    phone_number: phone,
    phone_code_hash: phone_code_hash,
  }).then(user => {
    dispatch( {
      type: 'TELEGRAM_USER_SET',
      payload: { user, messages: [], users: {} },
    } );
  })
};

export const sendTelegramMessage = ( message, fn ) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  const messages = getState().telegram.messages || [];
  const chatAccessHash = getState().telegram.chatAccessHash;
  const chatId = getState().telegram.chatId;
  if ( !api ) {
    return;
  }
  api.call('messages.sendMessage', {
    random_id: parseInt(Math.random() * 99999999999, 10),
    message,
    flags: 128,
    reply_to_msg_id: 0,
    type: "sendMessage",
    peer: {
      access_hash: chatAccessHash,
      channel_id: chatId,
      _: "inputPeerChannel"
    }
  }).then(d => {
    const msgs = d.updates.filter(d => d._ === 'updateNewChannelMessage').map(d => d.message)
    let newMessages = messages.concat(msgs)
    newMessages = uniqBy(newMessages, d => d.id)
    const messagesOffsetEnd = newMessages[newMessages.length - 1].id
    const messagesOffsetStart = newMessages[0].id
    dispatch( {
      type: 'TELEGRAM_SET',
      payload: { messages: newMessages, messagesOffsetStart, messagesOffsetEnd, hasNewMessages: true },
    } );
    if (fn) {
      fn()
    }
  })
};

export const getTargetGroupChat = ( fn ) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  const chatId = getState().telegram.chatId;
  if ( !api ) {
    return;
  }
  api.call('messages.getAllChats', {
    except_ids: []
  }).then(({ chats }) => {
    return chats.find(d => d.id === chatId)
  }).then(chat => {
    if (!chat) {
      fn(new Error())
      return;
    }
    dispatch( {
      type: 'TELEGRAM_SET',
      payload: { chatAccessHash: chat.access_hash },
    } );
    if (fn) {
      fn()
    }
  })
};

export const joinChannel = (fn) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  const userAccessHash = getState().telegram.userAccessHash;
  const chatId = getState().telegram.chatId;
  if ( !api ) {
    return;
  }
  api.call('channels.joinChannel', {
    channel: {
      access_hash: userAccessHash,
      channel_id: chatId,
      _: "inputChannel"
    },
  }).then(chat => {
    if (fn) {
      fn()
    }
    // dispatch( {
    //   type: 'TELEGRAM_SET',
    //   payload: { chatAccessHash: chat.access_hash },
    // } );
  }).catch(err => {
    console.log({err})
  })
};

export const getChannelMessage = ( id ) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  const chatAccessHash = getState().telegram.chatAccessHash;
  const chatId = getState().telegram.chatId;
  return api.call('channels.getMessages', {
    channel: {
      access_hash: chatAccessHash,
      channel_id: chatId,
      _: "inputChannel"
    },
    id: [{id: id, _: 'inputMessageID'}]
  })
}

export const setReadingNewMessages = (  ) => ( dispatch, getState ) => {
  dispatch({
      type: 'TELEGRAM_SET',
      payload: { hasNewMessages: false },
    })
}

export const getChannelMeta = () => ( dispatch, getState ) => {
  const channelUsername = getState().telegram.channelUsername;
  APIUtils.get( getState().users.token, `/chats/${channelUsername}` ).then( ( { chat } ) => {
    dispatch({
      type: 'TELEGRAM_SET',
      payload: { chat },
    })
  });
};

export const setTelegramUsers = ( users ) => ( dispatch, getState ) => {
  const oldUsers = getState().telegram.users;
  dispatch({
      type: 'TELEGRAM_SET',
      payload: { users: _merge(oldUsers, users) },
    })
}

export const loadSampleMessages = ( fn ) => ( dispatch, getState ) => {
  const isLoggedin = getState().telegram.isLoggedin;
  const channelUsername = getState().telegram.channelUsername;
  const isLoadingMessages = getState().telegram.isLoadingMessages;
  const oldMessages = getState().telegram.messages || [];
  const oldUsers = getState().telegram.users;
  const skip = oldMessages.length || 0;

  if (isLoadingMessages) {
    return;
  }
  dispatch( {
    type: 'TELEGRAM_SET',
    payload: { isLoadingMessages: true, isSample: true },
  } );

  APIUtils.get( getState().users.token, `/chats/${channelUsername}/messages?skip=${skip}` ).then( ( info ) => {
    const messages = (info.messages || []).map(d => {
      return {
        _: 'message',
        id: d.msg._messageId,
        from_id: { _: 'peerUser', user_id: d.msg._from._id },
        peer_id: { _: 'peerChannel', channel_id: d.msg._chat._id },
        date: d.msg._date,
        message: d.msg._text,
        media: {
          video: d.msg._video,
          photo: d.msg._photo,
          document: d.msg._sticker,
        }
      }
    }).reverse();
    const users = (info.messages || []).reduce((t, d) => {
      t[d.msg._from._id] = {
        photo_url: d.msg._from.imageUrl,
        last_name: d.msg._from._lastName,
        first_name: d.msg._from._firstName
      }
      return t;
    }, {})
    const newMessages = uniqBy(messages.concat(oldMessages), d => d.id)
    const newUsers = _merge(oldUsers, users)
    dispatch( {
      type: 'TELEGRAM_SET',
      payload: { users: newUsers, messages: newMessages, isLoadingMessages: false },
    } );

    if (fn) fn()
  } );
}

export const getChannelMessagesFn = ( msgUsers, oldUsers, msgMessages, oldMessages, isAfter, api ) => {
  const msgUsersWithImages = msgUsers.reduce((t, d) => {
    // if (d.photo) {
    //   const location = {
    //     ...d.photo.photo_small,
    //     // dc_id: d.photo.dc_id,
    //     big: false,
    //     peer: {
    //       '_': 'inputPeerUser',
    //       user_id: d.id,
    //       access_hash: d.access_hash
    //     },
    //     _: "inputPeerPhotoFileLocation",
    //   }
    //   photoManager.lookup(d.id, location, api)
    // }
    t[d.id] = d;
    return t
  }, {})
  const users = _merge(msgUsersWithImages, oldUsers)
  const messages = uniqBy(!isAfter ? msgMessages.reverse().concat(oldMessages) : oldMessages.concat(msgMessages.reverse()), d => d.id)
  return { users, messages }
}

export const getChannelMessages = ( isAfter, fn ) => ( dispatch, getState ) => {
  const api = getState().telegram.api;
  const user = getState().telegram.user;
  const isSample = getState().telegram.isSample;
  const hasNewMessagesOld = getState().telegram.hasNewMessages;
  const isLoadingMessages = getState().telegram.isLoadingMessages;
  const chatAccessHash = getState().telegram.chatAccessHash;
  const messagesOffsetStart = getState().telegram.messagesOffsetStart || 0;
  const messagesOffsetEnd = getState().telegram.messagesOffsetEnd || 0;
  const oldUsers = getState().telegram.users;
  const oldMessages = isSample ? [] : (getState().telegram.messages || []);
  const chatId = getState().telegram.chatId;
  if ( !api ) {
    return;
  }
  if ( !user ) {
    return;
  }
  if (isLoadingMessages) {
    return;
  }
  if (!isAfter) {
    dispatch( {
      type: 'TELEGRAM_SET',
      payload: { isLoadingMessages: true },
    } );
  }
  return api.call('messages.getHistory', {
    add_offset: !isAfter ? 0 : -20,
    limit: 20,
    offset_id: !isAfter ? messagesOffsetStart : messagesOffsetEnd,
    peer: {
      access_hash: chatAccessHash,
      channel_id: chatId,
      _: "inputPeerChannel"
    }
  }).then(msg => {
    const { messages, users } = getChannelMessagesFn(msg.users, oldUsers, msg.messages, oldMessages, isAfter, api)
    const messagesOffsetEnd = messages[messages.length - 1].id
    const messagesOffsetStart = messages[0].id
    const hasNewMessages = hasNewMessagesOld || (isAfter && (oldMessages.length < messages.length))

    dispatch( {
      type: 'TELEGRAM_SET',
      payload: { isSample: false, isLoadingMessages: false, hasNewMessages, messages, users, messagesOffsetStart, messagesOffsetEnd },
    } );
    if (fn) fn()
  })
};

const userReducer = ( state = {}, action ) => {
  return state;
};

const telegramReducer = ( state = { isLoggedin: false, chat: {} }, action ) => {
  const oldUsers = state.users;
  const oldMessages = state.messages || [];
  const api = state.api;
  if (action.type === 'TELEGRAM_API_SET') {
    return { ...state, ...action.payload };
  }
  if (action.type === 'TELEGRAM_USER_SET') {
    return { ...state, ...action.payload };
  }
  if (action.type === 'TELEGRAM_SET') {
    return { ...state, ...action.payload };
  }
  if (action.type === 'TELEGRAM_GET_NEW_MESSAGES') {
    const { messages, users } = getChannelMessagesFn(action.payload.users, oldUsers, action.payload.messages, oldMessages, true, api)
    return { ...state, messages, users, hasNewMessages: true };
  }
  if (action.type === 'TELEGRAM_DELETE_MESSAGES') {
    const messageIds = action.payload.messageIds || []
    const messages = oldMessages.filter(d => messageIds.indexOf(d.id) === -1)
    return { ...state, messages };
  }
  return state
};

const reducer = combineReducers( {
  telegram: telegramReducer,
  users: userReducer,
} );

export default ( initialState ) =>
  createStore( reducer, initialState, applyMiddleware( thunkMiddleware ) );
