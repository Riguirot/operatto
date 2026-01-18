export enum OrderChannelMode {
  WHATSAPP_INTERATIVO = "WHATSAPP_INTERATIVO",
  WEB_ONLY = "WEB_ONLY",
}

export const orderChannelConfig = {
  mode: OrderChannelMode.WHATSAPP_INTERATIVO,
  webOrderUrl: "https://pedido.operatto.com/pedidos/web",
};
