-- Insert initial blog posts with sample content from the website
INSERT INTO public.blog_posts (title, author_name, content, category, status, image_url, user_id)
SELECT 
  'The Future of Real Estate in Algeria',
  'Holibayt Research Team',
  E'<p>Algeria\'s real estate market is undergoing a significant transformation, driven by technological innovation, demographic changes, and economic reforms. As we look toward the future, several key trends are shaping the landscape of property investment and development across the country.</p>\n\n<h2>Digital Transformation</h2>\n<p>The digital revolution is fundamentally changing how Algerians buy, sell, and rent properties. Online platforms like Holibayt are making property transactions more transparent, efficient, and accessible to a broader audience. Virtual property tours, digital documentation, and AI-powered property matching are becoming standard practices.</p>\n\n<h2>Sustainable Development</h2>\n<p>Environmental consciousness is driving demand for sustainable housing solutions. Green building practices, energy-efficient designs, and renewable energy integration are becoming increasingly important factors in property valuation and buyer preferences.</p>\n\n<h2>Urban Planning Evolution</h2>\n<p>Major cities like Algiers, Oran, and Constantine are implementing smart city initiatives that improve infrastructure, transportation, and quality of life. These developments are creating new investment opportunities and reshaping property values across different neighborhoods.</p>',
  'market-trends',
  'published',
  '/src/assets/blog-real-estate-future.jpg',
  (SELECT id FROM auth.users WHERE email LIKE '%@holibayt.%' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE title = 'The Future of Real Estate in Algeria');

INSERT INTO public.blog_posts (title, author_name, content, category, status, image_url, user_id)
SELECT 
  'How to Choose the Right Location for Your Property',
  'Property Investment Guide',
  E'<p>Location is the most critical factor in real estate success. Whether you\'re buying your first home or making an investment, understanding how to evaluate location quality will determine your property\'s long-term value and your satisfaction as an owner.</p>\n\n<h2>Transportation and Accessibility</h2>\n<p>Proximity to major transportation hubs, highways, and public transit significantly impacts property value. In cities like Algiers, properties near metro stations or major bus routes command higher prices and rent more easily.</p>\n\n<h2>Neighborhood Development</h2>\n<p>Research planned infrastructure projects, new schools, hospitals, and commercial developments. Areas undergoing positive transformation often present excellent investment opportunities before prices rise substantially.</p>\n\n<h2>Safety and Security</h2>\n<p>Crime statistics, lighting, and general neighborhood safety should be thoroughly evaluated. Visit the area at different times of day and week to get a complete picture of the security situation.</p>',
  'buying-guide',
  'published',
  '/src/assets/blog-property-location.jpg',
  (SELECT id FROM auth.users WHERE email LIKE '%@holibayt.%' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE title = 'How to Choose the Right Location for Your Property');

INSERT INTO public.blog_posts (title, author_name, content, category, status, image_url, user_id)
SELECT 
  'Short-Stay Rental Investment Opportunities',
  'Investment Strategy',
  E'<p>The short-stay rental market in Algeria is experiencing unprecedented growth, driven by increased tourism, business travel, and evolving accommodation preferences. This presents significant opportunities for property investors willing to adapt to this dynamic market.</p>\n\n<h2>Market Dynamics</h2>\n<p>Algeria\'s tourism industry is growing rapidly, with both domestic and international visitors seeking alternatives to traditional hotels. Short-stay rentals offer more space, privacy, and authentic local experiences that modern travelers value.</p>\n\n<h2>Optimal Property Types</h2>\n<p>Properties near tourist attractions, business districts, or airports perform best. One to three-bedroom apartments in city centers or unique properties like traditional houses with modern amenities are particularly popular.</p>\n\n<h2>Revenue Optimization</h2>\n<p>Successful short-stay operators focus on professional photography, competitive pricing strategies, and exceptional guest services. Dynamic pricing tools can help maximize revenue during peak seasons and events.</p>',
  'investment',
  'published',
  '/src/assets/blog-short-stay-rental.jpg',
  (SELECT id FROM auth.users WHERE email LIKE '%@holibayt.%' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE title = 'Short-Stay Rental Investment Opportunities');

INSERT INTO public.blog_posts (title, author_name, content, category, status, image_url, user_id)
SELECT 
  'Understanding Property Valuation Methods',
  'Real Estate Analysis',
  E'<p>Accurate property valuation is crucial whether you\'re buying, selling, or investing. Understanding the various valuation methods helps you make informed decisions and negotiate effectively in the Algerian real estate market.</p>\n\n<h2>Comparative Market Analysis</h2>\n<p>The most common method involves comparing your property to similar recently sold properties in the area. This approach considers location, size, condition, and amenities to establish fair market value.</p>\n\n<h2>Income Approach</h2>\n<p>For investment properties, the income approach calculates value based on the property\'s income-generating potential. This method is particularly relevant for rental properties and considers factors like rental rates, occupancy levels, and operating expenses.</p>\n\n<h2>Cost Approach</h2>\n<p>This method estimates the cost to rebuild the property from scratch, minus depreciation. It\'s particularly useful for unique properties or new constructions where comparable sales are limited.</p>',
  'buying-guide',
  'published',
  '/src/assets/blog-property-valuation.jpg',
  (SELECT id FROM auth.users WHERE email LIKE '%@holibayt.%' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE title = 'Understanding Property Valuation Methods');

INSERT INTO public.blog_posts (title, author_name, content, category, status, image_url, user_id)
SELECT 
  'Renovation Tips for Maximizing Property Value',
  'Home Improvement Expert',
  E'<p>Strategic renovations can significantly increase your property\'s value and appeal to potential buyers or renters. However, not all improvements offer equal returns on investment. Focus on updates that provide the best value for your money.</p>\n\n<h2>Kitchen and Bathroom Updates</h2>\n<p>These rooms have the highest impact on property value. Modern fixtures, updated appliances, and fresh finishes can transform dated spaces without complete overhauls. Focus on quality materials that will last.</p>\n\n<h2>Energy Efficiency Improvements</h2>\n<p>Installing energy-efficient windows, insulation, and modern HVAC systems not only increases property value but also attracts environmentally conscious buyers and reduces operating costs.</p>\n\n<h2>Curb Appeal Enhancement</h2>\n<p>First impressions matter. Simple improvements like fresh paint, landscaping, and improved lighting can significantly impact how potential buyers perceive your property\'s value.</p>',
  'renovation',
  'published',
  '/src/assets/blog-renovation-tips.jpg',
  (SELECT id FROM auth.users WHERE email LIKE '%@holibayt.%' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE title = 'Renovation Tips for Maximizing Property Value');

INSERT INTO public.blog_posts (title, author_name, content, category, status, image_url, user_id)
SELECT 
  'Legal Considerations When Buying Property in Algeria',
  'Legal Advisory',
  E'<p>Understanding the legal framework governing property transactions in Algeria is essential for protecting your investment and ensuring smooth ownership transfer. Familiarize yourself with these key legal considerations before purchasing property.</p>\n\n<h2>Property Title Verification</h2>\n<p>Always conduct thorough due diligence on the property title. Verify ownership records, check for liens or encumbrances, and ensure there are no legal disputes associated with the property.</p>\n\n<h2>Registration Requirements</h2>\n<p>Property transactions must be registered with relevant government authorities. Ensure all documentation is properly completed and filed to establish legal ownership and avoid future complications.</p>\n\n<h2>Foreign Investment Regulations</h2>\n<p>Foreign buyers should understand specific regulations and restrictions that may apply to their purchases. Some property types or locations may have limitations on foreign ownership.</p>',
  'legal',
  'published',
  '/src/assets/blog-legal-considerations.jpg',
  (SELECT id FROM auth.users WHERE email LIKE '%@holibayt.%' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE title = 'Legal Considerations When Buying Property in Algeria');