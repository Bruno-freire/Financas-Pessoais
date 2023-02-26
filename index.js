let transactions = []

function createTransactionContainer(id){
  const container = document.createElement('div')
  container.classList.add('transaction')
  container.id = `transaction-${id}`
  return container
}

function createTransactionTitle(title){
  const span = document.createElement('span')
  span.classList.add('transaction-title')
  span.textContent = title
  return span
}

function createTransactionAmount(amount){
  const span = document.createElement('span')
  span.classList.add('transaction-amount')
  
  const formarter = Intl.NumberFormat('pt-BR', {
    compactDisplay: 'long',
    style: 'currency',
    currency: 'BRL'
  })
  const formartedAmount = formarter.format(amount)
  span.textContent = formartedAmount
  return span
}

function renderTransaction(transaction){
  const container = createTransactionContainer(transaction.id)
  const title = createTransactionTitle(transaction.name)
  const amount = createTransactionAmount(transaction.amount)

  const section = document.getElementById('transactions')
  container.append(title, amount)
  section.append(container)
}

async function fetchTransactions(){
  return await fetch('http://localhost:3000/transactions').then(t => t.json())
}

async function setup(){
  const results = await fetchTransactions()
  transactions.push(...results)
  transactions.forEach(renderTransaction)
}

document.addEventListener('DOMContentLoaded', setup)