CREATE TABLE estoque (
  id_estoque SERIAL PRIMARY KEY,
  quantidade_atual INTEGER NOT NULL DEFAULT 0,
  id_produto INTEGER NOT NULL UNIQUE,
  CONSTRAINT fk_estoque_produto
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);
