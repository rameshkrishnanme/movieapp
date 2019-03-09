
const chai = require('chai');
const request = require('supertest');
const should = chai.should();
const expect = chai.expect;

const app = require('../index.js');

describe("Route Testing", function(err) {
	let query = 'avengers';
	describe("Route Testing", function(err) {
		
		it('Testing movie search', function(done) {
			var data = { search : query };
			request(app).post('/usermovie/search')
			.send(data)
			.expect(200).end(function(err, res) {
				should.not.exist(err);
				expect(res).to.be.an('object');
				done();
			});
			
		});
		
		it('Testing movie search pagination', function(done) {
			var data = { search : query };
			request(app).get('/usermovie/search/'+query+'/2')
			.expect(200).end(function(err, res) {
				should.not.exist(err);
				expect(res).to.be.an('object');
				done();
			});
			
		});
	});
});