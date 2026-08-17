import { HomePage } from "./pages/homePage.js";
import { Router } from "./router.js";

const container = document.querySelector("#app");

const routes = {
  "/": HomePage,
//   "/products": ProductsPage,
};

const router = new Router(container, routes);