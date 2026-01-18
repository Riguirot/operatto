import PedidoService from "./pedido.service";
import { PedidoState } from "../domain/pedido.state";
import {
  orderChannelConfig,
  OrderChannelMode,
} from "../../../config/orderChannel";
import sessionStore from "./whatsapp-session.store";

/**
 * Produtos básicos (MVP)
 * Depois isso vem do banco
 */
const PRODUTOS_BASICOS = [
  { id: 1, nome: "Bolacha Tradicional de Coco" },
  { id: 2, nome: "Rosquinha de Coco" },
  { id: 3, nome: "Cacetinho de Coco" },
  { id: 4, nome: "Bolacha Amanteigada" },
  { id: 5, nome: "Bolacha Mimosa" },
];

interface WhatsAppInput {
  text?: string;
  button?: string;
}

export class WhatsAppPedidoService {
  /**
   * Entrada principal do WhatsApp
   * @param phone número do cliente (identificador da sessão)
   * @param input mensagem / botão recebido
   */
  handle(phone: string, input: WhatsAppInput): string {
    // 🔑 Se o gestor ligou WEB_ONLY, WhatsApp só envia link
    if (orderChannelConfig.mode === OrderChannelMode.WEB_ONLY) {
      return (
        "👋 Olá!\n" +
        "Os pedidos agora são feitos pelo site 👇\n\n" +
        `🔗 ${orderChannelConfig.webOrderUrl}\n\n` +
        "Se precisar de ajuda, é só chamar."
      );
    }

    // 🧠 Recupera ou cria sessão
    let pedido = sessionStore.get(phone);

    if (!pedido) {
      // clienteId temporário = phone (depois você mapeia para Cliente real)
      pedido = new PedidoService(Number(phone));
    }

    // 🔁 Processa FSM
    const resposta = this.processFSM(pedido, input);

    // 💾 Persistência da sessão
    if (
      pedido.getState() !== PedidoState.CONFIRMADO &&
      pedido.getState() !== PedidoState.CANCELADO
    ) {
      sessionStore.set(phone, pedido);
    } else {
      sessionStore.clear(phone);
    }

    return resposta;
  }

  // =====================
  // FSM / Conversa
  // =====================

  private processFSM(
    pedido: PedidoService,
    input: WhatsAppInput
  ): string {
    const state = pedido.getState();

    switch (state) {
      case PedidoState.INICIO: {
        pedido.dispatch({ type: "INICIAR" });
        return this.msgEscolherProduto();
      }

      case PedidoState.ESCOLHENDO_PRODUTO: {
        if (!input.button) {
          return "Selecione um produto usando os botões 👇";
        }

        const produtoId = Number(input.button);
        const produto = PRODUTOS_BASICOS.find((p) => p.id === produtoId);

        if (!produto) {
          return "❌ Produto inválido. Selecione um produto válido.";
        }

        pedido.dispatch({
          type: "SELECIONAR_PRODUTO",
          produtoId,
        });

        return `📦 *${produto.nome}*\nQuantas unidades deseja?`;
      }

      case PedidoState.DEFININDO_QUANTIDADE: {
        if (!input.text || isNaN(Number(input.text))) {
          return "Informe a quantidade (ex: 10, 20, 50)";
        }

        const quantidade = Number(input.text);

        if (quantidade <= 0) {
          return "A quantidade deve ser maior que zero.";
        }

        pedido.dispatch({
          type: "DEFINIR_QUANTIDADE",
          quantidade,
        });

        return this.msgResumo(pedido);
      }

      case PedidoState.RESUMO: {
        if (input.button === "ADICIONAR") {
          pedido.dispatch({ type: "ADICIONAR_OUTRO" });
          return this.msgEscolherProduto();
        }

        if (input.button === "CONFIRMAR") {
          pedido.dispatch({ type: "CONFIRMAR" });
          return "✅ *Pedido confirmado!* Em breve iniciaremos a produção.";
        }

        if (input.button === "CANCELAR") {
          pedido.dispatch({ type: "CANCELAR" });
          return "❌ Pedido cancelado.";
        }

        return this.msgResumo(pedido);
      }

      case PedidoState.CONFIRMADO:
        return "📦 Seu pedido já foi confirmado.";

      case PedidoState.CANCELADO:
        return "Pedido encerrado.";

      default:
        return "Não entendi sua mensagem.";
    }
  }

  // =====================
  // Mensagens auxiliares
  // =====================

  private msgEscolherProduto(): string {
    const lista = PRODUTOS_BASICOS.map(
      (p) => `${p.id}️⃣ ${p.nome}`
    ).join("\n");

    return (
      "🧺 *Escolha um produto:*\n" +
      lista +
      "\n\n👉 Selecione uma opção"
    );
  }

  private msgResumo(pedido: PedidoService): string {
    const itens = pedido.getContext().itens;

    const resumo = itens
      .map((item, index) => {
        const produto = PRODUTOS_BASICOS.find(
          (p) => p.id === item.produtoId
        );
        return `${index + 1}. ${produto?.nome} — ${item.quantidade}`;
      })
      .join("\n");

    return (
      "🧾 *Resumo do pedido*\n" +
      resumo +
      "\n\n" +
      "👉 O que deseja fazer?\n" +
      "ADICIONAR | CONFIRMAR | CANCELAR"
    );
  }
}

export default WhatsAppPedidoService;
