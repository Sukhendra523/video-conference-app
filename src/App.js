import React, { useState } from "react";
import LoadingComponent from "./componets/LoadingComponent";
import ContentBox from "./componets/ContentBox";
import Header from "./componets/Header";
import { Meet } from "./componets/Meet";

const App = () => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [call, setCall] = useState(false);
  const [password, setPassword] = useState("");

  const handleClick = (event) => {
    event.preventDefault();
    if (room && name) setCall(true);
  };
  return (
    <>
      {call ? (
        <Meet
          roomName={room}
          displayName={name}
          password={password}
          loadingComponent={LoadingComponent}
          errorComponent={<p>Oops, something went wrong</p>}
          containerStyles={{
            width: "100%",
            height: "calc(100vh)",
          }}
        />
      ) : (
        <>
          <Header />
          <ContentBox
            room={room}
            name={name}
            password={password}
            setRoom={setRoom}
            setName={setName}
            setPassword={setPassword}
            handleClick={handleClick}
          />
        </>
      )}
    </>
  );
};

export default App;
