# Railway Deployment Guide

Complete step-by-step guide to deploy the Project Management System to Railway.

## Prerequisites

- Railway account (https://railway.app)
- GitHub account with your project repository
- Git installed locally

## Step 1: Prepare Your GitHub Repository

### 1.1 Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Project Management System"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/project-management-system.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 2: Create Railway Project

### 2.1 Sign In to Railway

1. Go to https://railway.app
2. Click "Login"
3. Click "Login with GitHub"
4. Authorize Railway to access your GitHub repositories

### 2.2 Create New Project

1. Click "New Project" button
2. Select "Deploy from GitHub repo"
3. Search for your `project-management-system` repository
4. Click to select it
5. Railway will detect the repository and prepare deployment

## Step 3: Configure Backend Service

### 3.1 Set Root Directory

1. In the Railway dashboard, click on the project
2. Click "Settings" for the detected service
3. Set "Root Directory" to `backend`
4. Save changes

### 3.2 Add Environment Variables for Backend

1. In the service settings, go to "Variables"
2. Add the following variables:

```
JWT_SECRET=your_very_secure_random_string_here_at_least_32_chars
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-url.up.railway.app
```

**Important**: Generate a strong JWT_SECRET:
```bash
# On your machine, generate a random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 Deploy Backend

1. Click the "Deploy" button
2. Railway will build and deploy the backend service
3. You'll see build logs in real-time
4. Once deployed, Railway assigns a public URL

**Note the Backend URL**: `https://your-backend.up.railway.app`

## Step 4: Add PostgreSQL Database

### 4.1 Create Database Service

1. In your Railway project, click "+ Add"
2. Select "Database"
3. Choose "PostgreSQL"
4. Click "Add"
5. Railway automatically creates and configures PostgreSQL

### 4.2 Configure Database Connection

1. Click on the PostgreSQL service
2. Go to "Variables" tab
3. Railway auto-generates:
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DB`

### 4.3 Link Database to Backend

1. Go back to backend service settings
2. In "Variables", you should see `DATABASE_URL` is auto-populated by Railway
3. If not, manually add:
```
postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@<host>:5432/<POSTGRES_DB>
```

### 4.4 Initialize Database Schema

Railway will run `schema.sql` automatically if placed in the correct location.

**Manual initialization** (if needed):
1. Get PostgreSQL connection details from Railway
2. Connect using psql or pgAdmin:
```bash
psql <DATABASE_URL>
```
3. Run the schema:
```bash
\i backend/src/db/schema.sql
```

## Step 5: Configure Frontend Service

### 5.1 Create Frontend Deployment

1. In your Railway project, click "+ Add"
2. Select "Deploy from GitHub repo"
3. Choose your `project-management-system` repository again
4. This creates a new service

### 5.2 Configure Frontend Service

1. Set "Root Directory" to `frontend`
2. Set "Dockerfile" to `Dockerfile` (not Dockerfile.dev)

### 5.3 Add Environment Variables for Frontend

1. Go to "Variables" for frontend service
2. Add:
```
VITE_API_URL=https://your-backend.up.railway.app
```

Replace `your-backend.up.railway.app` with your actual backend URL from Step 3.3

### 5.4 Deploy Frontend

1. Click "Deploy"
2. Railway builds and deploys the frontend
3. Once complete, note the frontend URL

**Note the Frontend URL**: `https://your-frontend.up.railway.app`

## Step 6: Update CORS Configuration

### 6.1 Update Backend CORS

Now that you have the frontend URL:

1. Go to backend service settings
2. Go to "Variables"
3. Update `CORS_ORIGIN` to your actual frontend URL:
```
CORS_ORIGIN=https://your-frontend-url.up.railway.app
```

### 6.2 Redeploy Backend

1. Click "Redeploy" for the backend service
2. This applies the updated CORS_ORIGIN

## Step 7: Verify Deployment

### 7.1 Test Backend API

```bash
curl https://your-backend-url.up.railway.app/health
```

Expected response:
```json
{"status":"Server is running"}
```

### 7.2 Test Frontend

1. Open your frontend URL in browser
2. You should see the login page
3. Click "Sign up" to create an account
4. Test the application flow

## Step 8: Setup Custom Domain (Optional)

### 8.1 Add Custom Domain to Frontend

1. Go to frontend service settings
2. Click "Custom Domain"
3. Enter your domain (e.g., `pms.yourdomain.com`)
4. Follow DNS configuration instructions

### 8.2 Add Custom Domain to Backend

1. Go to backend service settings
2. Click "Custom Domain"
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Follow DNS configuration instructions

### 8.3 Update Frontend API URL

1. Update frontend service variable:
```
VITE_API_URL=https://api.yourdomain.com
```

2. Redeploy frontend

## Step 9: Enable Auto-Deployment

### 9.1 Setup GitHub Integration

1. Each service has GitHub integration enabled by default
2. Commits to the main branch trigger automatic deployments
3. You can see deployment history in "Deployments" tab

### 9.2 Branch Protection (Optional)

1. Protect the `main` branch in GitHub
2. Require pull request reviews before merging
3. This ensures quality control

## Step 10: Monitoring and Logs

### 10.1 View Logs

1. In each service, click "Logs"
2. Real-time logs appear as application runs
3. Errors and warnings are clearly displayed

### 10.2 Monitor Resources

1. Click on service
2. Go to "Metrics"
3. View CPU, Memory, Network usage

### 10.3 Set Up Alerts (Optional)

1. Go to project settings
2. Configure email notifications for deployment failures

## Troubleshooting

### Issue: Build Failing

**Solution**:
1. Check build logs
2. Ensure package.json exists in the specified root directory
3. Verify all dependencies are specified

### Issue: Database Connection Error

**Solution**:
1. Verify DATABASE_URL is set correctly
2. Check PostgreSQL service is running
3. Ensure schema was initialized

### Issue: CORS Error in Browser

**Solution**:
1. Verify CORS_ORIGIN matches frontend URL exactly
2. Redeploy backend after updating CORS_ORIGIN
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: Frontend Can't Reach Backend API

**Solution**:
1. Check VITE_API_URL is set correctly
2. Verify backend service is running (check Logs)
3. Test backend URL directly in browser/curl

### Issue: PostgreSQL Won't Initialize

**Solution**:
1. Manually run schema.sql using psql
2. Check logs for specific error messages
3. Ensure SQL syntax is correct

## Post-Deployment Checklist

- [ ] Backend service is running
- [ ] PostgreSQL database is initialized
- [ ] Frontend service is running
- [ ] CORS is properly configured
- [ ] Able to register new account
- [ ] Able to login
- [ ] Dashboard displays correctly
- [ ] Can create projects
- [ ] Can create and manage tasks
- [ ] Admin panel is accessible for admin users

## Performance Optimization

### 1. Enable Caching

For PostgreSQL queries, consider adding caching layer:
```javascript
// Use Redis cache (optional)
const redisCache = ...;
```

### 2. Optimize Database Queries

All queries use prepared statements and indexes for security and performance.

### 3. Frontend Optimization

- Vite build is already optimized
- CSS is minified
- JavaScript is bundled and minified

### 4. Monitor Performance

Use Railway's metrics to identify bottlenecks.

## Security Considerations

### 1. JWT Secret

- Generate a strong, random JWT_SECRET
- Never commit it to GitHub
- Use Railway's environment variables

### 2. Database Password

- Railway generates secure passwords
- Never share DATABASE_URL publicly

### 3. HTTPS

- Railway provides free HTTPS for all deployed services
- Always use HTTPS URLs in production

### 4. Environment Variables

- All sensitive data in environment variables
- Never hardcode secrets in code

## Maintenance

### Regular Tasks

1. **Monitor Logs**: Check for errors regularly
2. **Update Dependencies**: Periodically update npm packages
3. **Backup Database**: Set up automated PostgreSQL backups
4. **Test Functionality**: Regularly test new features

### Scaling

If experiencing high traffic:

1. Increase RAM for services
2. Add database replicas
3. Implement CDN for frontend assets
4. Consider load balancing

## Summary

You now have:
- ✅ Backend API running on Railway
- ✅ PostgreSQL database initialized
- ✅ Frontend deployed and connected
- ✅ CORS properly configured
- ✅ Auto-deployment from GitHub enabled
- ✅ Production-ready application

Your application is live and accessible at:
- **Frontend**: `https://your-frontend-url.up.railway.app`
- **Backend API**: `https://your-backend-url.up.railway.app`
- **Database**: Managed by Railway

---

For Railway support: https://railway.app/support
