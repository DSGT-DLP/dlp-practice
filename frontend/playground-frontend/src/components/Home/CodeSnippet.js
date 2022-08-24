import React from "react";
import PropTypes from "prop-types";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

const CodeSnippet = (props) => {
  const { backendResponse, layers } = props;

  if (!backendResponse?.success) {
    return (
      backendResponse?.message || (
        <p style={{ textAlign: "center" }}>There are no records to display</p>
      )
    );
  }

  return (
    <div id="code-snippet-div">
      <textarea
        id="code-snippet-text"
        readOnly
        rows="10"
        value={codeSnippetFormat(layers)}
      />
      <button
        id="code-snippet-clipboard"
        onClick={() => {
          navigator.clipboard.writeText(codeSnippetFormat(layers));
          toast.info("Code snippet copied");
        }}
      >
        <FaCopy />
      </button>
    </div>
  );
};

/**
 * This function returns necessary code skeleton to train data from local terminal
 * @param {layers[]} layers
 * @returns string with correct python syntax to 'train' data
 */
function codeSnippetFormat(layers) {
  const codeSnippet =
    "import torch\n" +
    "import torch.nn as nn \n" +
    "from torch.autograd import Variable\n" +
    "class DLModel(nn.Module):\n" +
    "\tdef __init__(self):\n" +
    "\t\t" +
    layersToString(layers) +
    "\n" +
    "\t\t## un-comment below code if loading model from a .pt file, replace PATH with the location path of the .pt file \n" +
    "\t\t# self.model = torch.load('PATH') \n" +
    "\t\t# self.model.eval()" +
    "\n \n" +
    "\tdef forward(self, x): \n" +
    "\t\t" +
    "self.model(x)";
  return codeSnippet;
}

/**
 * Given an array of layers, this function builds a string with all elements of the array after they have applied
 * the layerToString() function
 * @param {layers[]} layers
 * @returns string in form of 'self.model = nn.Sequential(*[layerToString(layers[0]),... ,layerToString(layers[N-1])])
 */
function layersToString(layers) {
  const prepend = "self.model = nn.Sequential(*[";
  let layersToString = prepend;
  const resultingList = [];
  for (let i = 0; i < layers.length; i++) {
    resultingList.push(layerToString(layers[i]));
  }
  layersToString += resultingList.join(",") + "])";
  return layersToString;
}

/**
 * Depending on layer passed in, this function builds a string with layer's name, and parameters associated to it (if any)
 * @param {layers} layer
 * @returns string in form of <layer name>(<parameters>)
 */
function layerToString(layer) {
  let layerToString = layer.object_name + "(";
  if (typeof layer.parameters.inputSize !== "undefined") {
    layerToString += layer.parameters.inputSize.value;
    if (typeof layer.parameters.outputSize !== "undefined") {
      layerToString += "," + layer.parameters.outputSize.value;
    }
  }
  layerToString += ")";
  return layerToString;
}

CodeSnippet.propTypes = {
  backendResponse: PropTypes.shape({
    success: PropTypes.bool,
    message: PropTypes.string,
  }),
  layers: PropTypes.array.isRequired,
};

export default CodeSnippet;