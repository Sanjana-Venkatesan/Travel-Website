const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Create a controller for trip planner functionality
const tripPlannerController = {
  generateItinerary: async (req, res) => {
    try {
      const { 
        location, 
        preferences, 
        budget, 
        dates, 
        interests, 
        groupType, 
        additionalInfo 
      } = req.body;
      
      // Check required fields
      if (!location) {
        return res.status(400).json({ message: 'Destination is required' });
      }
      
      // Prepare data for Python script
      const inputData = JSON.stringify({
        location,
        preferences,
        budget,
        dates,
        interests,
        group_type: groupType,
        additional_info: additionalInfo,
        api_key: 'AIzaSyC8DAChYdFPif4RgQSYVkneoMHKDvnjgrw'
      });
      
      // Spawn Python process
      const pythonProcess = spawn('py', [
        path.join(__dirname, './scripts/trip_planner.py')
      ]);
      
      let resultData = '';
      let errorData = '';
      
      // Send data to Python script
      pythonProcess.stdin.write(inputData);
      pythonProcess.stdin.end();
      
      // Collect data from Python script
      pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });
      
      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python process error:', errorData);
          return res.status(500).json({ 
            message: 'Failed to generate itinerary',
            error: errorData 
          });
        }
        
        try {
          const result = JSON.parse(resultData);
          res.json({ 
            itinerary: result.itinerary,
            message: 'Itinerary generated successfully' 
          });
        } catch (e) {
          res.status(500).json({ 
            message: 'Error parsing Python output',
            error: e.message 
          });
        }
      });
      
    } catch (error) {
      console.error('Trip planner error:', error);
      res.status(500).json({ 
        message: 'Server error during itinerary generation',
        error: error.message 
      });
    }
  }
};

// Define routes
router.post('/generate', tripPlannerController.generateItinerary);

module.exports = router