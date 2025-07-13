# **App Name**: Fleeting Inspector

## Core Features:

- Automatic Endpoint Generation: Generates a unique, random URL on page load for request inspection.
- Comprehensive Request Display: Displays all request methods (GET, POST, PUT, DELETE, etc.) with details: timestamp, IP, headers, parameters, and request body.
- Real-time Updates: Utilizes WebSockets to provide real-time updates as requests are received.
- Ephemeral Data Handling: Data is ephemeral; no database is used. Request data is held in memory only for the session and discarded when the session ends.
- Simple User Interface: Clear URL display, copy button, clear button, and reverse chronological list of requests.

## Style Guidelines:

- Primary color: Saturated purple (#9B5DE5) to suggest clarity and insight.
- Background color: Light desaturated purple (#F0EBF8) to create a clean and readable backdrop.
- Accent color: Analogous blue (#5F6DF5) to draw attention to important interactive elements, like CTAs and active UI.
- Font: 'Inter' (sans-serif) for both headings and body text, to ensure a modern, neutral, and highly readable presentation.
- Minimalist icons to represent actions and status, focused on clarity.
- Clean and straightforward layout, prioritizing the visibility of the generated URL and request details. Requests should be displayed in a reverse chronological order.
- Subtle animations for new requests appearing, providing a smooth and responsive user experience.