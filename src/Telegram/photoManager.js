require( 'regenerator-runtime/runtime' );

function bytesToBase64 ( bytes ) {
  let mod3;
  let result = '';

  for ( let nLen = bytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++ ) {
    mod3 = nIdx % 3;
    nUint24 |= bytes[ nIdx ] << ( 16 >>> mod3 & 24 );
    if ( mod3 === 2 || nLen - nIdx === 1 ) {
      result += String.fromCharCode(
        uint6ToBase64( nUint24 >>> 18 & 63 ),
        uint6ToBase64( nUint24 >>> 12 & 63 ),
        uint6ToBase64( nUint24 >>> 6 & 63 ),
        uint6ToBase64( nUint24 & 63 ),
      );
      nUint24 = 0;
    }
  }

  return result
  return result.replace( /A(?=A$|$)/g, '=' );
}

function uint6ToBase64 ( nUint6 ) {
  return nUint6 < 26
    ? nUint6 + 65
    : nUint6 < 52
      ? nUint6 + 71
      : nUint6 < 62
        ? nUint6 - 4
        : nUint6 === 62
          ? 43
          : nUint6 === 63
            ? 47
            : 65;
}

const photoManager = ( () => {
  const map = {};
  const user = {};
  let hasNewEntry = false;

  return {
    bytesToBase64,
    get: async ( location, api ) => {
      function getBlob( location ) {
        return api.call( 'upload.getFile', {
          offset: 0,
          limit: 1024 * 1024,
          cdn_supported: true,
          precise: false,
          location,
        } );
      }

      const { local_id, volume_id } = location;
      if ( map[ `${ local_id }_${ volume_id }` ] ) {
        return map[ `${ local_id }_${ volume_id }` ];
      }
      try {
        const blob = await getBlob( location );
        map[ `${ local_id }_${ volume_id }` ] = `data:image/jpg;base64,${ bytesToBase64( blob.bytes ) }`;
        hasNewEntry = true;
        return map[ `${ local_id }_${ volume_id }` ];
      } catch(err) {
        console.log(err)
      }
    },
    fetch: () => {
      hasNewEntry = false;
      return user;
    },
    hasNew: () => hasNewEntry,
    getUser: ( id ) => user[ id ],
    lookup: async ( id, location, api ) => {
      user[ id ] = await photoManager.get( location, api );
    },
    set: ( id, url ) => {
      map[ id ] = url;
    },
  };
} )();

export default photoManager;
