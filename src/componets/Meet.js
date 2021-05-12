import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import useJitsi from "../useJitsi";

import CallEndIcon from "@material-ui/icons/CallEnd";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicNoneIcon from "@material-ui/icons/MicNone";
import VideocamIcon from "@material-ui/icons/Videocam";
import AppsIcon from "@material-ui/icons/Apps";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import SecurityIcon from "@material-ui/icons/Security";
import AlbumIcon from "@material-ui/icons/Album";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";

import "./Meet.css";

const Meet = ({
  loadingComponent,
  errorComponent,
  containerStyles,
  jitsiContainerStyles,
  onError,
  onJitsi,
  ...options
}) => {
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const [tile, setTile] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [recording, setRecording] = useState(false);

  const { loading, error, jitsi } = useJitsi({
    setAudio,
    setVideo,
    setTile,
    setScreenShare,
    setRecording,
    recording,
    parentNode: "jitsi-container",
    ...options,
  });

  useEffect(() => {
    if (jitsi && onJitsi) onJitsi(jitsi);
  }, [jitsi]);

  useEffect(() => {
    if (error && onError) onError(error);
  }, [error]);

  return (
    <div style={{ ...{ width: "800px", height: "400px" }, ...containerStyles }}>
      {error && (errorComponent || <p>{error}</p>)}
      {!error && loading && (loadingComponent || <p>Loading ...</p>)}
      <div
        id="jitsi-container"
        style={{
          ...{
            display: loading ? "none" : "block",
            width: "100%",
            height: "100%",
          },
          ...jitsiContainerStyles,
        }}
      />
      <div id="participants_info" style={{ display: "none" }}>
        {/* {console.log("API.getParticipantsInfo() : ", API.getParticipantsInfo())} */}
      </div>
      <div id="toolbox" className="toolbox" style={{ display: "none" }}>
        <div className="toolbox__left">
          <button id="btnCustomCamera">
            {video ? <VideocamIcon /> : <VideocamOffIcon />}
          </button>
          <button id="btnCustomMic">
            {audio ? <MicNoneIcon /> : <MicOffIcon />}
          </button>
        </div>
        <div className="toolbox__center">
          <button id="btnSecurity">
            <SecurityIcon />
          </button>
          <button id="btnParticipants">
            <PeopleAltIcon />
          </button>
          <button id="btnChatbox">
            <ChatBubbleIcon />
          </button>
          <button id="btnCustomTileView" style={{ color: "green" }}>
            {tile ? <AppsIcon /> : <AppsOutlinedIcon />}
          </button>
          <button id="btnScreenShareCustom">
            {screenShare ? <StopScreenShareIcon /> : <ScreenShareIcon />}
          </button>
          {recording ? (
            <button id="btnStopRecording">
              <AlbumIcon style={{ color: "red" }} />
            </button>
          ) : (
            <button id="btnStartRecording">
              <AlbumIcon />
            </button>
          )}

          <button id="btnReaction">
            <EmojiEmotionsIcon />
          </button>
        </div>
        <div className="toolbox__right">
          <button id="btnHangup">
            <CallEndIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

Meet.propTypes = {
  jwt: PropTypes.string,
  domain: PropTypes.string,
  subject: PropTypes.string,
  password: PropTypes.string,
  roomName: PropTypes.string.isRequired,
  displayName: PropTypes.string,
  loadingComponent: PropTypes.object,
  errorComponent: PropTypes.object,
  containerStyles: PropTypes.object,
  jitsiContainerStyles: PropTypes.object,
  configOverwrite: PropTypes.object,
  interfaceConfigOverwrite: PropTypes.object,
  onError: PropTypes.func,
  onJitsi: PropTypes.func,
};

export { Meet, useJitsi };
