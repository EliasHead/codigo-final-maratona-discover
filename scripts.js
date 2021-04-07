const Modal = {
    open() {
        // Abrir modal
        // adiconar a class active do modal
        document
            .querySelector('.Modal-overlay')
            .classList
            .add('active')
    },
    close() {
        // Abrir modal
        // remover a class active do modal
        document
            .querySelector('.Modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(trasactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(trasactions))
    }

}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0; 
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0 ){
                income += transaction.amount;
            }
        })
        return income;
    },
    // somar as saidas
    expenses() {
        let expense = 0; 
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0 ){
                expense += transaction.amount;
            }
        })
        return expense;
    },
    //total
    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.Date}</td>
            <td>
            <i onclick="Transaction.remove(${index})" class="fas fa-minus-circle"></i>
            </td>
        `
        return html
    },

    
    upDateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount (value){
        value = Number(value) * 100
        
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g,"")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return signal + value

    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const { description, amount, date} = Form.getValues()
        
        if (    description.trim() === "" ||
                amount.trim() === "" ||
                date.trim() === "") {
                        throw new Error("Por favor, preencher todos os campos")
                }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()
        
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },


    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    }, 

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

Storage.get()

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.upDateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()



//Transaction.remove(0)
