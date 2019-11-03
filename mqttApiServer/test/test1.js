const http = require("http")

describe('test/test1.js ', function() {

    it('publishMsg', function(done){
        publishMsg();
        done();
    });

});

describe('test/test1.js ', function() {
    it('getTopics', function(done){
        getTopics();
        done();
    });
});

const publishMsg = async()=>{
    var postData = {
        'msg' : 'Hello World!'
    };
    var options = {
        hostname: 'localhost',
        port: 8082,
        path: '/mqtt/publish',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': '123456789',
        }
    };
    var req = await http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.')
        })
    });
    req.write(JSON.stringify(postData));
    req.end();

}
const getTopics = async()=>{
    var options = {
        hostname: 'localhost',
        port: 8082,
        path: '/mqtt/topics',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': '123456789',
        }
    };
    var req = await http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.')
        })
    });
    req.write("");
    req.end();

}
