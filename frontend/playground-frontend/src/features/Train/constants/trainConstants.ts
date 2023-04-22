import {
  BaseTrainspaceData,
  DATA_SOURCE,
  DatasetData,
} from "@/features/Train/types/trainTypes";
import TabularDatasetStep from "@/features/Train/features/Tabular/components/TabularDatasetStep";
import TabularTrainspace from "../features/Tabular/components/TabularTrainspace";
import {
  TabularData,
  TrainspaceStep,
  TrainspaceSteps,
} from "@/features/Train/features/Tabular/types/tabularTypes";

export const DATA_SOURCE_ARR = [
  "TABULAR",
  "PRETRAINED",
  "IMAGE",
  "AUDIO",
  "TEXTUAL",
  "CLASSICAL_ML",
  "OBJECT_DETECTION",
] as const;

export const TABULAR_STEPS_ARR = [
  "DATASET",
  "PARAMETERS",
  "REVIEW",
  "TRAIN",
] as const;

export const DATA_SOURCE_SETTINGS: {
  [T in DATA_SOURCE]: {
    name: string;
    steps: TrainspaceSteps<T>;
    trainspaceComponent: React.FC;
    stepsSettings: {
      [_ in TrainspaceStep<T>]: {
        name: string;
        optional: boolean;
        stepComponent: React.FC<{
          renderStepperButtons: (
            handleStepSubmit: (data: BaseTrainspaceData) => void
          ) => React.ReactNode;
        }>;
      };
    };
    defaultDatasets: { label: string; value: string }[];
  };
} = {
  TABULAR: {
    name: "Tabular",
    trainspaceComponent: TabularTrainspace,
    steps: TABULAR_STEPS_ARR,
    stepsSettings: {
      DATASET: {
        name: "Dataset",
        optional: false,
        stepComponent: TabularDatasetStep,
      },
      PARAMETERS: {
        name: "Parameters",
        optional: false,
        stepComponent: TabularDatasetStep,
      },
      REVIEW: {
        name: "Review",
        optional: false,
        stepComponent: TabularDatasetStep,
      },
      TRAIN: {
        name: "Train",
        optional: false,
        stepComponent: TabularDatasetStep,
      },
    },
    defaultDatasets: [
      { label: "Iris", value: "IRIS" },
      { label: "California Housing", value: "CALIFORNIAHOUSING" },
      { label: "Diabetes", value: "DIABETES" },
      { label: "Digits", value: "DIGITS" },
      { label: "Wine", value: "WINE" },
    ],
  },
  PRETRAINED: {
    name: "Pretrained",
    trainspaceComponent: TabularTrainspace,
    steps: [],
    stepsSettings: {},
    defaultDatasets: [],
  },
  IMAGE: {
    name: "Image",
    trainspaceComponent: TabularTrainspace,
    steps: [],
    stepsSettings: {},
    defaultDatasets: [],
  },
  AUDIO: {
    name: "Audio",
    trainspaceComponent: TabularTrainspace,
    steps: [],
    stepsSettings: {},
    defaultDatasets: [],
  },
  TEXTUAL: {
    name: "Textual",
    trainspaceComponent: TabularTrainspace,
    steps: [],
    stepsSettings: {},
    defaultDatasets: [],
  },
  CLASSICAL_ML: {
    name: "Classical ML",
    trainspaceComponent: TabularTrainspace,
    steps: [],
    stepsSettings: {},
    defaultDatasets: [],
  },
  OBJECT_DETECTION: {
    name: "Object Detection",
    trainspaceComponent: TabularTrainspace,
    steps: [],
    stepsSettings: {},
    defaultDatasets: [],
  },
};

export const setTrainspaceDataset = (
  trainspaceData: BaseTrainspaceData,
  datasetData: DatasetData
) => {
  switch (trainspaceData.dataSource) {
    case "TABULAR":
      (trainspaceData as TabularData<"PARAMETERS">).datasetData = datasetData;
      return;
    default:
      break;
  }
};
