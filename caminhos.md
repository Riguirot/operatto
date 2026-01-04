
./node_modules

./src
├───config
    ├───database.js

├───controllers
    ├───estoqueController.js
    ├───healthController.js
    ├───pedidoController.js
    ├───produtoController.js

├───middleware
    ├───errorHandler.js
    ├───validate.js

├───models
    ├───Cliente.js
    ├───Estoque.js
    ├───ItemPedido
    ├───MovimentacaoEstoque.js
    ├───OrdemProducao.js
    ├───Pedido.js
    ├───Produto.js

├───routes
    ├───estoque.routes.js
    ├───index.js
    ├───pedidos.routes.js
    ├───produtos.routes.js

├───services
    ├───estoqueService.js
    ├───inventarioService.js
    ├───pedidoService.js
    ├───produtoService.js

├───validation
    ├───estoque.schema.js
    ├───pedido.schema.js
    ├───produto.schema.js

├───app.js
├───server.js
├───testeConexao.js

./tabela

├───cliente.sql
├───estoque.sql
├───item_pedido.sql
├───movimentacao_estoque.sql
├───ordem_producao.sql
├───pedido.sql
├───produto.sql

./tests

├───estoque.test.js
├───health.test.js
├───pedido.test.js
├───produto.test.js

./caminhos  --> arvore de esquema das pastas e arquivos

./.gitignore

./ package-lock.json

./ package.json

./ README.md

./server.js  --> duplicado porque estava dando erro ontem.. então mantive um dentro de src e outro na pasta do projeto

