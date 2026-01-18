import PedidoService from "./pedido.service";
import { PedidoState } from "../domain/pedido.state";
import { PedidoContext } from "../domain/pedido.types";

interface PedidoSessionData {
  state: PedidoState;
  context: PedidoContext;
}

class WhatsAppSessionStore {
  private sessions = new Map<string, PedidoSessionData>();

  get(phone: string): PedidoService | null {
    const data = this.sessions.get(phone);
    if (!data) return null;

    const pedido = new PedidoService(data.context.clienteId);

    // restaura estado
    (pedido as any).state = data.state;
    (pedido as any).context = data.context;

    return pedido;
  }

  set(phone: string, pedido: PedidoService) {
    this.sessions.set(phone, {
      state: pedido.getState(),
      context: pedido.getContext(),
    });
  }

  clear(phone: string) {
    this.sessions.delete(phone);
  }
}

export default new WhatsAppSessionStore();
