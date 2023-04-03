import { React, useState, useEffect } from "react";
import { upload } from "../api/api.js";
import { useNavigate } from 'react-router-dom';

export const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(undefined);
  
  return (
    <>
      <label className="btn btn-default">
        <input
          type="file"
          onChange={(x) => {
            setFile(x.target.files);
          }}
        />
      </label>

      <button
        className="btn btn-success"
        disabled={file == undefined}
        onClick={() => {
          upload(file[0]);
          navigate("/mform");
        }}
      >
        Upload
      </button>
    </>
  );
};

