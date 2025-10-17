# Inventory Manager

**Inventory Manager** is a web app designed for the Breakable-Toy-I module. 
The system allows creating, updating, filtering, and sorting products, 
as well as tracking key metrics like total stock, inventory value, and average price.

The project was built with a focus on usability, clear data visualization, 
responsiveness and its supposed to be bug free. It supports pagination, 
search filters, product availability toggling, and sorting by multiple columns.

## Tech Stack

- **Frontend:** React.js + TypeScript
- **State Management:** React Context 
- **UI Components:** Custom CSS and AntDesign
- **Backend:** REST API with CRUD and stock control endpoints
[InventoryManagerBS](https://github.com/technologic-technologic/InventoryManagerBS.git)

## Features

- **Product CRUD**

- **Filtering & Searching**

- **Sorting**

- **Stock Management**

- **Inventory Metrics**

- **Pagination**

- **Visual Indicators (Optional)**

## Backend API (Expected)

Business service git URL: https://github.com/technologic-technologic/InventoryManagerBS.git

The frontend expects the following API endpoints:

- `GET /products` – List products with support for filtering, sorting, and pagination
- `POST /products` – Create a new product with validation
- `PUT /products/{id}` – Update an existing product
- `POST /products/{id}/outofstock` – Mark product as out of stock (stock = 0)
- `PUT /products/{id}/instock` – Restore product to in-stock (stock = 10)

## Getting Started

To run the frontend locally:

```bash
# Install dependencies
npm install

# Run the app on port 8080
npm run start
```
```bash
# Run all tests
npm run tests
```
