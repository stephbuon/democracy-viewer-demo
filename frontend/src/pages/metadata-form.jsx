import React from "react";
import { TextField } from "../common/textField.jsx";
import { useState } from "react";
import { uploadMetadata } from "../api/api.js";
import { useNavigate } from 'react-router-dom';

export function MetadataForm({ table_name }) {
    const navigate = useNavigate();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIspublic] = useState(false);

  return (
    <>
      <div className="container w-50">
        <h2 className="text-center">Enter information about Graph</h2>
        <TextField label="Table Name:" value={name} setValue={setName} />
        <TextField label="Graph Title:" value={title} setValue={setTitle} />
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          ></textarea>
          <input
            className="form-check-input"
            type="checkbox"
            value={isPublic}
            onChange={(x) => setIspublic(x)}
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            {" "}
            Public{" "}
          </label>
        </div>
        {name == "" || title == "" || description == "" ? (
          <button type="button" className="btn btn-md btn-primary" disabled>
            Submit
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-md btn-primary"
            onClick={() => {
              uploadMetadata({
                table_name: { table_name },
                title: { title },
                description: { description },
                is_public: true,
              });
              navigate("/");
            }}
          >
            Submit
          </button>
        )}
      </div>
    </>
  );
}
