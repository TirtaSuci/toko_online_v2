import { NextApiResponse } from "next";

export const responseAPISuccess = (res: NextApiResponse, status: boolean, statusCode: number, message: string, data?: unknown) => {
    return res.status(statusCode).json({
        status: status,
        statusCode: statusCode,
        message: message,
        data: data,
    });
};

export const responseAPIBadRequest = (res: NextApiResponse, data?: unknown) => {
    return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Bad request",
        data: data || null,
    });
};

export const responseAPIUnauthorized = (res: NextApiResponse, data?: unknown) => {
    return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Unauthorized",
        data: data || null,
    });
};

export const responseAPIDenied = (res: NextApiResponse, data?: unknown) => {
    return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Forbidden",
        data: data || null,
    });
};

export const responseAPINotFound = (res: NextApiResponse, data?: unknown) => {
    return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Not found",
        data: data || null,
    });
};

export const responseAPIMethodNotAllowed = (res: NextApiResponse, data?: unknown) => {
    return res.status(405).json({
        status: false,
        statusCode: 405,
        message: "Method not allowed",
        data: data || null,
    });
};

export const responseAPIConflict = (res: NextApiResponse, data?: unknown) => {
    return res.status(409).json({
        status: false,
        statusCode: 409,
        message: "Conflict",
        data: data || null,
    });
};

export const responseAPIServerError = (res: NextApiResponse, data?: unknown) => {
    return res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Server error",
        data: data || null,
    });
};