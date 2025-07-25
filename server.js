const express = require('express');
const cors = require('cors');
const app = express();
const weaviate = require('weaviate-client');
const { Filters } = require('weaviate-client');
require('dotenv').config();

app.use(cors());
app.use(express.json());

console.log('OpenAI key loaded:', process.env.OPENAI_API_KEY?.slice(0, 6) + '...');
console.log('Weaviate URL:', process.env.WEAVIATE_URL);

// 🔍 POST /api/search
app.post('/api/search', async (req, res) => {
  const { query, minPrice, maxPrice, category } = req.body;
  try {
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      {
        authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
        headers: {
          'X-OpenAI-Api-Key': process.env.MY_OPEN_AI_API_KEY,
        },
      }
    );

   

    // Convert query safely to string
    const queryString = typeof query === 'string'
      ? query
      : (typeof query === 'object' && query !== null ? JSON.stringify(query) : '');

  

    console.log('Search query:', queryString);
    

const products = client.collections.use('Products');
const result = await products.query.fetchObjects('price', {
  query: queryString,
  returnProperties: ['brand', 'model', 'price', 'image', 'description', 'category'],
  filters: Filters.and(
    products.filter.byProperty('price').lessThan(parseFloat(maxPrice)),
    products.filter.byProperty('price').greaterThan(parseFloat(minPrice)),
    products.filter.byProperty('category').equal(category)
  ),
  limit: 50
});

console.log('Search results:', result.objects.length, 'items found');
  
for (let object of result.objects) {
  console.log(JSON.stringify(object.properties, null, 2));
}

if (!result.objects.length) {
  console.warn("No matching results found for:", { queryString, minPrice, maxPrice, category });
}

console.log('Price filters:', minPrice, maxPrice);
for (const obj of result.objects) {
  console.log(`${obj.properties.brand} - ${obj.properties.model} => $${obj.properties.price}`);
}

   for (let object of result.objects) {
  console.log(JSON.stringify(object.properties, null, 2));
  }
    res.json(result.objects.map(obj => obj.properties));
  } catch (err) {
    console.error('Weaviate error:', err);
    res.status(500).json({ error: 'Weaviate search failed.', details: err.message });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));