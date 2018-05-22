const http = require('http');

var wmStates = ["idle","filling water","washing","rinsing","spinning"];
var wmStatus = 0;
var testi = {"cmd":"status"};
var running = false;
var perkele = "perkele";

http.createServer((req, res) => {
    if (req.method == 'POST' && req.url == '/api') {
        var whole = ''
        req.on('data', (chunk) => {
            whole = chunk.toString()
			var jotain = whole.cmd
        })
	
	
	
        req.on('end', () => {
			
			try {
				var jotain = JSON.parse(whole);
			} catch (e) {
			   console.log(e);
			   jotain = {"cmd":"error"};
			}
			
			if (jotain.cmd == 'status'){
				perkele = jotain.cmd;
				res.writeHead(200, 'OK', {'Content-Type': 'text/plain'})
				res.end('Washingmachine state: ' + wmStates[wmStatus])
			}
			if(jotain.cmd == 'start'){
				perkele = jotain.cmd;
				if (running == true){
					res.writeHead(200, 'OK', {'Content-Type': 'text/plain'})
					res.end('Error: Washinmachine already running')
					
				}
				else{
					wmStatus = 0;
					running = true;
					res.writeHead(200, 'OK', {'Content-Type': 'text/plain'})
					res.end('Washing...')
				}
				
			}
			if(jotain.cmd == 'abort'){
				wmStatus = -1;
				res.writeHead(200, 'OK', {'Content-Type': 'text/plain'})
				res.end('Aborting...')
			}
			else{
				res.writeHead(200, 'OK', {'Content-Type': 'text/plain'})
				res.end('Invalid command')
			}
        })

    }
	else{
		res.statusCode = 404;
		res.end();
	}

}).listen(3000)


async function pesukone() {
  return new Promise(function (resolve, reject) {
        if (wmStatus >= 0 && wmStatus < 4 && running == true) {
            wmStatus++;
            setTimeout(() => {resolve(wmStatus);}, 5000); // fulfilled
			console.log(wmStates[wmStatus]);
        } else {
			wmStatus = 0;
			running = false;
            reject(wmStatus); // reject
			
        }
  }).catch(error => console.log(wmStates[wmStatus]));
}

async function isrunning()
{
	return new Promise(function (resolve, reject){
		if (running == false)
		{	
			wmStatus = 0;
			setTimeout(() => {resolve(wmStatus);}, 5000);
		}
		else{
			running = false;
			wmStatus = 0;
			setTimeout(() => {reject(wmStatus);}, 5000);
		}
	}).catch(error => console.log(error));
}

async function facepalm() {
	console.log(wmStates[wmStatus]);
	for(;;)
	{
		//if(wmStatus >= 0 && wmStatus < 4 && running == true)
		if(running == true)
		{
		wmStatus = await pesukone();
		}
		else
		{
		wmStatus = await isrunning();
		
		}
	}
}

facepalm();