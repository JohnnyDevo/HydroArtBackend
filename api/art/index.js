const router = require('express-promise-router');

const artRouter = router(); //mounted to '/art'. 

//Anyone...
//...can retrieve all art info

//...can retrieve all art info by card ID

//...can retrieve all art info by artist ID

//...can retrieve all art info by card ID *and* artist ID

//...can retrieve art info by info ID

//Users...
//...can submit a new art piece

//Art owners...
//...can delete an art piece by ID

module.exports = artRouter;