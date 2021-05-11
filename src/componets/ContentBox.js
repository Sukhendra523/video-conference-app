import React, { useState } from "react";

import { Meet } from "./Meet";

const ContentBox = ({
  room,
  name,
  password,
  setRoom,
  setName,
  setPassword,
  handleClick,
}) => {
  return (
    <div className="content_box">
      <div className="wrapper">
        <div className="content_box_inr">
          <div className="content_box_left">
            <img src="images/joining_the_event.png" alt="" />
          </div>
          <div className="content_box_right">
            <h1>Meet for you</h1>
            <p>
              In this together. Keeping you securely connected wherever you are.
            </p>
            <div className="form_box">
              <div className="form_title">
                <h3>Join a Meeting</h3>
              </div>
              <div className="form_input_box">
                <input
                  id="room"
                  type="text"
                  placeholder="Room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
              <div className="form_input_box">
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form_input_box">
                <input
                  id="password"
                  type="text"
                  placeholder="Password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form_submit_box">
                <button onClick={handleClick} type="submit">
                  Start / Join
                  <span className="form_submit_icon_box">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.66667 20C1.66667 20 0 20 0 18.3333C0 16.6667 1.66667 11.6667 10 11.6667C18.3333 11.6667 20 16.6667 20 18.3333C20 20 18.3333 20 18.3333 20H1.66667ZM10 10C11.3261 10 12.5979 9.47322 13.5355 8.53553C14.4732 7.59785 15 6.32608 15 5C15 3.67392 14.4732 2.40215 13.5355 1.46447C12.5979 0.526784 11.3261 0 10 0C8.67392 0 7.40215 0.526784 6.46447 1.46447C5.52678 2.40215 5 3.67392 5 5C5 6.32608 5.52678 7.59785 6.46447 8.53553C7.40215 9.47322 8.67392 10 10 10Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </button>
                <small>
                  By Signing up you agree with OneClick - Video Chat
                </small>
                <p>
                  <a href="#.">Terms of Service</a> and{" "}
                  <a href="#.">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentBox;
