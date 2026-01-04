import fs from "fs";
import csv from "csv-parser";
import { registrarMovimentacao } from "../services/movimentacaoEstoqueService.js";
import { movimentacaoSchema } from "../validation/movimentacao.schema.js";

export async function importarEstoqueCSV(caminhoArquivo) {
  return new Promise((resolve, reject) => {
    const linhas = [];

    fs.createReadStream(caminhoArquivo)
      .pipe(csv())
      .on("data", (row) => {
        linhas.push(row);
      })
      .on("end", async () => {
        try {
          for (const linha of linhas) {
            const dados = {
              id_produto: Number(linha.id_produto),
              tipo: "ENTRADA",
              quantidade: Number(linha.quantidade),
              origem: "IMPORT_CSV",
              observacao: "Carga inicial de estoque"
            };

            // ✅ valida antes de mexer no banco
            movimentacaoSchema.parse(dados);

            // ✅ regra de negócio centralizada
            await registrarMovimentacao(dados);
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });
}
