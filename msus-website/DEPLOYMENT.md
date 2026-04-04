# MSUS Website - Deployment Guide

Complete deployment guide for the MSUS (Mohammadpur Samaj Unnayan Sangathan) website.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [Production Deployment](#production-deployment)
6. [Post-Deployment](#post-deployment)

---

## Prerequisites

### Required Software

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **MongoDB**: v6.x or higher (Local or Atlas)
- **Docker**: (Optional, for containerized deployment)
- **Git**: For version control

### Cloud Services (Production)

- **MongoDB Atlas**: For database hosting
- **Cloudinary**: For image storage
- **Stripe**: For payment processing
- **SMTP Provider**: Gmail/Outlook/SendGrid for emails
- **VPS**: DigitalOcean/Railway/Render/AW

---

## Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd msus-website
```

### 2. Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/msus

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=30d

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin
ADMIN_EMAIL=admin@msus.org.bd
ADMIN_PASSWORD=YourSecurePassword123!
```

### 3. Frontend Configuration

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

---

## Local Development

### Option 1: Local Node.js

#### Backend
```bash
cd backend
npm install
npm run seed  # Optional: Seed database
npm run dev   # Development server
```

#### Frontend
```bash
cd frontend
npm install
npm run dev   # Development server
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Option 2: Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Docker Deployment

### Single Docker Image (Recommended for VPS)

```bash
# Build production image
docker build -t msus-website .

# Run container
docker run -d \
  --name msus \
  -p 80:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb+srv://... \
  -e JWT_SECRET=... \
  msus-website
```

### Multi-container with Docker Compose

```bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# Scale backend instances
docker-compose up -d --scale backend=3
```

---

## Production Deployment

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
3. Deploy

#### Backend (Railway)

1. Connect GitHub repository to Railway
2. Add MongoDB plugin
3. Set environment variables
4. Deploy

### Option 2: VPS (DigitalOcean/Linode/AWS Lightsail)

1. **Provision Server** (Ubuntu 22.04 recommended)

2. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MongoDB (if not using Atlas)
# See MongoDB installation guide for your OS

# Install Nginx
sudo apt install nginx -y
```

3. **Clone and Setup**
```bash
git clone <repository-url> /var/www/msus
cd /var/www/msus

# Setup Backend
cd backend
npm install --production
npm run seed

# Setup Frontend
cd ../frontend
npm install
npm run build
```

4. **Configure PM2**
```bash
cd /var/www/msus
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

5. **Configure Nginx**
```bash
sudo cp nginx/nginx.conf /etc/nginx/sites-available/msus
sudo ln -s /etc/nginx/sites-available/msus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **SSL Certificate (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d msus.org.bd -d www.msus.org.bd
```

### Option 3: Kubernetes

```bash
# Create namespace
kubectl create namespace msus

# Apply manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## Post-Deployment

### 1. Initial Setup

1. Access admin panel: `/admin`
2. Login with default credentials:
   - Email: Set in ADMIN_EMAIL
   - Password: Set in ADMIN_PASSWORD
3. Change default password immediately
4. Configure site settings

### 2. Verify Deployment

```bash
# Health check
curl https://your-domain.com/health

# API test
curl https://api.your-domain.com/api/settings
```

### 3. Configure Domain

1. Point DNS A record to server IP
2. Wait for DNS propagation (24-48 hours)
3. Verify SSL certificate

### 4. Monitoring

- **PM2 Dashboard**: `pm2 monit`
- **Logs**: `pm2 logs`
- **Nginx Logs**: `/var/log/nginx/`

---

## Maintenance

### Backup Database

```bash
# MongoDB Atlas backup
# Automated daily backups configured in Atlas

# Manual export
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install
pm2 restart msus-backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart msus-frontend
```

### Security Checklist

- [ ] Change default admin password
- [ ] Enable 2FA for admin accounts
- [ ] Configure firewall (UFW)
- [ ] Set up fail2ban
- [ ] Enable MongoDB authentication
- [ ] Use strong JWT secret
- [ ] Configure CORS properly
- [ ] Enable SSL/HTTPS
- [ ] Set up rate limiting
- [ ] Regular security updates

---

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGODB_URI format
   - Verify network access in Atlas
   - Whitelist server IP

2. **CORS Errors**
   - Verify CLIENT_URL in backend .env
   - Check CORS configuration

3. **Email Not Sending**
   - Use App Password for Gmail
   - Verify SMTP settings
   - Check spam folders

4. **Build Failures**
   - Clear node_modules and package-lock
   - Use compatible Node.js version
   - Check for syntax errors

### Support

For deployment issues, contact the development team or create an issue in the repository.

---

## Production Checklist

Before going live, ensure:

- [ ] Environment variables set correctly
- [ ] Database seeded with initial data
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Email service tested
- [ ] Payment gateway configured
- [ ] Image upload working
- [ ] Admin account secured
- [ ] Backup scheduled
- [ ] Monitoring enabled
- [ ] Documentation updated

---

**Last Updated**: 2024
**Version**: 1.0.0
