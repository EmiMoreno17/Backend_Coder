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

  async updateProduct(id, updatedProductData) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
        console.log("Producto no encontrado");
        return;
      }

      products[productIndex] = { ...products[productIndex], ...updatedProductData };
      await this.saveProducts(products);
      console.log("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  }
 async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.filter((product) => product.id !== id);
      await this.saveProducts(updatedProducts);
      console.log("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
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

async function main() {
  // Agregar productos
  await productManager.addProduct('manzana', 'Descripcion 1', 20, 'imagen.jpg', 'bca321', 50);
  await productManager.addProduct('pera', 'Descripcion 2', 30, 'omagen.jpg', 'ABC123', 30);

  // Obtener y mostrar los productos
  const products = await productManager.getProducts();
  console.log("Productos:", products);

  // Obtener un producto por ID
  const productIdToFind = 2;
  const foundProduct = await productManager.getProductById(productIdToFind);
  if (foundProduct) {
    console.log("Producto encontrado:", foundProduct);
  }

  // Actualizar un producto por ID
  await productManager.updateProduct(1, { price: 15.99, stock: 60 });

  // Eliminar un producto por ID
  await productManager.deleteProduct(2);

  // Mostrar los productos actualizados
  const updatedProducts = await productManager.getProducts();
  console.log("Productos actualizados:", updatedProducts);
}

main().catch((error) => {
  console.error("Error:", error);
});
