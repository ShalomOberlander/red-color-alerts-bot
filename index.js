import fetch from 'node-fetch';


let lestid = 0
let lestla = 0
fetch("https://api.tzevaadom.co.il/alerts-history/")
    .then(response => response.json())
    .then(data => {
      
        lestid = data[0].id
        lestla = data[0].alerts.length
    })
      
// Function to fetch and send data
function fetchDataAndSend() {
  fetch("https://api.tzevaadom.co.il/alerts-history/")
    .then(response => response.json())
    .then(data => {
      
      
      if ((lestid!==data[0].id)||(lestla !== data[0].alerts.length)){
        
        let texttosand = "🚨🚨🚨";
      for (let index = 0; index < data[0].alerts.length; index++) {
        for (let i = 0; i < data[0].alerts[index].cities.length; i++) {
          texttosand += data[0].alerts[index].cities[i] +', '
        }
      }
      texttosand = texttosand.slice(0,texttosand.length - 2)
      if (data[0].alerts[0].threat == 0){
        texttosand += ' (ירי רקטות וטילים)'
      }
      if (data[0].alerts[0].threat == 2){
        texttosand += ' (חשש לחדירת מחבלים)'
      }
      if (data[0].alerts[0].threat == 5){
        texttosand += ' (חשש לחדירת כלי טייס עויינת)'
      }
        webhook(texttosand);
      }
      lestid = data[0].id
      lestla = data[0].alerts.length
    })
    .catch(error => {
      console.log("Error:", error);
    });
}

// Function to send data to Google Chat webhook
function webhook(text) {
    
    const webhookURL = 'https://chat.googleapis.com/v1/spaces/AAAA-_rWn38/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=dD-cXLFV4WiihGPcml61Z8pdY3Q86RU6Z_gyS0k_jSQ';
  
    const data = JSON.stringify({
      'text':text,
    });
    let resp;
    fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: data,
    }).then((response) => {
      resp = response;
      
    });
    return resp;
  }



setInterval(() => {
  
  fetchDataAndSend();
}, 1000);

// Initial fetch and send
console.log('Fetching initial data and sending...');
