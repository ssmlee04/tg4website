import React from 'react';

class ImAvatar extends React.Component {
  render() {
    return (
      <img
        className='im_service_message_photo_thumb'
        my-load-thumb
        thumb='historyMessage.action.photo.thumb'
      />
    );
  }
}

export default ImAvatar;
