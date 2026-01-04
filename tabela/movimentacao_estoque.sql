CREATE TABLE movimentacao_estoque (
  id_movimentacao SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL,
  quantidade INTEGER NOT NULL,
  data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observacao TEXT,
  id_produto INTEGER NOT NULL,
  CONSTRAINT fk_movimentacao_produto
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);
