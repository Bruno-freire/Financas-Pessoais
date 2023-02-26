let transactions = []
const formarter = Intl.NumberFormat('pt-BR', {
  compactDisplay: 'long',
  style: 'currency',
  currency: 'BRL'
})

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
  
  const formartedAmount = formarter.format(amount)

  if(amount > 0 ){
    span.classList.add('credit')
    span.textContent = `${formartedAmount} C`
  }else{
    span.classList.add('debit')
    span.textContent = `${formartedAmount} D`
  }
  return span
}

function createEditTransactionBtn(transaction){
  const editBtn = document.createElement('button')
  editBtn.classList.add('edit-btn')
  editBtn.textContent = 'Editar'

  editBtn.addEventListener('click', () => {
    document.getElementById('id').value = transaction.id
    document.getElementById('name').value = transaction.name
    document.getElementById('amount').value = transaction.amount
  })

  return editBtn
}

function createDeleteTransaction(transaction){
  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('delete-btn')
  deleteBtn.textContent = 'Deletar'
  deleteBtn.addEventListener('click', async () => {
    await fetch(`http://localhost:3000/transactions/${transaction.id}`, {
      method: 'DELETE'
    })
    transaction.remove()
  })
  return deleteBtn
}

function updateBalance(){
  const balance = document.getElementById('balance')
  const fullAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)

  const formartedAmount = formarter.format(fullAmount)
  balance.textContent = formartedAmount
}

async function saveTransaction(ev){
  ev.preventDefault()

  const name = document.getElementById('name').value
  const amount = parseFloat(document.getElementById('amount').value)
  const id = document.getElementById('id').value

  if(id){
    await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name,amount})
    })
  }else{
    await fetch('http://localhost:3000/transactions', {
    method: 'POST',
    body: JSON.stringify({name,amount}),
    headers: {'Content-Type': 'application/json'}
  })
  }
  
  updateBalance()
}

function renderTransaction(transaction){
  const container = createTransactionContainer(transaction.id)
  const title = createTransactionTitle(transaction.name)
  const amount = createTransactionAmount(transaction.amount)
  const editBtn = createEditTransactionBtn(transaction)
  const deleteBtn = createDeleteTransaction(transaction)

  const section = document.getElementById('transactions')
  container.append(title, amount,editBtn,deleteBtn)
  section.append(container)
  updateBalance()
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
document.querySelector('form').addEventListener('submit', saveTransaction)