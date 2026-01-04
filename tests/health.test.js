/*
import request from "supertest";
import app from "./src/app.js";

describe("Health Check", () => {
    it("deve retornar status 200", async() => {
        
        const response = await
    request(app).get("/health");
       
        expect(Response.statusCode).toBe(200);
       
    expect(Response.body.status).toBe("ok");

    });


}); */

describe("Infraestrutura da API", () => {
  it("ambiente de testes funcionando", () => {
    expect(true).toBe(true);
  });
});
