# Collaborative Board Platform

A professional real-time collaborative board application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time updates.

## Features

### Core Functionality
- **Real-time Collaboration**: Multiple users can work on boards simultaneously with instant updates
- **Interactive Boards**: Create boards with customizable lists and cards
- **Drag & Drop**: Smooth drag-and-drop interface for organizing cards and lists
- **Rich Content Tools**: Add text blocks, shapes, images, and connectors to boards
- **Visual Connectors**: Create flowchart-style connectors between elements with auto-adjustment
- **Team Management**: Share boards with team members and track contributions
- **Profile Dashboard**: View statistics and manage boards from a centralized dashboard

### Technical Features
- WebSocket-based real-time synchronization
- Persistent data storage with MongoDB
- JWT authentication
- RESTful API architecture
- Responsive design with Tailwind CSS
- Modern React with hooks and functional components
- State management with Zustand

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Beautiful DnD**: Drag and drop functionality
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **Zustand**: Lightweight state management
- **Framer Motion**: Smooth animations
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or pnpm package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd build-real-time-board
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collaboration-board
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
CLIENT_URL=http://localhost:5173
```

**Important**: Change the `JWT_SECRET` to a strong, random string in production.

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Database Setup

Make sure MongoDB is running locally or provide a MongoDB Atlas connection string in the server `.env` file.

```bash
# Start MongoDB locally (if using local installation)
mongod
```

## Running the Application

### Development Mode

#### Start Backend Server
```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Production Server
```bash
cd server
npm start
```

## Project Structure

### Frontend (`/client`)
```
client/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── BoardCard.jsx
│   │   ├── BoardList.jsx
│   │   ├── CardItem.jsx
│   │   ├── CreateBoardModal.jsx
│   │   ├── CreateListForm.jsx
│   │   ├── CreateCardForm.jsx
│   │   ├── LearnMoreModel.jsx
│   │   ├── ListColumn.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── sidebar.jsx
│   │   └── ToolsPanel/      # Canvas tool panels
│   │       ├── ConnectTool.jsx
│   │       ├── ImageTool.jsx
│   │       ├── ShapesTool.jsx
│   │       └── TextTool.jsx
│   ├── pages/               # Page components
│   │   ├── Board.jsx        # Main board interface
│   │   ├── Dashboard.jsx    # User dashboard
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── profile.jsx
│   ├── store/               # State management
│   │   ├── boardStore.js
│   │   └── userStore.js
│   ├── utils/
│   │   └── socket.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

### Backend (`/server`)
```
server/
├── controllers/             # Request handlers
│   ├── authController.js
│   ├── boardController.js
│   ├── cardController.js
│   ├── connectorController.js
│   ├── listController.js
│   └── userController.js
├── models/                  # MongoDB schemas
│   ├── Board.js
│   ├── Card.js
│   ├── Connector.js
│   ├── List.js
│   └── User.js
├── routes/                  # API routes
│   ├── auth.js
│   ├── board.js
│   ├── card.js
│   ├── connector.js
│   ├── list.js
│   └── user.js
├── middleware/
│   └── auth.js             # JWT verification
├── sockets/
│   └── socketHandler.js    # WebSocket event handlers
├── server.js               # Main server file
└── package.json
```

## API Documentation

### Authentication

#### Register User
- **POST** `/api/auth/register`
- Body: `{ name, email, password }`

#### Login User
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: `{ token, user }`

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`

### Boards

#### Get All User Boards
- **GET** `/api/boards`
- Headers: `Authorization: Bearer <token>`

#### Get Board by ID
- **GET** `/api/boards/:id`
- Headers: `Authorization: Bearer <token>`

#### Create Board
- **POST** `/api/boards`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title, description?, color? }`

#### Update Board
- **PUT** `/api/boards/:id`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title?, description?, color? }`

#### Delete Board
- **DELETE** `/api/boards/:id`
- Headers: `Authorization: Bearer <token>`

### Lists

#### Create List
- **POST** `/api/lists`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title, board, position? }`

#### Update List
- **PUT** `/api/lists/:id`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title?, position? }`

#### Delete List
- **DELETE** `/api/lists/:id`
- Headers: `Authorization: Bearer <token>`

#### Reorder Lists
- **POST** `/api/lists/reorder`
- Headers: `Authorization: Bearer <token>`
- Body: `{ lists: [listId1, listId2, ...] }`

### Cards

#### Create Card
- **POST** `/api/cards`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title, description?, list, board }`

#### Update Card
- **PUT** `/api/cards/:id`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title?, description?, dueDate?, labels? }`

#### Delete Card
- **DELETE** `/api/cards/:id`
- Headers: `Authorization: Bearer <token>`

#### Move Card
- **POST** `/api/cards/:id/move`
- Headers: `Authorization: Bearer <token>`
- Body: `{ fromList, toList, position }`

### Connectors

#### Create Connector
- **POST** `/api/connectors`
- Headers: `Authorization: Bearer <token>`
- Body: `{ board, fromElement, toElement, lineStyle?, arrowStyle?, color? }`

#### Get Board Connectors
- **GET** `/api/connectors/board/:boardId`
- Headers: `Authorization: Bearer <token>`

#### Update Connector
- **PUT** `/api/connectors/:id`
- Headers: `Authorization: Bearer <token>`

#### Delete Connector
- **DELETE** `/api/connectors/:id`
- Headers: `Authorization: Bearer <token>`

### User Stats

#### Get User Statistics
- **GET** `/api/users/stats`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ boards, lists, cards }`

## WebSocket Events

### Client → Server

- `join-board`: Join a board room
  - Payload: `(boardId, userId)`
- `join-user`: Join user room for profile updates
  - Payload: `(userId)`

### Server → Client

- `board:created`: New board created
- `board:deleted`: Board deleted
- `list:created`: New list added to board
- `list:deleted`: List removed from board
- `list:updated`: List modified
- `card:created`: New card added
- `card:updated`: Card modified
- `card:moved`: Card moved between lists
- `card:deleted`: Card removed
- `connector:created`: New connector added
- `connector:updated`: Connector modified
- `connector:deleted`: Connector removed

## Features Deep Dive

### Real-time Collaboration
The application uses Socket.IO for bidirectional real-time communication. When a user makes changes:
1. The change is saved to MongoDB
2. A WebSocket event is emitted to all users in the board room
3. Connected clients receive the update and refresh their UI

### Drag & Drop System
Uses `react-beautiful-dnd` for:
- Dragging cards between lists
- Reordering cards within a list
- Reordering lists on the board

### Canvas Tools
- **Text Tool**: Add formatted text with custom fonts, sizes, colors, and styles
- **Shape Tool**: Insert rectangles, circles, hexagons, and triangles
- **Image Tool**: Upload images or add from URL
- **Connect Tool**: Create visual connectors between elements for flowcharts

### Dynamic Statistics
Profile page shows real-time counts of:
- Boards created/owned
- Total lists across all boards
- Total cards across all boards

Updates automatically via WebSocket events and fallback polling.

## Development Guidelines

### Code Style
- Use functional React components with hooks
- Follow ES6+ JavaScript standards
- Use Tailwind CSS utility classes
- Add PropTypes for component props validation
- Handle errors gracefully with try-catch blocks

### Best Practices
1. Always validate user input on both client and server
2. Use JWT tokens stored in localStorage for authentication
3. Emit socket events after database operations complete
4. Clean up WebSocket listeners in React useEffect cleanup
5. Use environment variables for configuration

## Testing

### Run Linting
```bash
cd client
npm run lint
```

### Fix Linting Issues
```bash
npm run lint:fix
```

### Format Code
```bash
npm run format
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check Atlas connection
- Verify `MONGODB_URI` in `.env` is correct
- Check network connectivity for Atlas

### Socket.IO Connection Issues
- Verify `VITE_SOCKET_URL` matches server address
- Check CORS settings in server
- Ensure both transports are enabled: `['websocket', 'polling']`

### Build Errors
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Clear Vite cache: `rm -rf .vite`
- Ensure all peer dependencies are installed

### Authentication Issues
- Check JWT_SECRET is set in server `.env`
- Verify token is being sent in Authorization header
- Check token expiration (default: 7 days)

## Performance Optimization

### Frontend
- Lazy load routes with React.lazy
- Memoize expensive computations with useMemo
- Debounce frequent operations (search, autosave)
- Optimize images and use appropriate formats

### Backend
- Add database indexes for frequently queried fields
- Use MongoDB aggregation for complex queries
- Implement rate limiting for API endpoints
- Enable compression middleware

## Security Considerations

### Production Checklist
- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS for all connections
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Validate and sanitize all user inputs
- [ ] Use environment-specific configurations
- [ ] Set secure cookie flags
- [ ] Implement proper error handling (don't expose stack traces)
- [ ] Keep dependencies updated
- [ ] Use helmet.js for security headers

## Deployment

### Environment Variables (Production)
```env
# Server
PORT=5000
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
CLIENT_URL=<your-production-frontend-url>
NODE_ENV=production

# Client
VITE_API_URL=<your-production-api-url>
VITE_SOCKET_URL=<your-production-socket-url>
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, DigitalOcean, Railway
- **Database**: MongoDB Atlas, AWS DocumentDB

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## Changelog

### Version 1.0.0 (Current)
- Initial release with core features
- Real-time collaboration
- Drag and drop boards
- Canvas tools (text, shapes, images, connectors)
- Dynamic user statistics
- Profile management
- WebSocket-based real-time updates
- Persistent connector storage
- Professional UI/UX design

## Roadmap

### Planned Features
- [ ] Card comments and activity feed
- [ ] Board templates
- [ ] Advanced search and filtering
- [ ] Export boards (PDF, PNG, JSON)
- [ ] Board access control and permissions
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Collaborative cursors
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts
- [ ] Dark mode
- [ ] Integration with third-party tools (Slack, GitHub, etc.)

---

Built with ❤️ using the MERN stack
