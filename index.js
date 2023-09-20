// EJERCICIO PARA ENTREGAR



const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.nextProductId = 1;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      const products = await this.getProducts();

      if (products.some((product) => product.code === code)) {
        console.log("El código ya está en uso. Debe ser único.");
        return;
      }

      const newProduct = {
        id: this.nextProductId++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      products.push(newProduct);
      await this.saveProducts(products);
      console.log("Producto agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === id);
      if (!product) {
        console.log("Producto no encontrado");
        return null;
      }
      return product;
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
    }
  }

  async saveProducts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }
}

const productManager = new ProductManager('productos.json');

// Agregar productos



// Obtener y mostrar los productos
const products = productManager.getProducts();
console.log(products);

// Obtener un producto por ID
const productIdToFind = 2;
const foundProduct = productManager.getProductById(productIdToFind);
if (foundProduct) {
  console.log("Producto encontrado:", foundProduct);
}
