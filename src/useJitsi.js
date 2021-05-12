import { React, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import $ from "jquery";

const useJitsi = ({
  domain = "meet.jit.si",
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
  // var partInfo = false;
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
      $("#btnChatbox").on("click", function () {
        API.executeCommand("toggleChat");
      });
      //   $("#btnStartRecording").on("click", function () {
      //     API.executeCommand("startRecording", {
      //       mode: "file",
      //       // dropboxToken:
      //       //   "sl.AwqgiwyuVOck9Z5RCaVYbaewUt9pUUt4oAN7GaBUO9R05zCC8gj7XjPjPg0sKrBNMULR0YxxELiyQvs8NBGs-TEYOYMPFZ9MXLsvaFKkB5KI3Sd6AR5D4vfgCUIQQt2IlD4uII0",
      //     });
      //   });
      //   $("#btnStopRecording").on("click", function () {
      //     API.executeCommand("stopRecording", { mode: "file" });
      //   });
      //   $("#btnParticipants").on("click", function () {
      //     const ParticipantsInfo = API.getParticipantsInfo();
      //     const NumberOfParticipants = API.getNumberOfParticipants();
      //     partInfo = !partInfo;
      //     API.executeCommand(
      //       "avatarUrl",
      //       "https://www.iconninja.com/files/477/18/506/male-person-user-casual-avatar-man-icon.svg"
      //     );
      //     if (partInfo) {
      //       $("#participants_info").toggleClass("participants_info");
      //       $("#participants_info").append(
      //         `<h3>Meeting Participants ( ${NumberOfParticipants}) </h3>`,
      //         "<ul id='participants_info_list'></ul>"
      //       );

      //       ParticipantsInfo.map(({ avatarURL, displayName }) => {
      //         $("#participants_info_list").append(
      //           `<li><img src=${
      //             avatarURL || "images/avatar.svg"
      //           } style='border-radius:50%; width:30px;'>${displayName}</li>`
      //         );
      //       });
      //     } else {
      //       $("#participants_info").html("");
      //     }
      //     console.log("ParticipantsInfo :", ParticipantsInfo);
      //     console.log("number :", API.getNumberOfParticipants());
      //   });
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
        gravatarBaseURL: "https://seccdn.libravatar.org/avatar/",
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
        // Recording

        // Whether to enable file recording or not.
        // fileRecordingsEnabled: true,
        // Enable the dropbox integration.
        // dropbox: {
        //   appKey: "xveur4t5kkc7e30", // Specify your app key here.
        //   // A URL to redirect the user to, after authenticating
        //   // by default uses:
        //   // 'https://jitsi-meet.example.com/static/oauth.html'
        //   redirectURI: "https://jitsi-meet.example.com/static/oauth.html",
        // },
        // When integrations like dropbox are enabled only that will be shown,
        // by enabling fileRecordingsServiceEnabled, we show both the integrations
        // and the generic recording service (its configuration and storage type
        // depends on jibri configuration)
        // fileRecordingsServiceEnabled: true,
        // Whether to show the possibility to share file recording with other people
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

        // $("#jitsi-container").empty();
        // $("#toolbox").hide();
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
      recordingStatusChanged: function (data) {
        if (data.on) setRecording(true);
        else setRecording(false);
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
