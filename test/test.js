var expect = require("chai").expect;
const { json } = require("express");
var request = require("request");

describe("Sample Test", function() {
    var url = "http://localhost:3000";

    it("Message", function(done) {
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done()
        });
    })
})