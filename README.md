# Inventory Manager

**Inventory Manager** is a web app designed for the Breakable-Toy-I module. 
The system allows creating, updating, filtering, and sorting products, 
as well as tracking key metrics like total stock, inventory value, and average price.

The project was built with a focus of usability, clear data visualization and 
responsiveness, for an easy convenience store inventory management (and It's supposed to be bug free). 
It supports pagination, search filters, product availability toggling, and sorting by multiple columns.

## Tech Stack

- **Frontend:** React.js + TypeScript
- **State Management:** React Context 
- **UI Components:** Custom CSS and AntDesign
- **Backend:** REST API with CRUD and stock control endpoints
[InventoryManagerBS](https://github.com/technologic-technologic/InventoryManagerBS.git)

## Backend API (Expected communications)

Business service git URL: https://github.com/technologic-technologic/InventoryManagerBS.git

The frontend expects the following API endpoints:

- `GET /products` – List all products with support pagination
- `POST /products` – Create a new product with validation
- `PUT /products/{id}` – Update an existing product
- `POST /products/{id}/outofstock` – Mark product as out of stock (stock = 0)
- `PUT /products/{id}/instock` – Restore product to in-stock (stock = 10)
- `GET /products/summary` – List a summary for the categories of products in stock
- `GET /products/filters` – List products with support for filtering, sorting, and pagination
- `GET /products/categories` – List categories of products

## Getting Started

To run the frontend locally:

```bash
# go to directory from repo location
cd inventory-manager
```
```bash
# Install dependencies
npm install
```
```bash
# Run the app on port 8080
npm run dev
```

```bash
# Run tests manually
npm run test 
```
