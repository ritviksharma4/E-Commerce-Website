# ✨ Velvét Threads – E-commerce Web Application

A fully-featured, luxury-themed E-Commerce platform built with modern technologies and hosted entirely on AWS infrastructure. Built for high performance, user-centric design, and scalable cloud integration.

---

## 🚀 Features

### 🛍️ Shopping Experience
- Full product catalog with category and subcategory navigation (Men, Women, Accessories)
- Dynamically generated **Product Detail Pages** using product code.
- **Luxury-style Quick View** modal with product summary.
- **Size Guide Viewer** in Quick View and Product Page (supports cm/in toggle).
- **Wishlist (Favorites)** with Edit and Remove functionality.
- **MiniCart** and full **Cart Page** with real-time quantity updates and removal.
- Responsive layout for All Devices.

### 🔍 Smart Suggestions
- Recommended products on each product page.
- Priority-based suggestion logic (subcategory → category fallback).

### 🧠 Personalization
- `Wishlist-Items`, `Recently-Viewed`, and `Cart-Items` data stored per User.
- Fetched and updated using secure AWS Lambda Endpoints.

### 🔐 Authentication & Protection
- Route protection for favorites and cart using AWS Cognito.
- Dynamic login-based experience across the site.

### ⚙️ Admin-Friendly Structure
- Configuration-driven navigation and filters via `src/config.json`.
- Centralized product metadata from DynamoDB.
- Modular and reusable components (e.g., `BoxOption`, `FavoriteCard`, `LuxuryLoader`).

---

## 🧰 Tech Stack

| Layer             | Technology |
|------------------|------------|
| **Frontend**      | React, Gatsby |
| **Styling**       | CSS Modules, Custom Styles |
| **State**         | React Context API |
| **Authentication**| AWS Cognito |
| **Backend (API)** | AWS Lambda |
| **Database**      | AWS DynamoDB |
| **Media Storage** | AWS S3 |
| **Hosting**       | AWS S3 + CloudFront |

---

---

## 🌐 Deployment

This project is **fully hosted on AWS**:

- Static frontend is deployed via **S3 + CloudFront** for blazing-fast global delivery.
- Product images and size guides are stored in **S3** under structured directories (`category/subcategory/productCode/`).
- Product metadata is fetched from **DynamoDB** via **Lambda APIs**.
- User interactions (wishlist, cart, recently viewed) are stored and updated via Lambda functions backed by DynamoDB.

---

## 🔐 Environment Variables

The following variables are required in your `.env`:

```env
GATSBY_APP_AWS_REGION=your-region
GATSBY_APP_COGNITO_IDENTITY_POOL_ID=your-cognito-id
GATSBY_APP_DYNAMODB_TABLE=your-table-name
GATSBY_APP_S3_BUCKET_NAME=your-s3-bucket
GATSBY_APP_GET_PRODUCT_DETAILS_FOR_USER=https://your-lambda-url
GATSBY_APP_GET_SHOPPING_HISTORY_FOR_USER=https://your-lambda-url
GATSBY_APP_UPDATE_SHOPPING_HISTORY_FOR_USER=https://your-lambda-url
```

# 📈 Future Improvements for Velvét Threads E-commerce Platform

This document outlines upcoming features and enhancements to be added to the Luxe Threads e-commerce platform to further elevate user experience, administrative control, and business intelligence.

---

## 💳 1. Payment Gateway Integration

### Objective
Enable secure, seamless checkout and online payment for users globally.

### Proposed Solutions
- **Integrations**: Stripe, Razorpay, or PayPal
- **Features**:
  - Secure checkout flow with tokenized card handling
  - Support for multiple currencies (configured via `config.json`)
  - Guest checkout vs logged-in checkout
  - Order confirmation email with summary

### Stack Considerations
- AWS Lambda for backend transaction initiation
- Cognito for payment-related authentication tokens
- React state management for order and cart syncing

---

## 🚚 2. Order Tracking Dashboard

### Objective
Give users the ability to track the status of their orders post-purchase.

### Features
- Order timeline: Pending → Processed → Shipped → Delivered
- View order history by date, item, and status
- Integration with courier APIs for real-time tracking (e.g., Shiprocket, FedEx API)

### Backend Plan
- Store order metadata in DynamoDB
- AWS Step Functions to simulate order flow for MVP/testing

---

## 🛠️ 3. Admin Panel for Product Uploads

### Objective
Create a secure admin dashboard for managing product listings and media.

### Features
- Product create/edit/delete with rich metadata
- Bulk image upload to S3 via drag & drop
- Preview before publish
- Category and subcategory management
- Role-based access control (admin, editor)

### Tools
- Gatsby-based Admin UI or use Next.js for better dynamic routing
- Backend: AWS Lambda + DynamoDB + S3
- Auth: Cognito with custom roles/groups

---

## 📊 4. Inventory Management and Analytics

### Objective
Provide a dashboard for product performance and stock level monitoring.

### Features
- Stock level thresholds and alerts
- Sales analytics: top sellers, conversion rates, user interaction heatmaps
- Exportable CSV reports
- Integration with tools like AWS QuickSight for visual analytics

### Stack Ideas
- AWS DynamoDB Streams or EventBridge to trigger inventory updates
- Cron-triggered Lambda jobs for analytics summaries
- QuickSight or custom D3.js-based frontend dashboard

---

## 📅 Timeline (Tentative)

| Feature                     | Target Phase |
|----------------------------|--------------|
| Payment Gateway            | Phase 1      |
| Order Tracking             | Phase 2      |
| Admin Product Panel        | Phase 3      |
| Inventory + Analytics      | Phase 4      |

---

## 💼 Business Value

| Feature                     | Benefit                                     |
|----------------------------|---------------------------------------------|
| Payment Gateway            | Complete shopping experience, increased revenue |
| Order Tracking             | Trust building and customer satisfaction    |
| Admin Panel                | Scalable content operations                 |
| Inventory + Analytics      | Informed business decisions, reduce stockouts |

---

## 👨‍💻 Author

Built with ❤️ by **Ritvik Sharma**

I’m aspiring to become a Leader who will be a growling engine behind the changes in the world.
I love to fiddle with technology which I have never heard of before and build things that are intriguing.

---

### 🔗 Connect with Me

| Platform       | Link                                                                 |
|----------------|----------------------------------------------------------------------|
| 🌐 Portfolio   | [My Portfolio Website](https://ritvik-sharma.com/)                      |
| 💼 LinkedIn    | [linkedin.com/in/ritviksharma4](https://www.linkedin.com/in/ritviksharma4/)|
| 💻 GitHub      | [github.com/ritviksharma4](https://github.com/ritviksharma4)        |
| 📹 YouTube     | [youtube.com/@ritz182](https://www.youtube.com/@ritz182)        |
| ✍️ Medium      | [medium.com/@ritviksharma4](https://medium.com/@ritviksharma4)                |
| 🧠 LeetCode    | [leetcode.com/ritviksharma4/](https://leetcode.com/u/ritviksharma4/)    |

---

> Feel free to reach out for collaborations, code reviews, or just to say hi! 🌟


