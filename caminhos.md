# Estrutura do Projeto Operatto

> Documento de referência da árvore de diretórios e arquivos do projeto **Operatto**.
> Atualizado após a implementação da importação de estoque via CSV e ajustes de arquitetura.

---

## 📁 Raiz do projeto

```
Operatto/
├── node_modules/               # Dependências (ignorado pelo git)
├── dados/                      # Dados operacionais (IGNORADO)
│   └── estoque_inicial.csv     # Exemplo de carga inicial de estoque
├── tabela/                     # Scripts SQL de criação do banco
│   ├── cliente.sql
│   ├── estoque.sql
│   ├── item_pedido.sql
│   ├── movimentacao_estoque.sql
│   ├── ordem_producao.sql
│   ├── pedido.sql
│   └── produto.sql
├── tests/                      # Testes automatizados
│   ├── estoque.test.js
│   ├── health.test.js
│   ├── pedido.test.js
│   └── produto.test.js
├── src/
│   ├── config/
│   │   └── database.js         # Configuração do PostgreSQL
│   ├── controllers/            # Controllers (camada HTTP)
│   │   ├── estoqueController.js
│   │   ├── healthController.js
│   │   ├── pedidoController.js
│   │   └── produtoController.js
│   ├── imports/                # Importações administrativas (CSV)
│   │   ├── importEstoqueCSV.js
│   │   ├── importProdutosCSV.js
│   │   └── runImport.js         # Runner manual de importação
│   ├── middlewares/             # Middlewares globais
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/                 # Modelos de domínio (DTO / referência)
│   │   ├── Cliente.js
│   │   ├── Estoque.js
│   │   ├── ItemPedido.js
│   │   ├── MovimentacaoEstoque.js
│   │   ├── OrdemProducao.js
│   │   ├── Pedido.js
│   │   └── Produto.js
│   ├── routes/                 # Rotas da API
│   │   ├── estoque.routes.js
│   │   ├── movimentacao.routes.js
│   │   ├── pedidos.routes.js
│   │   ├── produtos.routes.js
│   │   └── index.js
│   ├── services/               # Regras de negócio (core do sistema)
│   │   ├── estoqueService.js
│   │   ├── inventarioService.js
│   │   ├── movimentacaoEstoqueService.js
│   │   ├── pedidoService.js
│   │   └── produtoService.js
│   ├── validation/             # Schemas de validação
│   │   ├── estoque.schema.js
│   │   ├── pedido.schema.js
│   │   └── produto.schema.js
│   ├── app.js                  # Configuração do Express
│   └── testeConexao.js          # Teste manual de conexão com o banco
├── server.js                   # Bootstrap da aplicação (ÚNICO)
├── .gitignore
├── caminhos.md                 # Este documento
├── package.json
├── package-lock.json
└── README.md
```

---

## 📌 Observações importantes

- A pasta `dados/` é **ignorada pelo Git** e usada apenas para arquivos de importação.
- A importação via CSV reutiliza o `movimentacaoEstoqueService`, garantindo integridade.
- O projeto segue separação clara de camadas: **routes → controllers → services → banco**.
- Existe **apenas um `server.js`** na raiz, responsável por subir a API.

---

## 🏁 Status atual

- ✔ Estrutura base da API definida
- ✔ PostgreSQL integrado
- ✔ Importação de estoque via CSV funcionando
- ✔ Arquitetura preparada para validações, rotas e exportações

