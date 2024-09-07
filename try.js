//import * from './xrpl-latest-min.js';

temp_disp = document.body.querySelector("#temperatureDisplay");
transactionArea_textarea = document.body.querySelector('#transactionArea-textarea');
checkbox = document.body.querySelector("#myCheckbox");

transactionArea_textarea.addEventListener('input', () => {
    console.log("input event fired");
    if (textarea.scrollTop + textarea.clientHeight >= textarea.scrollHeight) {
        textarea.scrollTop = textarea.scrollHeight;
    }
});


console.assert (temp_disp != undefined, "can't find temp displauy");


//const worker = new Worker('/home/alberto/temp_worker.js');

//const ws = new WebSocket ('ws://127.0.0.1:3000');

// ws.onopen = () => {
//     console.log("socket  opened to 127.0.0.1:3000");
//     ws.send ("hola from webbrowser");
// }


// ws.onmessage = (event) => {
//     //const messagesDiv = document.getElementById('messages');
//     const message = event.data;
//     if (temp_disp != undefined)
// 	temp_disp.value = message;
//     else
// 	console.log ("Error retrieving temperatureDisplay element");

//     //messagesDiv.innerHTML += `<p>${message}</p>`;
// };

// document.getElementById('sendButton').addEventListener('click', () => {
//     const messageInput = document.getElementById('messageInput');
//     const message = messageInput.value;
//     ws.send(message);
//     messageInput.value = '';
// });

// let temp_query_interval = setInterval (() =>
// 				       {
// 					   if (ws.readyState == WebSocket.OPEN){
// 					       ws.send("temperature-update");
// 					   }
// 				       }
// 				       , 500);




// Define the network client
const client = new xrpl.Client("wss://s1.ripple.com/")
const client2 = new xrpl.Client("wss://s2.ripple.com/")

async function main() {
    await client.connect()
    await client2.connect()
    // ... custom code goes here
    client.request({
	"command": "subscribe",
	"streams": ["ledger", "transactions"]
    })



    client.on ("transaction", async (tx) => {
	const transaction = tx.transaction;
	if (transaction.TransactionType === 'Payment'){
	    //console.log ("TYPE => " + transaction.TransactionType + " From: " + transaction.Account + " To: " + transaction.Destination + " Amount: " + JSON.stringify(transaction.Amount));
	    transactionArea_textarea.value += `TYPE =>  ${transaction.TransactionType} From: ${transaction.Account} To: ${transaction.Destination} Amount: ${JSON.stringify(transaction.Amount)}\n`;
	} else if (transaction.TransactionType === 'OfferCreate'){
	    //console.log ("TYPE => " + transaction.TransactionType + " TakerGets: " + JSON.stringify(transaction.TakerGets) + " TakerOffers: " + JSON.stringify(transaction.TakerPays));
	    transactionArea_textarea.value += `TYPE => ${transaction.TransactionType} TakerGets: ${JSON.stringify(transaction.TakerGets)} TakerOffers: ${JSON.stringify(transaction.TakerPays)}\n`;
	}
	if (checkbox.checked){
	    if (transactionArea_textarea.scrollTop + transactionArea_textarea.clientHeight < transactionArea_textarea.scrollHeight) {
		transactionArea_textarea.scrollTop = transactionArea_textarea.scrollHeight - 10;
	    }
	}
	
    })
    
    client.on("ledgerClosed", async (ledger) => {
	console.log(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`)
	transactionArea_textarea.value += `                                  ===== Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions! ===== \n`;
	if (checkbox.checked){
	    if (transactionArea_textarea.scrollTop + transactionArea_textarea.clientHeight < transactionArea_textarea.scrollHeight) {
		transactionArea_textarea.scrollTop = transactionArea_textarea.scrollHeight - 10;
	    }
	}
	//console.log (Object.keys(ledger)); [ "type", "ledger_index", "ledger_hash", "ledger_time", "fee_base", "reserve_base", "reserve_inc", "validated_ledgers", "txn_count" ]

	const full_ledger = await client.request({
	    command: 'ledger',
	    transactions: true,
	    ledger_index: ledger.ledger_index,
	})
	
	//console.log(`${ledger.ledger_index} validated ledger (type: ${ledger.type}):`, ledger)

	//const transactions = full_ledger.result.ledger.transactions
    })
    // Disconnect when done (If you omit this, Node.js won't end the process)
}

try {
    main();
} catch(error){
    console.log(error);
}
