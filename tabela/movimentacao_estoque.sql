CREATE TABLE movimentacao_estoque (
  id_movimentacao SERIAL PRIMARY KEY,
  id_produto INTEGER NOT NULL,
  id_estoque INTEGER NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ENTRADA', 'SAIDA')),
  quantidade NUMERIC(10,2) NOT NULL,
  origem VARCHAR(30),
  observacao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_mov_produto
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto),

  CONSTRAINT fk_mov_estoque
    FOREIGN KEY (id_estoque) REFERENCES estoque(id_estoque)
);
