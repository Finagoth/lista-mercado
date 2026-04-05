'use strict';

const CHAVE_ARMAZENAMENTO = 'lista_compras_itens';

let itens  = [];
let proximoId = 1;

const inputNome    = document.getElementById('prod-nome');
const inputQtd     = document.getElementById('prod-qtd');
const inputPreco   = document.getElementById('prod-preco');
const btnAdicionar = document.getElementById('btn-adicionar');
const btnQtdMenos  = document.getElementById('qtd-menos');
const btnQtdMais   = document.getElementById('qtd-mais');
const listaItens   = document.getElementById('lista-itens');
const estadoVazio  = document.getElementById('estado-vazio');
const colCabecalhos= document.getElementById('col-cabecalhos');
const barraTotal   = document.getElementById('barra-total');
const totalValor   = document.getElementById('total-valor');
const totalResumo  = document.getElementById('total-resumo');
const contagemItens= document.getElementById('contagem-itens');
const toastEl      = document.getElementById('toast');
const btnLimpar    = document.getElementById('btn-limpar');

function iniciar() {
  carregarDoArmazenamento();
  vincularEventos();
  renderizar();
}

function vincularEventos() {
  btnAdicionar.addEventListener('click', adicionarItem);
  btnLimpar.addEventListener('click', limparTudo);

  btnQtdMenos.addEventListener('click', () => ajustarQtd(-1));
  btnQtdMais.addEventListener('click',  () => ajustarQtd(+1));

  inputNome.addEventListener('keydown', e => {
    if (e.key === 'Enter') inputQtd.focus();
  });
  inputQtd.addEventListener('keydown', e => {
    if (e.key === 'Enter') inputPreco.focus();
  });
  inputPreco.addEventListener('keydown', e => {
    if (e.key === 'Enter') adicionarItem();
  });

  inputQtd.addEventListener('change', () => {
    if (parseInt(inputQtd.value) < 1 || isNaN(parseInt(inputQtd.value))) {
      inputQtd.value = 1;
    }
  });
}

function ajustarQtd(delta) {
  const atual = parseInt(inputQtd.value) || 1;
  inputQtd.value = Math.max(1, atual + delta);
}

function adicionarItem() {
  const nome  = inputNome.value.trim();
  const qtd   = parseInt(inputQtd.value) || 1;
  const preco = parseFloat(inputPreco.value);

  if (!nome) {
    sacudir(inputNome);
    exibirToast('⚠️ Informe o nome do produto');
    inputNome.focus();
    return;
  }
  if (isNaN(preco) || preco < 0) {
    sacudir(inputPreco);
    exibirToast('⚠️ Informe um preço válido');
    inputPreco.focus();
    return;
  }

  itens.push({ id: proximoId++, nome, qtd, preco });

  inputNome.value  = '';
  inputQtd.value   = 1;
  inputPreco.value = '';
  inputNome.focus();

  salvarNoArmazenamento();
  renderizar();
  exibirToast('✅ Produto adicionado!');
}

function removerItem(id) {
  itens = itens.filter(i => i.id !== id);
  salvarNoArmazenamento();
  renderizar();
  exibirToast('🗑 Item removido');
}

function alterarQtd(id, delta) {
  const item = itens.find(i => i.id === id);
  if (!item) return;
  item.qtd = Math.max(1, item.qtd + delta);
  salvarNoArmazenamento();
  renderizarItem(id);
  renderizarTotais();
}

function iniciarEdicao(id) {
  const item = itens.find(i => i.id === id);
  if (!item) return;

  const li = document.getElementById('item-' + id);
  li.classList.add('editando');

  li.querySelector('.item-visualizacao').style.display = 'none';
  const divEdicao = li.querySelector('.item-edicao');
  divEdicao.style.display = 'flex';

  divEdicao.querySelector('.edit-nome').value  = item.nome;
  divEdicao.querySelector('.edit-qtd').value   = item.qtd;
  divEdicao.querySelector('.edit-preco').value = item.preco.toFixed(2);

  divEdicao.querySelector('.edit-nome').focus();
}

function cancelarEdicao(id) {
  const li = document.getElementById('item-' + id);
  li.classList.remove('editando');
  li.querySelector('.item-visualizacao').style.display = 'flex';
  li.querySelector('.item-edicao').style.display = 'none';
}

function salvarEdicao(id) {
  const li       = document.getElementById('item-' + id);
  const novoNome = li.querySelector('.edit-nome').value.trim();
  const novaQtd  = parseInt(li.querySelector('.edit-qtd').value) || 1;
  const novoPreco= parseFloat(li.querySelector('.edit-preco').value);

  if (!novoNome) {
    sacudir(li.querySelector('.edit-nome'));
    exibirToast('⚠️ Nome não pode ficar vazio');
    return;
  }
  if (isNaN(novoPreco) || novoPreco < 0) {
    sacudir(li.querySelector('.edit-preco'));
    exibirToast('⚠️ Preço inválido');
    return;
  }

  const item = itens.find(i => i.id === id);
  item.nome  = novoNome;
  item.qtd   = Math.max(1, novaQtd);
  item.preco = novoPreco;

  salvarNoArmazenamento();
  renderizar();
  exibirToast('✏️ Item atualizado!');
}

function limparTudo() {
  if (itens.length === 0) return;
  if (!confirm('Deseja limpar toda a lista?')) return;
  itens = [];
  salvarNoArmazenamento();
  renderizar();
  exibirToast('🗑 Lista limpa!');
}

function renderizar() {
  listaItens.innerHTML = '';

  const total = itens.length > 0;

  estadoVazio.style.display   = total ? 'none'  : 'block';
  colCabecalhos.style.display = total ? 'flex'  : 'none';
  barraTotal.style.display    = total ? 'flex'  : 'none';

  contagemItens.textContent = itens.length === 0 ? '0 itens'
                            : itens.length === 1 ? '1 item'
                            : `${itens.length} itens`;

  itens.forEach((item, idx) => {
    listaItens.appendChild(construirElementoItem(item, idx));
  });

  renderizarTotais();
}

function renderizarItem(id) {
  const item  = itens.find(i => i.id === id);
  const idx   = itens.indexOf(item);
  const liAtual = document.getElementById('item-' + id);
  if (!liAtual || !item) return;
  liAtual.replaceWith(construirElementoItem(item, idx));
}

function construirElementoItem(item, idx) {
  const subtotal = item.qtd * item.preco;

  const li = document.createElement('li');
  li.className = 'item';
  li.id = 'item-' + item.id;

  li.innerHTML = `
    <div class="item-visualizacao">
      <div class="item-numero">${idx + 1}</div>

      <div class="item-info">
        <div class="item-nome" title="${escaparHTML(item.nome)}">${escaparHTML(item.nome)}</div>
      </div>

      <div class="item-qtd-wrap">
        <div class="item-qtd-ctrl">
          <button data-id="${item.id}" data-delta="-1" title="Diminuir quantidade">−</button>
          <span class="qtd-exibicao">${item.qtd}</span>
          <button data-id="${item.id}" data-delta="1" title="Aumentar quantidade">+</button>
        </div>
      </div>

      <div class="item-subtotal">
        R$ ${formatarPreco(subtotal)}
        <span class="item-preco-unit">R$ ${formatarPreco(item.preco)}/un</span>
      </div>

      <div class="item-acoes">
        <button class="btn btn-sm btn-editar"  data-editar="${item.id}"  title="Editar">✏️</button>
        <button class="btn btn-sm btn-remover" data-remover="${item.id}" title="Remover">✕</button>
      </div>
    </div>

    <div class="item-edicao">
      <div class="campos-edicao">
        <div class="campo-edicao ef-nome">
          <label>Produto</label>
          <input type="text" class="edit-nome" placeholder="Nome do produto"/>
        </div>
        <div class="campo-edicao ef-qtd">
          <label>Qtd.</label>
          <input type="number" class="edit-qtd" min="1" placeholder="1"/>
        </div>
        <div class="campo-edicao ef-preco">
          <label>Preço unit.</label>
          <input type="number" class="edit-preco" min="0" step="0.01" placeholder="0,00"/>
        </div>
      </div>
      <div class="acoes-edicao">
        <button class="btn btn-sm btn-salvar"   data-salvar="${item.id}"   title="Salvar">✓ Salvar</button>
        <button class="btn btn-sm btn-cancelar" data-cancelar="${item.id}" title="Cancelar">✕</button>
      </div>
    </div>
  `;

  li.addEventListener('click', tratarCliqueItem);

  const editNome  = li.querySelector('.edit-nome');
  const editQtd   = li.querySelector('.edit-qtd');
  const editPreco = li.querySelector('.edit-preco');
  editNome.addEventListener('keydown',  e => { if (e.key === 'Enter') editQtd.focus(); });
  editQtd.addEventListener('keydown',   e => { if (e.key === 'Enter') editPreco.focus(); });
  editPreco.addEventListener('keydown', e => { if (e.key === 'Enter') salvarEdicao(item.id); });

  return li;
}

function tratarCliqueItem(e) {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.dataset.delta !== undefined) {
    alterarQtd(parseInt(btn.dataset.id), parseInt(btn.dataset.delta));
    return;
  }
  if (btn.dataset.editar   !== undefined) { iniciarEdicao(parseInt(btn.dataset.editar));    return; }
  if (btn.dataset.remover  !== undefined) { removerItem(parseInt(btn.dataset.remover));     return; }
  if (btn.dataset.salvar   !== undefined) { salvarEdicao(parseInt(btn.dataset.salvar));     return; }
  if (btn.dataset.cancelar !== undefined) { cancelarEdicao(parseInt(btn.dataset.cancelar)); return; }
}

function renderizarTotais() {
  const total    = itens.reduce((s, i) => s + i.qtd * i.preco, 0);
  const totalQtd = itens.reduce((s, i) => s + i.qtd, 0);
  const qtdItens = itens.length;

  totalValor.textContent = `R$ ${formatarPreco(total)}`;
  totalResumo.textContent = qtdItens > 0
    ? `${qtdItens} ${qtdItens === 1 ? 'produto' : 'produtos'} · ${totalQtd} ${totalQtd === 1 ? 'unidade' : 'unidades'}`
    : '';
}

function salvarNoArmazenamento() {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify({ itens, proximoId }));
  } catch (erro) {
    console.warn('Não foi possível salvar:', erro);
  }
}

function carregarDoArmazenamento() {
  try {
    const bruto = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (!bruto) return;
    const dados = JSON.parse(bruto);
    if (Array.isArray(dados.itens)) {
      itens = dados.itens;
      proximoId = (dados.proximoId && Number.isInteger(dados.proximoId))
        ? dados.proximoId
        : itens.reduce((max, i) => Math.max(max, i.id), 0) + 1;
    }
  } catch (erro) {
    console.warn('Não foi possível carregar:', erro);
    itens = [];
    proximoId = 1;
  }
}

function formatarPreco(valor) {
  return valor.toFixed(2).replace('.', ',');
}

function escaparHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sacudir(el) {
  el.classList.remove('sacudir');
  void el.offsetWidth;
  el.classList.add('sacudir');
  el.addEventListener('animationend', () => el.classList.remove('sacudir'), { once: true });
}

let timerToast;
function exibirToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('visivel');
  clearTimeout(timerToast);
  timerToast = setTimeout(() => toastEl.classList.remove('visivel'), 2400);
}

iniciar();
