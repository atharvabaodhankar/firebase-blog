# Simple Firebase Blog

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Troubleshooting

Common issues and solutions:
1. **Missing or insufficient permissions**
   - Check Firebase security rules
   - Verify admin authentication
   - Ensure Firebase configuration is correct

2. **Posts not displaying**
   - Check Firebase database connection
   - Verify read permissions in security rules
   - Check console for errors

3. **Admin login issues**
   - Verify Firebase Authentication is enabled
   - Check admin credentials
   - Ensure proper Firebase configuration

## Support

For support, please open an issue in the GitHub repository or contact [your-contact-information].

## Project Setup

1. **Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Email/Password Authentication
   - Create a Cloud Firestore database
   - Copy `config.example.js` to `config.js`
   - Add your Firebase configuration to `config.js`
   
   ⚠️ IMPORTANT: Never commit your `config.js` file containing real Firebase credentials to GitHub!

2. **Environment Setup**
   ```bash
   # Clone the repository
   git clone [your-repository-url]
   
   # Copy the example config
   cp config.example.js config.js
   
   # Edit config.js with your Firebase credentials
   ```