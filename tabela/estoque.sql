CREATE TABLE estoque (
  id_estoque SERIAL PRIMARY KEY,
  id_produto INTEGER NOT NULL,
  quantidade_atual NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_estoque_produto
    FOREIGN KEY (id_produto)
    REFERENCES produto(id_produto)
);
