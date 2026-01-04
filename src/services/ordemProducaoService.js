import OrdemProducao from "../models/OrdemProducao.js";

class OrdemProducaoService {
  static async criar({ id_produto, quantidade }) {
    return OrdemProducao.criar({
      id_produto,
      quantidade
    });
  }

  static async iniciar(id_ordem) {
    return OrdemProducao.atualizarStatus(
      id_ordem,
      "EM_PRODUCAO"
    );
  }

  static async finalizar(id_ordem) {
    return OrdemProducao.finalizar(id_ordem);
  }

  static async listar() {
    return OrdemProducao.listar();
  }
}

export default OrdemProducaoService;
