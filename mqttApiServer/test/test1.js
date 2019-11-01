var request = require('superagent');
var expect = require('chai').expect;

describe('async.test.js ', function() {
    it('get allReqLog', function(done){
        request
            .get('http://localhost:8082/reqLog/allReqLog?aa=ee&dd=bb')
            .end(function(err, res){
                console.log(JSON.stringify(res.body));
                expect(res).to.be.an('object');
                done();
            });
    });
});
