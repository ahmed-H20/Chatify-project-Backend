import express from 'express';
import {
  createCall,
  acceptCall,
  rejectCall,
  endCall,
  getCalls,
  getCall,
  deleteCall
} from '../controller/callController.js';

const callRouter = express.Router();
// create a call
callRouter.route('/create')
  .post(createCall);
// accept a call
callRouter.route('/accept/:id')
  .post(acceptCall);
// reject a call
callRouter.route('/reject/:id')
  .post(rejectCall);
// end a call
callRouter.route('/end/:id')
  .post(endCall);
// get all calls
callRouter.route('/')
  .get(getCalls);
// get a call by id
callRouter.route('/:id')
  .get(getCall);
// delete a call by id
callRouter.route('/delete/:id')
  .delete(deleteCall);


export default callRouter;



// import express from 'express';

// import {createCallValidator,getCallValidator,updateCallValidator,deleteCallValidator} 
//     from '../utils/validators/callValidator.js'

// import {createCall,getCalls,getCall,updateCall,deleteCall} from '../controller/callController.js';

// import { protectRoute } from '../middlewares/protectRoute.js';

// const callRoute = express.Router();

// // Create a call
// callRoute.route('/createCall')
//     .post(protectRoute,createCallValidator,createCall);
// // Get all calls    
// callRoute.route('/calls')
//     .get(protectRoute,getCalls);
// // Get a call by id    
// callRoute.route('/:id')
//     .get(protectRoute,getCallValidator,getCall);
// // Update a call by id
// callRoute.route('/update/:id')
//     .put(protectRoute,updateCallValidator,updateCall);  
// // Delete a call by id
// callRoute.route('/delete/:id')
//     .delete(protectRoute,deleteCallValidator,deleteCall);      



    
// export default callRoute;