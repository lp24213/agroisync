# 🔐 GitHub Secrets Setup Guide for AGROTM

## ⚠️ Required Secrets for Deployment

The following secrets must be configured in your GitHub repository settings to ensure successful deployment:

### 🔑 AWS Credentials (Required)
```
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
```

### 🌐 Frontend Environment Variables
```
REACT_APP_API_URL=https://api.agrotm.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
REACT_APP_METAMASK_NETWORK=mainnet
```

### 🔒 Security & Monitoring (Optional but Recommended)
```
SNYK_TOKEN=your_snyk_token_here
```

## 📋 How to Set Up Secrets

### 1. Go to Your GitHub Repository
- Navigate to your repository on GitHub
- Click on **Settings** tab
- Click on **Secrets and variables** → **Actions**

### 2. Add Each Secret
- Click **New repository secret**
- Enter the secret name (exactly as shown above)
- Enter the secret value
- Click **Add secret**

### 3. Verify All Secrets Are Set
You should see all required secrets listed in your repository secrets.

## 🚨 Important Notes

1. **Never commit secrets to your code** - they should only exist in GitHub repository secrets
2. **Secrets are encrypted** and cannot be viewed after creation
3. **Update secrets** if you need to change values
4. **Test deployment** after setting up secrets

## 🔍 Troubleshooting

### If you get "Context access might be invalid" errors:
1. Verify the secret name is exactly correct (case-sensitive)
2. Ensure the secret has a value (not empty)
3. Check that the secret is accessible to the workflow

### If deployment fails:
1. Check the workflow logs for specific error messages
2. Verify all required secrets are set
3. Ensure AWS credentials have proper permissions

## 📱 Current Workflow Status

The updated workflow now includes:
- ✅ Secret validation before build
- ✅ Fallback values for missing secrets
- ✅ Better error handling and logging
- ✅ AGROTM-specific deployment messages

## 🎯 Next Steps

1. Set up all required secrets in GitHub
2. Test the workflow with a small change
3. Monitor the deployment process
4. Verify your application is working correctly

---

**Need Help?** Check the workflow logs or review this guide again.
