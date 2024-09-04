import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";

import $ from "jquery";

const useJitsi = ({
  domain = "meet.jit.si",
  setHangUpCall,
  setAudio,
  setVideo,
  setTile,
  setScreenShare,
  setRecording,
  recording,
  parentNode,
  subject,
  password,
  displayName,
  ...options
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jitsi, setJitsi] = useState(null);
  var API = null;

  useEffect(() => {
    function BindEvent() {
      $("#btnHangup").on("click", function () {
        API.executeCommand("hangup");
        setHangUpCall(true);
        window.location.reload(true);
      });
    }

    BindEvent();

    if (!window.JitsiMeetExternalAPI) {
      setError(
        "JitsiMeetExternalAPI is not available, check if https://meet.jit.si/external_API.js was loaded"
      );
      return;
    }

    options.parentNode = document.getElementById(parentNode);
    if (!options.parentNode) {
      setError(
        `Parent node is not available, check container have the correct id: "${parentNode}"`
      );
      return;
    }
    const addOptions = {
      onload: function () {
        $("#toolbox").show();
      },
      DEFAULT_REMOTE_DISPLAY_NAME: "New User",
      userInfo: {
        displayName: displayName,
      },
      interfaceConfigOverwrite: {
        APP_NAME: "Hello Meet",
        PROVIDER_NAME: "Hello",
        filmStripOnly: true,
        SHOW_JITSI_WATERMARK: false,
        DEFAULT_LOGO_URL: "images/oneClick_logo.png",
        DEFAULT_REMOTE_DISPLAY_NAME: "New User",
        DEFAULT_WELCOME_PAGE_LOGO_URL: "images/oneClick_logo.png",
      },
      configOverwrite: {
        gravatarBaseURL: "https://seccdn.libravatar.org/avatar/",
        disableSimulcast: false,
        startVideoMuted: 0,
        startWithVideoMuted: true,
        startWithAudioMuted: true,
        enableWelcomePage: true,
        prejoinPageEnabled: true,
        disableRemoteMute: false,
        remoteVideoMenu: {
          disableKick: false,
        },
        TOOLBAR_ALWAYS_VISIBLE: false,
        TOOLBAR_TIMEOUT: 4000,
        toolbarButtons: [
          "closedcaptions",
          "fullscreen",
          "recording",
          "shareaudio",
          "settings",
          "select-background",
          "download",
          "help",
          "mute-everyone",
          "mute-video-everyone",
          "security",
          "videoquality",
          "filmstrip",
          "invite",
          "feedback",
          "stats",
          "shortcuts",
          "microphone",
          "camera",
          "tileview",
          "desktop",
          "embedmeeting",
          "fodeviceselection",
          "profile",
          "chat",
          "livestreaming",
          "etherpad",
          "sharedvideo",
          "raisehand",
        ],
      },
    };

    API = new window.JitsiMeetExternalAPI(domain, {
      ...addOptions,
      ...options,
    });
    setJitsi(API);
    setLoading(false);
    setError(null);

    subject && API.executeCommand("subject", subject);

    API.addEventListeners({
      videoConferenceJoined: function () {
        password && API.executeCommand("password", password);
        displayName && API.executeCommand("displayName", displayName);
      },
      passwordRequired: function () {
        password && API.executeCommand("password", password);
        displayName && API.executeCommand("displayName", displayName);
      },
      readyToClose: function () {
        console.log("Meeting has ended");
      },
    });

    return () => jitsi && jitsi.dispose();
  }, [window.JitsiMeetExternalAPI]);

  return { jitsi, error, loading };
};

useJitsi.propTypes = {
  options: PropTypes.shape({
    domain: PropTypes.string,
    roomName: PropTypes.string.isRequired,
    subject: PropTypes.string,
    password: PropTypes.string,
    displayName: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    parentNode: PropTypes.string,
    configOverwrite: PropTypes.object,
    interfaceConfigOverwrite: PropTypes.object,
    noSSL: PropTypes.bool,
    jwt: PropTypes.string,
    onload: PropTypes.func,
    invitees: PropTypes.array,
    devices: PropTypes.object,
    userInfo: PropTypes.object,
  }),
};

export default useJitsi;
