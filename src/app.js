const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// ============================================
// Configuration
// ============================================
const CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'demo-secret-key',
  JWT_EXPIRY: '48h',
  PORT: 3000,
  API_VERSION: 'v2',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SUPPORTED_TOKEN_TYPES: ['Bearer'],
  PASSWORD_MIN_LENGTH: 8,
};

// In-memory store (demo only)
const users = new Map();
const loginAttempts = new Map();

// ============================================
// Authentication Module
// ============================================

// Login endpoint
app.post('/api/v2/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < CONFIG.PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${CONFIG.PASSWORD_MIN_LENGTH} characters` });
  }

  // Check lockout
  const attempts = loginAttempts.get(email) || { count: 0, lockedUntil: null };
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    return res.status(423).json({ error: 'ACCOUNT_LOCKED', message: 'Too many failed login attempts' });
  }

  // Demo: accept any valid email/password combination
  const userId = email.split('@')[0];
  const token = jwt.sign({ userId, email }, CONFIG.JWT_SECRET, {
    expiresIn: CONFIG.JWT_EXPIRY,
  });

  // Reset login attempts on success
  loginAttempts.delete(email);

  res.json({
    token,
    expiresIn: CONFIG.JWT_EXPIRY,
    tokenType: 'Bearer',
  });
});

// Token refresh endpoint
app.post('/api/v2/auth/refresh', authenticateToken, (req, res) => {
  const token = jwt.sign(
    { userId: req.user.userId, email: req.user.email },
    CONFIG.JWT_SECRET,
    { expiresIn: CONFIG.JWT_EXPIRY }
  );

  res.json({
    token,
    expiresIn: CONFIG.JWT_EXPIRY,
    tokenType: 'Bearer',
  });
});

// Password reset via email
app.post('/api/v2/auth/reset-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Demo: always return success
  res.json({
    message: 'Password reset link sent to your email',
    expiresIn: '1 hour',
  });
});

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing or invalid token' });
  }

  jwt.verify(token, CONFIG.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Token expired or insufficient permissions' });
    }
    req.user = user;
    next();
  });
}

// ============================================
// Billing Module
// ============================================

// Pricing tiers
const PRICING_TIERS = {
  free: { price: 0, requests: 1000, storage: '1GB', support: 'community' },
  starter: { price: 39, requests: 10000, storage: '10GB', support: 'email' },
  pro: { price: 99, requests: 100000, storage: '100GB', support: 'priority' },
  enterprise: { price: 499, requests: -1, storage: '1TB', support: 'dedicated' },
};

// Payment methods
const PAYMENT_METHODS = ['credit_card', 'bank_transfer'];

// Get current subscription
app.get('/api/v2/billing/subscription', authenticateToken, (req, res) => {
  res.json({
    plan: 'free',
    price: PRICING_TIERS.free.price,
    requests: PRICING_TIERS.free.requests,
    storage: PRICING_TIERS.free.storage,
    support: PRICING_TIERS.free.support,
  });
});

// Change plan
app.post('/api/v2/billing/change-plan', authenticateToken, (req, res) => {
  const { newPlan } = req.body;

  if (!PRICING_TIERS[newPlan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  res.json({
    message: `Plan changed to ${newPlan}`,
    plan: newPlan,
    ...PRICING_TIERS[newPlan],
    effectiveDate: new Date().toISOString(),
  });
});

// Get invoices
app.get('/api/v2/billing/invoices', authenticateToken, (req, res) => {
  // Invoices generated on the 1st of each month
  const now = new Date();
  res.json({
    invoices: [
      {
        id: `INV-${now.getFullYear()}-001`,
        date: `${now.getFullYear()}-01-01`,
        amount: 0,
        status: 'paid',
        plan: 'free',
      },
    ],
  });
});

// Get available payment methods
app.get('/api/v2/billing/payment-methods', authenticateToken, (req, res) => {
  res.json({ methods: PAYMENT_METHODS });
});

// ============================================
// Health Check
// ============================================
app.get('/api/v2/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: CONFIG.API_VERSION,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Server
// ============================================
app.listen(CONFIG.PORT, () => {
  console.log(`SecureAPI server running on port ${CONFIG.PORT}`);
  console.log(`API Version: ${CONFIG.API_VERSION}`);
});

module.exports = app;
