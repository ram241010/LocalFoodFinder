const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API key
const locationInput = document.getElementById('locationInput');
const findFoodBtn = document.getElementById('findFoodBtn');
const foodResults = document.getElementById('foodResults');

// Function to fetch nearby food places
findFoodBtn.addEventListener('click', async () => {
  const location = locationInput.value;
  if (!location) {
    alert('Please enter a location.');
    return;
  }

  try {
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`
    );
    const geocodeData = await geocodeResponse.json();
    const { lat, lng } = geocodeData.results[0].geometry.location;

    const placesResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=restaurant&key=${API_KEY}`
    );
    const placesData = await placesResponse.json();

    displayResults(placesData.results);
  } catch (error) {
    console.error('Error fetching data:', error);
    foodResults.innerHTML = `<p>Something went wrong. Please try again.</p>`;
  }
});

// Function to display results
function displayResults(places) {
  foodResults.innerHTML = '';
  if (places.length === 0) {
    foodResults.innerHTML = '<p>No food places found nearby.</p>';
    return;
  }

  places.forEach((place) => {
    const { name, vicinity, photos } = place;
    const photoURL = photos
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photos[0].photo_reference}&key=${API_KEY}`
      : 'https://via.placeholder.com/150';

    foodResults.innerHTML += `
      <div style="margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #ddd;">
        <img src="${photoURL}" alt="${name}" style="width: 100%; max-height: 200px; object-fit: cover;">
        <h3>${name}</h3>
        <p>${vicinity}</p>
      </div>
    `;
  });
}
