const weaviate = require('weaviate-client');
require('dotenv').config();
const search = async () => {
    const client = await weaviate.connectToWeaviateCloud(
        process.env.WEAVIATE_URL, { 
          authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY), 
          headers: {
            'X-OpenAI-Api-Key': process.env.MY_OPEN_AI_API_KEY,
          }
        })
          let products = client.collections.use('Products')

for await (let item of products.iterator({
    includeVector: true
  })) {
    console.log(item.uuid, item.properties);
    console.log(item.vectors);
}
    console.log(client)
}

search();
