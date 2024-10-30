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
    const ordersData = [
        { id: 1, customerName: 'Nguyễn Văn A', orderDate: '2023-06-01', totalAmount: '$150', status: 'Đã giao hàng' },
        { id: 2, customerName: 'Trần Thị B', orderDate: '2023-06-02', totalAmount: '$200', status: 'Đang xử lý' },
        { id: 3, customerName: 'Lê Văn C', orderDate: '2023-06-03', totalAmount: '$180', status: 'Đã hủy' },
        { id: 4, customerName: 'Phạm Thị D', orderDate: '2023-06-04', totalAmount: '$120', status: 'Đang giao hàng' },
        { id: 5, customerName: 'Hoàng Văn E', orderDate: '2023-06-05', totalAmount: '$250', status: 'Đã giao hàng' },
    ];

    const columns = [
        { accessor: 'id', label: 'ID', className: 'font-medium' },
        { accessor: 'customerName', label: 'Tên khách hàng', className: 'font-medium' },
        { accessor: 'orderDate', label: 'Ngày đặt hàng', className: 'text-center' },
        { accessor: 'totalAmount', label: 'Tổng tiền', className: 'text-right' },
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
        console.log(`Edit order with id: ${id}`);
    };

    const handleDelete = (id: number) => {
        console.log(`Delete order with id: ${id}`);
    };

    const handleCreate = () => {
        console.log('Create new order');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đã giao hàng':
                return 'bg-green-100 text-green-800';
            case 'Đang xử lý':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            case 'Đang giao hàng':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = ordersData.filter(order => 
        (selectedStatus === 'all' || order.status === selectedStatus) &&
        (searchKeyword === '' || order.customerName.toLowerCase().includes(searchKeyword.toLowerCase()))
    );

    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold">Quản lý đơn hàng</CardTitle>
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
                                <SelectItem value="Đã giao hàng">Đã giao hàng</SelectItem>
                                <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                                <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                                <SelectItem value="Đang giao hàng">Đang giao hàng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="relative w-64">
                        <Input
                            placeholder="Tìm kiếm khách hàng"
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
                            {filteredOrders.map((row, index) => (
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