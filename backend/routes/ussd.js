const express = require('express');
const router = express.Router();

// Session storage (in production, use Redis or a database)
const sessions = {};

// Session timeout in milliseconds (5 minutes)
const SESSION_TIMEOUT = 5 * 60 * 1000;

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(sessions).forEach(sessionId => {
    if (now - sessions[sessionId].lastActivity > SESSION_TIMEOUT) {
      delete sessions[sessionId];
    }
  });
}, 60000); // Check every minute

// @route   POST api/ussd/session
// @desc    Handle USSD session requests
// @access  Public
router.post('/session', (req, res) => {
  try {
    const { sessionId, phoneNumber, text, serviceCode } = req.body;
    
    if (!sessionId || !phoneNumber) {
      return res.status(400).json({ 
        response: 'END Invalid request. Missing sessionId or phoneNumber.',
        message: 'Missing required parameters'
      });
    }
    
    // Check if session exists and hasn't expired
    const now = Date.now();
    if (!sessions[sessionId] || (now - sessions[sessionId].lastActivity > SESSION_TIMEOUT)) {
      // Create new session or reset expired session
      sessions[sessionId] = {
        step: 0,
        data: {},
        history: [],
        phoneNumber,
        lastActivity: now
      };
      console.log(`New session created: ${sessionId}`);
    } else {
      // Update last activity timestamp
      sessions[sessionId].lastActivity = now;
    }
    
    const session = sessions[sessionId];
    let response = '';
    
    // Process based on input text
    if (text === '') {
      // Initial request
      response = `CON Welcome to TeleHealth Platform\n\n1. Book Appointment\n2. Health Tips\n3. Emergency Contact\n4. Check Appointments\n5. Register New User\n\n0. Exit`;
      session.step = 1;
    } else {
      // Process based on session step and user input
      const inputs = text.split('*');
      const lastInput = inputs[inputs.length - 1];
      
      switch(session.step) {
        case 1:
          // Main menu selection
          switch(lastInput) {
            case '1':
              response = `CON Book Appointment\n\nSelect Doctor Specialization:\n\n1. General Medicine\n2. Gynecology\n3. Obstetrics\n4. Pediatrics\n5. Family Medicine\n\n0. Back to Main Menu`;
              session.step = 2;
              session.data.service = 'appointment';
              break;
            case '2':
              response = `CON Daily Health Tips\n\n1. Maternal Health\n2. Nutrition\n3. Mental Wellness\n4. Preventive Care\n5. Emergency Signs\n\n0. Back to Main Menu`;
              session.step = 2;
              session.data.service = 'health_tips';
              break;
            case '3':
              response = `END Emergency Contacts\n\n24/7 Emergency Hotline:\n+232 44 444 419\n\nLocal Emergency:\n911\n\nWomen's Health Crisis:\n+1-800-WOMEN`;
              delete sessions[sessionId]; // End session
              break;
            case '4':
              response = `CON Your Appointments\n\nUpcoming:\n1. Dr. Smith - Jan 15, 2:00 PM\n2. Dr. Johnson - Jan 20, 10:00 AM\n\nNo other appointments\n\nPress 1 or 2 for details\n0. Back to Main Menu`;
              session.step = 2;
              session.data.service = 'check_appointments';
              break;
            case '5':
              response = `END New User Registration\n\nTo complete registration, please:\n1. Visit our website\n2. Call +232 44 444 419\n3. Visit nearest clinic\n\nRegistration requires:\n- Full Name\n- Phone Number\n- Location\n- Emergency Contact`;
              delete sessions[sessionId]; // End session
              break;
            case '0':
              response = `END Thank you for using TeleHealth USSD. Goodbye!`;
              delete sessions[sessionId]; // End session
              break;
            default:
              response = `CON Invalid option. Please try again.\n\n1. Book Appointment\n2. Health Tips\n3. Emergency Contact\n4. Check Appointments\n5. Register New User\n\n0. Exit`;
              break;
          }
          break;
          
        case 2:
          // Sub-menu selection
          if (session.data.service === 'health_tips') {
            switch(lastInput) {
              case '1':
                response = `END Maternal Health Tips\n\n• Take prenatal vitamins daily\n• Attend all prenatal checkups\n• Eat nutritious foods\n• Stay hydrated\n• Get adequate rest\n• Avoid alcohol & smoking\n\nFor more info, call:\n+232 44 444 419`;
                delete sessions[sessionId]; // End session
                break;
              case '2':
                response = `END Nutrition Guidelines\n\n• Eat 5 servings of fruits/vegetables daily\n• Choose whole grains\n• Include lean proteins\n• Limit processed foods\n• Drink 8 glasses of water\n• Take iron supplements if needed`;
                delete sessions[sessionId]; // End session
                break;
              case '3':
              case '4':
              case '5':
                response = `END Content coming soon. Call +232 44 444 419 for more info.`;
                delete sessions[sessionId]; // End session
                break;
              case '0':
                response = `CON Welcome to TeleHealth Platform\n\n1. Book Appointment\n2. Health Tips\n3. Emergency Contact\n4. Check Appointments\n5. Register New User\n\n0. Exit`;
                session.step = 1;
                break;
              default:
                response = `CON Invalid option. Please try again.\n\n1. Maternal Health\n2. Nutrition\n3. Mental Wellness\n4. Preventive Care\n5. Emergency Signs\n\n0. Back to Main Menu`;
                break;
            }
          } else if (session.data.service === 'check_appointments') {
            switch(lastInput) {
              case '1':
                response = `END Dr. Smith - General Medicine\n\nDate: January 15, 2024\nTime: 2:00 PM - 2:30 PM\nType: Video Consultation\nStatus: Confirmed\n\nTo reschedule, call:\n+232 44 444 419`;
                delete sessions[sessionId]; // End session
                break;
              case '2':
                response = `END Dr. Johnson - Gynecology\nJan 20, 10:00 AM\nVideo Call\nConfirmed`;
                delete sessions[sessionId]; // End session
                break;
              case '0':
                response = `CON Welcome to TeleHealth Platform\n\n1. Book Appointment\n2. Health Tips\n3. Emergency Contact\n4. Check Appointments\n5. Register New User\n\n0. Exit`;
                session.step = 1;
                break;
              default:
                response = `CON Invalid option. Please try again.\n\nPress 1 or 2 for details\n0. Back to Main Menu`;
                break;
            }
          } else if (session.data.service === 'appointment') {
            if (lastInput === '0') {
              response = `CON Welcome to TeleHealth Platform\n\n1. Book Appointment\n2. Health Tips\n3. Emergency Contact\n4. Check Appointments\n5. Register New User\n\n0. Exit`;
              session.step = 1;
            } else {
              response = `END Booking appointment...\nPlease call +232 44 444 419\nto complete booking.`;
              delete sessions[sessionId]; // End session
            }
          }
          break;
          
        default:
          // Handle unexpected session steps - reset to main menu
          response = `CON Welcome to TeleHealth Platform\n\n1. Book Appointment\n2. Health Tips\n3. Emergency Contact\n4. Check Appointments\n5. Register New User\n\n0. Exit`;
          session.step = 1;
          break;
      }
    }
    
    // Store history
    if (session && !session.history.includes(text)) {
      session.history.push(text);
    }
    
    // Always send response as JSON for consistency
    res.json({ response });
  } catch (err) {
    console.error('USSD Error:', err.message);
    // Return a user-friendly USSD response even on error
    res.status(500).json({ 
      response: 'CON An error occurred. Please try again.\n\n1. Retry\n0. Exit',
      error: err.message || 'Server error' 
    });
  }
});

// @route   GET api/ussd/sessions
// @desc    Get all active USSD sessions (for debugging)
// @access  Private (should be restricted in production)
router.get('/sessions', (req, res) => {
  res.json(sessions);
});

// @route   DELETE api/ussd/sessions/:id
// @desc    Clear a specific USSD session
// @access  Private (should be restricted in production)
router.delete('/sessions/:id', (req, res) => {
  const { id } = req.params;
  if (sessions[id]) {
    delete sessions[id];
    res.json({ msg: 'Session cleared' });
  } else {
    res.status(404).json({ msg: 'Session not found' });
  }
});

module.exports = router;