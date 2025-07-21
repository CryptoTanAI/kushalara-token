# 🚀 KushAlara Token - Web3 Sovereign State

The world's first Web3-native sovereign state, pioneering digital governance and economic innovation through blockchain technology.

## ✨ Features

- **Digital Citizenship Application** - Apply for full KushAlara citizenship
- **e-Residency Program** - Start your digital business in KushAlara
- **HubSpot CRM Integration** - Automatic contact creation and management
- **Payment Processing** - WalletConnect + MoonPay integration
- **Countdown Timer** - Real-time countdown to token launch (September 24, 2025)
- **Responsive Design** - Works on desktop and mobile
- **Admin Dashboard** - Monitor applications and statistics

## 🏗️ Project Structure

```
kushalara-token/
├── backend/           # Flask API server
│   ├── src/
│   │   ├── models/    # Database models
│   │   ├── routes/    # API endpoints
│   │   └── services/  # Business logic
│   ├── app.py         # Main Flask application
│   └── requirements.txt
├── frontend/          # React website
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── providers/
│   │   └── lib/
│   ├── package.json
│   └── vite.config.js
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/kushalara-token.git
cd kushalara-token
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open Website
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables
Create `backend/.env` with:
```env
HUBSPOT_API_KEY=your_hubspot_api_key
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FLASK_DEBUG=True
```

### Backend URL
Update frontend API calls in:
- `frontend/src/pages/CitizenshipApplication.jsx`
- `frontend/src/pages/EResidencyApplication.jsx`

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Upload dist/ folder
```

### Backend (Railway/Render)
```bash
cd backend
# Connect GitHub repository
# Set environment variables
```

## 📱 Usage

1. **Homepage** - Overview and countdown timer
2. **Citizenship** - Apply for full citizenship
3. **e-Residency** - Apply for digital business residency
4. **Admin** - View application statistics

## 🔗 Links

- **Instagram**: https://instagram.com/kushalara
- **Twitter**: https://twitter.com/kushalara

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@kushalara.com or join our community.

---

Built with ❤️ for the future of digital sovereignty

