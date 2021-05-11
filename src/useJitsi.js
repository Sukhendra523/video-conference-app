import { React, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import $ from "jquery";
import Header from "./componets/Header";
import ContentBox from "./componets/ContentBox";
import callContext from "./App";

const useJitsi = ({
  domain = "meet.jit.si",
  setAudio,
  setVideo,
  setTile,
  setScreenShare,
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
        window.location.reload(true);
      });
      $("#btnCustomMic").on("click", function () {
        API.executeCommand("toggleAudio");
      });
      $("#btnCustomCamera").on("click", function () {
        API.executeCommand("toggleVideo");
      });
      $("#btnCustomTileView").on("click", function () {
        API.executeCommand("toggleTileView");
      });
      $("#btnScreenShareCustom").on("click", function () {
        API.executeCommand("toggleShareScreen");
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
        // alert("loaded");
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
        disableSimulcast: false,
        startVideoMuted: 0,
        startWithVideoMuted: true,
        startWithAudioMuted: true,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableRemoteMute: true,
        remoteVideoMenu: {
          disableKick: true,
        },
        TOOLBAR_ALWAYS_VISIBLE: false,
        TOOLBAR_TIMEOUT: 4000,
        toolbarButtons: [
          /* "microphone",
          "camera",
          "hangup", 
          "tileview" ,'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
     'fodeviceselection',  'profile', 'chat', 'recording',
     'livestreaming', 'etherpad', 'sharedvideo', 'shareaudio', 'settings', 'raisehand',
     'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
     'select-background', 'download', 'help', 'mute-everyone', 'mute-video-everyone', 'security' */
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
        $("#jitsi-container").empty();
        $("#toolbox").hide();
      },
      audioMuteStatusChanged: function (data) {
        if (data.muted) setAudio(false);
        else setAudio(true);
      },
      videoMuteStatusChanged: function (data) {
        if (data.muted) setVideo(false);
        else setVideo(true);
      },
      tileViewChanged: function (data) {
        if (data.on) setTile(true);
        else setTile(false);
      },
      screenSharingStatusChanged: function (data) {
        if (data.on) setScreenShare(true);
        else setScreenShare(false);
      },
      participantJoined: function (data) {
        console.log("participantJoined", data);
      },
      participantLeft: function (data) {
        console.log("participantLeft", data);
      },
    });
    // API.addEventListener("videoConferenceJoined", () => {
    //   password && API.executeCommand("password", password);
    //   displayName && API.executeCommand("displayName", displayName);
    // });

    // API.addEventListener("passwordRequired", () => {
    //   password && API.executeCommand("password", password);
    // });
    // API.addEventListener("readyToClose", () => {
    //   console.log("Meeting has ended");
    //   $("#jitsi-container").empty();
    //   $("#toolbox").hide();
    // });

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
