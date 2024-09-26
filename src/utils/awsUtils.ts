import { S3ClientConfig } from "@aws-sdk/client-s3";
import { RekognitionClientConfig } from "@aws-sdk/client-rekognition";
import {
  REACT_APP_AWS_ACCESS_KEY_ID,
  REACT_APP_AWS_SECRET_ACCESS_KEY,
  REACT_APP_AWS_REGION,
} from "../config";

export const awsConfig: S3ClientConfig & RekognitionClientConfig = {
  region: REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
};
