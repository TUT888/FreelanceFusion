const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../server");
const freelancerModel = require("../models/freelancerModel");

chai.use(chaiHttp);

describe("Freelancer Controller", () => {
	let mockFreelancers;

	beforeEach(() => {
		mockFreelancers = [
			{
				_id: "66f55a859fcd32a0418a2fbb",
				email: "freelancer@example.com",
				password: "hashed_password_1",
				role: "freelancer",
				profile: {
					name: "Alice Smith",
					skills: ["JavaScript", "React"],
					experience: "4 years of experience in front-end development",
				},
				contact_info: {
					phone: "123-456-7890",
					address: "123 Freelance St, Developer City",
				},
				created_at: "2024-09-26T12:58:45.545Z",
				updated_at: "2024-09-26T12:58:45.546Z",
				__v: 0,
			},
		];

		freelancerModel.find = () => ({
			exec: () => Promise.resolve(mockFreelancers),
		});

		freelancerModel.getFreelancerById = (id) => {
			if (id === "66f55a859fcd32a0418a2fbb") {
				return Promise.resolve(mockFreelancers[0]);
			} else {
				return Promise.resolve(null);
			}
		};
	});

	describe("GET /freelancers/search", () => {
		it("should return a list of freelancers and render the freelancer view", (done) => {
			chai
				.request(app)
				.get("/freelancers/search")
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.text).to.include("Alice Smith");
					expect(res.text).to.include("JavaScript");
					expect(res.text).to.include("React");
					expect(res.text).to.include("4 years of experience in front-end development");
					done();
				});
		});

		it("should apply pagination and return the correct page of freelancers", (done) => {
			chai
				.request(app)
				.get("/freelancers/search?page=1&limit=1")
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.text).to.include("Alice Smith");
					done();
				});
		});

		it("should redirect to page 1 if no freelancers are found on the current page", (done) => {
			chai
				.request(app)
				.get("/freelancers/search?page=2")
				.redirects(0)
				.end((err, res) => {
					expect(res).to.have.status(302);
					expect(res).to.have.header("location", "/freelancers/search?page=1");
					done();
				});
		});

		it("should return a filtered list of freelancers based on keyword", (done) => {
			chai
				.request(app)
				.get("/freelancers/search?keyword=JavaScript")
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.text).to.include("Alice Smith");
					expect(res.text).to.include("JavaScript");
					done();
				});
		});
		
	});

	describe("GET /freelancers/:id", () => {
		it("should return freelancer details for a valid freelancer ID", (done) => {
			chai
				.request(app)
				.get("/freelancers/search/66f55a859fcd32a0418a2fbb")
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.text).to.include("Alice Smith");
					expect(res.text).to.include("JavaScript");
					expect(res.text).to.include("4 years of experience in front-end development");
					done();
				});
		});

		it("should return 404 if the freelancer is not found", (done) => {
			chai
				.request(app)
				.get("/freelancers/search/invalidID")
				.end((err, res) => {
					expect(res).to.have.status(404);
					expect(res.text).to.equal("Freelancer not found");
					done();
				});
		});
	});

	
	
});
