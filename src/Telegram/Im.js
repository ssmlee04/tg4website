import React from 'react';
import ImHead from './ImHead';
import ImMessage from './ImMessage';

class Im extends React.Component {
  render() {
    const { messages, users, api } = this.props;

    return (
      <div>
        <ImHead { ...this.props } />

        <div className='im_page_wrap'>

          <div className='im_page_split clearfix'>

            <div ng-controller='AppImDialogsController' my-dialogs className='im_dialogs_col_wrap'>
              <div className='im_dialogs_panel'>
                <div className='im_dialogs_search'>
                  <input className='form-control im_dialogs_search_field no_outline' type='search' placeholder="{{'modal_search' | i18n}}" ng-model='search.query' autoComplete='off' />
                  <a className='im_dialogs_search_clear tg_search_clear' ng-click='searchClear()' ng-show='search.query.length'>
                    <i className='icon icon-search-clear' />
                  </a>
                </div>
              </div>

              <div my-dialogs-list-mobile className='im_dialogs_col im_dialogs_scrollable_wrap mobile_scrollable_wrap' style={ { height: 400 } }>

                <div className='im_dialogs_empty_wrap' ng-if='isEmpty.contacts' my-vertical-position='0.4'>
                  <h3 className='im_dialogs_empty_header' />
                  <p className='im_dialogs_empty_lead' />
                  <button type='button' className='btn btn-primary btn-block im_dialogs_add_contact' ng-click='importContact()' />
                  <button ng-if='phonebookAvailable' type='button' className='btn btn-primary btn-block im_dialogs_import_phonebook' ng-click='importPhonebook()' />
                </div>

                <ul className='nav nav-pills nav-stacked'>
                  <li className='im_dialog_wrap' my-dialog dialog-message='dialogMessage' ng-repeat='dialogMessage in dialogs track by dialogMessage.peerID' />
                </ul>

                <div className='im_dialogs_contacts_wrap' ng-show='myResults.length > 0'>
                  <h5/>
                  <ul className='nav nav-pills nav-stacked'>
                    <li className='im_dialog_wrap' ng-repeat='myResult in myResults track by myResult.id' ng-className='{active: curDialog.peerID == myResult.id}'>
                      <a className='im_dialog' ng-mousedown='dialogSelect(myResult.peerString)'>
                        <div className='im_dialog_photo pull-left' my-peer-photolink='myResult.id' img-className='im_dialog_photo' watch='true' for-dialog='true' />
                        <div className='im_dialog_message_wrap'>
                          <div className='im_dialog_peer'>
                            <span className='im_dialog_user' my-peer-link='myResult.id' verified='true' for-dialog='true' />
                          </div>
                          <div className='im_dialog_message' ng-switch='myResult.id > 0'>
                            <span ng-switch-when='true' className='im_dialog_message_text' my-user-status='::myResult.id' for-dialog='true' />
                            <span className='im_dialog_message_text' my-chat-status='::-myResult.id' />
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className='im_dialogs_contacts_wrap' ng-show='foundPeers.length > 0'>
                  <h5 />
                  <ul className='nav nav-pills nav-stacked'>
                    <li className='im_dialog_wrap' ng-repeat='foundPeer in foundPeers track by foundPeer.id' ng-className='{active: curDialog.peerID == foundPeer.id}'>
                      <a className='im_dialog' ng-mousedown='dialogSelect(foundPeer.peerString)'>
                        <div className='im_dialog_photo pull-left' my-peer-photolink='foundPeer.id' img-className='im_dialog_photo' watch='true' for-dialog='true' />
                        <div className='im_dialog_message_wrap'>
                          <div className='im_dialog_peer'>
                            <span className='im_dialog_user' my-peer-link='foundPeer.id' verified='true' for-dialog='true' />
                          </div>
                          <div className='im_dialog_message'>
                            <span className='im_dialog_message_text' ng-switch='foundPeer.id > 0'>
                              <span ng-bind="::'@' + foundPeer.username + ', '" />
                              <span ng-switch-when='true' className='im_dialog_message_text' my-user-status='::foundPeer.id' for-dialog='true' />
                              <span className='im_dialog_message_text' my-chat-status='::-foundPeer.id' />
                            </span>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className='im_dialogs_messages_wrap' ng-show='foundMessages.length > 0'>
                  <h5 />
                  <ul className='nav nav-pills nav-stacked'>
                    <li className='im_dialog_wrap' my-dialog dialog-message='dialogMessage' ng-repeat='dialogMessage in foundMessages track by dialogMessage.mid' ng-className='{active: curDialog.peerID == dialogMessage.peerID &amp;&amp; curDialog.messageID == dialogMessage.mid}' />
                  </ul>
                </div>

              </div>
            </div>

            <div className='im_history_col_wrap' ng-controller='AppImHistoryController' ng-className='{im_history_loaded: state.loaded}'>

              <div className='im_history_not_selected_wrap im_history_not_selected' my-vertical-position='0.35' padding='true'>
                <span my-loading-dots />
              </div>

              <div className='im_history_selected_wrap'>
                <div my-history-mobile className='im_history_col'>

                  <div my-peer-pinned-message-bar='curDialog.peerID' className='im_history_pinned_panel' />

                  <div className='im_history_wrap im_history_scrollable_wrap mobile_scrollable_wrap' style={ { height: 400 } }>

                    <div className='im_history_scrollable'>
                      <div className='im_history' ng-className='{im_history_selectable: !historyState.botActions, im_history_select_active: historyState.selectActions}'>
                        <div ng-if='state.empty' className='im_history_empty' ng-switch='state.mayBeHasMore' my-vertical-position='0.25' padding='true'>
                          <span ng-switch-when='true'>
                            <my-i18n msgid='im_loading_history' /><span my-loading-dots />
                          </span>
                          <span my-i18n='im_no_messages' />
                        </div>

                        <div className='im_history_messages im_history_messages_group' ng-className='{im_history_messages_group: historyPeer.id < 0}'>
                          <div className='im_history_messages_peer' ng-show='peerHistory.peerID == historyPeer.id' ng-repeat='peerHistory in peerHistories'>
                            {messages.map( message => (
                              <div className='im_history_message_wrap'>
                                <ImMessage api={ api } message={ message } users={ users } />
                              </div>
                            ) )}
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                  <div className='im_bottom_panel_wrap'>

                    <div className='im_edit_panel_wrap clearfix' ng-show='historyState.actions()' ng-switch='historyState.actions()'>
                      <div className='im_edit_panel_border' />

                      <div ng-switch-when='bot'>
                        <a ng-show="historyState.botActions == 'param'" className='btn btn-md btn-md-primary im_edit_cancel_link' ng-click='cancelBot()' my-i18n='modal_cancel' />
                        <div className='im_edit_start_actions'>
                          <a className='btn btn-primary im_start_btn' ng-click='startBot()' my-i18n='im_start' />
                        </div>
                      </div>
                      <div ng-switch-when='channel'>
                        <div className='im_edit_start_actions' ng-switch='historyState.channelActions'>
                          <a ng-switch-when='join' className='btn btn-primary im_start_btn' ng-click='joinChannel()' my-i18n='im_channel_join' />
                          <a ng-switch-when='mute' className='btn btn-link im_start_btn' ng-click='togglePeerMuted(true)' my-i18n='im_channel_mute' />
                          <a ng-switch-when='unmute' className='btn btn-link im_start_btn' ng-click='togglePeerMuted(false)' my-i18n='im_channel_unmute' />
                        </div>
                      </div>
                      <div ng-switch-when='selected' className='im_edit_selected_actions' my-i18n>
                        <a className='btn btn-primary im_edit_forward_btn' ng-click='selectedForward()' ng-className='{disabled: !selectedCount}' ng-disabled='!selectedCount' my-i18n-format='im_forward' /><a className='btn btn-primary im_edit_delete_btn' ng-click='selectedDelete()' ng-className='{disabled: !selectedCount}' ng-disabled='!selectedCount' my-i18n-format='im_delete' ng-show='historyState.canDelete' />
                        <my-i18n-param name='count'><strong className='im_selected_count' ng-show='selectedCount > 0' ng-bind='selectedCount' /></my-i18n-param>
                      </div>
                    </div>

                    <div className='im_send_panel_wrap' ng-show='!historyState.actions()'>

                      <div className='im_send_form_wrap1'>

                        <div className='im_send_form_wrap clearfix' ng-controller='AppImSendController'>
                          <div my-send-form draft-message='draftMessage' mentions='mentions' commands='commands' reply-keyboard='historyState.replyKeyboard' />
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}

export default Im;
