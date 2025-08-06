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
  const {
    minPrice,
    maxPrice,
    category,
    battery,
  } = req.body;

 
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

    const filters = [];

    const min = Number(minPrice);
    const max = Number(maxPrice);
    const batteryImportance = Number(battery);
    
    if (!isNaN(min)) filters.push(products.filter.byProperty('price').greaterThan(min));
    if (!isNaN(max)) filters.push(products.filter.byProperty('price').lessThan(max));

    if (category && category !== 'All') {
      filters.push(products.filter.byProperty('category').equal(category));
    }

    

    if (batteryImportance >= 6) {
  filters.push(products.filter.byProperty('battery').greaterThan(4000));
    }
  


const result = await products.query.bm25(
  'phone',
  {
    alpha: 0.5,
    limit: 50,
    filters: Filters.or(
      products.filter.byProperty('price').greaterThan(min),
      products.filter.byProperty('price').lessThan(max),
      products.filter.byProperty('category').equal(category),
  
      products.filter.byProperty('battery').equal(batteryImportance),
    ),
    returnProperties: [
      'brand',
      'model',
      'description',
      'battery',
  
      'price',
      'category',
      'image'
    ]
  }
);


console.log(result.objects.length, 'results found', min, max, category, cameraImportance, batteryImportance);
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