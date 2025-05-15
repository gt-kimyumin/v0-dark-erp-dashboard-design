"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import Image from "next/image"
import Link from "next/link"

// Mock data for products
const products = [
  {
    id: "1",
    name: "Ergonomic Chair",
    category: "Furniture",
    price: 299.99,
    stock: 45,
    status: "In Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "2",
    name: "Wireless Keyboard",
    category: "Electronics",
    price: 89.99,
    stock: 32,
    status: "In Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "3",
    name: 'LED Monitor 27"',
    category: "Electronics",
    price: 249.99,
    stock: 12,
    status: "Low Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "4",
    name: "Standing Desk",
    category: "Furniture",
    price: 499.99,
    stock: 0,
    status: "Out of Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "5",
    name: "Wireless Mouse",
    category: "Electronics",
    price: 49.99,
    stock: 78,
    status: "In Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  // 추가 데이터
  {
    id: "6",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 129.99,
    stock: 25,
    status: "In Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "7",
    name: "Office Chair",
    category: "Furniture",
    price: 199.99,
    stock: 15,
    status: "Low Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "8",
    name: "Desk Lamp",
    category: "Lighting",
    price: 39.99,
    stock: 50,
    status: "In Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "9",
    name: "External Hard Drive",
    category: "Electronics",
    price: 89.99,
    stock: 0,
    status: "Out of Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "10",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 149.99,
    stock: 22,
    status: "In Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export function ProductsTable() {
  const [productList, setProductList] = useState(products)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const deleteProduct = (id: string) => {
    setProductList(productList.filter((product) => product.id !== id))
  }

  // 현재 페이지에 표시할 제품 목록 계산
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem)

  // 총 페이지 수 계산
  const totalPages = Math.ceil(productList.length / itemsPerPage)

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    product.status === "In Stock"
                      ? "default"
                      : product.status === "Low Stock"
                        ? "warning"
                        : "destructive"
                  }
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Link href={`/products/${product.id}`} className="flex w-full items-center">
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href={`/products/${product.id}/edit`} className="flex w-full items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 페이지네이션 추가 */}
      <div className="flex items-center justify-between border-t px-4 py-4">
        <div className="text-sm text-muted-foreground">
          {productList.length > 0
            ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, productList.length)} of ${productList.length} items`
            : "No items"}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}
