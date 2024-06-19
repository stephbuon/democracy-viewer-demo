// Imports
import React, { useRef, useEffect, useState } from "react";
import Plotly from "plotly.js-dist";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { metrics } from "./metrics";

export const GraphComponent = ({ data, setData }) => {
    // UseState definitions

    // Function definitions
    const listToString = (list) => {
        let string = ""
        list.forEach((word, i) => {
            if(i < list.length - 1){
                string += word + " ";

            } else {
                string += "and " + word;
            }
        });
        return string;
    }

    // Other variable definitions
    try {
        var layout = {
            title: metrics[data.metric] + " for " + listToString(data.titleList),
            width: 1000,
            height: 500,
            margin: {
                l: 50,
                r: 50,
                b: 100,
                t: 50,
                pad: 4
            },
            xaxis: {
                automargin: true,
                title: {
                  text: data.xLabel,
                  standoff: 20
                }},
              yaxis: {
                automargin: true,
                tickangle: 0,
                title: {
                  text: data.yLabel,
                  standoff: 40
                }}
        };
    } catch {
        localStorage.removeItem("graph-data");
    }
    const navigate = useNavigate();
    const graph = useRef(null);

    // UseEffect: Generates graph object with zoom click event definition
    useEffect(() => {
        Plotly.newPlot('graph', data.graph, layout, {displayModeBar: false});
        graph.current.on('plotly_click', function (event) { // Click event for zoom page
            const dataPoint = event.points[0];
            let idx;
            if (typeof dataPoint.pointIndex === "number") {
                idx = dataPoint.pointIndex;
            } else {
                idx = (dataPoint.pointIndex[0] + 1) * (dataPoint.pointIndex[1] + 1) - 1;
            }
            const tempData = {
                x: dataPoint.x,
                y: dataPoint.y,
                ids: dataPoint.data.ids[idx],
                dataset: data.table_name
            };
            if (data.graph[0].type === "bar") {
                tempData.words = [dataPoint.x];
            } else if (data.graph[0].type === "scatter") {
                tempData.words = [dataPoint.text];
            } else if (data.graph[0].type === "heatmap") {
                tempData.words = [...data.titleList];
            } else {
                throw new Error("Graph type not supported")
            }
            localStorage.setItem('selected', JSON.stringify(tempData))
            navigate("/zoom");
          });
      }, [data]);

    return <>
        {/* Graph */}
        <Box className="d-flex vh-100" sx={{ margin: "8px" }}>
            <div id='graph' ref={graph} hidden={data.graph == undefined}></div>
        </Box>
    </>
}
