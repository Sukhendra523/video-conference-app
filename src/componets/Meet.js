import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import useJitsi from "../Hook/useJitsi";

import CallEndIcon from "@material-ui/icons/CallEnd";

import "./Meet.css";
import { Redirect } from "react-router-dom";

const Meet = ({
  loadingComponent,
  errorComponent,
  containerStyles,
  jitsiContainerStyles,
  onError,
  onJitsi,
  ...options
}) => {
  const [recording, setRecording] = useState(false);
  const [hangUpCall, setHangUpCall] = useState(false);
  const { loading, error, jitsi } = useJitsi({
    setHangUpCall,
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
  if (hangUpCall) {
    <Redirect to="/" />;
  }
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
      <div className="toolbox__right">
        <button id="btnHangup">
          <CallEndIcon />
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
