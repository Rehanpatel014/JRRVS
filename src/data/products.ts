import { Product, StudentReview } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'jrrvs-boxy-tee-01',
    name: 'Heavyweight Boxy Tee',
    subtitle: '280 GSM Combed Cotton · Drop Shoulder',
    price: 1499,
    originalPrice: 1899,
    category: 'tees',
    fit: 'Boxy Fit',
    gsm: 280,
    color: 'Vintage Black',
    colorHex: '#18181b',
    availableColors: [
      { name: 'Vintage Black', hex: '#18181b' },
      { name: 'Chalk White', hex: '#f4f3ef' },
      { name: 'Washed Charcoal', hex: '#3f3f46' },
      { name: 'Faded Moss', hex: '#3f4e3f' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    description: 'Constructed from custom-developed 280 GSM combed jersey with a tight 1x1 rib collar that never sags after wash. Features a high boxy torso, relaxed elbow-length sleeves, and raw drop shoulders engineered for the modern college silhouette.',
    details: [
      '280 GSM heavyweight 100% combed cotton',
      'Anti-bacon tight 1.25" rib collar',
      'Wide boxy torso cut with zero side taper',
      'Pre-shrunk vintage garment dye wash',
      'Machine wash cold, air dry recommended'
    ],
    modelInfo: 'Model is 6\'1" (185cm) / 165 lbs wearing Size L for an oversized drape',
    isNewDrop: true,
    isBestseller: true,
    stockCount: 8
  },
  {
    id: 'jrrvs-hoodie-01',
    name: 'Drop-Shoulder Fleece Hoodie',
    subtitle: '460 GSM French Terry · Structured Double Hood',
    price: 2999,
    originalPrice: 3699,
    category: 'hoodies',
    fit: 'Oversized',
    gsm: 460,
    color: 'Bone Off-White',
    colorHex: '#e8e6df',
    availableColors: [
      { name: 'Bone Off-White', hex: '#e8e6df' },
      { name: 'Graphite Slate', hex: '#27272a' },
      { name: 'Earthy Clay', hex: '#785b4f' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
    description: 'The definitive campus cold-weather layer. Dense 460 GSM loopback cotton that stands on its own without slouching. Features an uncorded clean double-layered hood, hidden deep kangaroo pocket, and heavy ribbed cuffs.',
    details: [
      '460 GSM ultra-heavyweight loopback fleece',
      'Seamless double-lined structured hood (no drawstrings)',
      'Extreme drop shoulder with tailored wrist taper',
      'Concealed double-stitch kangaroo pocket',
      'Pre-washed to preserve fit across semesters'
    ],
    modelInfo: 'Model is 5\'11" (180cm) / 160 lbs wearing Size L',
    isNewDrop: true,
    isBestseller: true,
    stockCount: 5
  },
  {
    id: 'jrrvs-cargo-01',
    name: 'Wide-Leg Parachute Cargo',
    subtitle: 'Bungee Hem Adjusters · 6-Pocket Utility Layout',
    price: 2499,
    originalPrice: 2999,
    category: 'cargos',
    fit: 'Wide Leg',
    gsm: 310,
    color: 'Mineral Olive',
    colorHex: '#44493c',
    availableColors: [
      { name: 'Mineral Olive', hex: '#44493c' },
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Desert Sand', hex: '#b3a896' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
    description: 'Engineered with lightweight yet tear-resistant ripstop cotton twill. Relaxed balloon leg with adjustable bungee toggles at the ankles, letting you alternate between stacked pooling over sneakers or tapered joggers.',
    details: [
      '310 GSM cotton-poly blend with ripstop weave',
      'Dual gusseted 3D thigh cargo pockets with snap flap',
      'Elasticized waistband with internal heavy drawcord',
      'Ankle bungee cinch locks for versatile silhouette',
      'Roomy hip and thigh profile'
    ],
    modelInfo: 'Model is 6\'0" (183cm) wearing Size M (31-32" waist)',
    isNewDrop: true,
    isBestseller: true,
    stockCount: 11
  },
  {
    id: 'jrrvs-hoodie-02',
    name: 'Campus Uniform Zip-Hoodie',
    subtitle: '440 GSM Brushed Fleece · Custom Matte Two-Way Zip',
    price: 3199,
    originalPrice: 3899,
    category: 'hoodies',
    fit: 'Oversized',
    gsm: 440,
    color: 'Washed Ash Grey',
    colorHex: '#4a4d53',
    availableColors: [
      { name: 'Washed Ash Grey', hex: '#4a4d53' },
      { name: 'Midnight Onyx', hex: '#141416' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
    description: 'Designed for layering between campus classes. Heavyweight 440 GSM fleece fitted with an antique silver two-way zipper so you can unzip the lower half for that relaxed boxy streetwear drape.',
    details: [
      '440 GSM brushed heavyweight cotton fleece',
      'Heavy-gauge dual two-way metal zipper',
      'Relaxed drop-shoulder armhole cut',
      'Reinforced side seam ribbed panels',
      'Split pouch pockets with bar-tack reinforcement'
    ],
    modelInfo: 'Model is 6\'2" (188cm) / 170 lbs wearing Size XL',
    isNewDrop: false,
    isBestseller: true,
    stockCount: 6
  },
  {
    id: 'jrrvs-denim-01',
    name: 'Washed Baggy Carpenter Denim',
    subtitle: '13.5 oz Raw Slub Denim · Hammer Loop & Tool Pockets',
    price: 2899,
    originalPrice: 3499,
    category: 'cargos',
    fit: 'Wide Leg',
    gsm: 460,
    color: 'Distressed Vintage Blue',
    colorHex: '#4c627a',
    availableColors: [
      { name: 'Distressed Vintage Blue', hex: '#4c627a' },
      { name: 'Faded Black Enzyme', hex: '#2b2b2e' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80',
    description: 'Authentic 90s skater cut adapted for modern university styling. 13.5 oz ring-spun denim treated with stone washing and subtle hand whiskers. Wide straight leg with generous hem stack over low or high-top kicks.',
    details: [
      '13.5 oz (approx 460 GSM) 100% rigid ring-spun cotton',
      'Authentic carpenter utility pocket and hammer loop',
      'Relaxed seat with extra leg clearance',
      'Custom embossed JRRVS metal shank button & rivets',
      'Natural leg opening stacking at 21"'
    ],
    modelInfo: 'Model is 6\'1" wearing Size M (32 waist)',
    isNewDrop: true,
    isBestseller: false,
    stockCount: 9
  },
  {
    id: 'jrrvs-tee-02',
    name: 'Campus Nostalgia Graphic Tee',
    subtitle: '260 GSM Distressed Print · Acid Wash Finish',
    price: 1599,
    category: 'tees',
    fit: 'Boxy Fit',
    gsm: 260,
    color: 'Acid Washed Pepper',
    colorHex: '#2f3136',
    availableColors: [
      { name: 'Acid Washed Pepper', hex: '#2f3136' },
      { name: 'Washed Oat', hex: '#ded9cd' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    description: 'Subtle archival screenprint inspired by brutalist campus architecture and college soundscapes. Soft water-based discharge ink sinks directly into the cotton fibers, preventing cracking.',
    details: [
      '260 GSM single jersey with vintage garment enzyme wash',
      'Soft-feel discharge screenprint front and back neck',
      'Thick rib knit crewneck',
      'Wide chest box cut with dropped shoulders'
    ],
    modelInfo: 'Model is 6\'0" / 155 lbs wearing Size L',
    isNewDrop: false,
    isBestseller: true,
    stockCount: 14
  },
  {
    id: 'jrrvs-outerwear-01',
    name: 'Nylon Campus Coach Jacket',
    subtitle: 'Matte Crinkle Shell · Quilted Satin Lining',
    price: 3799,
    originalPrice: 4499,
    category: 'outerwear',
    fit: 'Relaxed',
    gsm: 320,
    color: 'Matte Ink Navy',
    colorHex: '#1e2530',
    availableColors: [
      { name: 'Matte Ink Navy', hex: '#1e2530' },
      { name: 'Pitch Black', hex: '#111111' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
    description: 'A rain-resistant lightweight coach jacket engineered for dashing between campus halls and evening parties. Features an internal lightweight diamond-quilted fill for chilly mornings, snap buttons, and a clean point collar.',
    details: [
      'DWR water-repellent matte crinkle nylon shell',
      'Low-bulk diamond quilted polyfill lining',
      'Tone-on-tone matte powder-coated metal snaps',
      'Internal zip chest pocket for campus ID and AirPods',
      'Dual slant hand-warmer welt pockets'
    ],
    modelInfo: 'Model is 6\'1" wearing Size L',
    isNewDrop: true,
    isBestseller: false,
    stockCount: 7
  },
  {
    id: 'jrrvs-tee-03',
    name: 'Heavy Waffle Thermal Longsleeve',
    subtitle: '340 GSM Honeycomb Waffle · Raw Cut Hem',
    price: 1899,
    category: 'tees',
    fit: 'Relaxed',
    gsm: 340,
    color: 'Raw Ecru Chalk',
    colorHex: '#dedcd3',
    availableColors: [
      { name: 'Raw Ecru Chalk', hex: '#dedcd3' },
      { name: 'Slate Anthracite', hex: '#2c2e33' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80',
    description: 'Thick, tactile waffle knit designed to peek out beneath short sleeve boxy tees or stand alone on mild autumn afternoons. Relaxed wrist cuffs and subtle raw edge detail.',
    details: [
      '340 GSM heavy honeycomb textured 100% cotton',
      'Extended sleeve length for relaxed wrist stacking',
      'Pre-washed for non-shrinkage',
      'Tonal minimalist embroidery on inner cuff'
    ],
    modelInfo: 'Model is 6\'0" wearing Size M',
    isNewDrop: false,
    isBestseller: false,
    stockCount: 12
  },
  {
    id: 'jrrvs-accessories-01',
    name: 'Unstructured Heavy Twill Cap',
    subtitle: '100% Chino Cotton Twill · Brushed Silver Slide Buckle',
    price: 999,
    originalPrice: 1299,
    category: 'accessories',
    fit: 'Relaxed',
    gsm: 380,
    color: 'Washed Carbon',
    colorHex: '#25262a',
    availableColors: [
      { name: 'Washed Carbon', hex: '#25262a' },
      { name: 'Bone White', hex: '#e8e6df' },
      { name: 'Forest Evergreen', hex: '#22382c' }
    ],
    sizes: ['M'], // One Size
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=1000&q=80',
    description: 'The low-profile dad cap perfected for bed-head 8 AM lectures. Unstructured 6-panel crown crafted from heavy washed chino twill with a custom debossed metal clasp at the back strap.',
    details: [
      '100% heavyweight enzyme washed cotton twill',
      'Low-profile 6-panel unstructured crown',
      'Self-fabric back strap with brushed silver buckle',
      'Subtle tonal tonal JRRVS micro-embroidery at temple',
      'One size fits all'
    ],
    modelInfo: 'One size fits all with adjustable back strap',
    isNewDrop: true,
    isBestseller: true,
    stockCount: 22
  },
  {
    id: 'jrrvs-accessories-02',
    name: 'Cordura Crossbody Tech Sling',
    subtitle: 'Waterproof 500D Nylon · Fidlock Magnetic Buckle',
    price: 1499,
    originalPrice: 1799,
    category: 'accessories',
    fit: 'Relaxed',
    gsm: 500,
    color: 'Stealth Black',
    colorHex: '#121214',
    availableColors: [
      { name: 'Stealth Black', hex: '#121214' },
      { name: 'Slate Grey', hex: '#4b5563' }
    ],
    sizes: ['M'], // One Size
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
    description: 'Sized precisely for student daily essentials: iPad Mini or e-reader, phone, keys, sunglasses, charger, and ID card. Quick-release magnetic clasp and water-resistant YKK Aquaguard zips.',
    details: [
      '500D waterproof textured ballistic nylon',
      'Quick snap magnetic strap buckle',
      'YKK weather-sealed reverse coil zippers',
      'Padded internal mesh pocket dividers',
      'Volume: 2.8 Liters'
    ],
    modelInfo: 'Adjustable cross-chest or shoulder carry',
    isNewDrop: false,
    isBestseller: true,
    stockCount: 15
  },
  {
    id: 'jrrvs-cargos-02',
    name: 'Relaxed Double-Knee Work Short',
    subtitle: 'Reinforced 320 GSM Canvas · Skater Hem Cut',
    price: 2199,
    category: 'cargos',
    fit: 'Wide Leg',
    gsm: 320,
    color: 'Faded Khaki Sand',
    colorHex: '#8c826e',
    availableColors: [
      { name: 'Faded Khaki Sand', hex: '#8c826e' },
      { name: 'Washed Black', hex: '#1f1f23' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=1000&q=80',
    description: 'Heavyweight canvas shorts that sit just below the knee with a wide, boxy leg opening. Reinforced double front panels and deep pockets for everyday dorm life.',
    details: [
      '320 GSM heavy cotton duck canvas',
      'Reinforced double knee panel with brass rivets',
      '11" inseam tailored for relaxed baggy drape',
      'Triple-stitched main seams'
    ],
    modelInfo: 'Model is 6\'1" wearing Size M',
    isNewDrop: false,
    isBestseller: false,
    stockCount: 8
  },
  {
    id: 'jrrvs-hoodie-03',
    name: 'Raw Edge Knit Boxy Crewneck',
    subtitle: '400 GSM Reverse Weave · Ribbed Side Gussets',
    price: 2599,
    originalPrice: 3199,
    category: 'hoodies',
    fit: 'Boxy Fit',
    gsm: 400,
    color: 'Deep Concrete',
    colorHex: '#3a3a3d',
    availableColors: [
      { name: 'Deep Concrete', hex: '#3a3a3d' },
      { name: 'Faded Bone', hex: '#dfded7' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?auto=format&fit=crop&w=1000&q=80',
    description: 'Clean crewneck sweater with heavyweight ribbing along both sides to allow natural mobility when biking across campus. Boxy cut with wide drop sleeves and subtle tonal collar stitch.',
    details: [
      '400 GSM heavyweight French terry',
      'Action-rib side panels for non-binding fit',
      'Drop shoulders with high armholes',
      'Minimal tone-on-tone stitched tab at waist hem'
    ],
    modelInfo: 'Model is 6\'0" wearing Size L',
    isNewDrop: true,
    isBestseller: false,
    stockCount: 10
  }
];

export const STUDENT_REVIEWS: StudentReview[] = [
  {
    id: 'rev-1',
    author: 'Aryan K.',
    campus: 'Delhi University (North Campus)',
    productName: 'Heavyweight Boxy Tee (280 GSM)',
    sizePurchased: 'Size L',
    userStats: '6ft 1in, 72 kg',
    rating: 5,
    date: '3 days ago',
    comment: 'Literally the only tee that doesn’t flare weird at the collar after 10 washes in hostel washing machines. Collar stays tight, shoulders have that heavy luxury streetwear drape without costing ₹6,000+.'
  },
  {
    id: 'rev-2',
    author: 'Rohan M.',
    campus: 'IIT Bombay, Powai',
    productName: 'Drop-Shoulder Fleece Hoodie (460 GSM)',
    sizePurchased: 'Size XL',
    userStats: '6ft 2in, 76 kg',
    rating: 5,
    date: '1 week ago',
    comment: 'The hood actually stands up on its own instead of drooping flat on your neck. 460 GSM loopback cotton is seriously dense. Gets complimented constantly at library night outs.'
  },
  {
    id: 'rev-3',
    author: 'Kabir T.',
    campus: 'Christ University, Bengaluru',
    productName: 'Wide-Leg Parachute Cargo',
    sizePurchased: 'Size M',
    userStats: '5ft 11in, 68 kg',
    rating: 5,
    date: '2 weeks ago',
    comment: 'The bungee cords at the ankles are clutch. You can stack them crazy wide over Sambas or cinch them over high-top Dunks. 10/10 fit, easily the best ₹2,499 spent on college clothes.'
  },
  {
    id: 'rev-4',
    author: 'Dev R.',
    campus: 'BITS Pilani, Goa Campus',
    productName: 'Campus Uniform Zip-Hoodie',
    sizePurchased: 'Size L',
    userStats: '6ft 0in, 70 kg',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Two-way zipper allows that effortless bottom unzipped silhouette. Fabric is insanely soft and heavy. The student coupon code COLLEGE10 gave an instant 10% discount too.'
  }
];

export const LOOKBOOK_LOOKS = [
  {
    id: 'look-1',
    title: 'The Library All-Nighter',
    location: 'Central Campus Library, 11:40 PM',
    description: 'Heavyweight 460 GSM hoodie layered over boxy vintage tee with relaxed parachute cargos for unconstrained focus.',
    items: ['Drop-Shoulder Fleece Hoodie', 'Utility Parachute Cargo', 'Cordura Tech Sling'],
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80',
    tags: ['Comfort Drape', '460 GSM', 'Lecture Ready']
  },
  {
    id: 'look-2',
    title: 'Off-Campus Cafe Link',
    location: 'Kala Ghoda / Cyber Hub Courtyard, 2:15 PM',
    description: 'Vintage 280 GSM boxy tee paired with distressed raw carpenter denim and the unstructured twill cap.',
    items: ['Heavyweight Boxy Tee', 'Baggy Carpenter Denim', 'Unstructured Twill Cap'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
    tags: ['Street Skater', 'Boxy Torso', 'Denim Stacking']
  },
  {
    id: 'look-3',
    title: 'Transit & Studio Grind',
    location: 'Design Metro Station, 6:00 PM',
    description: 'Two-way zip hoodie in Washed Ash over heavy waffle thermal and utility cargos with cinched bungee cuffs.',
    items: ['Campus Uniform Zip-Hoodie', 'Waffle Thermal Longsleeve', 'Parachute Cargo'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
    tags: ['Modular Layering', 'Weatherproof', 'Campus Uniform']
  }
];
