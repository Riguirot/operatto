import { importarEstoqueCSV } from "./importEstoqueCSV.js";

await importarEstoqueCSV("./dados/estoque_inicial.csv");

console.log("Importação concluída com sucesso");
process.exit();
