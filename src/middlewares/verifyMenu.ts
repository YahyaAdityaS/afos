import { Category } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { it } from "node:test";

const addDataSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().valid('DRINK', 'FOOD', 'SNACK').required(), //.valid = validasi kategori menu (harus sesuai dengan enum)
    description: Joi.string().required(),
    picture: Joi.allow().optional(), //optional (Bisa diisi bisa tidak)
    user: Joi.optional()
})

const editDataSchema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    category: Joi.string().valid('DRINK', 'FOOD', 'SNACK').optional(), //.valid = validasi kategori menu (harus sesuai dengan enum)
    description: Joi.string().optional(),
    picture: Joi.allow().optional(), //optional (Bisa diisi bisa tidak)
    user: Joi.optional()
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

export const verifyEditMenu = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(request.body, {abortEarly: false})

    if (error) {
        return response.status(400).json({
            status: false,
            massage: error.details.map(it => it.message).join()
        })
    }
    return next()
}