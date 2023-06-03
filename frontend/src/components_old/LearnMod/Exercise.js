import React, { useState, useMemo, useEffect } from "react";
import { DEFAULT_ADDED_LAYERS } from "../../constants";
import PropTypes from "prop-types";
import {
  BOOL_OPTIONS,
  CRITERIONS,
  DEFAULT_DATASETS,
  OPTIMIZER_NAMES,
  POSSIBLE_LAYERS,
  PROBLEM_TYPES,
} from "../../settings";
import {
  AddNewLayer,
  AddedLayer,
  BackgroundLayout,
  Input,
  LayerChoice,
  Spacer,
  Results,
  TitleText,
  TrainButton,
} from "../../common/components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-toastify";
import { sendToBackend } from "../../common/components/helper_functions/TalkWithBackend";

const Exercise = (props) => {
  const csvDataInput = [];
  const uploadedColumns = [];

  // holds response data from model training
  const [dlpBackendResponse, setDLPBackendResponse] = useState(null);
  const [inputKey, setInputKey] = useState(0);

  // input responses
  const fileURL = "";
  const [addedLayers, setAddedLayers] = useState(DEFAULT_ADDED_LAYERS);
  const [targetCol, setTargetCol] = useState(null);
  const [features, setFeatures] = useState([]);
  const [problemType, setProblemType] = useState(PROBLEM_TYPES[0]);
  const [criterion, setCriterion] = useState(
    problemType === PROBLEM_TYPES[0] ? CRITERIONS[3] : CRITERIONS[0]
  );
  const [optimizerName, setOptimizerName] = useState(OPTIMIZER_NAMES[0]);
  const [usingDefaultDataset, setUsingDefaultDataset] = useState(
    DEFAULT_DATASETS[0]
  );
  const [shuffle, setShuffle] = useState(BOOL_OPTIONS[1]);
  const [epochs, setEpochs] = useState(5);
  const [testSize, setTestSize] = useState(0.2);
  const [batchSize, setBatchSize] = useState(20);
  const [inputFeatureColumnOptions, setInputFeatureColumnOptions] = useState(
    uploadedColumns.map((e, i) => ({
      label: e.name,
      value: i,
    }))
  );
  const [activeColumns, setActiveColumns] = useState([]);
  const [finalAccuracy, setFinalAccuracy] = useState("");

  const input_responses = {
    addedLayers: addedLayers,
    targetCol: targetCol?.label,
    features: features?.map((e) => e.label),
    problemType: problemType?.value,
    criterion: criterion?.value,
    optimizerName: optimizerName?.value,
    usingDefaultDataset: usingDefaultDataset?.value,
    shuffle: shuffle?.value,
    epochs: epochs,
    testSize: testSize,
    batchSize: batchSize,
    fileURL: fileURL,
    customModelName: `Model ${new Date().toLocaleString()}`,
  };

  const columnOptionsArray = activeColumns.map((e, i) => ({
    label: e.name || e,
    value: i,
  }));

  const inputColumnOptions = usingDefaultDataset.value
    ? []
    : columnOptionsArray;

  //handles change of target data
  const handleTargetChange = (e) => {
    setTargetCol(e);
    const csvColumnsCopy = JSON.parse(JSON.stringify(columnOptionsArray));
    let featuresCopy = JSON.parse(JSON.stringify(features));
    csvColumnsCopy.splice(e.value, 1);
    if (featuresCopy) {
      featuresCopy = featuresCopy.filter((item) => item.value !== e.value);
      setInputKey((e) => e + 1);
      setFeatures(featuresCopy);
    }
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
      beginnerMode: true,
    },
    {
      queryText: "Criterion",
      options: CRITERIONS.filter((crit) =>
        crit.problem_type.includes(problemType.value)
      ),
      onChange: setCriterion,
      defaultValue: criterion,
      beginnerMode: true,
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
      beginnerMode: true,
    },
    {
      queryText: "Test Size",
      range: true,
      onChange: setTestSize,
      defaultValue: testSize,
    },
    {
      queryText: "Batch Size",
      onChange: setBatchSize,
      defaultValue: batchSize,
      freeInputCustomRestrictions: { type: "number", min: 2 },
      beginnerMode: true,
    },
  ];

  // update user progress on model training completion
  async function updateUserProgress() {
    let requestData = {
      uid: props.user.uid,
      moduleID: props.moduleID,
      sectionID: props.sectionID,
      questionID: props.exerciseObject.questionID,
    };

    sendToBackend("updateUserProgressData", requestData);
  }

  useEffect(() => {
    setCriterion(
      problemType === PROBLEM_TYPES[0] ? CRITERIONS[3] : CRITERIONS[0]
    );
    setInputKey((e) => e + 1);
  }, [problemType]);

  useEffect(() => {
    (async () => {
      if (usingDefaultDataset.value) {
        const datasetResult = await sendToBackend("defaultDataset", {
          using_default_dataset: usingDefaultDataset.value,
        });

        if (!datasetResult.success) {
          toast.error(datasetResult.message);
        } else {
          setActiveColumns(datasetResult.columns);
        }
      } else {
        setActiveColumns(uploadedColumns);
      }
    })();
  }, [usingDefaultDataset]);

  useEffect(() => {
    if (usingDefaultDataset.value) {
      setTargetCol({ label: "target", value: 0 });
      handleTargetChange(columnOptionsArray[columnOptionsArray.length - 1]);
    } else {
      setTargetCol(null);
      setInputFeatureColumnOptions([]);
    }
    setFeatures(null);
    setInputKey((e) => e + 1);
  }, [activeColumns]);

  useEffect(() => {
    if (dlpBackendResponse != null) {
      setFinalAccuracy(
        dlpBackendResponse["dl_results"][epochs - 1]["train_acc"]
      );
    }

    if (finalAccuracy >= props.exerciseObject.minAccuracy) {
      updateUserProgress();
    }
  }, [dlpBackendResponse]);

  const ImplementedLayers = (
    <>
      <TitleText text="Implemented Layers" />
      <BackgroundLayout>
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
    </>
  );

  const LayersInventory = (
    <>
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
                  val.value = val.default ? val.default : val.min;
                });
                copyCurrent.push(layerCopy);
                return copyCurrent;
              });
            }}
          />
        ))}
      </BackgroundLayout>
    </>
  );

  const InputParameters = (
    <>
      <TitleText text="Deep Learning Parameters" />
      <BackgroundLayout>
        {input_queries.map((e) => (
          <Input {...e} key={e.queryText + inputKey} />
        ))}
      </BackgroundLayout>
    </>
  );

  const ResultsMemo = useMemo(
    () => (
      <div>
        <Results
          dlpBackendResponse={dlpBackendResponse}
          problemType={problemType}
          simplified={true}
        />
      </div>
    ),
    [dlpBackendResponse, problemType]
  );

  return (
    <div id="train-tabular-data" className="container-fluid">
      <Spacer height={40} />

      <DndProvider backend={HTML5Backend}>
        {ImplementedLayers}
        <Spacer height={40} />
        {LayersInventory}
      </DndProvider>

      <Spacer height={40} />
      {InputParameters}

      <Spacer height={40} />

      <TitleText text="Deep Learning Results" />
      {ResultsMemo}
      <br></br>
      {finalAccuracy !== 0 ? (
        <h4 id="FinalAccuracyDisplay">
          Final Accuracy was: {finalAccuracy.substring(0, 6)}
        </h4>
      ) : (
        <div></div>
      )}
      {finalAccuracy > props.exerciseObject.minAccuracy ? (
        <h4 id="FinalAccuracyDisplay">
          You've met the required accuracy! Congrats!
        </h4>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Exercise;

const propTypes = {
  user: PropTypes.object,
  exerciseObject: PropTypes.object,
  moduleID: PropTypes.number,
  sectionID: PropTypes.number,
};
Exercise.propTypes = propTypes;

const deepCopyObj = (obj) => JSON.parse(JSON.stringify(obj));