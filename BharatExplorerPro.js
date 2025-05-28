import React, { useState, useEffect } from 'react';

const BharatExplorerPro = () => {
 const [activeTab, setActiveTab] = useState('discover');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [selectedState, setSelectedState] = useState(null);
 const [selectedRoute, setSelectedRoute] = useState(null);
 const [selectedUNESCO, setSelectedUNESCO] = useState(null);
 const [currentImageIndex, setCurrentImageIndex] = useState(0);
 const [weather, setWeather] = useState({ temp: 28, condition: 'sunny', location: 'Mumbai' });

 // AI states
 const [aiQuery, setAiQuery] = useState('');
 const [aiResponse, setAiResponse] = useState('');
 const [aiLoading, setAiLoading] = useState(false);

 // 🔑 ADD YOUR GEMINI API KEY HERE
 const GEMINI_API_KEY = ""; // Replace with your actual API key
 const WEATHER_API_KEY = "";  // Replace with your actual OpenWeatherMap API key

 useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { 
      id: 'discover', 
      label: 'Discover India', 
      icon: '🌍',
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25'
    },
    { 
      id: 'plan', 
      label: 'Plan Trip', 
      icon: '📅',
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'from-blue-400 to-indigo-500',
      shadowColor: 'shadow-blue-500/25'
    },
    { 
      id: 'routes', 
      label: 'Scenic Routes', 
      icon: '🛣️',
      gradient: 'from-purple-500 to-violet-600',
      hoverGradient: 'from-purple-400 to-violet-500',
      shadowColor: 'shadow-purple-500/25'
    },
    { 
      id: 'heritage', 
      label: 'UNESCO Sites', 
      icon: '🏛️',
      gradient: 'from-amber-500 to-orange-600',
      hoverGradient: 'from-amber-400 to-orange-500',
      shadowColor: 'shadow-amber-500/25'
    },
    { 
      id: 'fuel', 
      label: 'Fuel & EV', 
      icon: '⛽',
      gradient: 'from-red-500 to-pink-600',
      hoverGradient: 'from-red-400 to-pink-500',
      shadowColor: 'shadow-red-500/25'
    },
    { 
      id: 'food', 
      label: 'Food Stops', 
      icon: '🍽️',
      gradient: 'from-orange-500 to-red-600',
      hoverGradient: 'from-orange-400 to-red-500',
      shadowColor: 'shadow-orange-500/25'
    },
    { 
      id: 'community', 
      label: 'Community', 
      icon: '👥',
      gradient: 'from-cyan-500 to-blue-600',
      hoverGradient: 'from-cyan-400 to-blue-500',
      shadowColor: 'shadow-cyan-500/25'
    }
  ];
  const [scrolled, setScrolled] = useState(false);

 const handleTabClick = (tab) => {
   setActiveTab(tab);
   setIsMobileMenuOpen(false);
 };

 // Auto-rotate images
 useEffect(() => {
   const interval = setInterval(() => {
     setCurrentImageIndex((prev) => (prev + 1) % 3);
   }, 4000);
   return () => clearInterval(interval);
 }, []);

 // Weather icon mapping function
 const getWeatherIcon = (condition) => {
   const iconMap = {
     'clear': '☀️',
     'sunny': '☀️',
     'cloudy': '☁️',
     'rain': '🌧️',
     'thunderstorm': '⛈️',
     'snow': '🌨️',
     'mist': '🌫️',
     'haze': '🌫️',
     'fog': '🌫️'
   };
   return iconMap[condition.toLowerCase()] || '🌤️';
 };
  // 🌤️ REAL-TIME WEATHER FUNCTION
  const fetchWeather = async (city = 'Mumbai') => {
    if (!WEATHER_API_KEY) {
      // Demo weather data if no API key
      const demoWeather = {
        temp: Math.floor(Math.random() * 15) + 20,
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
        location: city,
        description: ['Clear Sky', 'Partly Cloudy', 'Light Rain'][Math.floor(Math.random() * 3)]
      };
      setWeather(demoWeather);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main.toLowerCase(),
          location: data.name,
          description: data.weather[0].description
        });
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      // Fallback to demo data
      setWeather({
        temp: 28,
        condition: 'sunny',
        location: city,
        description: 'Clear Sky'
      });
    }
  };

  // Fetch weather on component mount and every 30 minutes
  useEffect(() => {
    fetchWeather();
    const weatherInterval = setInterval(() => fetchWeather(), 1800000); // 30 minutes
    return () => clearInterval(weatherInterval);
  }, []);


 // 🤖 GEMINI AI SEARCH FUNCTION
 const handleAISearch = async () => {
   if (!aiQuery.trim()) return;
   
   setAiLoading(true);
   try {
     const prompt = `You are an expert Indian travel guide with deep knowledge of India's destinations, culture, food, and travel routes. 

User Query: "${aiQuery}"

Provide a comprehensive, helpful response including:
- Specific destination recommendations
- Best time to visit
- How to reach (flights, trains, buses)
- Approximate budget (in INR)
- Must-try local food
- Cultural significance or unique experiences
- Insider tips for travelers
- Nearby attractions

Format your response in a friendly, informative way with emojis for better readability.`;

     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         contents: [{
           parts: [{
             text: prompt
           }]
         }]
       })
     });

     const data = await response.json();
     
     if (data.candidates && data.candidates[0] && data.candidates[0].content) {
       setAiResponse(data.candidates[0].content.parts[0].text);
     } else {
       setAiResponse("🤖 Sorry, I couldn't process your request right now. Please check your API key or try again later!");
     }
   } catch (error) {
     console.error('Gemini AI Error:', error);
     setAiResponse("🤖 Sorry, I couldn't process your request right now. Please check your API key or try again later!");
   }
   setAiLoading(false);
 };

 // 🗺️ TOURIST MAP FUNCTION
 const openGoogleMaps = (query = 'India tourist places') => {
   const encodedQuery = encodeURIComponent(query);
   window.open(`https://www.google.com/maps/search/${encodedQuery}`, '_blank');
 };

 // Premium UNESCO Sites with Real Images
 const unescoSites = [
   {
     id: 1,
     name: 'Taj Mahal',
     location: 'Agra, Uttar Pradesh',
     year: 1983,
     type: 'Cultural',
     description: 'An ivory-white marble mausoleum, symbol of eternal love built by Shah Jahan',
     bestTime: 'October - March',
     entryFee: '₹50 (Indians), ₹1100 (Foreigners)',
     timings: '6:00 AM - 6:30 PM (Closed on Fridays)',
     rating: 4.9,
     visitors: '6-8 million/year',
     images: [
       'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
       'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800&h=600&fit=crop',
       'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop'
     ],
     nearbyAttractions: ['Agra Fort', 'Mehtab Bagh', 'Itimad-ud-Daulah'],
     transportation: ['Air: Agra Airport', 'Rail: Agra Cantt', 'Road: NH2 from Delhi'],
     accommodation: ['ITC Mughal', 'Oberoi Amarvilas', 'Trident Agra']
   },
   {
     id: 2,
     name: 'Red Fort Complex',
     location: 'Delhi',
     year: 2007,
     type: 'Cultural',
     description: 'Magnificent Mughal architecture and symbol of India\'s independence',
     bestTime: 'October - March',
     entryFee: '₹35 (Indians), ₹500 (Foreigners)',
     timings: '9:30 AM - 4:30 PM (Closed on Mondays)',
     rating: 4.7,
     visitors: '2-3 million/year',
     images: [
       'https://amoghavarshaiaskas.in/wp-content/uploads/2024/10/Red-Fort-Complex.jpg',
       'https://travel-blog.happyeasygo.com/wp-content/uploads/2020/04/Red-Fort1.jpg',
       'https://akm-img-a-in.tosshub.com/sites/indiacontent/0/images/product/public/18092019/00/01/56/88/12/85/93/48/1568812859348/659-shot-of-red-fort-in-new-image-88005500_20190917_069.jpg'
     ],
     nearbyAttractions: ['Jama Masjid', 'Chandni Chowk', 'India Gate'],
     transportation: ['Metro: Lal Qila Station', 'Bus: DTC', 'Auto/Taxi'],
     accommodation: ['The Imperial', 'Maidens Hotel', 'Hotel Broadway']
   },
   {
     id: 3,
     name: 'Hampi',
     location: 'Karnataka',
     year: 1986,
     type: 'Cultural',
     description: 'Ruins of the magnificent Vijayanagara Empire with stunning boulder landscapes',
     bestTime: 'October - February',
     entryFee: '₹40 (Indians), ₹600 (Foreigners)',
     timings: 'Sunrise to Sunset',
     rating: 4.8,
     visitors: '500K/year',
     images: [
       'https://karnatakatourism.org/wp-content/uploads/2020/05/Hampi.jpg',
       'https://s7ap1.scene7.com/is/image/incredibleindia/a-journey-through-masthead-hero-1?qlt=82&ts=1727368343764',
       'https://theindosphere.com/wp-content/uploads/2024/05/image-1024x670.jpg'
     ],
     nearbyAttractions: ['Vittala Temple', 'Virupaksha Temple', 'Elephant Stables'],
     transportation: ['Train: Hospet Junction', 'Bus: KSRTC', 'Car: 350km from Bangalore'],
     accommodation: ['Hampi Boulders', 'Clarks Inn', 'Kishkinda Heritage Resort']
   },
   {
     id: 4,
     name: 'Backwaters of Kerala',
     location: 'Alleppey, Kerala',
     year: 2012,
     type: 'Natural',
     description: 'Enchanting network of lagoons, lakes, and canals with traditional houseboats',
     bestTime: 'September - March',
     entryFee: 'Houseboat: ₹8000-25000/night',
     timings: 'All day experience',
     rating: 4.9,
     visitors: '1 million/year',
     images: [
       'https://lp-cms-production.imgix.net/2025-04/shutterstock2454866115.jpg?auto=format,compress&q=72&w=1440&h=810&fit=crop',
       'https://static.toiimg.com/thumb/msid-91888972,width-748,height-499,resizemode=4,imgsize-243110/.jpg',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbg_WmNSVMtT1iBHK834bEeiVBZ537OOTI0Q&s'
     ],
     nearbyAttractions: ['Kumarakom', 'Vembanad Lake', 'Pathiramanal Island'],
     transportation: ['Train: Alleppey Station', 'Bus: KSRTC', 'Car: 60km from Kochi'],
     accommodation: ['Houseboat Stay', 'Punnamada Resort', 'Lake Palace Resort']
   },
   {
     id: 5,
     name: 'Nilgiri Toy Train',
     location: 'Ooty, Tamil Nadu',
     year: 2005,
     type: 'Cultural',
     description: 'Heritage railway offering stunning views of Nilgiri Hills and tea plantations',
     bestTime: 'October - March',
     entryFee: '₹50 (Indians), ₹600 (Foreigners)',
     timings: '9:00 AM - 6:00 PM',
     rating: 4.7,
     visitors: '300K/year',
     images: [
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXmmMo9n2OjGkIt65LdxdHUFeDdE8UmWX51g&s',
       'https://travelescape.in/wp-content/uploads/2017/02/Nilgiri-Mountain-Railway.jpg',
       'https://www.holidify.com/images/cmsuploads/compressed/Nilgiri_Mountain_Railway_20180110112401.jpg'
     ],
     nearbyAttractions: ['Botanical Gardens', 'Doddabetta Peak', 'Coonoor'],
     transportation: ['Train: Mettupalayam Station', 'Bus: Ooty Bus Stand', 'Car: 90km from Coimbatore'],
     accommodation: ['Savoy Hotel Ooty', 'Sterling Ooty Fern Hill', 'Club Mahindra Derby Green']
   },
   {
     id: 6,
     name: 'Kaziranga National Park',
     location: 'Assam',
     year: 1985,
     type: 'Natural',
     description: 'Home to two-thirds of world\'s one-horned rhinoceros and incredible wildlife',
     bestTime: 'November - April',
     entryFee: '₹200 (Indians), ₹2000 (Foreigners)',
     timings: 'Dawn to Dusk safaris',
     rating: 4.8,
     visitors: '170K/year',
     images: [
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy5qzBfk1CT3tHkd8_NK21FrBAm-uvqyxWSw&s',
       'https://kazirangatourism.in/image/wildlifesafari.jpg',
       'https://media.assettype.com/outlooktraveller%2F2023-10%2F5b58aa6a-cfcb-45a1-ad9f-5bad3b8984ee%2F106554149_744865456346625_1735154775456169959_n.jpg'
     ],
     nearbyAttractions: ['Majuli Island', 'Sibsagar', 'Jorhat'],
     transportation: ['Air: Jorhat Airport', 'Train: Furkating Station', 'Road: NH37'],
     accommodation: ['Wild Grass Lodge', 'Kaziranga Golf Resort', 'Infinity Resorts']
   },
   {
     id: 7,
     name: 'Ajanta Caves',
     location: 'Maharashtra',
     year: 1983,
     type: 'Cultural',
     description: 'Ancient Buddhist cave monuments with exquisite paintings and sculptures',
     bestTime: 'November - March',
     entryFee: '₹40 (Indians), ₹600 (Foreigners)',
     timings: '9:00 AM - 5:30 PM (Closed on Mondays)',
     rating: 4.6,
     visitors: '300K/year',
     images: [
       'https://www.gokitetours.com/wp-content/uploads/2024/11/Top-7-Unique-Facts-About-the-Ajanta-and-Ellora-Caves.webp',
       'https://monomousumi.com/wp-content/uploads/ajanta-1.jpeg',
       'https://aurangabadtourism.in/images/places-to-visit/header/ajanta-caves-aurangabad-tourism-entry-fee-timings-holidays-reviews-header.jpg'
     ],
     nearbyAttractions: ['Ellora Caves', 'Daulatabad Fort', 'Bibi Ka Maqbara'],
     transportation: ['Air: Aurangabad Airport', 'Train: Aurangabad Station', 'Bus: MSRTC'],
     accommodation: ['Taj Residency', 'Lemon Tree Hotel', 'WelcomHotel Rama International']
   },
   {
     id: 8,
     name: 'Western Ghats',
     location: 'Maharashtra, Karnataka, Kerala',
     year: 2012,
     type: 'Natural',
     description: 'A mountain range known for its biodiversity, lush forests, and scenic beauty',
     bestTime: 'June - September (Monsoon), October - February',
     entryFee: 'Free',
     timings: 'All day',
     rating: 4.8,
     visitors: '1 million/year',
     images: [
       'https://sahyadale.com/cdn/shop/articles/koda_1200x1200.jpg?v=1589120928',
       'https://www.bhavyaholidays.com/blogs/wp-content/uploads/2014/03/The-Western-Ghats-A-UNESCO-World-Heritage-Site.jpg',
       'https://www.holidify.com/images/cmsuploads/compressed/Western_Ghats_20180110112401.jpg'
     ],
     nearbyAttractions: ['Mahabaleshwar', 'Munnar', 'Coorg'],
     transportation: ['Air: Pune Airport, Mangalore Airport', 'Train: Lonavala Station, Mysore Station', 'Road: NH48, NH66'],
     accommodation: ['Elysium Resort Mahabaleshwar', 'Club Mahindra Munnar', 'Orange County Coorg']
   },
   {
     id: 9,
     name: 'Brihadeeswarar Temple',
     location: 'Thanjavur, Tamil Nadu',
     year: 1987,
     type: 'Cultural',
     description: 'A masterpiece of Chola architecture, dedicated to Lord Shiva',
     bestTime: 'October - March',
     entryFee: '₹50 (Indians), ₹500 (Foreigners)',
     timings: '6:00 AM - 8:00 PM',
     rating: 4.7,
     visitors: '500K/year',
     images: [
       'https://inditales.com/wp-content/uploads/2012/12/brihadeeswara-temple-big-temple-thanjavur-temple.jpg',
       'https://www.holidify.com/images/cmsuploads/compressed/Brihadeeswarar_Temple_20180110112401.jpg',
       'https://www.holidify.com/images/cmsuploads/compressed/Brihadeeswarar_Temple_20180110112401.jpg'
     ],
     nearbyAttractions: ['Thanjavur Palace', 'Gangaikonda Cholapuram', 'Airavatesvara Temple'],
     transportation: ['Air: Tiruchirappalli Airport', 'Train: Thanjavur Junction', 'Bus: TNSTC'],
     accommodation: ['Sangam Hotel Thanjavur', 'Hotel Parisutham', 'Ideal River View Resort']
   },
   {
     id: 10,
     name: 'Khajuraho Temples',
     location: 'Madhya Pradesh',
     year: 1986,
     type: 'Cultural',
     description: 'Famous for their intricate erotic sculptures and stunning architecture',
     bestTime: 'October - March',
     entryFee: '₹40 (Indians), ₹600 (Foreigners)',
     timings: '8:00 AM - 6:00 PM',
     rating: 4.8,
     visitors: '500K/year',
     images: [
       'https://static.toiimg.com/photo/64665528.cms',
       'https://changestarted.com/wp-content/uploads/2023/01/Vyala-Sculpture-at-Khajuraho-Temple.jpg',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeUgNpHnc7FZgRHHHOQjZnE7pOOWQd1b-ZbQ&s'
     ],
     nearbyAttractions: ['Panna National Park', 'Raneh Falls', 'Beni Sagar Dam'],
     transportation: ['Air: Khajuraho Airport', 'Train: Khajuraho Station', 'Bus: MP Tourism'],
     accommodation: ['Radisson Jass Hotel', 'Hotel Chandela', 'The Lalit Temple View']
   },
   {
     id: 11,
     name: 'Golden Temple',
     location: 'Amritsar, Punjab',
     year: 1604,
     type: 'Spiritual',
     description: 'Most sacred Sikh shrine, known for its golden architecture and community kitchen',
     bestTime: 'October - March',
     entryFee: 'Free',
     timings: '4:00 AM - 11:00 PM',
     rating: 4.9,
     visitors: '100K/day',
     images: [
       'https://www.tallengestore.com/cdn/shop/files/GoldenTemple_SriHarmandirSahib_Amritsar-SikhShrine_large.jpg?v=1729751066',
       'https://freshtraveldestinations.com/wp-content/uploads/2020/04/Harmandir-Darbar-Sahib-Golden-Temple-India-01.jpg',
       'https://media.istockphoto.com/id/518370948/photo/golden-temple-of-amritsar-pubjab-india.jpg?s=612x612&w=0&k=20&c=i5ZvIrTw7BybA4Js0GwFlDCFgwuzw-UNAg2256-fN6A='
     ],
     nearbyAttractions: ['Jallianwala Bagh', 'Wagah Border', 'Gobindgarh Fort'],
     transportation: ['Air: Sri Guru Ram Dass Jee International Airport', 'Train: Amritsar Junction', 'Road: GT Road'],
     accommodation: ['Hyatt Amritsar', 'Holiday Inn Amritsar', 'Hotel Royal Castle']
   },
   {
     id: 12,
     name: 'Gokarna Beach',
     location: 'Karnataka',
     year: 2020,
     type: 'Beach Paradise',
     description: 'Pristine beaches with spiritual vibes, perfect blend of serenity and adventure',
     bestTime: 'October - March',
     entryFee: 'Free',
     timings: 'All day',
     rating: 4.8,
     visitors: '2 million/year',
     images: [
       'https://upload.wikimedia.org/wikipedia/commons/d/dd/Delight_india.jpg',
       'https://rajputanacabs.b-cdn.net/wp-content/uploads/2023/10/murdeshwar-temple-gokarna-goa.webp',
       'https://i0.wp.com/zikation.com/wp-content/uploads/2022/04/Gokarna.jpg?fit=1280%2C960&ssl=1'
     ],
     nearbyAttractions: ['Om Beach', 'Kudle Beach', 'Mahabaleshwar Temple'],
     transportation: ['Train: Gokarna Road Station', 'Bus: KSRTC', 'Car: 140km from Goa'],
     accommodation: ['SwaSwara Resort', 'Zostel Gokarna', 'Namaste Cafe Stays']
   },
   {
     id: 13,
     name: 'Rann of Kutch',
     location: 'Gujarat',
     year: 2019,
     type: 'Desert Spectacle',
     description: 'World\'s largest salt desert with stunning white landscapes and cultural festivals',
     bestTime: 'November - February',
     entryFee: '₹100',
     timings: 'All day',
     rating: 4.7,
     visitors: '1.5 million/year',
     images: [
       'https://www.rannutsav.net/wp-content/uploads/2024/12/White-rann-camel-ride.webp',
       'https://www.clubmahindra.com/blog/media/section_images/top-reason-0e1e2d2af40f8b3.jpg',
       'https://www.rajarshitravels.in/images/service-road-to-heaven-th.jpg'
     ],
     nearbyAttractions: ['Dholavira', 'Kala Dungar', 'Mandvi Beach'],
     transportation: ['Air: Bhuj Airport', 'Train: Bhuj Railway Station', 'Road: NH27'],
     accommodation: ['Tent City', 'Gateway Hotel Bhuj', 'Regenta Resort Bhuj']
   },
   {
     id: 14,
     name: 'Munnar Tea Gardens',
     location: 'Kerala',
     year: 2018,
     type: 'Hill Station',
     description: 'Rolling tea plantations, misty mountains, and cool climate paradise',
     bestTime: 'September - March',
     entryFee: '₹50-200 (Tea Factory tours)',
     timings: '9:00 AM - 5:00 PM',
     rating: 4.9,
     visitors: '800K/year',
     images: [
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx-NAEhDLbUxCd237zDhphTVm6x02-fDBJqQ&s',
       'https://www.clubmahindra.com/blog/media/section_images/banner1920-827ba76d7063797.webp',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEzh9Rt0v09doG4ts-RWrUvzgK0LeVn_a_ig&s'
     ],
     nearbyAttractions: ['Eravikulam National Park', 'Top Station', 'Mattupetty Dam'],
     transportation: ['Air: Kochi Airport (130km)', 'Train: Ernakulam (130km)', 'Bus: KSRTC'],
     accommodation: ['The Windermere Estate', 'Fragrant Nature Munnar', 'Tea County Resort']
   },
   {
     id: 15,
     name: 'Varanasi Ghats',
     location: 'Uttar Pradesh',
     year: 1983,
     type: 'Spiritual Capital',
     description: 'Ancient city on Ganges, spiritual ceremonies, and timeless traditions',
     bestTime: 'October - March',
     entryFee: 'Free',
     timings: 'All day (Aarti at sunset)',
     rating: 4.7,
     visitors: '3 million/year',
     images: [
       'https://www.savaari.com/blog/wp-content/uploads/2023/09/Varanasi_ghats1.webp',
       'https://www.tusktravel.com/blog/wp-content/uploads/2019/09/Popular-Ghats-in-Varanasi.jpg',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp05UbvDIe1F7wugfIdWiqlSJ1uz1uKVt_Jg&s'
     ],
     nearbyAttractions: ['Kashi Vishwanath Temple', 'Sarnath', 'Banaras Hindu University'],
     transportation: ['Air: Varanasi Airport', 'Train: Varanasi Junction', 'Bus: UP Roadways'],
     accommodation: ['Taj Ganges Varanasi', 'Radisson Hotel Varanasi', 'BrijRama Palace']
   },
   {
     id: 16,
     name: 'Ladakh Monasteries',
     location: 'Jammu & Kashmir',
     year: 2010,
     type: 'Mountain Paradise',
     description: 'High altitude desert with Buddhist monasteries and breathtaking landscapes',
     bestTime: 'May - September',
     entryFee: '₹100-300 per monastery',
     timings: '7:00 AM - 7:00 PM',
     rating: 4.9,
     visitors: '300K/year',
     images: [
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0zp8iL-THdksv9beUS7ifD0o7H3shtYT94A&s',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO5qCdB279VCnBzDVtgEjSG7ptNMr3s0vBlu5Ye-yNcXSjGrp2y9BpLNFMTUH0auC_TXE&usqp=CAU',
       'https://www.thekashmirpackage.com/package/kashmir-and-ladakh-tour-package.jpg'
     ],
     nearbyAttractions: ['Pangong Lake', 'Nubra Valley', 'Magnetic Hill'],
     transportation: ['Air: Leh Airport', 'Road: Manali-Leh Highway, Srinagar-Leh Highway'],
     accommodation: ['The Grand Dragon Ladakh', 'Hotel Singge Palace', 'Zostel Leh']
   }
 ];

 // Premium Scenic Routes with Real Images
 const scenicRoutes = [
   {
     id: 1,
     name: 'Mumbai to Goa Coastal Highway',
     distance: '464 km',
     duration: '8-10 hours',
     difficulty: 'Easy',
     type: 'Coastal',
     highlights: ['Ratnagiri', 'Ganpatipule', 'Konkan Coast', 'Malvan'],
     bestTime: 'October - February',
     description: 'Breathtaking coastal drive with pristine beaches, coconut groves, and seafood',
     tolls: '₹480',
     fuelCost: '₹2800-3500',
     images: [
       'https://cdn.dwello.in/articles/assets/364e78ae-3760-4d7f-acea-a22d91977651/ahaeecff.jpeg',
       'https://swarajya.gumlet.io/swarajya%2F2022-07%2Fc68f788f-dc89-4149-b758-90abba7775b5%2Fkaranataka_coastal_highway.jpg?w=1200&ar=40%3A21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100',
       'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop'
     ],
     stops: [
       { name: 'Alibaug', type: 'Beach Town', attractions: ['Alibaug Beach', 'Kolaba Fort'] },
       { name: 'Ratnagiri', type: 'Coastal City', attractions: ['Ganpatipule Beach', 'Thibaw Palace'] },
       { name: 'Malvan', type: 'Beach Paradise', attractions: ['Tarkarli Beach', 'Sindhudurg Fort'] }
     ],
     fuelStations: ['HP Petrol Pump - Panvel', 'IOCL - Mahad', 'BPCL - Ratnagiri', 'HP - Kudal'],
     restaurants: ['Hotel Prasad - Mahad', 'Konkani Katta - Ratnagiri', 'Malvan Kinara - Malvan'],
     accommodation: ['Radisson Blu Alibaug', 'Blue Ocean Resort Ganpatipule', 'MTDC Malvan']
   },
   {
     id: 2,
     name: 'Bangalore to Ooty Hill Route',
     distance: '272 km',
     duration: '6-7 hours',
     difficulty: 'Moderate',
     type: 'Hill Station',
     highlights: ['Bandipur', 'Mudumalai', 'Coonoor', 'Nilgiri Hills'],
     bestTime: 'September - May',
     description: 'Scenic hill drive through forests, tea gardens, and misty mountains',
     tolls: '₹200',
     fuelCost: '₹1800-2200',
     images: [
       'https://www.savaari.com/blog/wp-content/uploads/2021/04/masinagudi-wild-animals-elephant3.jpg',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUi41mLg2VG_zUmdlIXVx_O3RPkOyZ9QqYxw&s',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9bkcNhPaZV44ybtvs1aTwXaYrNQDyt_dWw&s'
     ],
     stops: [
       { name: 'Bandipur', type: 'Wildlife Sanctuary', attractions: ['Tiger Reserve', 'Nature Safari'] },
       { name: 'Gudalur', type: 'Hill Town', attractions: ['Tea Estates', 'Tribal Culture'] },
       { name: 'Coonoor', type: 'Hill Station', attractions: ['Sim\'s Park', 'Dolphin\'s Nose'] }
     ],
     fuelStations: ['IOCL - Mysore Road', 'HP - Gundlupet', 'BPCL - Gudalur', 'IOCL - Ooty'],
     restaurants: ['MTR - Bangalore', 'RRR - Mysore', 'Earl\'s Secret - Ooty'],
     accommodation: ['Taj Savoy Ooty', 'Sterling Ooty Fern Hill', 'Club Mahindra Ooty']
   },
   {
     id: 3,
     name: 'Delhi to Manali Himalayan Route',
     distance: '570 km',
     duration: '12-14 hours',
     difficulty: 'Challenging',
     type: 'Mountain',
     highlights: ['Chandigarh', 'Kullu Valley', 'Beas River', 'Snow Mountains'],
     bestTime: 'March - June, September - November',
     description: 'Epic Himalayan journey through valleys, rivers, and snow-capped peaks',
     tolls: '₹650',
     fuelCost: '₹4000-5000',
     images: [
       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
       'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
       'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop'
     ],
     stops: [
       { name: 'Chandigarh', type: 'Planned City', attractions: ['Rock Garden', 'Sukhna Lake'] },
       { name: 'Kullu', type: 'Valley Town', attractions: ['Kullu Valley', 'Adventure Sports'] },
       { name: 'Manali', type: 'Hill Station', attractions: ['Rohtang Pass', 'Solang Valley'] }
     ],
     fuelStations: ['IOCL - Delhi', 'HP - Ambala', 'BPCL - Chandigarh', 'IOCL - Kullu'],
     restaurants: ['Paranthe Wali Gali - Delhi', 'Pal Dhaba - Murthal', 'Johnson\'s Cafe - Manali'],
     accommodation: ['The Himalayan Manali', 'Span Resort Manali', 'Apple Country Resort']
   },
   {
     id: 4,
     name: 'Pune to Mumbai Expressway',
     distance: '148 km',
     duration: '2.5-3 hours',
     difficulty: 'Easy',
     type: 'Expressway',
     highlights: ['Lonavala', 'Khandala', 'Western Ghats', 'Sahyadri Mountains'],
     bestTime: 'June - September (Monsoon), October - February',
     description: 'India\'s first expressway through lush Western Ghats and hill stations',
     tolls: '₹275',
     fuelCost: '₹900-1200',
     images: [
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREwI2MdY8lXc8L9KQaHMcO21krK9s2HXoEmA&s',
       'https://jugyah-dev-property-photos.s3.ap-south-1.amazonaws.com/mumbai_to_pune_distance_01_5f0670df51.webp',
       'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
     ],
     stops: [
       { name: 'Lonavala', type: 'Hill Station', attractions: ['Tiger Point', 'Bhushi Dam'] },
       { name: 'Khandala', type: 'Valley View', attractions: ['Duke\'s Nose', 'Rajmachi Fort'] },
       { name: 'Khopoli', type: 'Adventure Hub', attractions: ['Imagica Theme Park', 'Della Adventure'] }
     ],
     fuelStations: ['IOCL - Pune', 'HP - Lonavala', 'BPCL - Khopoli', 'IOCL - Panvel'],
     restaurants: ['German Bakery - Pune', 'Rama Krishna - Lonavala', 'Sunny Da Dhaba - Khopoli'],
     accommodation: ['Fariyas Resort Lonavala', 'Della Resorts', 'Picaddle Resort Lonavala']
   },
   {
     id: 5,
     name: 'Chennai to Pondicherry ECR',
     distance: '160 km',
     duration: '3-4 hours',
     difficulty: 'Easy',
     type: 'Coastal',
     highlights: ['Mamallapuram', 'Covelong', 'Bay of Bengal', 'French Architecture'],
     bestTime: 'November - February',
     description: 'Scenic coastal route with temples, beaches, and French colonial charm',
     tolls: '₹120',
     fuelCost: '₹1000-1300',
     images: [
       'https://i.12go.co/images/upload-media/5170.jpeg',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXcTOMi7wOyvgbsPFgF7lH-6sldRbt0n9sqg&s',
       'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop'
     ],
     stops: [
       { name: 'Mamallapuram', type: 'Heritage Town', attractions: ['Shore Temple', 'Five Rathas'] },
       { name: 'Covelong', type: 'Beach Town', attractions: ['Covelong Beach', 'Surfing'] },
       { name: 'Pondicherry', type: 'French Colony', attractions: ['French Quarter', 'Auroville'] }
     ],
     fuelStations: ['IOCL - Chennai', 'HP - Mamallapuram', 'BPCL - Tindivanam', 'IOCL - Pondicherry'],
     restaurants: ['Murugan Idli Shop - Chennai', 'Moonrakers - Mamallapuram', 'Villa Helena - Pondicherry'],
     accommodation: ['Radisson Blu Temple Bay Mamallapuram', 'Le Pondy', 'Palais de Mahe']
   },
   {
     id: 6,
     name: 'Guwahati to Tawang Scenic Route',
     distance: '500 km',
     duration: '12-14 hours',
     difficulty: 'Challenging',
     type: 'Mountain',
     highlights: ['Bomdila', 'Sela Pass', 'Tawang Monastery', 'Bumla Pass'],
     bestTime: 'March - October',
     description: 'Breathtaking Himalayan drive through lush valleys, Buddhist monasteries, and snow-capped peaks',
     tolls: '₹300',
     fuelCost: '₹4000-5000',
     images: [
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl1QhsMIT7mfcdLFmGKLJs2wvz4M3bCzywtw&s',
       'https://nexplore.org/blog/wp-content/uploads/2019/04/road-to-tawang.jpg',
       'https://www.citybit.in/wp-content/uploads/2023/08/Tawang-Arunachal-Pradesh.jpg'
     ],
     stops: [
       { name: 'Bomdila', type: 'Hill Station', attractions: ['Bomdila Monastery', 'Dirang Dzong'] },
       { name: 'Sela Pass', type: 'Mountain Pass', attractions: ['Sela Lake', 'Snow Activities'] },
       { name: 'Tawang', type: 'Buddhist Town', attractions: ['Tawang Monastery', 'Bumla Pass'] }
     ],
     fuelStations: ['IOCL - Guwahati', 'HP - Tezpur', 'BPCL - Bomdila', 'IOCL - Tawang'],
     restaurants: ['Paradise Restaurant - Guwahati', 'Hotel Tawang - Bomdila', 'Tawang Kitchen - Tawang'],
     accommodation: ['Hotel Brahmaputra - Guwahati', 'Hotel Tawang - Bomdila', 'Tawang Monastery Guesthouse']
   }
 ];

 // Food Stops Data
 const foodStops = [
   {
     id: 1,
     name: 'Amrik Sukhdev Dhaba',
     location: 'Murthal, Haryana',
     type: 'Highway Dhaba',
     specialty: 'Butter Chicken, Paranthas',
     rating: 4.8,
     priceRange: '₹300-500 per person',
     highway: 'Delhi-Chandigarh Highway',
     image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
     timings: '24/7',
     facilities: ['Parking', 'Clean Washrooms', 'AC Dining']
   },
   {
     id: 2,
     name: 'MTR',
     location: 'Bengaluru, Karnataka',
     type: 'Iconic South Indian',
     specialty: 'Rava Idly, Dosa, Filter Coffee',
     rating: 4.8,
     priceRange: '₹300-500 per person',
     highway: 'Bengaluru-Mysuru Highway',
     image: 'https://images.jdmagicbox.com/v2/comp/bangalore/v5/080pxx80.xx80.230427103003.a6v5/catalogue/mavalli-tiffin-room-known-as-mtr-hotel-sudhama-nagar-bangalore-restaurants-05jvfgo6j6.jpg',
     timings: '6:30 AM - 11:00 PM',
     facilities: ['Quick Service', 'Traditional Ambiance', 'Takeaway']
   },
   {
     id: 3,
     name: 'Thalappakkatti Biriyani',
     location: 'Dindigul, Tamil Nadu',
     type: 'Highway Restaurant',
     specialty: 'Dindigul Biriyani, Chicken Fry',
     rating: 4.6,
     priceRange: '₹300-500 per person',
     highway: 'Chennai-Madurai Highway',
     image: 'https://dineout-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/v1684309807/009de09a13c521cd7908de3e9d266ab1.webp',
     timings: '11:00 AM - 11:00 PM',
     facilities: ['Family Dining', 'Air Conditioning', 'Home Delivery']
   },
   {
     id: 4,
     name: 'Vaishno Dhaba',
     location: 'Lonavala, Maharashtra',
     type: 'Hill Station Restaurant',
     specialty: 'Vada Pav, Maharashtrian Thali',
     rating: 4.6,
     priceRange: '₹250-400 per person',
     highway: 'Mumbai-Pune Expressway',
     image: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400&h=300&fit=crop',
     timings: '7:00 AM - 11:00 PM',
     facilities: ['Valley View', 'Family Seating', 'Takeaway']
   },
   {
     id: 5,
     name: 'Bawarchi',
     location: 'Hyderabad, Telangana',
     type: 'Highway Restaurant',
     specialty: 'Hyderabadi Biryani, Kebabs',
     rating: 4.7,
     priceRange: '₹400-600 per person',
     highway: 'Hyderabad-Bangalore Highway',
     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsfd98lM5L05Lsx-CACMf5pl_2QA73wFp_MQ&s',
     timings: '11:00 AM - 11:30 PM',
     facilities: ['Famous Brand', 'Multiple Outlets', 'Home Delivery']
   },
   {
     id: 6,
     name: 'Kamat Restaurant',
     location: 'Hubli, Karnataka',
     type: 'South Indian',
     specialty: 'Dosas, Filter Coffee, Thali',
     rating: 4.7,
     priceRange: '₹150-300 per person',
     highway: 'Bangalore-Goa Highway',
     image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
     timings: '6:00 AM - 10:00 PM',
     facilities: ['Quick Service', 'Hygienic', 'Budget Friendly']
   }
 ];

 const renderTabContent = () => {
   switch(activeTab) {
     case 'discover':
       return (
         <div className="space-y-16">
           {/* 🤖 AI TRAVEL ASSISTANT */}
           <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
             <div className="text-center mb-8">
               <h3 className="text-3xl font-bold text-gray-800 mb-4">🤖 AI Travel Assistant</h3>
               <p className="text-gray-600 max-w-2xl mx-auto">Ask me anything about Indian destinations, routes, food, culture, or travel tips!</p>
             </div>
             
             <div className="max-w-4xl mx-auto">
               <div className="flex space-x-4 mb-6">
                 <input
                   type="text"
                   value={aiQuery}
                   onChange={(e) => setAiQuery(e.target.value)}
                   placeholder="Try: 'Best hill stations in South India' or 'Cheapest way to travel from Delhi to Goa'"
                   className="flex-1 px-6 py-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg"
                   onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
                 />
                 <button
                   onClick={handleAISearch}
                   disabled={aiLoading || !aiQuery.trim()}
                   className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {aiLoading ? '🤔 Thinking...' : '🚀 Ask AI'}
                 </button>
               </div>
               
               {/* Quick suggestion buttons */}
               <div className="flex flex-wrap gap-3 justify-center mb-6">
                 {[
                   'Best time to visit Kerala',
                   'Budget trip to Rajasthan',
                   'Adventure sports in Himachal',
                   'Food tour of Mumbai',
                   'UNESCO sites in India'
                 ].map((suggestion, index) => (
                   <button
                     key={index}
                     onClick={() => {setAiQuery(suggestion); handleAISearch();}}
                     className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg text-gray-700 hover:text-blue-600 transition-all duration-200 text-sm font-medium"
                   >
                     {suggestion}
                   </button>
                 ))}
               </div>
               
               {aiResponse && (
                 <div className="bg-white rounded-2xl p-6 shadow-xl">
                   <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                     <span className="mr-2">🤖</span>
                     AI Travel Expert Says:
                   </h4>
                   <div className="prose max-w-none">
                     <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">{aiResponse}</pre>
                   </div>
                 </div>
               )}
             </div>
           </div>
     
           {/* Premium Hero Carousel */}
           <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=600&fit=crop"
               alt="India Tourism"
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 z-20 flex items-center justify-center text-white text-center">
               <div>
                 <h3 className="text-4xl font-bold mb-4">Experience Incredible India</h3>
                 <p className="text-xl opacity-90">Journey through 5000 years of history and culture</p>
               </div>
             </div>
           </div>

           {/* Live Weather Widget */}
            {/* REAL-TIME WEATHER Widget */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold">Live Weather Update</h4>
                  <p className="text-3xl font-bold">{weather.temp}°C</p>
                  <p className="opacity-90">{weather.location}</p>
                  <p className="text-sm opacity-80 capitalize">{weather.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl mb-2">{getWeatherIcon(weather.condition)}</div>
                  <p className="capitalize">{weather.condition}</p>
                  <button 
                    onClick={() => fetchWeather('Delhi')}
                    className="mt-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
              
              {/* Weather for other cities */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {['Delhi', 'Mumbai', 'Bangalore', 'Chennai'].map((city, index) => (
                  <button
                    key={city}
                    onClick={() => fetchWeather(city)}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-center transition-colors"
                  >
                    <div className="text-sm font-medium">{city}</div>
                    <div className="text-lg">🌤️</div>
                  </button>
                ))}
              </div>
            </div>


           {/* Featured Destinations */}
           <div>
             <div className="text-center mb-12">
               <h4 className="text-4xl font-bold text-gray-800 mb-4">
                 🌟 Featured Destinations
               </h4>
               <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                 Discover India's most incredible destinations - from ancient temples to pristine beaches, 
                 from snow-capped mountains to golden deserts
               </p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
               {unescoSites.slice(0, 12).map((site) => (
                 <div key={site.id} className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                   <div className="relative h-64 overflow-hidden">
                     <img 
                       src={site.images[currentImageIndex]}
                       alt={site.name}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                       <span className="text-sm font-semibold text-gray-800">⭐ {site.rating}</span>
                     </div>
                     <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                       <span className="text-sm font-semibold text-white">{site.type}</span>
                     </div>
                     
                     {/* Visitor count on hover */}
                     <div className="absolute bottom-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <span className="text-xs font-bold">{site.visitors}</span>
                     </div>
                   </div>
                   
                   <div className="p-6">
                     <h5 className="text-xl font-bold text-gray-800 mb-2">{site.name}</h5>
                     <p className="text-gray-600 mb-3 flex items-center">
                       <span className="mr-2">📍</span>
                       {site.location}
                     </p>
                     <p className="text-gray-700 text-sm mb-4 line-clamp-2">{site.description}</p>
                     
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-sm text-green-600 font-medium">
                         🕒 {site.bestTime}
                       </span>
                       <span className="text-sm text-blue-600 font-medium">
                         🎫 {site.entryFee.split(',')[0]}
                       </span>
                     </div>
                     
                     <button 
                       onClick={() => setSelectedUNESCO(site)}
                       className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                     >
                       Explore Details
                     </button>
                   </div>
                 </div>
               ))}
             </div>
             
             {/* Load More Button */}
             <div className="text-center">
               <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                 🌈 Load More Amazing Places ({unescoSites.length - 12} more)
               </button>
             </div>
           </div>

           {/* Travel Categories */}
           <div>
             <h4 className="text-3xl font-bold text-gray-800 mb-8 text-center">
               🎯 Explore by Your Passion
             </h4>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {[
                 { name: 'Heritage Sites', icon: '🏛️', count: '40+', color: 'from-amber-400 to-orange-500', places: ['Taj Mahal', 'Red Fort', 'Hampi'] },
                 { name: 'Hill Stations', icon: '⛰️', count: '50+', color: 'from-green-400 to-blue-500', places: ['Munnar', 'Ooty', 'Darjeeling'] },
                 { name: 'Beaches', icon: '🏖️', count: '100+', color: 'from-cyan-400 to-blue-500', places: ['Goa', 'Gokarna', 'Andaman'] },
                 { name: 'Wildlife', icon: '🐅', count: '30+', color: 'from-emerald-400 to-green-600', places: ['Kaziranga', 'Ranthambore', 'Corbett'] },
                 { name: 'Adventure', icon: '🏔️', count: '25+', color: 'from-purple-400 to-pink-500', places: ['Ladakh', 'Rishikesh', 'Manali'] },
                 { name: 'Spiritual', icon: '🕉️', count: '200+', color: 'from-yellow-400 to-orange-500', places: ['Varanasi', 'Golden Temple', 'Tirupati'] },
                 { name: 'Food Tours', icon: '🍛', count: '150+', color: 'from-red-400 to-pink-500', places: ['Delhi', 'Mumbai', 'Lucknow'] },
                 { name: 'Festivals', icon: '🎭', count: '365+', color: 'from-indigo-400 to-purple-500', places: ['Holi', 'Diwali', 'Pushkar'] },
                 { name: 'Desert Safari', icon: '🏜️', count: '15+', color: 'from-yellow-500 to-orange-600', places: ['Jaisalmer', 'Rann of Kutch', 'Bikaner'] },
                 { name: 'Backwater Cruises', icon: '🚤', count: '20+', color: 'from-teal-400 to-blue-500', places: ['Kerala', 'Sundarbans', 'Kashmir'] }
               ].map((category, index) => (
                 <div key={index} className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl text-white hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 group`}>
                   <div className="text-center">
                     <div className="text-3xl mb-3 group-hover:animate-bounce">{category.icon}</div>
                     <h5 className="font-bold mb-1">{category.name}</h5>
                     <p className="text-sm opacity-90 mb-2">{category.count} destinations</p>
                     <div className="text-xs opacity-75">
                       {category.places.map((place, idx) => (
                         <div key={idx}>{place}</div>
                       ))}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Regional Highlights */}
           <div>
             <h4 className="text-3xl font-bold text-gray-800 mb-8 text-center">
               🗺️ Explore by Region
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { 
                   region: 'North India', 
                   highlights: ['Delhi', 'Agra', 'Jaipur', 'Amritsar'], 
                   image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop',
                   color: 'from-red-500 to-pink-500'
                 },
                 { 
                   region: 'South India', 
                   highlights: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh'], 
                   image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop',
                   color: 'from-green-500 to-teal-500'
                 },
                 { 
                   region: 'Western India', 
                   highlights: ['Goa', 'Mumbai', 'Rajasthan', 'Gujarat'], 
                   image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
                   color: 'from-orange-500 to-yellow-500'
                 },
                 { 
                   region: 'Eastern India', 
                   highlights: ['West Bengal', 'Odisha', 'Seven Sisters', 'Sikkim'], 
                   image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
                   color: 'from-blue-500 to-purple-500'
                 }
               ].map((region, index) => (
                 <div key={index} className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                   <div className="relative h-48 overflow-hidden">
                     <img src={region.image} alt={region.region} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     <div className={`absolute inset-0 bg-gradient-to-t ${region.color} opacity-60`}></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <h5 className="text-2xl font-bold text-white">{region.region}</h5>
                     </div>
                   </div>
                   <div className="p-6">
                     <div className="space-y-2">
                       {region.highlights.map((place, idx) => (
                         <div key={idx} className="flex items-center space-x-2">
                           <span className="text-orange-500">📍</span>
                           <span className="text-gray-700">{place}</span>
                         </div>
                       ))}
                     </div>
                     <button className={`w-full mt-4 bg-gradient-to-r ${region.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200`}>
                       Explore {region.region}
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           
           {/* Trending This Month */}
           <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl p-8">
             <h4 className="text-3xl font-bold text-gray-800 mb-8 text-center">
               🔥 Trending This Month
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { name: 'Rann of Kutch', trend: '+300%', reason: 'Rann Utsav Festival Season', image: 'https://www.rajarshitravels.in/images/service-road-to-heaven-th.jpg' },
                 { name: 'Munnar Hills', trend: '+180%', reason: 'Perfect winter weather', image: 'https://miro.medium.com/v2/resize:fit:1000/1*cWyYxjVyB80sUhUwV-hK5A.jpeg' },
                 { name: 'Golden Temple', trend: '+250%', reason: 'Guru Nanak Jayanti celebrations', image: 'https://static.toiimg.com/photo/61820954/.jpg' }
               ].map((trend, index) => (
                 <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                   <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                     <img src={trend.image} alt={trend.name} className="w-full h-full object-cover" />
                     <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                       {trend.trend} 📈
                     </div>
                   </div>
                   <h5 className="text-xl font-bold text-gray-800 mb-2">{trend.name}</h5>
                   <p className="text-gray-600 text-sm mb-4">{trend.reason}</p>
                   <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                     Book Now 🎯
                   </button>
                 </div>
               ))}
             </div>
           </div>
           {/* Enhanced Search Section */}
         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8">
           <div className="text-center mb-8">
             <h4 className="text-3xl font-bold text-gray-800 mb-4">🔍 Find Your Perfect Adventure</h4>
             <p className="text-gray-600 max-w-2xl mx-auto">Search through thousands of destinations, routes, and experiences across India</p>
           </div>
           
           <div className="max-w-4xl mx-auto">
             <div className="relative mb-6">
               <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🌟</span>
               <input
                 type="text"
                 placeholder="Search destinations, UNESCO sites, hill stations, beaches, temples..."
                 className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg shadow-lg"
               />
               <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200">
                 Search 🚀
               </button>
             </div>
             
             {/* Quick Filter Buttons */}
             <div className="flex flex-wrap gap-3 justify-center">
               {['🏛️ Heritage', '⛰️ Hill Stations', '🏖️ Beaches', '🕉️ Spiritual', '🎪 Adventure', '🍛 Food Tours', '🌿 Wildlife', '🏙️ Cities'].map((filter, index) => (
                 <button key={index} className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg text-gray-700 hover:text-purple-600 transition-all duration-200 font-medium">
                   {filter}
                 </button>
               ))}
             </div>
           </div>
         </div>

           {/* Call to Action */}
           <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white">
             <h4 className="text-3xl font-bold mb-4">Ready for Your Indian Adventure?</h4>
             <p className="text-xl mb-8 opacity-90">Join millions of travelers discovering the magic of India</p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                 🎯 Plan My Trip
               </button>
               <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300">
                 💬 Talk to Expert
               </button>
             </div>
           </div>
         </div>
       );
       
     case 'routes':
       return (
         <div className="space-y-8">
           <div className="text-center mb-8">
             <h4 className="text-3xl font-bold text-gray-800 mb-4">🛣️ Epic Scenic Routes</h4>
             <p className="text-gray-600 max-w-2xl mx-auto">Discover India's most breathtaking drives through mountains, coasts, and cultural landscapes</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {scenicRoutes.map((route) => (
               <div key={route.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                 <div className="relative h-64">
                   <img 
                     src={route.images[0]}
                     alt={route.name}
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                   <div className="absolute bottom-4 left-4 text-white">
                     <h5 className="text-xl font-bold mb-1">{route.name}</h5>
                     <p className="text-sm opacity-90">{route.distance} • {route.duration}</p>
                   </div>
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                     <span className="text-sm font-semibold text-gray-800">{route.type}</span>
                   </div>
                 </div>
                 
                 <div className="p-6">
                   <p className="text-gray-700 mb-4">{route.description}</p>
                   
                   <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                       <p className="text-sm text-gray-600">Best Time</p>
                       <p className="font-semibold text-green-600">{route.bestTime}</p>
                     </div>
                     <div>
                       <p className="text-sm text-gray-600">Difficulty</p>
                       <p className="font-semibold text-blue-600">{route.difficulty}</p>
                     </div>
                     <div>
                       <p className="text-sm text-gray-600">Tolls</p>
                       <p className="font-semibold text-purple-600">{route.tolls}</p>
                     </div>
                     <div>
                       <p className="text-sm text-gray-600">Fuel Cost</p>
                       <p className="font-semibold text-orange-600">{route.fuelCost}</p>
                     </div>
                   </div>

                   <div className="mb-4">
                     <p className="text-sm font-semibold text-gray-700 mb-2">🌟 Highlights:</p>
                     <div className="flex flex-wrap gap-2">
                       {route.highlights.map((highlight, idx) => (
                         <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                           {highlight}
                         </span>
                       ))}
                     </div>
                   </div>

                   <div className="flex space-x-3">
                     <button 
                       onClick={() => setSelectedRoute(route)}
                       className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                     >
                       View Details
                     </button>
                     <button className="px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200">
                       Plan Route
                     </button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       );

     case 'heritage':
       return (
         <div className="space-y-8">
           <div className="text-center mb-8">
             <h4 className="text-3xl font-bold text-gray-800 mb-4">🏛️ UNESCO World Heritage Sites</h4>
             <p className="text-gray-600 max-w-2xl mx-auto">Explore India's 40 UNESCO World Heritage Sites - monuments that tell the story of human civilization</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
             {unescoSites.map((site) => (
               <div key={site.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-102">
                 <div className="relative h-56 overflow-hidden">
                   <img 
                     src={site.images[0]}
                     alt={site.name}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                     <span className="text-sm font-bold text-gray-800">⭐ {site.rating}</span>
                   </div>
                   <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-3 py-1">
                     <span className="text-sm font-bold">{site.year}</span>
                   </div>
                   <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <span className="text-white text-sm font-semibold">{site.visitors}</span>
                   </div>
                 </div>
                 
                 <div className="p-6">
                   <div className="flex items-center justify-between mb-3">
                     <h5 className="text-xl font-bold text-gray-800">{site.name}</h5>
                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                       site.type === 'Cultural' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                     }`}>
                       {site.type}
                     </span>
                   </div>
                   
                   <p className="text-gray-600 mb-3 flex items-center">
                     <span className="mr-2">📍</span>
                     {site.location}
                   </p>
                   
                   <p className="text-gray-700 text-sm mb-4 line-clamp-3">{site.description}</p>
                   
                   <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                     <div>
                       <p className="text-gray-600">Best Time</p>
                       <p className="font-semibold text-green-600">{site.bestTime}</p>
                     </div>
                     <div>
                       <p className="text-gray-600">Timings</p>
                       <p className="font-semibold text-blue-600">{site.timings.split('(')[0]}</p>
                     </div>
                   </div>
                   
                   <div className="mb-4">
                     <p className="text-gray-600 text-sm mb-2">Entry Fee</p>
                     <p className="font-semibold text-orange-600 text-sm">{site.entryFee}</p>
                   </div>
                   
                   <button 
                     onClick={() => setSelectedUNESCO(site)}
                     className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                   >
                     Explore Heritage
                   </button>
                 </div>
               </div>
             ))}
           </div>
         </div>
       );

     case 'fuel':
       return (
         <div className="space-y-8">
           <div className="text-center mb-8">
             <h4 className="text-3xl font-bold text-gray-800 mb-4">⛽ Fuel & EV Calculator</h4>
             <p className="text-gray-600 max-w-2xl mx-auto">Calculate fuel costs, find charging stations, and plan your eco-friendly journey</p>
           </div>
           
           {/* 🗺️ INTERACTIVE MAP SECTION */}
           <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h5 className="text-2xl font-bold text-gray-800">🗺️ Interactive Tourist Map</h5>
                 <div className="flex space-x-4">
                   <div className="flex items-center space-x-2">
                     <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                     <span className="text-sm text-gray-600">⛽ Fuel Stations</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                     <span className="text-sm text-gray-600">⚡ EV Charging</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Tourist Map Container */}
             <div 
               className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 cursor-pointer hover:from-blue-200 hover:to-green-200 transition-all duration-300"
               onClick={() => openGoogleMaps('India fuel stations EV charging')}
             >
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center p-8">
                   <div className="text-6xl mb-4">🗺️</div>
                   <h3 className="text-2xl font-bold text-gray-800 mb-2">Explore India's Travel Map</h3>
                   <p className="text-gray-600 mb-4">Click to open interactive map with fuel stations, EV charging points, and tourist attractions</p>
                   <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                     <span>🚀 Open Google Maps</span>
                   </div>
                 </div>
               </div>
               
               {/* Floating location markers */}
               <div className="absolute top-20 left-20 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center animate-bounce">
                 ⛽
               </div>
               <div className="absolute top-32 right-24 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center animate-bounce" style={{animationDelay: '0.5s'}}>
                 ⚡
               </div>
               <div className="absolute bottom-24 left-1/3 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center animate-bounce" style={{animationDelay: '1s'}}>
                 🏛️
               </div>
               <div className="absolute bottom-32 right-1/3 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center animate-bounce" style={{animationDelay: '1.5s'}}>
                 🏔️
               </div>
             </div>
           </div>

           {/* Quick Map Access Buttons */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { name: 'Fuel Stations', query: 'petrol pumps India', icon: '⛽', color: 'from-orange-500 to-red-500' },
               { name: 'EV Charging', query: 'EV charging stations India', icon: '⚡', color: 'from-green-500 to-emerald-500' },
               { name: 'Tourist Places', query: 'tourist attractions India', icon: '🏛️', color: 'from-blue-500 to-purple-500' },
               { name: 'Restaurants', query: 'restaurants highway India', icon: '🍽️', color: 'from-pink-500 to-rose-500' }
             ].map((item, index) => (
               <button
                 key={index}
                 onClick={() => openGoogleMaps(item.query)}
                 className={`bg-gradient-to-r ${item.color} text-white p-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
               >
                 <div className="text-2xl mb-2">{item.icon}</div>
                 <div className="font-semibold">{item.name}</div>
               </button>
             ))}
           </div>

           {/* Fuel Calculator */}
           <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8">
             <h5 className="text-2xl font-bold text-gray-800 mb-6">🧮 Trip Cost Calculator</h5>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white rounded-2xl p-6 shadow-lg">
                 <h6 className="text-lg font-semibold mb-4">Fuel Calculator</h6>
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                     <input 
                       type="number" 
                       placeholder="500"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Mileage (km/l)</label>
                     <input 
                       type="number" 
                       placeholder="15"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Price (₹/liter)</label>
                     <input 
                       type="number" 
                       placeholder="100"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                     />
                   </div>
                   <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold">
                     Calculate Cost
                   </button>
                 </div>
               </div>

               <div className="bg-white rounded-2xl p-6 shadow-lg">
                 <h6 className="text-lg font-semibold mb-4">EV Calculator</h6>
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                     <input 
                       type="number" 
                       placeholder="500"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Efficiency (km/kWh)</label>
                     <input 
                       type="number" 
                       placeholder="5"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Charging Cost (₹/kWh)</label>
                     <input 
                       type="number" 
                       placeholder="8"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                     />
                   </div>
                   <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold">
                     Calculate EV Cost
                   </button>
                 </div>
               </div>
             </div>
           </div>

           {/* Current Fuel Prices */}
           <div className="bg-white rounded-2xl p-6 shadow-xl">
             <h5 className="text-xl font-bold text-gray-800 mb-4">💰 Current Fuel Prices</h5>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="text-center p-4 bg-orange-50 rounded-xl">
                 <div className="text-2xl mb-2">⛽</div>
                 <p className="font-semibold">Petrol</p>
                 <p className="text-lg font-bold text-orange-600">₹103.50</p>
                 <p className="text-sm text-gray-600">per liter</p>
               </div>
               <div className="text-center p-4 bg-green-50 rounded-xl">
                 <div className="text-2xl mb-2">🚚</div>
                 <p className="font-semibold">Diesel</p>
                 <p className="text-lg font-bold text-green-600">₹89.20</p>
                 <p className="text-sm text-gray-600">per liter</p>
               </div>
               <div className="text-center p-4 bg-blue-50 rounded-xl">
                 <div className="text-2xl mb-2">⚡</div>
                 <p className="font-semibold">EV Charging</p>
                 <p className="text-lg font-bold text-blue-600">₹8.50</p>
                 <p className="text-sm text-gray-600">per kWh</p>
               </div>
               <div className="text-center p-4 bg-purple-50 rounded-xl">
                 <div className="text-2xl mb-2">🛣️</div>
                 <p className="font-semibold">Avg Toll</p>
                 <p className="text-lg font-bold text-purple-600">₹2.80</p>
                 <p className="text-sm text-gray-600">per km</p>
               </div>
             </div>
           </div>
         </div>
       );

     case 'food':
       return (
         <div className="space-y-8">
           <div className="text-center mb-8">
             <h4 className="text-3xl font-bold text-gray-800 mb-4">🍽️ Highway Food Stops</h4>
             <p className="text-gray-600 max-w-2xl mx-auto">Discover the best dhabas, restaurants, and food joints along your route</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {foodStops.map((stop) => (
               <div key={stop.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                 <div className="relative h-48">
                   <img 
                     src={stop.image}
                     alt={stop.name}
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                     <span className="text-sm font-bold text-gray-800">⭐ {stop.rating}</span>
                   </div>
                   <div className="absolute top-4 right-4 bg-orange-500 text-white rounded-full px-3 py-1">
                     <span className="text-sm font-bold">{stop.type}</span>
                   </div>
                 </div>
                 
                 <div className="p-6">
                   <h5 className="text-xl font-bold text-gray-800 mb-2">{stop.name}</h5>
                   <p className="text-gray-600 mb-3 flex items-center">
                     <span className="mr-2">📍</span>
                     {stop.location}
                   </p>
                   
                   <div className="mb-4">
                     <p className="text-sm font-semibold text-gray-700 mb-1">Specialty:</p>
                     <p className="text-orange-600 font-medium">{stop.specialty}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                     <div>
                       <p className="text-gray-600">Price Range</p>
                       <p className="font-semibold text-green-600">{stop.priceRange}</p>
                     </div>
                     <div>
                       <p className="text-gray-600">Timings</p>
                       <p className="font-semibold text-blue-600">{stop.timings}</p>
                     </div>
                   </div>
                   
                   <div className="mb-4">
                     <p className="text-sm font-semibold text-gray-700 mb-2">🏪 Facilities:</p>
                     <div className="flex flex-wrap gap-2">
                       {stop.facilities.map((facility, idx) => (
                         <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                           {facility}
                         </span>
                       ))}
                     </div>
                   </div>
                   
                   <button 
                     onClick={() => openGoogleMaps(`${stop.name} ${stop.location}`)}
                     className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                   >
                     Get Directions
                   </button>
                 </div>
               </div>
             ))}
           </div>
         </div>
       );

     case 'plan':
       return (
         <div className="space-y-8">
           <div className="text-center mb-8">
             <h4 className="text-3xl font-bold text-gray-800 mb-4">📅 Trip Planner</h4>
             <p className="text-gray-600 max-w-2xl mx-auto">Plan your perfect Indian adventure with our smart itinerary builder</p>
           </div>

           {/* Quick Trip Builder */}
           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8">
             <h5 className="text-2xl font-bold text-gray-800 mb-6">🚀 Quick Trip Builder</h5>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Starting Point</label>
                   <input 
                     type="text" 
                     placeholder="Enter your city"
                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                   <input 
                     type="text" 
                     placeholder="Where do you want to go?"
                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                   />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                     <input 
                       type="date"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                     <input 
                       type="date"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                     />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                   <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none">
                     <option>Budget (₹5,000 - ₹15,000)</option>
                     <option>Mid-range (₹15,000 - ₹40,000)</option>
                     <option>Luxury (₹40,000+)</option>
                   </select>
                 </div>
               </div>
               
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Travel Interests</label>
                   <div className="grid grid-cols-2 gap-3">
                     {['Heritage', 'Adventure', 'Nature', 'Beaches', 'Wildlife', 'Food', 'Shopping', 'Spiritual'].map((interest) => (
                       <label key={interest} className="flex items-center space-x-2">
                         <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                         <span className="text-sm text-gray-700">{interest}</span>
                       </label>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
                   <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none">
                     <option>Solo (1 person)</option>
                     <option>Couple (2 people)</option>
                     <option>Family (3-5 people)</option>
                     <option>Group (6+ people)</option>
                   </select>
                 </div>
                 
                 <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-200">
                   Create My Itinerary 🎯
                 </button>
               </div>
             </div>
           </div>

           {/* Popular Itineraries */}
           <div>
             <h5 className="text-2xl font-bold text-gray-800 mb-6">🌟 Popular Itineraries</h5>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { name: 'Golden Triangle', duration: '7 Days', places: 'Delhi → Agra → Jaipur', price: '₹25,000', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop' },
                 { name: 'Kerala Backwaters', duration: '5 Days', places: 'Kochi → Alleppey → Munnar', price: '₹18,000', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop' },
                 { name: 'Rajasthan Royal', duration: '10 Days', places: 'Jaipur → Udaipur → Jodhpur → Jaisalmer', price: '₹35,000', image: 'https://hikerwolf.com/wp-content/uploads/2021/02/istockphoto-635726330-612x612-1.jpg' },
                 { name: 'Southern India', duration: '15 Days', places: 'Chennai → Kanchipuram → Mahabalipuram → Pondicherry → Thanjavur → Trichy → Madurai → Thekkady → Alappuzha → Kochi → Ooty → Mysore → Bangalore', price: '₹35,000', image: 'https://karnatakatourism.org/wp-content/uploads/2020/06/Mysuru-Palace-banner-1920_1100.jpg' },
                 { name: 'Nilgiris', duration: '5 Days', places: 'Bengaluru → Mysore → Bandipur → Masinagudi → Ooty', price: '₹18,000', image: 'https://bestplaces.blog/wp-content/uploads/2023/09/Nilgiris.jpg.webp' },
                 { name: 'Himachal Adventure', duration: '8 Days', places: 'Delhi → Shimla → Manali → Kasol → Dharamshala', price: '₹28,000', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' }
               ].map((itinerary, index) => (
                 <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                   <img src={itinerary.image} alt={itinerary.name} className="w-full h-48 object-cover" />
                   <div className="p-6">
                     <h6 className="text-lg font-bold text-gray-800 mb-2">{itinerary.name}</h6>
                     <p className="text-gray-600 mb-2">{itinerary.duration}</p>
                     <p className="text-sm text-gray-700 mb-3">{itinerary.places}</p>
                     <div className="flex justify-between items-center">
                       <span className="text-lg font-bold text-green-600">{itinerary.price}</span>
                       <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                         View Details
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       );

     case 'community':
       return (
         <div className="space-y-8">
           <div className="text-center mb-8">
             <h4 className="text-3xl font-bold text-gray-800 mb-4">👥 Travel Community</h4>
             <p className="text-gray-600 max-w-2xl mx-auto">Connect with fellow travelers, share experiences, and get insider tips</p>
           </div>

           {/* Community Stats */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
             <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl text-center">
               <div className="text-3xl font-bold mb-2">50K+</div>
               <div className="text-sm opacity-90">Active Travelers</div>
             </div>
             <div className="bg-gradient-to-br from-green-500 to-blue-500 text-white p-6 rounded-2xl text-center">
               <div className="text-3xl font-bold mb-2">25K+</div>
               <div className="text-sm opacity-90">Trip Stories</div>
             </div>
             <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-2xl text-center">
               <div className="text-3xl font-bold mb-2">1000+</div>
               <div className="text-sm opacity-90">Local Guides</div>
             </div>
             <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-2xl text-center">
               <div className="text-3xl font-bold mb-2">100K+</div>
               <div className="text-sm opacity-90">Photos Shared</div>
             </div>
           </div>

           {/* Recent Posts */}
           <div className="bg-white rounded-2xl p-6 shadow-xl">
             <h5 className="text-xl font-bold text-gray-800 mb-6">📱 Recent Travel Posts</h5>
             <div className="space-y-6">
               {[
                 { user: 'Priya Sharma', location: 'Ladakh', time: '2 hours ago', content: 'Just completed the most amazing Leh-Ladakh bike trip! The views are absolutely breathtaking. Sharing some tips for first-timers...', likes: 45, comments: 12 },
                 { user: 'Rahul Verma', location: 'Kerala', time: '5 hours ago', content: 'Houseboat experience in Alleppey was magical! The sunset over the backwaters is something everyone should witness. Best time to visit is definitely winter.', likes: 32, comments: 8 },
                 { user: 'Anita Patel', location: 'Rajasthan', time: '1 day ago', content: 'Palace hopping in Rajasthan was incredible! Udaipur City Palace is a must-visit. Pro tip: Book sunset viewing at Jagmandir Island in advance!', likes: 78, comments: 23 }
               ].map((post, index) => (
                 <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                       {post.user.charAt(0)}
                     </div>
                     <div>
                       <p className="font-semibold text-gray-800">{post.user}</p>
                       <p className="text-sm text-gray-600">{post.location} • {post.time}</p>
                     </div>
                   </div>
                   <p className="text-gray-700 mb-3">{post.content}</p>
                   <div className="flex items-center space-x-6 text-gray-500">
                     <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                       <span>❤️</span>
                       <span>{post.likes}</span>
                     </button>
                     <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                       <span>💬</span>
                       <span>{post.comments}</span>
                     </button>
                     <button className="hover:text-green-500 transition-colors">
                       <span>🔗 Share</span>
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Travel Buddy Finder */}
           <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
             <h5 className="text-xl font-bold text-gray-800 mb-4">🤝 Find Travel Buddies</h5>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { name: 'Vikash Kumar', destination: 'Goa', dates: 'Dec 25-30', interests: ['Beaches', 'Nightlife'], age: '25-30' },
                 { name: 'Sneha Iyer', destination: 'Himachal', dates: 'Jan 15-22', interests: ['Trekking', 'Photography'], age: '22-28' },
                 { name: 'Arjun Singh', destination: 'Rajasthan', dates: 'Feb 10-20', interests: ['Heritage', 'Culture'], age: '30-35' }
               ].map((buddy, index) => (
                 <div key={index} className="bg-white rounded-xl p-4 shadow-lg">
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                       {buddy.name.charAt(0)}
                     </div>
                     <div>
                       <p className="font-semibold text-gray-800">{buddy.name}</p>
                       <p className="text-sm text-gray-600">Age: {buddy.age}</p>
                     </div>
                   </div>
                   <p className="text-gray-700 mb-2">🎯 <strong>{buddy.destination}</strong></p>
                   <p className="text-gray-600 mb-3">📅 {buddy.dates}</p>
                   <div className="mb-4">
                     <p className="text-sm text-gray-600 mb-1">Interests:</p>
                     <div className="flex flex-wrap gap-1">
                       {buddy.interests.map((interest, idx) => (
                         <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                           {interest}
                         </span>
                       ))}
                     </div>
                   </div>
                   <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                     Connect
                   </button>
                 </div>
               ))}
             </div>
           </div>

           {/* Local Guides */}
           <div className="bg-white rounded-2xl p-6 shadow-xl">
             <h5 className="text-xl font-bold text-gray-800 mb-6">🗺️ Verified Local Guides</h5>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { name: 'Ramesh Tiwari', location: 'Varanasi', speciality: 'Spiritual Tours', rating: 4.9, price: '₹1500/day', languages: ['Hindi', 'English'] },
                 { name: 'Meera Rajput', location: 'Jaipur', speciality: 'Heritage Walks', rating: 4.8, price: '₹2000/day', languages: ['Hindi', 'English', 'German'] },
                 { name: 'Suresh Nair', location: 'Kerala', speciality: 'Backwater Tours', rating: 4.9, price: '₹1800/day', languages: ['Malayalam', 'English'] }
               ].map((guide, index) => (
                 <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                       {guide.name.charAt(0)}
                     </div>
                     <div>
                       <p className="font-semibold text-gray-800">{guide.name}</p>
                       <p className="text-sm text-gray-600">⭐ {guide.rating} • {guide.location}</p>
                     </div>
                   </div>
                   <p className="text-gray-700 mb-2">{guide.speciality}</p>
                   <p className="text-green-600 font-semibold mb-3">{guide.price}</p>
                   <div className="mb-3">
                     <p className="text-sm text-gray-600 mb-1">Languages:</p>
                     <div className="flex flex-wrap gap-1">
                       {guide.languages.map((lang, idx) => (
                         <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                           {lang}
                         </span>
                       ))}
                     </div>
                   </div>
                   <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                     Book Guide
                   </button>
                 </div>
               ))}
             </div>
           </div>
         </div>
       );

     default:
       return (
         <div className="text-center py-20 text-gray-500">
           <div className="text-6xl mb-4">
             {navigationItems.find(item => item.id === activeTab)?.icon}
           </div>
           <p className="text-lg">Feature coming soon! 🚀</p>
         </div>
       );
   }
 };

 // Modal for UNESCO Site Details
 const UNESCOModal = () => {
   if (!selectedUNESCO) return null;

   return (
     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto">
         <div className="relative h-64 rounded-t-3xl overflow-hidden">
           <img 
             src={selectedUNESCO.images[0]}
             alt={selectedUNESCO.name}
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
           <button 
             onClick={() => setSelectedUNESCO(null)}
             className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
           >
             <span className="text-gray-800 text-xl">✕</span>
           </button>
           <div className="absolute bottom-4 left-4 text-white">
             <h3 className="text-2xl font-bold mb-1">{selectedUNESCO.name}</h3>
             <p className="opacity-90">{selectedUNESCO.location}</p>
           </div>
         </div>
         
         <div className="p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <h4 className="text-xl font-bold text-gray-800 mb-4">About</h4>
               <p className="text-gray-700 mb-6">{selectedUNESCO.description}</p>
               
               <div className="space-y-4">
                 <div>
                   <p className="font-semibold text-gray-800">Best Time to Visit</p>
                   <p className="text-green-600">{selectedUNESCO.bestTime}</p>
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800">Entry Fee</p>
                   <p className="text-orange-600">{selectedUNESCO.entryFee}</p>
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800">Timings</p>
                   <p className="text-blue-600">{selectedUNESCO.timings}</p>
                 </div>
               </div>
             </div>
             
             <div>
               <h4 className="text-xl font-bold text-gray-800 mb-4">Travel Information</h4>
               
               <div className="space-y-4">
                 <div>
                   <p className="font-semibold text-gray-800 mb-2">Nearby Attractions</p>
                   <div className="flex flex-wrap gap-2">
                     {selectedUNESCO.nearbyAttractions.map((attraction, idx) => (
                       <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                         {attraction}
                       </span>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <p className="font-semibold text-gray-800 mb-2">How to Reach</p>
                   <div className="space-y-1">
                     {selectedUNESCO.transportation.map((transport, idx) => (
                       <p key={idx} className="text-gray-700 text-sm">{transport}</p>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <p className="font-semibold text-gray-800 mb-2">Recommended Stay</p>
                   <div className="space-y-1">
                     {selectedUNESCO.accommodation.map((hotel, idx) => (
                       <p key={idx} className="text-gray-700 text-sm">{hotel}</p>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="mt-8 flex space-x-4">
             <button 
               onClick={() => openGoogleMaps(`${selectedUNESCO.name} ${selectedUNESCO.location}`)}
               className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold"
             >
               Open in Maps
             </button>
             <button className="flex-1 border-2 border-purple-500 text-purple-500 py-3 rounded-xl font-semibold hover:bg-purple-50">
               Add to Itinerary
             </button>
           </div>
         </div>
       </div>
     </div>
   );
 };

 // Modal for Route Details
 const RouteModal = () => {
   if (!selectedRoute) return null;

   return (
     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto">
         <div className="relative h-64 rounded-t-3xl overflow-hidden">
           <img 
             src={selectedRoute.images[0]}
             alt={selectedRoute.name}
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
           <button 
             onClick={() => setSelectedRoute(null)}
             className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
           >
             <span className="text-gray-800 text-xl">✕</span>
           </button>
           <div className="absolute bottom-4 left-4 text-white">
             <h3 className="text-2xl font-bold mb-1">{selectedRoute.name}</h3>
             <p className="opacity-90">{selectedRoute.distance} • {selectedRoute.duration}</p>
           </div>
         </div>
         
         <div className="p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <h4 className="text-xl font-bold text-gray-800 mb-4">Route Details</h4>
               <p className="text-gray-700 mb-6">{selectedRoute.description}</p>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                   <p className="font-semibold text-gray-800">Best Time</p>
                   <p className="text-green-600">{selectedRoute.bestTime}</p>
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800">Difficulty</p>
                   <p className="text-blue-600">{selectedRoute.difficulty}</p>
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800">Tolls</p>
                   <p className="text-purple-600">{selectedRoute.tolls}</p>
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800">Fuel Cost</p>
                   <p className="text-orange-600">{selectedRoute.fuelCost}</p>
                 </div>
               </div>
               
               <div>
                 <p className="font-semibold text-gray-800 mb-2">Major Stops</p>
                 <div className="space-y-3">
                   {selectedRoute.stops.map((stop, idx) => (
                     <div key={idx} className="border-l-4 border-blue-500 pl-4">
                       <p className="font-medium text-gray-800">{stop.name}</p>
                       <p className="text-sm text-gray-600">{stop.type}</p>
                       <p className="text-sm text-blue-600">{stop.attractions.join(', ')}</p>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
             
             <div>
               <h4 className="text-xl font-bold text-gray-800 mb-4">Travel Essentials</h4>
               
               <div className="space-y-6">
                 <div>
                   <p className="font-semibold text-gray-800 mb-2">⛽ Fuel Stations</p>
                   <div className="space-y-1">
                     {selectedRoute.fuelStations.map((station, idx) => (
                       <p key={idx} className="text-gray-700 text-sm">{station}</p>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <p className="font-semibold text-gray-800 mb-2">🍽️ Recommended Restaurants</p>
                   <div className="space-y-1">
                     {selectedRoute.restaurants.map((restaurant, idx) => (
                       <p key={idx} className="text-gray-700 text-sm">{restaurant}</p>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <p className="font-semibold text-gray-800 mb-2">🏨 Accommodation</p>
                   <div className="space-y-1">
                     {selectedRoute.accommodation.map((hotel, idx) => (
                       <p key={idx} className="text-gray-700 text-sm">{hotel}</p>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="mt-8 flex space-x-4">
             <button 
               onClick={() => openGoogleMaps(`${selectedRoute.name} route navigation`)}
               className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold"
             >
               Start Navigation
             </button>
             <button className="flex-1 border-2 border-blue-500 text-blue-500 py-3 rounded-xl font-semibold hover:bg-blue-50">
               Save Route
             </button>
           </div>
         </div>
       </div>
     </div>
   );
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 🌈 POWERFUL COLORFUL HEADER */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-700 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-2xl' 
          : 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 shadow-xl'
      }`}>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* 🚀 ENHANCED LOGO SECTION */}
            <div className="flex items-center space-x-3 group">
  <div className="relative flex-shrink-0">
    <div className="relative w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
      <span className="text-white text-lg">🌍</span>
    </div>
    {/* Floating particles */}
    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
    <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
  </div>
  
  {/* SINGLE LINE COMPANY NAME */}
  <div className="flex items-center">
    <h1 className={`text-xl font-black tracking-tight whitespace-nowrap ${
      scrolled 
        ? 'bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent' 
        : 'text-white drop-shadow-lg'
    }`}>
      Across The Adventure
    </h1>
  </div>
</div>
            {/* 🎨 RAINBOW NAVIGATION TABS */}
            <nav className="hidden lg:flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative px-2 py-1 rounded-xl flex items-center space-x-2 transition-all duration-300 transform hover:scale-90 ${
                    activeTab === item.id
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                      : `text-white/80 hover:text-white hover:bg-gradient-to-r ${item.hoverGradient} hover:shadow-lg`
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* 📱 ENHANCED MOBILE MENU BUTTON */}
            <button
              className="lg:hidden relative p-4 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-2xl transform hover:scale-110 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span>{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* 🎯 ENHANCED MOBILE NAVIGATION */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-xl">
            <div className="px-4 py-6 space-y-2">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-6 py-4 rounded-2xl flex items-center space-x-4 transition-all duration-300 ${
                    activeTab === item.id
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl`
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-bold text-lg">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
)}
      </header>



     {/* Hero Section */}
     <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
       <div className="max-w-4xl mx-auto text-center">
         <h2 className="text-5xl font-bold text-gray-900 mb-6">
           Discover the Magic of{' '}
           <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
             Incredible India
           </span>
         </h2>
         <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
           Plan your perfect Indian adventure with AI-powered recommendations, real-time updates, 
           and comprehensive travel tools designed specifically for India's diverse landscape.
         </p>

         
       </div>
     </section>

     {/* Main Content Area */}
     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
       <div className="bg-white rounded-3xl shadow-xl p-8">
         <h3 className="text-2xl font-bold text-gray-900 mb-6">
           {navigationItems.find(item => item.id === activeTab)?.label}
         </h3>
         
         {/* Dynamic Tab Content */}
         {renderTabContent()}
       </div>
     </main>

     {/* Enhanced Footer */}
     <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 relative z-10">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
           <div className="md:col-span-2">
             <div className="flex items-center space-x-4 mb-6">
               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center">
                 <span className="text-white text-xl">🌍</span>
               </div>
               <div>
                 <span className="text-2xl font-bold">Across The Adventure</span>
                 <p className="text-gray-400 text-sm">Your Ultimate Travel Companion</p>
               </div>
             </div>
             <p className="text-gray-300 mb-6 leading-relaxed">
               Discover the incredible diversity of India with our comprehensive travel platform. 
               From majestic Himalayas to pristine beaches, ancient temples to modern cities - 
               we help you explore it all.
             </p>
             <div className="flex space-x-4">
               {['📱', '🐦', '📘', '📷', '📺'].map((social, index) => (
                 <button key={index} className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                   <span className="text-xl">{social}</span>
                 </button>
               ))}
             </div>
           </div>
           
           <div>
             <h4 className="font-bold mb-6 text-lg">🗺️ Explore</h4>
             <ul className="space-y-3 text-gray-300">
               <li className="hover:text-orange-400 cursor-pointer transition-colors">UNESCO World Heritage Sites</li>
               <li className="hover:text-orange-400 cursor-pointer transition-colors">Epic Scenic Routes</li>
               <li className="hover:text-orange-400 cursor-pointer transition-colors">Spiritual Destinations</li>
               <li className="hover:text-orange-400 cursor-pointer transition-colors">Adventure Sports</li>
               <li className="hover:text-orange-400 cursor-pointer transition-colors">Hill Station Retreats</li>
             </ul>
           </div>
           
           <div>
             <h4 className="font-bold mb-6 text-lg">📅 Plan</h4>
             <ul className="space-y-3 text-gray-300">
               <li className="hover:text-green-400 cursor-pointer transition-colors">Smart Trip Planner</li>
               <li className="hover:text-green-400 cursor-pointer transition-colors">Budget Calculator</li>
               <li className="hover:text-green-400 cursor-pointer transition-colors">Route Optimizer</li>
               <li className="hover:text-green-400 cursor-pointer transition-colors">Weather Updates</li>
               <li className="hover:text-green-400 cursor-pointer transition-colors">Travel Insurance</li>
             </ul>
           </div>
           
           <div>
             <h4 className="font-bold mb-6 text-lg">🤝 Connect</h4>
             <ul className="space-y-3 text-gray-300">
               <li className="hover:text-purple-400 cursor-pointer transition-colors">Travel Community</li>
               <li className="hover:text-purple-400 cursor-pointer transition-colors">Local Guides Network</li>
               <li className="hover:text-purple-400 cursor-pointer transition-colors">Share Experiences</li>
               <li className="hover:text-purple-400 cursor-pointer transition-colors">24/7 Emergency Help</li>
               <li className="hover:text-purple-400 cursor-pointer transition-colors">Travel Buddy Finder</li>
             </ul>
           </div>
         </div>
         
         <div className="border-t border-gray-700 mt-12 pt-8">
           <div className="flex flex-col md:flex-row justify-between items-center">
             <p className="text-gray-400 text-center md:text-left">
               &copy; 2024 Across The Adventure. Made with ❤️ for Incredible India 🇮🇳
             </p>
             <div className="flex space-x-6 mt-4 md:mt-0">
               <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
               <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
               <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Contact Us</span>
             </div>
           </div>
         </div>
       </div>
     </footer>

     {/* Modals */}
     <UNESCOModal />
     <RouteModal />
   </div>
 );
};

export default BharatExplorerPro;