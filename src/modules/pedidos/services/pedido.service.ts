import { PedidoState, PedidoEvent } from "../domain/pedido.state";
import { PedidoContext } from "../domain/pedido.types";
import AppError from "../../../utils/AppError";

export class PedidoService {
  private state: PedidoState;
  private context: PedidoContext;

  constructor(clienteId: number) {
    this.state = PedidoState.INICIO;
    this.context = {
      clienteId,
      itens: [],
    };
  }

  getState() {
    return this.state;
  }

  getContext() {
    return this.context;
  }

  dispatch(event: PedidoEvent) {
    switch (this.state) {
      case PedidoState.INICIO:
        if (event.type === "INICIAR") {
          this.state = PedidoState.ESCOLHENDO_PRODUTO;
          return;
        }
        break;

      case PedidoState.ESCOLHENDO_PRODUTO:
        if (event.type === "SELECIONAR_PRODUTO") {
          this.context.produtoAtual = event.produtoId;
          this.state = PedidoState.DEFININDO_QUANTIDADE;
          return;
        }
        break;

      case PedidoState.DEFININDO_QUANTIDADE:
        if (event.type === "DEFINIR_QUANTIDADE") {
          if (!this.context.produtoAtual) {
            throw new AppError("Produto não selecionado", 400);
          }

          this.context.itens.push({
            produtoId: this.context.produtoAtual,
            quantidade: event.quantidade,
          });

          this.context.produtoAtual = undefined;
          this.state = PedidoState.RESUMO;
          return;
        }
        break;

      case PedidoState.RESUMO:
        if (event.type === "ADICIONAR_OUTRO") {
          this.state = PedidoState.ESCOLHENDO_PRODUTO;
          return;
        }

        if (event.type === "CONFIRMAR") {
          this.state = PedidoState.CONFIRMADO;
          return;
        }

        if (event.type === "CANCELAR") {
          this.state = PedidoState.CANCELADO;
          return;
        }
        break;
    }

    throw new AppError(
      `Evento ${event.type} inválido no estado ${this.state}`,
      400
    );
  }
}

export default PedidoService;
