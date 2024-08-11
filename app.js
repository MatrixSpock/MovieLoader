// Code server here
// Your server this week should not do any of the processing or calculations
// Your server only exists to allow someone to get to the HTML Page and download the associated assets to run the application
// const express = require('express');
// const path = require('path');
// const app = express();
// const routes = require('./routes');

// app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use('/', routes);

// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });

const express = require('express');
const app = express();

app.use(express.static('public'));
const constructorMethod = require('./routes');

constructorMethod(app);  // Pass 'app' to the function here

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
