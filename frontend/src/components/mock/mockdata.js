const mockItems = [
    {
      id: 1,
      type: 'ucard',
      studentName: 'John Doe',
      spireId: 12345678,
      locationFound: 'Franklin Dining Commons',
      finderEmail: 'finder1@example.com',
      imageUrl: 'https://example.com/ucard1.jpg',
      createdAt: '2023-05-15',
      coordinate: { latitude: 42.391, longitude: -72.526 },
      image: {
        b64: 'data:image/jpeg;base64,...', // base64 string
        blob: 'https://example.com/ucard1.jpg' // URL to the image blob
      }
    },
    {
      id: 2,
      type: 'general',
      itemDescription: 'Nike backpack with UMass logo',
      spireId: null,
      locationFound: 'Integrated Learning Center',
      finderEmail: 'finder2@example.com',
      imageUrl: 'https://example.com/backpack1.jpg',
      createdAt: '2023-05-14',
      coordinate: { latitude: 42.389, longitude: -72.528 },
      image: {
        b64: 'data:image/jpeg;base64,...', // base64 string
        blob: 'https://example.com/backpack1.jpg' // URL to the image blob
      }
    },
    {
      id: 3,
      type: 'ucard',
      studentName: 'Jane Smith',
      spireId: 23456789,
      locationFound: 'Campus Center',
      finderEmail: 'finder3@example.com',
      imageUrl: 'https://example.com/ucard2.jpg',
      createdAt: '2023-05-13',
      coordinate: { latitude: 42.386, longitude: -72.529 },
      image: {
        b64: 'data:image/jpeg;base64,...', // base64 string
        blob: 'https://example.com/ucard2.jpg' // URL to the image blob
      }
    },
    {
      id: 4,
      type: 'general',
      itemDescription: 'Red Hydro Flask',
      spireId: null,
      locationFound: 'Recreation Center',
      finderEmail: 'finder4@example.com',
      imageUrl: 'https://example.com/bottle1.jpg',
      createdAt: '2023-05-12',
      coordinate: { latitude: 42.385, longitude: -72.530 },
      image: {
        b64: 'data:image/jpeg;base64,...', // base64 string
        blob: 'https://example.com/bottle1.jpg' // URL to the image blob
      }
    },
    // ... other items
  ];
  
  export default mockItems;