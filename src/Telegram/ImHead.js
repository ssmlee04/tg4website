import React from 'react';

class ImHead extends React.Component {
  toggleLogoutPanel(e) { 
    e.stopPropagation();
    this.props.toggleLogoutPanel();
  }

  render() {
    const { chat } = this.props;
    const numberOfUsers = chat && chat.numberOfUsers || 50
    const title = chat && chat.title || 'Chat Group'
    const logoUrl = chat && chat.logo || '';

    return (
      <div className='tg_page_head'>
        <div className='navbar-static-top navbar-inverse' style={ { height: 50 } }>
          <div className='row no-gutters'>

            <div className='col-md-10 col-10'>
              <div className='pl-2 pt-1'>
                <div className='im_head_title'>{title}</div>
                <div className='im_head_subtitle'>{numberOfUsers} members.</div>
              </div>
            </div>
            <div className='col-md-2 col-2'>
              <div className='navbar-peer-wrap peer_photo_init right'>
                <img src={logoUrl} onClick={this.toggleLogoutPanel.bind(this)} />
              </div>
            </div>

            {/* <div className="navbar-toggle-wrap dropdown" dropdown ng-switch="!curDialog.peer">
              <ul ng-switch-when="true" className="dropdown-menu">
                <li><a ng-click="openGroup()" my-i18n="head_new_group"></a></li>
                <li><a ng-click="importContact()" my-i18n="head_new_contact"></a></li>
                <li ng-if="!isEmpty.contacts"><a ng-click="openContacts()" my-i18n="head_contacts"></a></li>
                <li><a ng-click="openSettings()" my-i18n="head_settings"></a></li>
                <li><a ng-click="logOut()" my-i18n="head_log_out"></a></li>
              </ul>
              <ul className="dropdown-menu">
                <li><a ng-click="toggleEdit()" my-i18n="head_select_messages"></a></li>
                <li ng-if="!historyFilter.mediaType" className="divider"></li>
                <li ng-if="!historyFilter.mediaType"><a ng-click="toggleMedia('photos')" my-i18n="head_media_photos"></a></li>
                <li ng-if="!historyFilter.mediaType"><a ng-click="toggleMedia('video')" my-i18n="head_media_video"></a></li>
                <li ng-if="!historyFilter.mediaType"><a ng-click="toggleMedia('documents')" my-i18n="head_media_documents"></a></li>
                <li ng-if="!historyFilter.mediaType"><a ng-click="toggleMedia('music')" my-i18n="head_media_music"></a></li>
                <li ng-if="!historyFilter.mediaType"><a ng-click="toggleMedia('urls')" my-i18n="head_media_links"></a></li>
                <li ng-if="!historyFilter.mediaType"><a ng-click="toggleMedia('audio')" my-i18n="head_media_audio"></a></li>
                <li ng-if="!historyFilter.mediaType"><a ng-click="toggleMedia('round')" my-i18n="head_media_round"></a></li>
                <li ng-if="!historyFilter.mediaType && isHistoryPeerGroup()" className="divider"></li>
                <li ng-if="!historyFilter.mediaType && isHistoryPeerGroup()"><a ng-click="toggleMedia('mentions')" my-i18n="head_media_mymentions"></a></li>
              </ul>
            </div> */}

            {/* <a className="navbar-search-wrap" ng-click="toggleSearch()">
              <i className="icon-search"></i>
            </a> */}

            {/* <div className="navbar-header">

              <a className="navbar-brand tg_logo_wrap" href="#/im"><i className="icon icon-tg-logo"></i><i className="icon icon-tg-title"></i></a>

              <span className="tg_head_logo"></span>

              <div className="tg_head_peer_menu_wrap" ng-switch="curDialog.peer &amp;&amp; historyFilter.mediaType.length > 0">
                <ul ng-switch-when="true" className="nav navbar-nav navbar-quick-nav">
                  <li>
                    <a ng-click="toggleMedia()" className="navbar-quick-media-back">
                      <div className="navbar-quick-back-title" ng-switch="historyFilter.mediaType">
                        <h4 ng-switch-when="photos" my-i18n="im_media_photos"></h4>
                        <h4 ng-switch-when="video" my-i18n="im_media_video"></h4>
                        <h4 ng-switch-when="documents" my-i18n="im_media_documents"></h4>
                        <h4 ng-switch-when="audio" my-i18n="im_media_audio"></h4>
                        <h4 ng-switch-when="round" my-i18n="im_media_round"></h4>
                        <h4 ng-switch-when="music" my-i18n="im_media_music"></h4>
                        <h4 ng-switch-when="urls" my-i18n="im_media_links"></h4>
                        <h4 ng-switch-when="mentions" my-i18n="im_media_mentions"></h4>
                      </div>
                    </a>
                  </li>
                </ul>
                <div ng-switch="historyState.selectActions">
                  <ul ng-switch-when="selected" className="nav navbar-navbar navbar-quick-nav navbar-history-edit">
                    <li className="navbar-quick-right">
                      <a ng-click="toggleEdit()" my-i18n="modal_cancel"></a>
                    </li>
                    <li className="navbar-quick-left">
                      <a ng-click="selectedFlush()" my-i18n="head_clear_all"></a>
                    </li>
                    <li className="navbar-quick-title" my-i18n="head_select"></li>
                  </ul>
                  <ul className="nav navbar-nav navbar-quick-nav" ng-switch="historyPeer.id > 0">
                    <li ng-switch-when="true">
                      <a href="#/im" className="navbar-quick-profile-back">
                        <div className="navbar-quick-back-title">
                          <h4 my-peer-link="historyPeer.id" peer-watch="true"></h4>
                          <small ng-switch="historyState.typing.length">
                            <span ng-switch-when="1" className="status_online">
                              <my-i18n msgid="head_typing"></my-i18n><span my-loading-dots></span>
                            </span>
                            <span my-user-status="historyPeer.id" for-dialog="true"></span>
                          </small>
                        </div>
                      </a>
                    </li>
                    <li ng-switch-default>
                      <a href="#/im" className="navbar-quick-group-back">
                        <div className="navbar-quick-back-title">
                          <h4 my-peer-link="historyPeer.id" peer-watch="true" for-dialog="true"></h4>
                          <small ng-switch="historyState.typing.length">
                            <span ng-switch-when="0" className="tg_head_peer_status" my-chat-status="-historyPeer.id"></span>
                            <my-i18n>
                              <span ng-switch-when="1" className="status_online" my-i18n-format="head_one_typing"></span>
                              <span ng-switch-when="2" className="status_online" my-i18n-format="head_two_typing"></span>
                              <span className="status_online" my-i18n-format="head_many_typing"></span>
                              <my-i18n-param name="name1"><span my-peer-link="historyState.typing[0]" short="true"></span></my-i18n-param>
                              <my-i18n-param name="name2"><span my-peer-link="historyState.typing[1]" short="true"></span></my-i18n-param>
                              <my-i18n-param name="names" ng-bind="historyState.typing.length - 1"></my-i18n-param>
                              <my-i18n-param name="dots"><span my-loading-dots></span></my-i18n-param>
                            </my-i18n>
                          </small>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="navbar-menu" ng-if="offline">

              <ul className="nav navbar-nav navbar-offline">
                <li ng-show="!offlineConnecting"><span className="navbar-offline-text"><my-i18n msgid="head_waiting_for_network"></my-i18n><span my-loading-dots></span></span></li>
                <li ng-show="!offlineConnecting" className="hidden-xs"><a href="" ng-click="retryOnline()" my-i18n="head_retry"></a></li>
                <li ng-show="offlineConnecting"><span className="navbar-offline-text"><my-i18n msgid="head_connecting"></my-i18n><span my-loading-dots></span></span></li>
              </ul>
            </div> */}

          </div>
        </div>
      </div>

    );
  }
}

export default ImHead;
