const { MongoClient } = require("mongodb");

const client = new MongoClient(
  "mongodb+srv://mikkosar:Pkh8tfdJDlBGLND9@thesis-chatbot-cluster.eyi4zmw.mongodb.net/chatbot-cluster?retryWrites=true&w=majority&appName=thesis-chatbot-cluster"
);

async function run() {
  try {
    const database = client.db("chatbot-cluster");
    const collection = database.collection("chunks");

    const index = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            numDimensions: 1536,
            path: "embedding",
            similarity: "dotProduct",
            quantization: "scalar",
          },
        ],
      },
    };

    // run the helper method
    const result = await collection.createSearchIndex(index);
    console.log(`New search index named ${result} is building.`);

    // wait for the index to be ready to query
    console.log(
      "Polling to check if the index is ready. This may take up to a minute."
    );

    let isQueryable = false;
    while (!isQueryable) {
      const cursor = collection.listSearchIndexes();
      for await (const index of cursor) {
        if (index.name === result) {
          if (index.queryable) {
            console.log(`${result} is ready for querying.`);
            isQueryable = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      }
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
