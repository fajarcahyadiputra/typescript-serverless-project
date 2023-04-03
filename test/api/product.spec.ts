import { v4 } from "uuid"
import { request } from "../helpers/app"
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"
import { AttributeValue } from "aws-lambda"

describe("Products", ()=> {
    describe("POST /product", ()=> {
        it("responds with 201 status code and newly created product data if product has been created successfully", async ()=> {
            const  requestBody = {
                product: {
                    name: `product-name-${v4()}`,
                    description: `product-desc-${v4()}`,
                    price: Math.random() * 50,
                }
            }
            const expectedResponseBody = {
                product: {
                    ...requestBody.product,
                    id:expect.anything(),
                    createdAt: expect.anything()
                }
            }
            const response = await request
            .post("/product")
            // .set("Authorization", )
            .send(requestBody)

            expect(response.body).toEqual(expectedResponseBody)
            expect(typeof response.body.product.id).toEqual("string")
            expect(new Date().getTime() - new Date(response.body.product.createdAt).getTime()).toBeLessThan(1000)
            expect(response.statusCode).toEqual(201)
        })
        it("stores product in database", async()=> {
            const  product =  {
                name: `product-name-${v4()}`,
                description: `product-desc-${v4()}`,
                price: Math.random() * 50,
            }
            const requestBody = {
                product
            }     
            const response = await request.post("/product").send(requestBody)
            const actualproduct = response.body.product
            const client = new DynamoDBClient({})
           const output = await client.send(new GetItemCommand({
                TableName: "Product",
                Key: {
                    ProductId: {S: response.body.product.id}
                }
            })) 

            expect(output.Item).not.toBeUndefined()
            const item =  output.Item as Record<string, AttributeValue>
            expect(item["ProductId"].S).toEqual(actualproduct.id)
            expect(item["Name"].S).toEqual(actualproduct.name)
            expect(item["Description"].S).toEqual(actualproduct.description)
            expect(item["Price"].N).toEqual(actualproduct.price)
            expect(item["CreatedAt"].S).toEqual(String(actualproduct.createdAt))
      })
   }) 
})