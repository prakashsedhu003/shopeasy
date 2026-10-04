const express = require("express");
const  getConnection = require("../db");

const router = express.Router();

// Get all products from Oracle
router.get("/products", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT
                product_id,
                name,
                description,
                price,
                image,
                category,
                stock
            FROM products
            ORDER BY product_id
        `);

        const products = result.rows.map(row => ({
            id: row[0],
            name: row[1],
            description: row[2],
            price: row[3],
            image: row[4],
            category: row[5],
            stock: row[6]
        }));

        res.json(products);

    } catch (error) {
        console.error("Error loading products:", error);

        res.status(500).json({
            message: "Failed to load products"
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// Get one product from Oracle
router.get("/products/:id", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const result = await connection.execute(
            `
            SELECT
                product_id,
                name,
                description,
                price,
                image,
                category,
                stock
            FROM products
            WHERE product_id = :id
            `,
            {
                id: Number(req.params.id)
            }
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const row = result.rows[0];

        res.json({
            id: row[0],
            name: row[1],
            description: row[2],
            price: row[3],
            image: row[4],
            category: row[5],
            stock: row[6]
        });

    } catch (error) {
        console.error("Error loading product:", error);

        res.status(500).json({
            message: "Failed to load product"
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

module.exports = router;