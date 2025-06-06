# Telehealth Platform

A comprehensive telehealth platform built with Next.js frontend and Node.js backend, featuring video consultations, appointment scheduling, patient management, and multi-channel communication support.

## Features

### Core Features
- **Video Consultations**: Real-time video calls between patients and healthcare providers
- **Appointment Scheduling**: Easy-to-use booking system with calendar integration
- **Patient Dashboard**: Comprehensive patient portal with medical history and appointments
- **Doctor Dashboard**: Healthcare provider interface for managing patients and consultations
- **User Authentication**: Secure login system with JWT tokens
- **Real-time Notifications**: Instant updates for appointments and messages

### Communication Channels
- **Web Interface**: Modern, responsive web application
- **Voice Navigation**: Accessibility features with voice commands
- **USSD Support**: Basic mobile phone access for areas with limited internet
- **SMS Integration**: Appointment reminders and notifications via Twilio

### Advanced Features
- **Multi-language Support**: Internationalization ready
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Secure Data Handling**: HIPAA-compliant data protection
- **Payment Integration**: Stripe integration for consultation fees

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design
- **State Management**: React hooks and context
- **Real-time Communication**: WebRTC for video calls

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer for handling file uploads
- **Communication**: Twilio for SMS and voice services
- **Payments**: Stripe for payment processing

### Infrastructure
- **Database**: MongoDB
- **SMS/Voice**: Twilio
- **Payments**: Stripe
- **Environment**: Node.js runtime

## Project Structure

```
telehealth-platform/
├── backend/
│   ├── controllers/
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── patientController.js
│   │   ├── paymentController.js
│   │   └── ussdController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   └── User.js
│   ├── routes/
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   ├── doctors.js
│   │   ├── patients.js
│   │   ├── payments.js
│   │   └── ussd.js
│   ├── services/
│   │   ├── notificationService.js
│   │   ├── smsService.js
│   │   └── twilioService.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── appointments/
│   │   │   ├── auth/
│   │   │   ├── doctor-dashboard/
│   │   │   ├── patient-dashboard/
│   │   │   ├── ussd/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── VoiceCommandListener.tsx
│   │   │   ├── VoiceNavigationButton.tsx
│   │   │   └── VoiceNavigationProvider.tsx
│   │   ├── hooks/
│   │   │   └── useVoiceNavigation.ts
│   │   └── utils/
│   │       └── voiceNavigation.ts
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Twilio account (for SMS/voice features)
- Stripe account (for payments)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Twilio credentials
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+15551234567

# Stripe credentials
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get specific appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient profile
- `GET /api/patients/:id` - Get specific patient
- `PUT /api/patients/:id` - Update patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create doctor profile
- `GET /api/doctors/:id` - Get specific doctor
- `PUT /api/doctors/:id` - Update doctor

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment

### USSD
- `POST /api/ussd` - Handle USSD requests

## Usage

### For Patients
1. Register/Login to the platform
2. Complete your profile with medical information
3. Browse available doctors and their specialties
4. Book appointments with preferred time slots
5. Join video consultations at scheduled times
6. Access medical records and appointment history

### For Healthcare Providers
1. Register as a healthcare provider
2. Set up your professional profile and availability
3. Manage appointment requests and confirmations
4. Conduct video consultations with patients
5. Access patient medical histories (with consent)
6. Update patient records and prescriptions

### Voice Navigation
- Click the voice navigation button or say "Hey Health"
- Use voice commands like:
  - "Go to appointments"
  - "Show my profile"
  - "Book appointment"
  - "Call doctor"

### USSD Access
- Dial the USSD code from any mobile phone
- Follow the menu prompts to:
  - Check appointment status
  - Receive basic health information
  - Get emergency contact numbers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All sensitive data is encrypted
- JWT tokens for secure authentication
- HTTPS enforcement in production
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration for cross-origin requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@telehealth-platform.com or create an issue in this repository.

## Acknowledgments

- Built with modern web technologies
- Designed for accessibility and inclusivity
- Focused on healthcare provider and patient needs
- Compliant with healthcare data protection standards