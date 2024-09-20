import { Category } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { it } from "node:test";

const addDataSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    Category: Joi.string().required(),
    description: Joi.string().required(),
    picture: Joi.allow().optional() //optional (Bisa diisi bisa tidak)
})

export const verifyAddMenu = (request: Request, response: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, {abortEarly: false})

    if (error) {
        return response.status(400).json({
            status: false,
            massage: error.details.map(it => it.message).join()
        })
    }
    return next()
}