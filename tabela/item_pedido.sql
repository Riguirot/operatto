CREATE TABLE item_pedido (
  id_item SERIAL PRIMARY KEY,
  id_pedido INTEGER NOT NULL,
  id_produto INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_item_pedido
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),

  CONSTRAINT fk_item_produto
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

