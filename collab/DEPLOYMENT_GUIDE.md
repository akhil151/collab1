# Deployment Guide

## Pre-Deployment Checklist

### Code Quality ✅
- [x] Zero console warnings
- [x] No TypeScript/ESLint errors
- [x] Clean dependency tree
- [x] Optimized bundle size
- [x] Production-ready code

### Testing ✅
- [x] All features tested manually
- [x] Real-time sync verified
- [x] Database persistence confirmed
- [x] Multi-user collaboration tested
- [x] Cross-browser compatibility checked

### Security ✅
- [x] JWT authentication implemented
- [x] Authorization on all endpoints
- [x] Environment variables configured
- [x] Input validation in place
- [x] XSS protection enabled

---

## Environment Setup

### Production Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collaboration-board
JWT_SECRET=your-super-secret-key-min-32-chars
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
```

---

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to railway.app
   - Sign up with GitHub

2. **Create New Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   cd server
   railway init
   ```

3. **Add MongoDB**
   - In Railway dashboard, add MongoDB plugin
   - Copy connection string to environment variables

4. **Configure Environment**
   - Add all environment variables in Railway dashboard
   - Set `PORT=5000`

5. **Deploy**
   ```bash
   railway up
   ```

6. **Get Domain**
   - Railway provides a domain automatically
   - Or add custom domain in settings

#### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Import Project"
   - Select your GitHub repository
   - Choose `/client` as root directory

3. **Configure Build**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables**
   - Add `VITE_API_URL` with your Railway backend URL
   - Add `VITE_SOCKET_URL` with your Railway backend URL

5. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically

---

### Option 2: DigitalOcean Droplet

#### Setup Droplet

1. **Create Droplet**
   - Ubuntu 22.04 LTS
   - 2GB RAM minimum
   - Add SSH key

2. **Connect to Droplet**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   apt update
   apt install -y mongodb-org
   systemctl start mongod
   systemctl enable mongod
   
   # Install PM2
   npm install -g pm2
   
   # Install Nginx
   apt install -y nginx
   ```

4. **Deploy Application**
   ```bash
   # Clone repository
   cd /var/www
   git clone your-repo-url collaboration-board
   cd collaboration-board
   
   # Install backend dependencies
   cd server
   npm install
   
   # Create .env file
   nano .env
   # Add production environment variables
   
   # Start backend with PM2
   pm2 start server.js --name collab-backend
   pm2 save
   pm2 startup
   
   # Install frontend dependencies
   cd ../client
   npm install
   npm run build
   ```

5. **Configure Nginx**
   ```bash
   nano /etc/nginx/sites-available/collaboration-board
   ```
   
   Add configuration:
   ```nginx
   # Frontend
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/collaboration-board/client/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # API proxy
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Socket.IO proxy
       location /socket.io {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable and restart:
   ```bash
   ln -s /etc/nginx/sites-available/collaboration-board /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

6. **SSL Certificate (Optional but Recommended)**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d your-domain.com
   ```

---

### Option 3: Heroku

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd server
   heroku create your-app-backend
   ```

3. **Add MongoDB Atlas**
   - Create free cluster at mongodb.com/atlas
   - Get connection string
   - Add to Heroku config:
   ```bash
   heroku config:set MONGODB_URI=your-connection-string
   heroku config:set JWT_SECRET=your-secret-key
   ```

4. **Create Procfile**
   ```
   web: node server.js
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

#### Frontend Deployment

Use Vercel or Netlify (same as Option 1)

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Cluster**
   - Go to mongodb.com/atlas
   - Create free M0 cluster
   - Choose closest region

2. **Configure Network Access**
   - Add IP: 0.0.0.0/0 (allow all - secure with other methods)
   - Or add specific deployment server IPs

3. **Create Database User**
   - Username: collabadmin
   - Password: Generate strong password
   - Permissions: Read and write to any database

4. **Get Connection String**
   ```
   mongodb+srv://collabadmin:<password>@cluster.mongodb.net/collaboration-board?retryWrites=true&w=majority
   ```

5. **Add Indexes**
   ```javascript
   // In MongoDB Atlas UI or using Compass
   db.boards.createIndex({ "owner": 1 })
   db.lists.createIndex({ "board": 1 })
   db.cards.createIndex({ "list": 1, "board": 1 })
   db.users.createIndex({ "email": 1 }, { unique: true })
   ```

---

## Performance Optimization

### Frontend Optimization

1. **Build for Production**
   ```bash
   cd client
   npm run build
   ```
   
   This automatically:
   - Minifies JavaScript
   - Optimizes CSS
   - Compresses images
   - Tree-shakes unused code

2. **Enable Gzip Compression**
   ```nginx
   # In nginx.conf
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   ```

3. **Add Caching Headers**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

### Backend Optimization

1. **Use PM2 Cluster Mode**
   ```bash
   pm2 start server.js -i max --name collab-backend
   ```

2. **Enable Compression**
   ```javascript
   // In server.js
   import compression from 'compression'
   app.use(compression())
   ```

3. **Add Rate Limiting**
   ```javascript
   import rateLimit from 'express-rate-limit'
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   })
   
   app.use('/api/', limiter)
   ```

---

## Monitoring

### Recommended Tools

1. **Uptime Monitoring**
   - UptimeRobot (free)
   - Pingdom

2. **Error Tracking**
   - Sentry
   - LogRocket

3. **Performance Monitoring**
   - New Relic
   - DataDog

### Setup PM2 Monitoring (DigitalOcean)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Monitor
pm2 monit
```

---

## Backup Strategy

### Database Backups

1. **MongoDB Atlas Automatic Backups**
   - Enable in Atlas dashboard
   - Continuous backups available
   - Point-in-time recovery

2. **Manual Backup**
   ```bash
   mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
   ```

3. **Automated Backup Script**
   ```bash
   #!/bin/bash
   # backup.sh
   DATE=$(date +%Y%m%d_%H%M%S)
   mongodump --uri="$MONGODB_URI" --out=/backup/$DATE
   tar -czf /backup/backup_$DATE.tar.gz /backup/$DATE
   rm -rf /backup/$DATE
   
   # Keep only last 7 days
   find /backup -name "backup_*.tar.gz" -mtime +7 -delete
   ```
   
   Add to crontab:
   ```bash
   0 2 * * * /path/to/backup.sh
   ```

---

## Security Best Practices

### SSL/TLS
- Use Let's Encrypt for free SSL certificates
- Enforce HTTPS redirects
- Update certificates automatically

### Environment Variables
- Never commit .env files
- Use secure key management (AWS Secrets Manager, etc.)
- Rotate JWT secrets periodically

### Database Security
- Use strong passwords
- Enable MongoDB authentication
- Use IP whitelisting when possible
- Regular security patches

### Application Security
- Keep dependencies updated
- Regular security audits
- Input sanitization
- SQL injection prevention (using Mongoose helps)

---

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**
   - Nginx or cloud load balancer
   - Distribute traffic across multiple instances

2. **Database Sharding**
   - MongoDB Atlas supports sharding
   - Partition by board ID or user ID

3. **Redis for Sessions**
   ```bash
   npm install redis connect-redis
   ```

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Add database indexes
- Implement caching

---

## Post-Deployment

### Health Checks

1. **API Health Endpoint**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({ 
       status: 'ok', 
       timestamp: new Date(),
       uptime: process.uptime()
     })
   })
   ```

2. **Database Connection Check**
   ```javascript
   app.get('/health/db', async (req, res) => {
     try {
       await mongoose.connection.db.admin().ping()
       res.json({ status: 'ok', database: 'connected' })
     } catch (error) {
       res.status(500).json({ status: 'error', database: 'disconnected' })
     }
   })
   ```

### Monitoring Dashboard

Set up dashboards for:
- Server CPU/Memory usage
- Database connections
- API response times
- Socket.IO connections
- Error rates

---

## Rollback Plan

1. **Keep Previous Version**
   ```bash
   pm2 save
   # If issues occur
   git checkout previous-version-tag
   npm install
   pm2 reload all
   ```

2. **Database Migrations**
   - Always backup before schema changes
   - Test migrations in staging first
   - Have rollback scripts ready

---

## Support & Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check server health
- Review usage metrics

**Weekly:**
- Review performance metrics
- Check for security updates
- Analyze user feedback

**Monthly:**
- Update dependencies
- Review and optimize queries
- Backup verification
- Security audit

---

## Troubleshooting

### Common Issues

**Socket.IO Connection Fails:**
- Check firewall rules
- Verify WebSocket support
- Check CORS configuration

**Database Connection Timeout:**
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check database user permissions

**High Memory Usage:**
- Check for memory leaks
- Restart PM2 processes
- Review large file uploads

---

## Cost Estimation

### Free Tier (Dev/Small Teams)
- **Frontend:** Vercel (Free)
- **Backend:** Railway (Free $5 credit)
- **Database:** MongoDB Atlas (Free 512MB)
- **Total:** $0/month

### Production (Small Business)
- **Frontend:** Vercel Pro ($20/month)
- **Backend:** Railway Pro ($20/month)
- **Database:** MongoDB Atlas M10 ($57/month)
- **Total:** ~$97/month

### Enterprise (Large Teams)
- **Frontend:** Vercel Enterprise (Custom)
- **Backend:** Multiple servers ($200+/month)
- **Database:** MongoDB Atlas M30+ ($250+/month)
- **CDN:** CloudFlare ($20/month)
- **Monitoring:** DataDog ($31/month)
- **Total:** $500+/month

---

## Conclusion

This application is production-ready and can be deployed using any of the methods above. Choose based on:

- **Budget:** Free tier for testing, paid for production
- **Technical Expertise:** Managed services vs. manual setup
- **Scaling Needs:** Start small, scale as needed
- **Control:** Full control with VPS, convenience with PaaS

**Recommended for Most Users:** Vercel + Railway + MongoDB Atlas

Good luck with your deployment! 🚀
