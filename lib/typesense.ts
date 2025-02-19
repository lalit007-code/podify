import { Client } from "typesense";

const typesenseClient = new Client({
  nodes: [
    {
      host: "localhost", // Replace with your Typesense server host
      port: 8108, // Replace with your Typesense server port
      protocol: "http", // Use 'https' if applicable
    },
  ],
  apiKey: "your-api-key", // Replace with your Typesense API key
  connectionTimeoutSeconds: 2,
});

export default typesenseClient;
