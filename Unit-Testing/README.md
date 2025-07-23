# 🧪 End-to-End Testing for Velvet E-Commerce

This repository contains a comprehensive suite of automated end-to-end tests for the **Velvet** e-commerce application, using **Selenium WebDriver**, **Mocha**, and **Chai**. Tests are organized to cover real user interactions across the site and ensure stable, consistent behavior across all major flows.

---

## 🛠️ Tech Stack

- **Test Framework**: [Mocha](https://mochajs.org/)
- **Assertions**: [Chai](https://www.chaijs.com/)
- **Browser Automation**: [Selenium WebDriver](https://www.selenium.dev/)
- **Reporting**: [Mochawesome](https://github.com/adamgruber/mochawesome)

---

## 📁 Test Structure

30+ Unit-Tests are logically grouped by page/feature under the `Tests/` directory.

```
Tests/
│
├── LoginTests/
│   ├── emptyLogin.test.js
│   ├── noPasswordLogin.test.js
│   ├── noUserNameLogin.test.js
│   ├── validLogin.test.js
|
├── HomePage/
│   ├── Footer/
|   │   ├── about.test.js
|   │   ├── contactUs.test.js
|   │   ├── faq.test.js
|   │   ├── journal.test.js
|   │   ├── privacyPolicy.test.js
|   │   ├── shippingReturns.test.js
│   ├── Header/
|   │   ├── about.test.js
|   │   ├── account.test.js
|   │   ├── cart.test.js
|   │   ├── journal.test.js
|   │   ├── search.test.js
│   ├── Main/
|   │   ├── accessories.test.js
|   │   ├── footwear.test.js
|   │   ├── men.test.js
|   │   ├── women.test.js
│
├── Shop/
│   ├── Men/
|   │   ├── AllClothings/
|   │   |  ├── filtering.test.js
|   │   |  ├── quickView.test.js
|   │   |  ├── sorting.test.js
|   │   ├── allClothings.test.js
|   │   ├── jackets.test.js
|   │   ├── sweatshirtsHoodies.test.js
|   │   ├── trousers.test.js
|   │   ├── tshirtsAndShirts.test.js
|
├── CartItems/
│   ├── addProductPage.test.js
│   ├── addQuickView.test.js
│   ├── deleteItem.test.js
│   ├── placeOrder.test.js
```

---

## ✅ Test Scenarios Covered


### 1. **Login: Empty Credentials**
- **Test**: Attempts login with both username and password left blank.
- **Validation**:
  - Clicks login without entering credentials.
  - Confirms error message is displayed for missing fields.

---

### 2. **Login: Missing Password**
- **Test**: Attempts login with username only.
- **Validation**:
  - Enters a valid username.
  - Leaves password blank.
  - Verifies password-required error appears.

---

### 3. **Login: Missing Username**
- **Test**: Attempts login with only password filled.
- **Validation**:
  - Leaves username field blank.
  - Enters password.
  - Asserts error message for missing username.

---

### 4. **Login: Valid Credentials**
- **Test**: Successfully logs in with valid credentials.
- **Validation**:
  - Enters valid username and password.
  - Confirms redirection to user dashboard or home page.

---

### 5. **Footer: About Page Navigation**
- **Test**: Navigates to About page via footer.
- **Validation**:
  - Clicks on About link in the footer.
  - Confirms presence of About page content.

---

### 6. **Footer: Contact Us**
- **Test**: Opens Contact Us page from the footer.
- **Validation**:
  - Clicks Contact Us link.
  - Verifies visibility of form or contact details.

---

### 7. **Footer: FAQ**
- **Test**: Navigates to FAQ section via footer.
- **Validation**:
  - Ensures FAQ link works.
  - Checks that common questions are rendered.

---

### 8. **Footer: Journal Page**
- **Test**: Opens Journal from footer.
- **Validation**:
  - Clicks Journal link.
  - Verifies blog entries are loaded.

---

### 9. **Footer: Privacy Policy**
- **Test**: Views Privacy Policy.
- **Validation**:
  - Clicks link in footer.
  - Asserts legal policy text is displayed.

---

### 10. **Footer: Shipping & Returns**
- **Test**: Checks the Shipping & Returns page.
- **Validation**:
  - Navigates via footer link.
  - Verifies policies are listed.

---

### 11. **Header: About Page Navigation**
- **Test**: Opens About page via header.
- **Validation**:
  - Uses header link to navigate.
  - Confirms expected text appears.

---

### 12. **Header: Account Dropdown**
- **Test**: Interacts with account icon.
- **Validation**:
  - Hovers/clicks account icon.
  - Validates dropdown options display.

---

### 13. **Header: Cart Icon**
- **Test**: Opens cart from header.
- **Validation**:
  - Clicks cart icon.
  - Checks empty cart message or cart item list.

---

### 14. **Header: Journal Link**
- **Test**: Opens Journal via header.
- **Validation**:
  - Clicks Journal in navigation bar.
  - Verifies blog grid loads.

---

### 15. **Header: Search Interaction**
- **Test**: Opens and closes the search dropdown from the header.
- **Validation**:
  - Clicks the magnifying glass icon.
  - Waits for the "What are you looking for?" prompt.
  - Asserts text visibility.
  - Closes dropdown and confirms return to homepage.

---

### 16. **Main: Accessories Section**
- **Test**: Navigates to accessories category.
- **Validation**:
  - Clicks accessories banner.
  - Asserts correct products are shown.

---

### 17. **Main: Footwear Section**
- **Test**: Navigates to footwear section.
- **Validation**:
  - Clicks footwear block.
  - Verifies product images load.

---

### 18. **Main: Men’s Section**
- **Test**: Opens Men’s category from homepage.
- **Validation**:
  - Clicks men’s banner.
  - Confirms redirection to /shop/men.

---

### 19. **Main: Women’s Section**
- **Test**: Navigates to Women’s collection.
- **Validation**:
  - Clicks women’s section on homepage.
  - Asserts correct path and product rendering.

---

### 20. **All Clothings: Filtering by Color**
- **Test**: Applies and clears a color filter.
- **Validation**:
  - Applies black color filter.
  - Waits for product count update.
  - Clears filter and validates reset count.

---

### 21. **All Clothings: Quick View Modal**
- **Test**: Opens and closes quick view of a product.
- **Validation**:
  - Hovers on product.
  - Clicks quick view icon.
  - Waits for modal load.
  - Closes modal and confirms URL.

---

### 22. **All Clothings: Sorting Dropdown**
- **Test**: Sorts products by "Newest First".
- **Validation**:
  - Clicks sort dropdown.
  - Selects "Newest First".
  - Verifies sort order changes.

---

### 23. **Men: All Clothings Page**
- **Test**: Validates default display of Men → All Clothings.
- **Validation**:
  - Checks URL.
  - Waits for item count to stabilize (e.g., 6/87 items).

---

### 24. **Men: Jackets Category**
- **Test**: Opens Jackets category and validates display.
- **Validation**:
  - Clicks Jackets tab.
  - Checks correct products appear.

---

### 25. **Men: Sweatshirts & Hoodies**
- **Test**: Validates hoodie/sweatshirt section.
- **Validation**:
  - Navigates to that subcategory.
  - Verifies header and images.

---

### 26. **Men: Trousers Category**
- **Test**: Loads Trousers under Men.
- **Validation**:
  - Clicks Trousers tab.
  - Checks layout consistency.

---

### 27. **Men: T-Shirts & Shirts**
- **Test**: Displays t-shirts & shirts together.
- **Validation**:
  - Validates combined view of the two subcategories.

---

### 28. **Cart: Add from Product Page**
- **Test**: Adds a jacket from product detail page.
- **Validation**:
  - Navigates to product URL.
  - Clicks “Add to Bag” button.
  - Verifies cart item is added.

---

### 29. **Cart: Add from Quick View**
- **Test**: Adds item to cart via quick view modal.
- **Validation**:
  - Opens modal.
  - Clicks “Add to Bag”.
  - Verifies cart updates.

---

### 30. **Cart: Remove Item**
- **Test**: Deletes an item from the cart.
- **Validation**:
  - Clicks remove/delete icon.
  - Confirms cart reflects change.

---

### 31. **Cart: Place Order**
- **Test**: Simulates placing an order.
- **Validation**:
  - Proceeds to checkout.
  - Verifies order summary/confirmation is shown.

---


## 📊 Test Reports

All tests generate clean and interactive **Mochawesome HTML reports**.

### ➤ To View Report:

After running tests, open:
```
mochawesome-report/mochawesome.html
```

Features:
- ✅ Clean UI
- ✅ Per-test status
- ✅ Screenshots support (optional)
- ✅ Easy to share with stakeholders

---

## 🚀 How to Run Tests

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Tests

```bash
npm test
```

or with Mochawesome explicitly:

```bash
npx mocha tests/**/*.test.js --reporter mochawesome
```

---

## 💡 Tips & Considerations

- Every test includes proper waiting logic (`until.elementLocated`, `until.elementIsVisible`) to handle async UI updates and animations.
- Delays are introduced where animations/loaders require stability.
- CSS selectors and XPath are tuned to be resilient against style-only changes.

---

## 🧑‍💻 Author

**Ritvik Sharma**  
🛍️ Creator of Velvet E-Commerce  
🔗 [ritvik-sharma.com](https://ritvik-sharma.com)