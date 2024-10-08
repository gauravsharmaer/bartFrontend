import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import axios from "axios";
import {
  REACT_APP_AWS_ACCESS_KEY_ID,
  REACT_APP_AWS_SECRET_ACCESS_KEY,
  REACT_APP_AWS_REGION,
} from "../../config";

export const createApiClient = () =>
  new BedrockAgentRuntimeClient({
    region: REACT_APP_AWS_REGION,
    credentials: {
      accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

export const createCommand = (
  inputText: string,
  sessionId: string
): InvokeAgentCommand => {
  if (!sessionId) {
    throw new Error("Session ID is not set");
  }
  return new InvokeAgentCommand({
    agentId: "U3YHVQFHVA",
    agentAliasId: "NBRGXSURUV",
    sessionId: sessionId,
    inputText: inputText,
  });
};

export const sendAndDecodeResponse = async (
  client: BedrockAgentRuntimeClient,
  command: InvokeAgentCommand
): Promise<string> => {
  const response = await client.send(command);
  console.log("API Response:", response);

  let fullResponse = "";
  const decoder = new TextDecoder("utf-8");

  if (response.completion) {
    for await (const event of response.completion) {
      if (event.chunk && event.chunk.bytes) {
        const byteArray = new Uint8Array(event.chunk.bytes);
        fullResponse += decoder.decode(byteArray, { stream: true });
      }
    }
  } else {
    console.error("Unexpected API response structure:", response);
  }

  return fullResponse;
};

export const storeMessage = async (
  message: string,
  isUserMessage: boolean,
  sessionId: string
): Promise<void> => {
  try {
    const username = "";
    const password = "gaurav@123";

    if (!username || !password) {
      console.error("Username or password not found");
      return;
    }

    await axios.post(
      "https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat",
      {
        action: "store",
        email: username,
        password: password,
        sessionId: sessionId,
        message: message,
        isUserMessage: isUserMessage,
      }
    );
  } catch (error) {
    console.error("Error storing message:", error);
  }
};
