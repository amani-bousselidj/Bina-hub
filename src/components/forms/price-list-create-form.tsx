"use client"
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface PriceListCreateFormProps {
  regions: any[];
  currencies: any[];
  pricePreferences: any;
}

export function PriceListCreateForm({ regions, currencies, pricePreferences }: PriceListCreateFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "sale",
    status: "draft",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating price list:", formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Price List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter price list name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="sale">Sale</option>
              <option value="override">Override</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Create Price List
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}



