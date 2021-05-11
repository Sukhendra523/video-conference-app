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
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";

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

  const { loading, error, jitsi } = useJitsi({
    setAudio,
    setVideo,
    setTile,
    setScreenShare,
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
      <div id="toolbox" className="toolbox" style={{ display: "none" }}>
        <button id="btnCustomTileView">
          {tile ? <AppsIcon /> : <AppsOutlinedIcon />}
        </button>
        <div className="toolbox__center">
          <button id="btnCustomMic">
            {audio ? <MicNoneIcon /> : <MicOffIcon />}
          </button>
          <button id="btnHangup">
            <CallEndIcon />
          </button>
          <button id="btnCustomCamera">
            {video ? <VideocamIcon /> : <VideocamOffIcon />}
          </button>
        </div>
        <button id="btnScreenShareCustom">
          {screenShare ? <DesktopWindowsIcon /> : <DesktopAccessDisabledIcon />}
        </button>
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
