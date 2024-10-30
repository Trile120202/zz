import { NextApiRequest, NextApiResponse } from 'next';
import knex from 'knex';
import knexConfig from '../../../knexfile';
import { StatusCode } from "@/lib/statusCodes";
import { transformResponse } from "@/lib/interceptors/transformInterceptor";

const db = knex(knexConfig);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search as string;
            const status = req.query.status as string;

            let query = db('tags');

            if (search) {
                query = query.whereRaw('LOWER(name) LIKE ?', [`%${search.toLowerCase()}%`]);
            }

            if (status && status !== 'all') {
                query = query.where('status', parseInt(status));
            }

            const [tags, totalResult] = await Promise.all([
                query.clone()
                    .select('*')
                    .orderBy('id', 'desc')
                    .limit(limit)
                    .offset(offset),
                query.clone().count('* as count').first()
            ]);

            const total = totalResult?.count as number;
            const totalPages = Math.ceil(total / limit);

            res.status(StatusCode.OK).json(transformResponse({
                data: {
                    tags,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalItems: total,
                        itemsPerPage: limit
                    }
                },
                message: 'Tags retrieved successfully.',
                statusCode: StatusCode.OK,
            }));
        } catch (error) {
            console.error(error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(transformResponse({
                data: null,
                message: 'An error occurred while retrieving tags.',
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            }));
        }
    } else if (req.method === 'POST') {
        try {
            const { name, status } = req.body;

            if (!name) {
                return res.status(StatusCode.BAD_REQUEST).json(transformResponse({
                    data: null,
                    message: 'Tag name is required.',
                    statusCode: StatusCode.BAD_REQUEST,
                }));
            }

            const existingTag = await db('tags').whereRaw('LOWER(name) = ?', [name.toLowerCase()]).first();
            if (existingTag) {
                return res.status(StatusCode.CONFLICT).json(transformResponse({
                    data: null,
                    message: 'Tag with this name already exists.',
                    statusCode: StatusCode.CONFLICT,
                }));
            }

            const [newTag] = await db('tags')
                .insert({ name, status: status || 1 })
                .returning('*');

            res.status(StatusCode.CREATED).json(transformResponse({
                data: newTag,
                message: 'Tag created successfully.',
                statusCode: StatusCode.CREATED,
            }));
        } catch (error) {
            console.error(error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(transformResponse({
                data: null,
                message: 'An error occurred while creating the tag.',
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            }));
        }
    } else if (req.method === 'PUT') {
        try {
            const { id, name, status } = req.body;

            if (!id || !name) {
                return res.status(StatusCode.BAD_REQUEST).json(transformResponse({
                    data: null,
                    message: 'Tag ID and name are required.',
                    statusCode: StatusCode.BAD_REQUEST,
                }));
            }

            const existingTag = await db('tags')
                .whereRaw('LOWER(name) = ? AND id != ?', [name.toLowerCase(), id])
                .first();
            if (existingTag) {
                return res.status(StatusCode.CONFLICT).json(transformResponse({
                    data: null,
                    message: 'Another tag with this name already exists.',
                    statusCode: StatusCode.CONFLICT,
                }));
            }

            const [updatedTag] = await db('tags')
                .where({ id })
                .update({ name, status: status !== undefined ? status : 1 })
                .returning('*');

            if (!updatedTag) {
                return res.status(StatusCode.NOT_FOUND).json(transformResponse({
                    data: null,
                    message: 'Tag not found.',
                    statusCode: StatusCode.NOT_FOUND,
                }));
            }

            res.status(StatusCode.OK).json(transformResponse({
                data: updatedTag,
                message: 'Tag updated successfully.',
                statusCode: StatusCode.OK,
            }));
        } catch (error) {
            console.error(error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(transformResponse({
                data: null,
                message: 'An error occurred while updating the tag.',
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            }));
        }
    } else if (req.method === 'PATCH') {
        try {
            const { id, status } = req.body;

            if (!id || status === undefined) {
                return res.status(StatusCode.BAD_REQUEST).json(transformResponse({
                    data: null,
                    message: 'Tag ID and status are required.',
                    statusCode: StatusCode.BAD_REQUEST,
                }));
            }

            const updatedTag = await db('tags')
                .where({ id })
                .update({ status })
                .returning('*');

            if (updatedTag.length === 0) {
                return res.status(StatusCode.NOT_FOUND).json(transformResponse({
                    data: null,
                    message: 'Tag not found.',
                    statusCode: StatusCode.NOT_FOUND,
                }));
            }

            res.status(StatusCode.OK).json(transformResponse({
                data: updatedTag[0],
                message: 'Tag status updated successfully.',
                statusCode: StatusCode.OK,
            }));
        } catch (error) {
            console.error(error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(transformResponse({
                data: null,
                message: 'An error occurred while updating the tag status.',
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            }));
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH']);
        return res.status(StatusCode.METHOD_NOT_ALLOWED).end(`Method ${req.method} Not Allowed`);
    }
}
