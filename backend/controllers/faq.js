const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Create a controller for trip planner functionality
const tripFaqController = {
  generateFaq: async (req, res) => {
    try {
        const { question } = req.body;
  
        if (!question) {
          return res.status(400).json({ message: "Question is required" });
        }
      
      
      // Prepare data for Python script
      const inputData = JSON.stringify({
        question,
        api_key: 'AIzaSyC8DAChYdFPif4RgQSYVkneoMHKDvnjgrw'
      });
      
      // Spawn Python process
      const pythonProcess = spawn('py', [
        path.join(__dirname, './scripts/faq.py')
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
            answer: result.answer,  // Updated from "itinerary" to "answer"
            raw_text: result.raw_text,
            status: result.status,
          });
        } catch (e) {
          res.status(500).json({ 
            message: 'Error parsing Python output',
            error: e.message 
          });
        }
      });
      
    } catch (error) {
      console.error('Trip faq error:', error);
      res.status(500).json({ 
        message: 'Server error during answer generation',
        error: error.message 
      });
    }
  }
};

// Define routes
router.post('/faq', tripFaqController.generateFaq);

module.exports = router