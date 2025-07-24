const express = require('express');
const cors = require('cors');
const app = express();
const weaviate = require('weaviate-client');
const { parse } = require('dotenv');
const { Filters } = weaviate;
require('dotenv').config();

app.use(cors());
app.use(express.json());

console.log('OpenAI key loaded:', process.env.OPENAI_API_KEY?.slice(0, 6) + '...');
console.log('Weaviate URL:', process.env.WEAVIATE_URL);

// 🔍 POST /api/search
app.post('/api/search', async (req, res) => {
  const { query, minPrice, maxPrice, category } = req.body;
 const filters = [];
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

    const products = client.collections.use('Products');

    // Convert query safely to string
    const queryString = typeof query === 'string'
      ? query
      : (typeof query === 'object' && query !== null ? JSON.stringify(query) : '');

  

    console.log('Search query:', queryString);
    


const result = await products.query.hybrid('Products', {
  query: queryString,
  limit: 50,
  returnProperties: ['brand', 'model', 'description', 'price', 'category', 'image'],
  filters: Filters.or(
   products.filter.byProperty('price').greaterThan(parseFloat(minPrice || 0)),
      products.filter.byProperty('price').lessThan(parseFloat(maxPrice || Number.MAX_VALUE)),
  )
});

console.log('Price filters:', minPrice, maxPrice);
    res.json(result.objects.map(obj => obj.properties));
  } catch (err) {
    console.error('Weaviate error:', err);
    res.status(500).json({ error: 'Weaviate search failed.', details: err.message });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));