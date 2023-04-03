import { React, useRef, useEffect, useState } from "react";
import { TextField } from "../common/textField.jsx";
import { MDBContainer } from "mdbreact";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { SelectField } from "../common/selectField.jsx";
import { Range } from "../common/range.jsx";
import Plotly from "plotly.js-dist";
import { useNavigate } from "react-router-dom";

export const Graph = ({ dataset, setData }) => {
  const graph = useRef(null);
  const navigate = useNavigate();

  var data = [
    {
      x: dataset.x,
      y: dataset.y,
      type: 'bar'
    }
  ];
  var layout = {
    title: dataset.label
  };

  useEffect(() => {
    Plotly.newPlot(graph.current, data, layout);
    graph.current.on('plotly_click', function (data) {
      let i = data.points[0].pointIndex;
      setData({
        x: dataset.x[i],
        y: dataset.y[i],
        description: dataset.other[i]
      });
      navigate("/zoom");
    });
  })

  const [searchValue, setSearchValue] = useState("");

  const [topDecade, setTopDecade] = useState(1900);
  const [bottomDecade, SetBottomDecade] = useState(1900);

  const [vocabulary, setVocabulary] = useState("");
  const [vocabOptions] = useState([{ value: 1, label: "All" }]);

  const [sentiment, setSentiment] = useState("");
  const [sentimentOptions] = useState([
    { value: 1, label: "All" },
    { value: 2, label: "Positive" },
    { value: 3, label: "Negative" },
  ]);

  const [measure, setMeasure] = useState("");
  const [measureOptions] = useState([
    { value: 1, label: "Count" },
    { value: 2, label: "tf-idf" },
  ]);

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-2 border border-secondary border-3 rounded m-1">
          <SelectField
            label="Vocabulary"
            value={vocabulary}
            setValue={setVocabulary}
            options={vocabOptions}
            hideBlankOption={1}
          />
          <SelectField
            label="Measure"
            value={measure}
            setValue={setMeasure}
            options={measureOptions}
            hideBlankOption={1}
          />
          <Range
            value={topDecade}
            setValue={setTopDecade}
            label="Decade (Top)"
            min={1900}
            max={2000}
            step={10}
          />
          <Range
            value={bottomDecade}
            setValue={SetBottomDecade}
            label="Decade (Bottom)"
            min={1900}
            max={2000}
            step={10}
          />
          <div className="row">
            <div className="col">
              <button
                type="button"
                className="btn btn-md btn-primary w-100 mb-2"
              >
                Law
              </button>
              <button
                type="button"
                className="btn btn-md btn-primary w-100 mb-2"
              >
                Government
              </button>
            </div>
            <div className="col">
              <button
                type="button"
                className="btn btn-md btn-primary w-100 mb-2"
              >
                Men
              </button>
              <button
                type="button"
                className="btn btn-md btn-primary w-100 mb-2"
              >
                Women
              </button>
            </div>
          </div>
          <TextField
            label="Custom Search:"
            value={searchValue}
            setValue={setSearchValue}
          />
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="keywordRadioDefault"
              id="keywordRadio1"
              checked
            />
            <label className="form-check-label" htmlFor="keywordRadio1">
              Include Keyword
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="keywordRadioDefault"
              id="keywordRadio2"
            />
            <label className="form-check-label" htmlFor="keywordRadio2">
              Match Keyword
            </label>
          </div>
          <SelectField
            label="Sentiment"
            value={sentiment}
            setValue={setSentiment}
            options={sentimentOptions}
            hideBlankOption={1}
          />
        </div>
        <div className="col ms-2">
          <div ref={graph}></div>
        </div>
      </div>
    </>
  );
}
