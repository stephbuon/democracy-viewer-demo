import { React, useState, useEffect } from "react";
import { upload } from "../api/api.js";
import { Stack, Typography } from "@mui/material";
import Box from '@mui/material/Box';
export const Upload = () => {
  const [file, setFile] = useState(undefined);

  useEffect(() => {
    console.log(file);
    console.log(file == undefined);
  }, [file]);
  function print() {
    console.log(file);
  }
  return (
    <>
    <div className='blue' style={{ marginTop: "1in" }}>
      <Box component="main">
        <Box
          sx={{
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <img
              src="https://cdn.pixabay.com/photo/2016/01/03/00/43/upload-1118929_1280.png"
              alt="Upload"
              style={{ maxWidth: "20%" }}
            />
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Upload Your File
            </Typography>
            <label className="btn btn-default">
              <input
                type="file"
                onChange={(x) => {
                  setFile(x.target.files);
                }}
              />
            </label>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button
                variant="outlined"
                sx={{ m: 2 }}
                disabled={file == undefined}
                onClick={() => {
                  upload(file[0]);
                }}
              >
                Upload
              </button>
            </Box>
            <Box>
              <button
                variant="outlined"
                sx={{ m: 2 }}
                disabled={file == undefined}
                onClick={print}
              >
                Log File
              </button>
            </Box>
          </Stack>
        </Box>
      </Box>
      </div>
      </>
  );
};