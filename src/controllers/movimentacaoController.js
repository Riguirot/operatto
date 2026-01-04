async function entrada(req, res, next) {
  try {
    const resultado = await MovimentacaoEstoque.registrar(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const movs = await MovimentacaoEstoque.listarPorProduto(
      Number(req.params.idProduto)
    );
    res.json(movs);
  } catch (err) {
    next(err);
  }
}

export default {
  entrada,
  listar
};
