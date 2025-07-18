const express = require('express');
const cors = require('cors');
const app = express();
const weaviate = require('weaviate-client') ;

app.use(cors());
app.use(express.json());
require ('dotenv').config();
// Example mock products
const mockResults = [
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    description: 'Amazing camera and all-day battery. Perfect for photographers!',
    price: 999
  },
  {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    description: 'Lightning fast. Best-in-class video and photo performance.',
    price: 1199
  },
  {
    image: 'https://images.unsplash.com/photo-1526178613658-3d6b6ce3c6c7?auto=format&fit=crop&w=400&q=80',
    brand: 'Sony',
    model: 'WH-1000XM5',
    description: 'Top-rated wireless noise-cancelling headphones.',
    price: 349
  }
];


app.post('/api/search', async (req, res) => {
  const { query, minPrice, maxPrice, category } = req.body;
  const filters = [];

  if (minPrice) filters.push({ path: ["price"], operator: "GreaterThanEqual", valueNumber: parseFloat(minPrice) });
  if (maxPrice) filters.push({ path: ["price"], operator: "LessThanEqual", valueNumber: parseFloat(maxPrice) });
  if (category && category !== "All") filters.push({ path: ["category"], operator: "Equal", valueText: category });

  const where =
    filters.length > 1
      ? { operator: "And", operands: filters }
      : filters.length === 1
      ? filters[0]
      : undefined;

  try {
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      { 
        authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
        headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY }
      }
    );

    const result = await client.graphql.get()
      .withClassName('Product')
      .withFields('brand model description price category image')
      .withNearText(query ? { concepts: [query] } : undefined)
      .withWhere(where)
      .withLimit(18)
      .do();

    res.json(result.data.Get.Product || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Weaviate search failed.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
//weaviate client setup
const MY_WEAVIATE_URL = process.env.WEAVIATE_URL;
const MY_API_KEY = process.env.WEAVIATE_API_KEY;
const MY_OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const search = async () => {
    const client = await weaviate.connectToWeaviateCloud(
        MY_WEAVIATE_URL, { 
          authCredentials: new weaviate.ApiKey(MY_API_KEY), 
          headers: {
            'X-OpenAI-Api-Key': MY_OPENAI_API_KEY,
          }
        } 
      )

    console.log(client)
}

search()