const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category } = req.query;
    
    // Get all active products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    let productsToProcess = data;
    
    // Filter by category if provided
    if (category) {
      productsToProcess = data.filter(product => {
        if (!product.category) return false;
        
        try {
          let categories = typeof product.category === 'string' 
            ? JSON.parse(product.category) 
            : product.category;
          
          return Array.isArray(categories) && categories.includes(category);
        } catch (e) {
          console.log('Error parsing category for product:', product.id, product.category);
          return false;
        }
      });
    }
    
    // Handle image URLs - direct URLs or storage paths
    const productsWithImages = productsToProcess.map((product) => {
      if (product.image_path) {
        // Check if image_path is already a full URL
        if (product.image_path.startsWith('http://') || product.image_path.startsWith('https://')) {
          product.image_url = product.image_path;
        } else {
          // Treat as storage path
          const { data: publicUrl } = supabase.storage
            .from('furniture-images')
            .getPublicUrl(product.image_path);
          
          if (publicUrl) {
            product.image_url = publicUrl.publicUrl;
          }
        }
      }
      return product;
    });
    
    res.status(200).json({ products: productsWithImages });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}