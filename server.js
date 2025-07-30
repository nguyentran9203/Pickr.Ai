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
const min = Number(minPrice);
const max = Number(maxPrice);

const result = await products.query.bm25(
  'phone',
  {
    alpha: 0.5,
    limit: 50,
    filters: Filters.and(
      products.filter.byProperty('price').greaterThan(min),
      products.filter.byProperty('price').lessThan(max),
      products.filter.byProperty('category').equal(category)
    ),
    returnProperties: [
      'brand',
      'model',
      'description',
      'price',
      'category',
      'image'
    ]
  }
);


console.log(result.objects.length, 'results found', min, max, category);
  if (result.objects.length === 0) {
    return res.status(404).json({ message: 'No products found' });
  }
console.log('Search results:', result.objects.map(obj => obj.properties));
  // Return
res.json(result.objects.map(obj => ({
    id: obj.id,
    ...obj.properties
  })));

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));