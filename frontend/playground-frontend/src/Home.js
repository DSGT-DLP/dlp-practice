import React, { useState, useEffect } from "react";
import {
  COLORS,
  DEFAULT_ADDED_LAYERS,
  GENERAL_STYLES,
  LAYOUT,
} from "./constants";
import {
  BOOL_OPTIONS,
  DEFAULT_DATASETS,
  OPTIMIZER_NAMES,
  POSSIBLE_LAYERS,
  PROBLEM_TYPES,
} from "./settings";
import {
  BackgroundLayout,
  AddedLayer,
  RectContainer,
  AddNewLayer,
  LayerChoice,
  Input,
  CSVInput,
  TrainButton,
  EmailInput,
  TitleText,
  CodeSnippet,
  HomeCSVInputURL,
} from "./components";
import { CRITERIONS } from "./settings";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DataTable from "react-data-table-component";
import CONFUSION_VIZ from "./backend_outputs/visualization_output/my_confusion_matrix.png";
import ONNX_OUTPUT_PATH from "./backend_outputs/my_deep_learning_model.onnx";
import PT_PATH from "./backend_outputs/model.pt";
import { CSVLink } from "react-csv";
import Plot from "react-plotly.js";

const Home = () => {
  const [csvDataInput, setCSVDataInput] = useState([]);
  const [csvColumns, setCSVColumns] = useState([]);
  const [dlpBackendResponse, setDLPBackendResponse] = useState();

  // input responses
  const [fileURL, setFileURL] = useState("");
  const [email, setEmail] = useState("");
  const [addedLayers, setAddedLayers] = useState(DEFAULT_ADDED_LAYERS);
  const [targetCol, setTargetCol] = useState();
  const [features, setFeatures] = useState([]);
  const [problemType, setProblemType] = useState(PROBLEM_TYPES[0]);
  const [criterion, setCriterion] = useState(CRITERIONS[3]);
  const [optimizerName, setOptimizerName] = useState(OPTIMIZER_NAMES[0]);
  const [usingDefaultDataset, setUsingDefaultDataset] = useState();
  const [shuffle, setShuffle] = useState(BOOL_OPTIONS[1]);
  const [epochs, setEpochs] = useState(5);
  const [testSize, setTestSize] = useState(0.2);
  const [inputFeatureColumnOptions, setInputFeatureColumnOptions] = useState(
    csvColumns.map((e, i) => ({
      label: e.name,
      value: i,
    }))
  );
  const input_responses = {
    addedLayers,
    targetCol: targetCol?.label,
    features: features?.map((e) => e.label),
    problemType: problemType?.value,
    criterion: criterion?.value,
    optimizerName: optimizerName?.value,
    usingDefaultDataset: usingDefaultDataset?.value,
    shuffle: shuffle?.value,
    epochs,
    testSize,
    fileURL,
    email,
  };

  const inputColumnOptions = csvColumns.map((e, i) => ({
    label: e.name,
    value: i,
  }));

  const dl_results_data = dlpBackendResponse?.dl_results || [];
  const auc_roc_data_res =
    dlpBackendResponse?.auxiliary_outputs?.AUC_ROC_curve_data || [];
  const auc_roc_data = [];
  auc_roc_data.push({
    name: "baseline",
    x: [0, 1],
    y: [0, 1],
    type: "line",
    marker: { color: "grey" },
    line: {
      dash: "dash",
    },
    config: { responsive: true },
  });
  for (var i = 0; i < auc_roc_data_res.length; i++) {
    auc_roc_data.push({
      name: `${i} (AUC: ${auc_roc_data_res[i][2]})`,
      x: auc_roc_data_res[i][0] || [],
      y: auc_roc_data_res[i][1] || [],
      type: "line",
      config: { responsive: true },
    });
  }

  const handleTargetChange = (e) => {
    setTargetCol(e);
    const csvColumnsCopy = JSON.parse(JSON.stringify(inputColumnOptions));
    csvColumnsCopy.splice(e.value, 1);
    setInputFeatureColumnOptions(csvColumnsCopy);
  };

  const input_queries = [
    {
      queryText: "Target Column",
      options: inputColumnOptions,
      onChange: handleTargetChange,
      defaultValue: targetCol,
    },
    {
      queryText: "Features",
      options: inputFeatureColumnOptions,
      onChange: setFeatures,
      isMultiSelect: true,
      defaultValue: features,
    },
    {
      queryText: "Problem Type",
      options: PROBLEM_TYPES,
      onChange: setProblemType,
      defaultValue: problemType,
    },
    {
      queryText: "Optimizer Name",
      options: OPTIMIZER_NAMES,
      onChange: setOptimizerName,
      defaultValue: optimizerName,
    },
    {
      queryText: "Criterion",
      options: CRITERIONS,
      onChange: setCriterion,
      defaultValue: criterion,
    },
    {
      queryText: "Default",
      options: DEFAULT_DATASETS,
      onChange: setUsingDefaultDataset,
      defaultValue: usingDefaultDataset,
    },
    {
      queryText: "Epochs",
      freeInputCustomRestrictions: { type: "number", min: 0 },
      onChange: setEpochs,
      defaultValue: epochs,
    },
    {
      queryText: "Shuffle",
      options: BOOL_OPTIONS,
      onChange: setShuffle,
      defaultValue: shuffle,
    },
    {
      queryText: "Test Size",
      onChange: setTestSize,
      defaultValue: testSize,
      freeInputCustomRestrictions: { type: "number", min: 0, step: 0.1 },
    },
  ];

  const showResults = () => {
    if (!dlpBackendResponse?.success) {
      return (
        dlpBackendResponse?.message || (
          <p style={{ textAlign: "center" }}>There are no records to display</p>
        )
      );
    }

    const dl_results_columns_react_csv = Object.keys(dl_results_data[0]).map(
      (c) => ({
        label: c,
        key: c,
      })
    );

    const mapResponses = (key) =>
      dlpBackendResponse?.dl_results.map((e) => e[key]) || [];

    const FIGURE_HEIGHT = 500;
    const FIGURE_WIDTH = 750;

    return (
      <>
        <CSVLink data={dl_results_data} headers={dl_results_columns_react_csv}>
          <button style={{ ...styles.download_csv_res, padding: 5.5 }}>
            📄 Download Results (CSV)
          </button>
        </CSVLink>
        <span style={{ marginLeft: 8 }}>
          <a href={ONNX_OUTPUT_PATH} download style={styles.download_csv_res}>
            📄 Download ONNX Output File
          </a>
        </span>
        <span style={{ marginLeft: 8 }}>
          <a href={PT_PATH} download style={styles.download_csv_res}>
            📄 Download model.pt File
          </a>
        </span>

        <DataTable
          pagination
          highlightOnHover
          columns={Object.keys(dl_results_data[0]).map((c) => ({
            name: c,
            selector: (row) => row[c],
          }))}
          data={dl_results_data}
        />

        <div style={{ marginTop: 8 }}>
          {problemType.value === "classification" ? (
            <Plot
              data={[
                {
                  name: "Train accuracy",
                  x: mapResponses("epoch"),
                  y: mapResponses("train_acc"),
                  type: "scatter",
                  mode: "markers",
                  marker: { color: "red", size: 10 },
                  config: { responsive: true },
                },
                {
                  name: "Test accuracy",
                  x: mapResponses("epoch"),
                  y: mapResponses("val/test acc"),
                  type: "scatter",
                  mode: "markers",
                  marker: { color: "blue", size: 10 },
                  config: { responsive: true },
                },
              ]}
              layout={{
                width: FIGURE_WIDTH,
                height: FIGURE_HEIGHT,
                xaxis: { title: "Epoch Number" },
                yaxis: { title: "Accuracy" },
                title: "Train vs. Test Accuracy for your Deep Learning Model",
                showlegend: true,
              }}
            />
          ) : null}
          <Plot
            data={[
              {
                name: "Train loss",
                x: mapResponses("epoch"),
                y: mapResponses("train_loss"),
                type: "scatter",
                mode: "markers",
                marker: { color: "red", size: 10 },
                config: { responsive: true },
              },
              {
                name: "Test loss",
                x: mapResponses("epoch"),
                y: mapResponses("test_loss"),
                type: "scatter",
                mode: "markers",
                marker: { color: "blue", size: 10 },
                config: { responsive: true },
              },
            ]}
            layout={{
              width: FIGURE_WIDTH,
              height: FIGURE_HEIGHT,
              xaxis: { title: "Epoch Number" },
              yaxis: { title: "Loss" },
              title: "Train vs. Test Loss for your Deep Learning Model",
              showlegend: true,
            }}
          />
          {problemType.value === "classification" &&
          auc_roc_data_res.length !== 0 ? (
            <Plot
              data={auc_roc_data}
              layout={{
                width: FIGURE_WIDTH,
                height: FIGURE_HEIGHT,
                xaxis: { title: "False Positive Rate" },
                yaxis: { title: "True Positive Rate" },
                title: "AUC/ROC Curves for your Deep Learning Model",
                showlegend: true,
              }}
            />
          ) : null}
          {problemType.value === "classification" &&
          auc_roc_data_res.length == 0 ? (
            <p style={{ textAlign: "center" }}>
              No AUC/ROC curve could be generated. If this is not intended,
              check that shuffle is set to true to produce a more balanced
              train/test split which would enable correct AUC score calculation
            </p>
          ) : null}
          {problemType.value === "classification" ? (
            <Plot
              data={[
                {
                  z: dlpBackendResponse?.auxiliary_outputs?.confusion_matrix,
                  type: "heatmap",
                  colorscale: [
                    [0, "#e6f6fe"],
                    [1, COLORS.dark_blue],
                  ],
                },
              ]}
              layout={{
                title: "Confusion Matrix (Last Epoch)",
                xaxis: { title: "Predicted" },
                yaxis: { title: "Actual", autorange: "reversed" },
                showlegend: true,
                width: FIGURE_HEIGHT,
                height: FIGURE_HEIGHT,
              }}
            />
          ) : null}
        </div>
      </>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <DndProvider backend={HTML5Backend}>
        <TitleText text="Implemented Layers" />
        <BackgroundLayout>
          <RectContainer style={styles.fileInput}>
            <CSVInput
              data={csvDataInput}
              columns={csvColumns}
              setData={setCSVDataInput}
              setColumns={setCSVColumns}
            />
            <HomeCSVInputURL
              fileURL={fileURL}
              setFileURL={setFileURL}
              setCSVColumns={setCSVColumns}
              setCSVDataInput={setCSVDataInput}
            />
          </RectContainer>

          {addedLayers.map((_, i) => (
            <AddedLayer
              thisLayerIndex={i}
              addedLayers={addedLayers}
              setAddedLayers={setAddedLayers}
              key={i}
              onDelete={() => {
                const currentLayers = [...addedLayers];
                currentLayers.splice(i, 1);
                setAddedLayers(currentLayers);
              }}
            />
          ))}
          <AddNewLayer />

          <TrainButton
            {...input_responses}
            csvDataInput={csvDataInput}
            setDLPBackendResponse={setDLPBackendResponse}
          />
        </BackgroundLayout>

        <div style={{ marginTop: 20 }} />

        <TitleText text="Layers Inventory" />
        <BackgroundLayout>
          {POSSIBLE_LAYERS.map((e) => (
            <LayerChoice
              layer={e}
              key={e.display_name}
              onDrop={(newLayer) => {
                setAddedLayers((currentAddedLayers) => {
                  const copyCurrent = [...currentAddedLayers];
                  const layerCopy = deepCopyObj(newLayer);
                  Object.values(layerCopy.parameters).forEach((val) => {
                    val["value"] = "";
                  });
                  copyCurrent.push(layerCopy);
                  return copyCurrent;
                });
              }}
            />
          ))}
        </BackgroundLayout>
      </DndProvider>
      <div style={{ marginTop: 20 }} />

      <TitleText text="Deep Learning Parameters" />
      <BackgroundLayout>
        {input_queries.map((e) => (
          <Input {...e} key={e.queryText} />
        ))}
      </BackgroundLayout>

      <TitleText text="Email (optional)" />
      <EmailInput email={email} setEmail={setEmail} />

      <TitleText text="CSV Input" />
      <DataTable
        pagination
        highlightOnHover
        columns={csvColumns}
        data={csvDataInput}
      />

      <TitleText text="Deep Learning Results" />
      {showResults()}
      <TitleText text="Code Snippet" />
      <CodeSnippet backendResponse={dlpBackendResponse} layers={addedLayers} />
    </div>
  );
};

export default Home;

const deepCopyObj = (obj) => JSON.parse(JSON.stringify(obj));

const styles = {
  h1: {
    ...GENERAL_STYLES.p,
    padding: 0,
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  fileInput: {
    ...LAYOUT.column,
    backgroundColor: COLORS.input,
    width: 200,
  },
  download_csv_res: {
    ...GENERAL_STYLES.p,
    backgroundColor: COLORS.layer,
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: 8,
    textDecoration: "none",
    fontSize: "medium",
  },
};
