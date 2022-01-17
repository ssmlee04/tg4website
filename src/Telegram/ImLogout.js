import React from 'react';
import Autocomplete from 'react-autocomplete';

class ImLogout extends React.Component {
  constructor( props ) {
    super( props );
    this.logout = this.logout.bind( this );
  }

  async logout() {
    this.props.log( { type: 'telegram_logout' } );
    this.props.logoutTelegram();
  }

  render() {
    return ( <div className='im_page_wrap'>
      <div className='im_history_col_wrap' >
        <div className='im_history_selected_wrap'>
          <div className='im_history_col'>
            <div className='im_history_wrap im_history_scrollable_wrap mobile_scrollable_wrap' style={ { height: 500 } }>
              <div className='im_history_scrollable p-3'>
                <div className='im_history'>

                  <div>
                    <h3 className='login_phone_head font-12 gray'>Logout:<span /></h3>
                    <div className='row'>
                      <div className='col-8 col-md-8' style={ { paddingRight: 0 } }>
                        <button className='btn btn-warning font-12' onClick={ this.logout } style={ { width: '100%' } }>Logout</button>
                      </div>
                    </div>
                  </div>

                  <div className='im_history_messages im_history_messages_group' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> );
  }
}

export default ImLogout;
