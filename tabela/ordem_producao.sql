CREATE TABLE ordem_producao (
  id_ordem_producao SERIAL PRIMARY KEY,
  quantidade_planejada INTEGER NOT NULL,
  quantidade_produzida INTEGER,
  status VARCHAR(20) NOT NULL,
  data_inicio TIMESTAMP,
  data_fim TIMESTAMP,
  id_pedido INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ordem_pedido
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);
