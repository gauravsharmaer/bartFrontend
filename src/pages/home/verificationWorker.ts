// Import removed since it's not used
declare const self: Worker;

self.onmessage = async (e: MessageEvent) => {
  // Remove unused threshold variable
  const { descriptors } = e.data;

  try {
    const averageDescriptor = calculateAverageDescriptor(descriptors);
    self.postMessage({ success: true, descriptor: averageDescriptor });
  } catch (error: unknown) {
    // Type guard for error message
    if (error instanceof Error) {
      self.postMessage({ success: false, error: error.message });
    } else {
      self.postMessage({ success: false, error: "An unknown error occurred" });
    }
  }
};

function calculateAverageDescriptor(descriptors: Float32Array[]): number[] {
  if (descriptors.length === 0) return [];

  const length = descriptors[0].length;
  const sum = new Float32Array(length);

  for (const descriptor of descriptors) {
    for (let i = 0; i < length; i++) {
      sum[i] += descriptor[i];
    }
  }

  return Array.from(sum.map((val) => val / descriptors.length));
}
