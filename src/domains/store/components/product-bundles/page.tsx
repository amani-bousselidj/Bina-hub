"use client"

// Force dynamic rendering to avoid SSG auth context issues
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react"

export const dynamic = 'force-dynamic'
interface ProductBundle {
  id: string
  title: string
  handle: string
  bundle_type: "fixed" | "dynamic" | "kit"
  item_count: number
  status: "active" | "inactive" | "draft"
  created_at: string
  updated_at: string
}

export default function ProductBundles() {
  
  const router = useRouter()
  const [bundles, setBundles] = useState<ProductBundle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadBundles()
  }, [])

  const loadBundles = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
            setBundles([])
    } catch (error) {
      console.error("Error loading bundles:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBundles = bundles.filter(bundle => {
    const matchesSearch = bundle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bundle.handle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bundle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getBundleTypeColor = (type: string) => {
    switch (type) {
      case "fixed": return "bg-blue-100 text-blue-800"
      case "dynamic": return "bg-green-100 text-green-800"
      case "kit": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-red-100 text-red-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = async (bundleId: string) => {
    if (confirm("Are you sure you want to delete this bundle?")) {
      try {
        // TODO: Replace with actual API call
        setBundles(bundles.filter(b => b.id !== bundleId))
      } catch (error) {
        console.error("Error deleting bundle:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading bundles...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Bundles</h1>
          <p className="text-gray-600">Manage product bundles and kits</p>
        </div>
        <Button onClick={() => router.push("/store/product-bundles/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Bundle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search bundles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48 h-10 px-3 border border-gray-300 rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBundles.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bundles found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your filters"
                  : "Create your first product bundle to get started"
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => router.push("/store/product-bundles/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bundle
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBundles.map((bundle) => (
                  <TableRow key={bundle.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{bundle.title}</div>
                        <div className="text-sm text-gray-500">{bundle.handle}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getBundleTypeColor(bundle.bundle_type)}>
                        {bundle.bundle_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{bundle.item_count} items</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(bundle.status)}>
                        {bundle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(bundle.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/store/product-bundles/${bundle.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/store/product-bundles/${bundle.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(bundle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bundle Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{bundles.length}</div>
              <div className="text-sm text-gray-600">Total Bundles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bundles.filter(b => b.status === "active").length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bundles.filter(b => b.status === "draft").length}
              </div>
              <div className="text-sm text-gray-600">Draft</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(bundles.reduce((sum, b) => sum + b.item_count, 0) / bundles.length || 0)}
              </div>
              <div className="text-sm text-gray-600">Avg Items</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}





