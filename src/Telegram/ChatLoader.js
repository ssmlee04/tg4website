import React from 'react';
import { connect } from 'react-redux';
import {
  checkOrJoinChat,
  getTargetGroupChat,
  getChannelMessages,
} from './../reduxStore';

class ChatLoader extends React.Component {
  componentDidMount() {
    this.props.checkOrJoinChat( () => {
      this.props.getTargetGroupChat();
      this.props.getChannelMessages();
    } );
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = {
  checkOrJoinChat,
  getTargetGroupChat,
  getChannelMessages,
};

const mapStateToProps = state => ( {
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)( ChatLoader );
