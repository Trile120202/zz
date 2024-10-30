'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Page = () => {
    const bannersData = [
        { id: 1, name: 'Banner Trang chủ', position: 'Trang chủ', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Đang hiển thị' },
        { id: 2, name: 'Banner Khuyến mãi', position: 'Trang khuyến mãi', startDate: '2023-02-01', endDate: '2023-03-01', status: 'Đã kết thúc' },
        { id: 3, name: 'Banner Sản phẩm mới', position: 'Trang sản phẩm', startDate: '2023-03-15', endDate: '2023-06-15', status: 'Đang hiển thị' },
        { id: 4, name: 'Banner Mùa hè', position: 'Trang chủ', startDate: '2023-06-01', endDate: '2023-08-31', status: 'Chưa bắt đầu' },
        { id: 5, name: 'Banner Black Friday', position: 'Trang khuyến mãi', startDate: '2023-11-24', endDate: '2023-11-26', status: 'Chưa bắt đầu' },
    ];

    const columns = [
        { accessor: 'id', label: 'ID', className: 'font-medium' },
        { accessor: 'name', label: 'Tên banner', className: 'font-medium' },
        { accessor: 'position', label: 'Vị trí', className: 'text-center' },
        { accessor: 'startDate', label: 'Ngày bắt đầu', className: 'text-center' },
        { accessor: 'endDate', label: 'Ngày kết thúc', className: 'text-center' },
        { accessor: 'status', label: 'Trạng thái', className: 'text-center' },
        { accessor: 'actions', label: 'Thao tác', className: 'text-right' },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEdit = (id: number) => {
        console.log(`Edit banner with id: ${id}`);
    };

    const handleDelete = (id: number) => {
        console.log(`Delete banner with id: ${id}`);
    };

    const handleCreate = () => {
        console.log('Create new banner');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đang hiển thị':
                return 'bg-green-100 text-green-800';
            case 'Đã kết thúc':
                return 'bg-red-100 text-red-800';
            case 'Chưa bắt đầu':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredBanners = bannersData.filter(banner => 
        (selectedStatus === 'all' || banner.status === selectedStatus) &&
        (searchKeyword === '' || banner.name.toLowerCase().includes(searchKeyword.toLowerCase()))
    );

    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold">Quản lý banner</CardTitle>
                    <Button onClick={handleCreate} className="bg-green-500 hover:bg-green-600 transition duration-300">
                        <FaPlus className="mr-2 h-4 w-4" />
                        Tạo mới
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex space-x-4 mb-6">
                    <div className="relative">
                        <Select onValueChange={setSelectedStatus} defaultValue="all">
                            <SelectTrigger className="w-[200px] border-2 border-gray-300 rounded-lg">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="Đang hiển thị">Đang hiển thị</SelectItem>
                                <SelectItem value="Đã kết thúc">Đã kết thúc</SelectItem>
                                <SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="relative w-64">
                        <Input
                            placeholder="Tìm kiếm banner"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                {columns.map((col, index) => (
                                    <TableHead key={index} className={`${col.className} py-3`}>
                                        {col.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBanners.map((row, index) => (
                                <TableRow key={index} className="hover:bg-gray-50 transition duration-150">
                                    {columns.map((col, colIndex) => (
                                        <TableCell 
                                            key={colIndex} 
                                            className={`${col.className} py-4`}
                                        >
                                            {col.accessor === 'actions' ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <BsThreeDots className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(row.id)}>
                                                            <FaEdit className="mr-2 h-4 w-4" />
                                                            <span>Sửa</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(row.id)}>
                                                            <FaTrash className="mr-2 h-4 w-4" />
                                                            <span>Xóa</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : col.accessor === 'status' ? (
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                                                    {row.status}
                                                </span>
                                            ) : (
                                                row[col.accessor as keyof typeof row]
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink 
                                    href="#"
                                    onClick={() => handlePageChange(index + 1)}
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </CardContent>
        </Card>
    );
};

export default Page;