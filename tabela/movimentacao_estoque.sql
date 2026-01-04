CREATE TABLE movimentacao_estoque (
  id_movimentacao SERIAL PRIMARY KEY,
  id_produto INTEGER NOT NULL,
  tipo VARCHAR(10) NOT NULL,
  quantidade NUMERIC NOT NULL,
  origem VARCHAR(50),
  observacao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_mov_produto
    FOREIGN KEY (id_produto)
    REFERENCES produto(id_produto)
);

