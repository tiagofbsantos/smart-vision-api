import Clarifai from "clarifai";
import config from "../config";

export default new Clarifai.App({ apiKey: config.clarifaiApiKey });
