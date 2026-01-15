import OrdemProducao from "../models/OrdemProducao";

interface CriarOrdemDTO {
  id_produto: number;
  quantidade: number;
}

class OrdemProducaoService {
  static async criar({ id_produto, quantidade }: CriarOrdemDTO) {
    return OrdemProducao.criar({
      id_produto,
      quantidade,
    });
  }

  static async iniciar(id_ordem: number) {
    return OrdemProducao.atualizarStatus(
      id_ordem,
      "EM_PRODUCAO"
    );
  }

  static async finalizar(id_ordem: number) {
    return OrdemProducao.finalizar(id_ordem);
  }

  static async listar() {
    return OrdemProducao.listar();
  }
}

export default OrdemProducaoService;
