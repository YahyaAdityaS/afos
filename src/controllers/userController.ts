import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"
import { BASE_URL, SECRET } from "../global";
import fs from "fs"
import { date, exist, number } from "joi";
import md5 from "md5"; //enskripsi password
import { sign } from "jsonwebtoken"; //buat mendapatkan token jsonwebtoken

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getProfile = async (request: Request, response: Response) => {
    try {
        const user = request.body.user
        const getProfile = await prisma.user.findFirst({
            where: {
                id : user.id
            }
        })
        return response.json({
            status: true,
            data: getProfile,
            message: `User berhasil ditampilkan`
        }).status(200)
    }
    catch (error) {
        return response.json({
            status: false,
            message: `Yah Error :( ${error}`
        }).status(400)
    }
}

export const getAllUser = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allUser = await prisma.user.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })
        return response.json({
            status: true,
            data: allUser,
            message: 'Ini isi usernya yaa'
        }).status(200)
    }
    catch (error) {
        return response
            .json({
                status: false,
                message: `Yah Error :( ${error} `
            }).status(400)
    }
}

export const createUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password, role } = request.body
        const uuid = uuidv4()

        let filename = "" //untuk upload foto menu
        if (request.file) filename = request.file.filename

        const newUser = await prisma.user.create({
            data: { uuid, name, email, password: md5(password), role, profile_picture:filename }
        })
        return response.status(200).json({
            status: true,
            data: newUser,
            message: `Buat user bisa yaa`
        })
    } catch (error) {
        return response
            .status(400).json({
                status: false,
                message: `Buat user error :( ${error} `
            })
    }
}

export const updateUser = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { name, email, password, role } = request.body

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
        if (!findUser) return response
            .status(200)
            .json({
                status: false,
                message: 'Usernya nda ada'
            })

            let filename = findUser.profile_picture
            if (request.file) {
                filename = request.file.filename
                let path = `${BASE_URL}/../public/profile-picture/${findUser.profile_picture}`
                let exists = fs.existsSync(path)
                if (exists && findUser.profile_picture !== ``) fs.unlinkSync(path)
            }

        const updateUser = await prisma.user.update({
            data: {
                name: name || findUser.name, //or untuk perubahan (kalau ada yang kiri dijalankan, misal tidak ada dijalankan yang kanan)
                email: email || findUser.email, //operasi tenary (sebelah kiri ? = kondisi (price) jika kondisinya true (:) false )
                password: password || findUser.password,
                role: role || findUser.role,
                profile_picture: filename
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updateUser,
            message: 'Update user bisa yaa'
        })

    } catch (error) {
        return response
            .json({
                status: false,
                message: `Yah Error :( ${error} `
            })
            .status(400)
    }
}

export const changePicture = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
        if (!findUser) return response
            .status(200)
            .json({ status: false, message: 'Usernya nda ada' })
        let filename = findUser.profile_picture
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/profile-picture/${findUser.profile_picture}`
            let exists = fs.existsSync(path)
            if (exists && findUser.profile_picture !== ``) fs.unlinkSync(path)
        }
        const updatePicture = await prisma.user.update({
            data: { profile_picture: filename },
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: updatePicture,
            message: `Ganti foto bisa yaa`
        }).status(200)
    }
    catch (error) {
        return response.json({
            status: false,
            message: `Ganti foto gagal yaa`
        }).status(400)
    }
}

export const deleteUser = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
        if (!findUser) return response
            .status(200)
            .json({ status: false, message: 'Usernya nda ada'})

        let path = `${BASE_URL}/../public/profile-picture/${findUser.profile_picture}`
        let exists = fs.existsSync(path)
        if (exists && findUser.profile_picture !== ``) fs.unlinkSync(path)

        const deletedUser = await prisma.user.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deleteUser,
            message: 'Usernya bisa dihapus yaa'
        }).status(200)
    } catch (eror) {
        return response
            .json({
                status: false,
                message: `Yah Error :( ${eror} `
            }).status(400)
    }
}

export const authentication = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body;
        const findUser = await prisma.user.findFirst({
            where: { email, password: md5(password) },
        });
        if (!findUser) {
            return response
                .status(200)
                .json({
                    status: false,
                    logged: false,
                    message: `Email sama password salah`
                })
        }
        let data = {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role,
        }
        let payload = JSON.stringify(data); //mennyiapakan data untuk menjadikan token
        let token = sign(payload, SECRET || "token");

        return response
            .status(200)
            .json({
                status: true,
                logged: true,
                message: `Login Succes`, token, data: data
            })
    } catch (error) {
        return response
            .json({
                status: false,
                message: `Yah Error :( ${error} `
            }).status(400)
    }
}
