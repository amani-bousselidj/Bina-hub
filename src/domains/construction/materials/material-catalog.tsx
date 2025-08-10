'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui';
import { 
  Search, 
  Package, 
  DollarSign, 
  Truck, 
  Star, 
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter
} from 'lucide-react';

interface Material {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: string[];
  price: number;
  unit: string;
  availability: 'in-stock' | 'limited' | 'out-of-stock' | 'custom-order';
  supplier: string;
  quality: 'standard' | 'premium' | 'economy';
  rating: number;
  reviews: number;
  deliveryTime: string;
  minimumOrder: number;
  image: string;
  certifications: string[];
  applications: string[];
}

interface Supplier {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  specialties: string[];
  certifications: string[];
  paymentTerms: string;
  contact: string;
}

export default function MaterialCatalog() {
  const [activeTab, setActiveTab] = useState('overview');
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      name: 'Portland Cement Type I',
      category: 'Cement',
      description: 'High-quality Portland cement suitable for general construction',
      specifications: ['Compressive Strength: 42.5 MPa', 'Setting Time: 45-600 min', 'Fineness: 300-400 m²/kg'],
      price: 25,
      unit: 'bag (50kg)',
      availability: 'in-stock',
      supplier: 'Saudi Cement Company',
      quality: 'premium',
      rating: 4.8,
      reviews: 324,
      deliveryTime: '1-2 days',
      minimumOrder: 100,
      image: '/materials/cement.jpg',
      certifications: ['SASO', 'ISO 9001', 'Green Building'],
      applications: ['Foundations', 'Structural concrete', 'Masonry']
    },
    {
      id: '2',
      name: 'Reinforcement Steel Bars (Grade 60)',
      category: 'Steel',
      description: 'High-strength deformed steel bars for concrete reinforcement',
      specifications: ['Yield Strength: 420 MPa', 'Tensile Strength: 620 MPa', 'Elongation: 12%'],
      price: 2800,
      unit: 'ton',
      availability: 'in-stock',
      supplier: 'Hadeed Steel',
      quality: 'premium',
      rating: 4.9,
      reviews: 567,
      deliveryTime: '3-5 days',
      minimumOrder: 5,
      image: '/materials/rebar.jpg',
      certifications: ['SASO', 'ASTM A615', 'ISO 14001'],
      applications: ['Concrete reinforcement', 'Structural elements', 'Foundations']
    },
    {
      id: '3',
      name: 'Red Clay Bricks',
      category: 'Bricks',
      description: 'Traditional red clay bricks for construction and decoration',
      specifications: ['Compressive Strength: 10-15 MPa', 'Water Absorption: <15%', 'Thermal Conductivity: 0.6-0.8 W/mK'],
      price: 0.75,
      unit: 'piece',
      availability: 'in-stock',
      supplier: 'Al-Khobar Bricks',
      quality: 'standard',
      rating: 4.3,
      reviews: 189,
      deliveryTime: '2-3 days',
      minimumOrder: 1000,
      image: '/materials/bricks.jpg',
      certifications: ['SASO', 'Local Standards'],
      applications: ['Walls', 'Facades', 'Landscaping']
    },
    {
      id: '4',
      name: 'Concrete Blocks (200x200x400mm)',
      category: 'Blocks',
      description: 'Hollow concrete blocks for structural and non-structural applications',
      specifications: ['Compressive Strength: 7-15 MPa', 'Density: 1400-1800 kg/m³', 'Thermal Conductivity: 0.15-0.25 W/mK'],
      price: 4.5,
      unit: 'piece',
      availability: 'in-stock',
      supplier: 'Riyadh Blocks Factory',
      quality: 'standard',
      rating: 4.1,
      reviews: 276,
      deliveryTime: '1-2 days',
      minimumOrder: 500,
      image: '/materials/blocks.jpg',
      certifications: ['SASO', 'Energy Efficiency'],
      applications: ['Load-bearing walls', 'Partitions', 'Foundations']
    },
    {
      id: '5',
      name: 'Insulation Foam Boards',
      category: 'Insulation',
      description: 'High-performance thermal insulation boards for buildings',
      specifications: ['Thermal Conductivity: 0.022-0.028 W/mK', 'Compressive Strength: 150-300 kPa', 'Thickness: 50-200mm'],
      price: 45,
      unit: 'm²',
      availability: 'limited',
      supplier: 'Insulation Solutions',
      quality: 'premium',
      rating: 4.7,
      reviews: 143,
      deliveryTime: '5-7 days',
      minimumOrder: 50,
      image: '/materials/insulation.jpg',
      certifications: ['SASO', 'Energy Star', 'Green Building'],
      applications: ['Roof insulation', 'Wall insulation', 'Foundation insulation']
    }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Saudi Cement Company',
      location: 'Riyadh, Saudi Arabia',
      rating: 4.8,
      reviews: 1250,
      deliveryTime: '1-3 days',
      specialties: ['Cement', 'Concrete products', 'Aggregates'],
      certifications: ['ISO 9001', 'ISO 14001', 'SASO'],
      paymentTerms: 'Net 30 days',
      contact: '+966-11-234-5678'
    },
    {
      id: '2',
      name: 'Hadeed Steel',
      location: 'Jubail, Saudi Arabia',
      rating: 4.9,
      reviews: 892,
      deliveryTime: '2-5 days',
      specialties: ['Steel bars', 'Structural steel', 'Wire mesh'],
      certifications: ['ASTM', 'ISO 9001', 'SASO'],
      paymentTerms: 'Net 45 days',
      contact: '+966-13-345-6789'
    },
    {
      id: '3',
      name: 'Al-Khobar Bricks',
      location: 'Al-Khobar, Saudi Arabia',
      rating: 4.3,
      reviews: 456,
      deliveryTime: '1-3 days',
      specialties: ['Clay bricks', 'Decorative bricks', 'Pavers'],
      certifications: ['SASO', 'Local Building Code'],
      paymentTerms: 'Net 15 days',
      contact: '+966-13-456-7890'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  const categories = ['all', ...Array.from(new Set(materials.map(m => m.category)))];
  const qualities = ['all', 'economy', 'standard', 'premium'];
  const availabilities = ['all', 'in-stock', 'limited', 'out-of-stock', 'custom-order'];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesQuality = selectedQuality === 'all' || material.quality === selectedQuality;
    const matchesAvailability = selectedAvailability === 'all' || material.availability === selectedAvailability;
    
    return matchesSearch && matchesCategory && matchesQuality && matchesAvailability;
  });

  const getAvailabilityColor = (availability: Material['availability']) => {
    switch (availability) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'custom-order': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: Material['quality']) => {
    switch (quality) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'economy': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityIcon = (availability: Material['availability']) => {
    switch (availability) {
      case 'in-stock': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'limited': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'out-of-stock': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'custom-order': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Material Catalog</h1>
        <p className="text-gray-600">Comprehensive database of construction materials with specifications and pricing</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {qualities.map(quality => (
                  <option key={quality} value={quality}>
                    {quality === 'all' ? 'All Qualities' : quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {availabilities.map(availability => (
                  <option key={availability} value={availability}>
                    {availability === 'all' ? 'All Availability' : availability.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                    </div>
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-lg">{material.price} SAR</span>
                      <span className="text-sm text-gray-500">/ {material.unit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{material.rating}</span>
                      <span className="text-sm text-gray-500">({material.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getAvailabilityIcon(material.availability)}
                    <Badge className={getAvailabilityColor(material.availability)}>
                      {material.availability.replace('-', ' ')}
                    </Badge>
                    <Badge className={getQualityColor(material.quality)}>
                      {material.quality}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Delivery: {material.deliveryTime}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Min order: {material.minimumOrder} {material.unit}
                    </div>
                    <div className="text-sm text-gray-600">
                      Supplier: {material.supplier}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Specifications:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {material.specifications.slice(0, 2).map((spec, index) => (
                          <li key={index}>• {spec}</li>
                        ))}
                        {material.specifications.length > 2 && (
                          <li className="text-blue-600">• +{material.specifications.length - 2} more</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Certifications:</h4>
                      <div className="flex flex-wrap gap-1">
                        {material.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-gray-600">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Applications:</h4>
                      <div className="flex flex-wrap gap-1">
                        {material.applications.slice(0, 2).map((app, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                        {material.applications.length > 2 && (
                          <span className="text-xs text-blue-600">+{material.applications.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                      Request Quote
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => alert('Button clicked')}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <p className="text-sm text-gray-600">{supplier.location}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                      <span className="text-sm text-gray-500">({supplier.reviews})</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Delivery: {supplier.deliveryTime}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {supplier.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Certifications:</h4>
                    <div className="flex flex-wrap gap-1">
                      {supplier.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-gray-600">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Payment Terms:</span> {supplier.paymentTerms}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Contact:</span> {supplier.contact}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                      Contact Supplier
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => alert('Button clicked')}>
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}





