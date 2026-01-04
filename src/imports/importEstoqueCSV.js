import fs from "fs";
import csv from "csv-parser";
import { registrarMovimentacao } from "../services/movimentacaoEstoqueService.js";

export async function importarEstoqueCSV(caminhoArquivo) {
  return new Promise((resolve, reject) => {
    const movimentacoes = [];

    fs.createReadStream(caminhoArquivo)
      .pipe(csv())
      .on("data", (row) => {
        movimentacoes.push(row);
      })
      .on("end", async () => {
        try {
          for (const linha of movimentacoes) {
            await registrarMovimentacao({
              id_produto: Number(linha.id_produto),
              tipo: "ENTRADA",
              quantidade: Number(linha.quantidade),
              origem: "IMPORT_CSV",
              observacao: "Carga inicial de estoque"
            });
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
}
