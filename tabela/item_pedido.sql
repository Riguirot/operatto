CREATE TABLE item_pedido (
  id_item_pedido SERIAL PRIMARY KEY,
  quantidade INTEGER NOT NULL,
  preco_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  id_pedido INTEGER NOT NULL,
  id_produto INTEGER NOT NULL,
  CONSTRAINT fk_item_pedido_pedido
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  CONSTRAINT fk_item_pedido_produto
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);
