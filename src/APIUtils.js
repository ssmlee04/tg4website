import fetch from 'isomorphic-fetch';
import { timeout } from 'promise-timeout';

const apiUrl = typeof window !== 'undefined' ? process.env.REACT_APP_TG_API_URL : 'https://tg.tradeideashq.com/api';

const checkStatus = response => {
  if ( response.status >= 200 && response.status <= 304 ) {
    return response;
  }
  if ( response.status === 429 ) {
    console.error( '⚠️ Too many requests. Please try again in a bit.');
  }
  return response.json().then( d => {
    const error = new Error( d.error );
    error.status = response.status;
    throw error;
  } );
};

const APIUtilsFn = {
  get: ( token, endpoint ) => {
    const url = `${ apiUrl }${ endpoint }`;
    return fetch( url, {
      headers: {
        Authorization: `Bearer ${ token }`,
        'Content-Type': 'application/json',
      },
    } )
      .then( checkStatus )
      .then( response => response.json() );
  },
  post: ( token, endpoint, body, query ) => {
    const url = `${ apiUrl }${ endpoint }`;

    return fetch( url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ token }`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( body ),
    } )
      .then( checkStatus )
      .then( response => response.json() );
  },
  put: ( token, endpoint, body, query ) => {
    const url = `${ apiUrl }${ endpoint }`;

    return fetch( url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${ token }`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( body ),
    } )
      .then( checkStatus )
      .then( response => response.json() );
  },
  del: ( token, endpoint ) => {
    const url = `${ apiUrl }${ endpoint }`;

    return fetch( url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${ token }`,
        'Content-Type': 'application/json',
      },
    } )
      .then( checkStatus )
      .then( response => response.json() );
  },
};

const APIUtils = {
  get: (token, endpoint) => {
    return timeout(APIUtilsFn.get(token, endpoint), 10000)
  },
  put: (token, endpoint, body, query) => {
    return timeout(APIUtilsFn.put(token, endpoint, body, query), 10000)
  },
  post: (token, endpoint, body, query) => {
    return timeout(APIUtilsFn.post(token, endpoint, body, query), 10000)
  },
  del: (token, endpoint) => {
    return timeout(APIUtilsFn.del(token, endpoint), 10000)
  }
}
export default APIUtils;
