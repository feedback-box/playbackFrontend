import * as cv from 'opencv.js';

let loaded = false;
let promise;

const loadOpenCV = async () => {
  if (!loaded) {
    promise = new Promise((resolve, reject) => {
      cv.onRuntimeInitialized = () => {
        loaded = true;
        resolve();
      };
    });
  }
  await promise;
};

export default {
  loadOpenCV,
  cv,
};