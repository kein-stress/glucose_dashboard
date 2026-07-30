require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Glucose Workout Dashboard listening on http://localhost:${PORT}`);
});
