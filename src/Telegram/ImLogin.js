import React from 'react';
import Autocomplete from 'react-autocomplete';
import { countries } from './samples';

class ImLogin extends React.Component {
  constructor( props ) {
    super( props );
    this.handleChangeCode = this.handleChangeCode.bind( this );
    this.handleChangePhone = this.handleChangePhone.bind( this );
    this.requestLogin = this.requestLogin.bind( this );
    this.login = this.login.bind( this );
    this.state = {
      isRequested: false,
      label: '',
    };
  }

  handleChangeCode( e ) {
    this.setState( { code: e.target.value } );
  }

  handleChangePhone( e ) {
    this.setState( { phone: e.target.value } );
  }

  async requestLogin() {
    const { phone, countryCode } = this.state;
    const { phone_code_hash: phoneCodeHash } = await this.props.sendCode( `${ countryCode }${ phone }` );
    this.setState( { phoneCodeHash, isRequested: true } );
  }

  async login() {
    const {
      phoneCodeHash, phone, code, countryCode,
    } = this.state;
    this.props.log( { type: 'telegram_login' } );
    this.props.signInTelegram( { code, phone: `${ countryCode }${ phone }`, phone_code_hash: phoneCodeHash } );
    this.setState( { isLogginin: true } );
  }

  render() {
    const {
      countryCode, code, label, phone, isRequested, isLogginin,
    } = this.state;

    return ( <div className='im_page_wrap'>
      <div className='im_history_col_wrap' >
        <div className='im_history_selected_wrap'>
          <div className='im_history_col'>
            <div className='im_history_wrap im_history_scrollable_wrap mobile_scrollable_wrap' style={ { height: 500 } }>
              <div className='im_history_scrollable p-3'>
                <div className='im_history'>

                  <div name='mySendCodeForm' ng-if='!credentials.phone_code_hash' ng-submit='sendCode()'>
                    <div className='login_form_head' my-i18n='login_sign_in'>Login to Telegram from your app</div>
                    {/*<div className='login_form_lead gray font-10' my-i18n='login_enter_number_description_md'>
                      Please choose your country and enter your phone number.
                    </div>*/}
                  </div>
                  <br />

                  <div>
                    <div className='row'>
                      <div className='col-8 col-md-8' style={ { paddingRight: 0 } }>
                        <div className='login_phone_head font-12 mt-1'>Country<span /></div>
                        <Autocomplete
                            getItemValue={ ( item ) => item.label }
                            items={ countries.filter( d => d.label.toLowerCase().indexOf( label.toLowerCase() ) > -1 ) }
                            wrapperStyle={ { lineHeight: '32px' } }
                            menuStyle={ { zIndex: 1000, padding: 5, fontSize: 12, border: '1px solid lightgray' } }
                            inputProps={ {
                            style: {
                              width: '100%', height: 30, border: '1px solid #ced4da', borderRadius: '0.25rem', paddingLeft: 10,
                            },
                          } }
                            renderItem={ ( item, isHighlighted ) =>
                            ( <div style={ { background: isHighlighted ? 'lightgray' : 'white', padding: 5 } }>
                              {item.label} <span className='font-20'>{item.flag}</span>
                            </div> )
                          }
                            value={ label }
                            onChange={ ( e ) => {
                            this.setState( { label: e.target.value } );
                          } }
                            onSelect={ ( label ) => {
                            const country = countries.find( d => d.label === label );
                            const countryCode = country && country.value || '+1';
                            this.setState( { label, countryCode } );
                          } }
                        />
                      </div>
                      <div className='col-4 col-md-4'>
                        <div className='login_phone_head font-12 mt-1'>Country Code<span /></div>
                        <input
                            type='text' className='form-control font-12' onChange={ ( e ) => {
                            this.setState( { countryCode: e.target.value } );
                          } } style={ { width: '100%' } } value={ countryCode }
                        />
                      </div>
                    </div>

                    <br />
                    <div className='login_phone_head font-12'>Phone Number<span /></div>
                    <div className='row'>
                      <div className='col-8 col-md-8' style={ { paddingRight: 0 } }>
                        <input type='text' className='form-control font-12' onChange={ this.handleChangePhone } style={ { width: '100%' } } value={ phone } />
                      </div>
                      <div className='col-4 col-md-4'>
                        <button disabled={ !phone || !countryCode || isRequested } onClick={ this.requestLogin } className='btn btn-warning font-12' style={ { width: '100%' } }>Send Code</button>
                      </div>
                    </div>

                    <br />
                    <div className='login_phone_head font-12'>Login Code<span /></div>
                    <div className='row'>
                      <div className='col-8 col-md-8' style={ { paddingRight: 0 } }>
                        <input type='text' disabled={ !isRequested } className='form-control font-12' onChange={ this.handleChangeCode } style={ { width: '100%' } } value={ code } />
                      </div>
                      <div className='col-4 col-md-4'>
                        <button className='btn btn-warning font-12' onClick={ this.login } disabled={ !isRequested || !code || isLogginin } style={ { width: '100%' } }>Login</button>
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

export default ImLogin;
