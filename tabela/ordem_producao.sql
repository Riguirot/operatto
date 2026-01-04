CREATE TABLE ordem_producao (
  id_ordem SERIAL PRIMARY KEY,
  id_produto INTEGER NOT NULL,
  quantidade NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  data_inicio TIMESTAMP,
  data_fim TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_ordem_produto
    FOREIGN KEY (id_produto)
    REFERENCES produto(id_produto)
);
