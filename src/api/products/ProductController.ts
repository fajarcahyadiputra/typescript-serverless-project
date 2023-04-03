import { inject } from "inversify";
import { Body, Controller, Get, Path, Post, Route, Security, SuccessResponse } from "tsoa";

import securities from "../auth/securities";
import { provideSingleton } from "../../util/provideSingleton";
import { Product, Newproduct } from "./Product";
import { v4 } from "uuid";

export type ProductRequestBody = {
  product: Newproduct;
};

export type ProductResponseBody = {
  product: Product;
};

@Route("product")
@provideSingleton(ProductController)
export class ProductController extends Controller {
  constructor() {
    super();
  }

  @SuccessResponse(201)
//   @Security(securities.USER_AUTH)
  @Post()
  public async postArticle(@Body() reqBody: ProductRequestBody): Promise<ProductResponseBody> {
    return Promise.resolve({
        product: {
            ...reqBody.product,
            id: v4(),
            createdAt: new Date()
        }
    })
  }
}
