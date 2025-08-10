'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, 
  Calendar, 
  MessageSquare, 
  Star, 
  Clock, 
  CheckCircle, 
  User, 
  Phone,
  Mail,
  Award,
  BookOpen,
  FileText,
  Search,
  Filter
} from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviews: number;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'offline';
  languages: string[];
  certifications: string[];
  avatar: string;
  bio: string;
  location: string;
  responseTime: string;
  consultationTypes: ('video' | 'audio' | 'chat' | 'site-visit')[];
}

interface Consultation {
  id: string;
  expertId: string;
  expertName: string;
  type: 'video' | 'audio' | 'chat' | 'site-visit';
  topic: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  duration: number;
  cost: number;
  rating?: number;
  feedback?: string;
  attachments: string[];
  notes: string;
}

interface ConsultationRequest {
  expertId: string;
  type: 'video' | 'audio' | 'chat' | 'site-visit';
  topic: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  budget: number;
  attachments: string[];
}

export default function ExpertConsultation() {
  const [activeTab, setActiveTab] = useState('overview');
  const [experts, setExperts] = useState<Expert[]>([
    {
      id: '1',
      name: 'Dr. Ahmed Al-Rashid',
      title: 'Senior Structural Engineer',
      specialization: ['Structural Analysis', 'Earthquake Engineering', 'High-rise Buildings'],
      experience: 15,
      rating: 4.9,
      reviews: 127,
      hourlyRate: 350,
      availability: 'available',
      languages: ['Arabic', 'English'],
      certifications: ['PE', 'LEED AP', 'PMP'],
      avatar: '/experts/ahmed.jpg',
      bio: 'Experienced structural engineer with expertise in high-rise buildings and seismic design. Licensed Professional Engineer with 15+ years of experience in the GCC region.',
      location: 'Riyadh, Saudi Arabia',
      responseTime: '< 2 hours',
      consultationTypes: ['video', 'audio', 'chat', 'site-visit']
    },
    {
      id: '2',
      name: 'Eng. Sarah Al-Mahmoud',
      title: 'Construction Quality Expert',
      specialization: ['Quality Control', 'Material Testing', 'Project Management'],
      experience: 12,
      rating: 4.8,
      reviews: 89,
      hourlyRate: 280,
      availability: 'available',
      languages: ['Arabic', 'English'],
      certifications: ['PMP', 'Six Sigma Black Belt', 'ISO 9001 Lead Auditor'],
      avatar: '/experts/sarah.jpg',
      bio: 'Quality control specialist with extensive experience in construction project management and material testing. Expert in ISO standards and quality assurance.',
      location: 'Jeddah, Saudi Arabia',
      responseTime: '< 1 hour',
      consultationTypes: ['video', 'audio', 'chat']
    },
    {
      id: '3',
      name: 'Dr. Mohammed Ibn Khalid',
      title: 'Geotechnical Engineer',
      specialization: ['Soil Analysis', 'Foundation Design', 'Ground Improvement'],
      experience: 18,
      rating: 4.9,
      reviews: 156,
      hourlyRate: 400,
      availability: 'busy',
      languages: ['Arabic', 'English', 'French'],
      certifications: ['PE', 'DGE', 'ASCE Fellow'],
      avatar: '/experts/mohammed.jpg',
      bio: 'Leading geotechnical engineer with expertise in complex foundation systems and soil stabilization. Consultant for major infrastructure projects in the Middle East.',
      location: 'Al-Khobar, Saudi Arabia',
      responseTime: '< 4 hours',
      consultationTypes: ['video', 'site-visit']
    },
    {
      id: '4',
      name: 'Eng. Fatima Al-Zahra',
      title: 'MEP Systems Specialist',
      specialization: ['HVAC Design', 'Electrical Systems', 'Plumbing Design'],
      experience: 10,
      rating: 4.7,
      reviews: 73,
      hourlyRate: 250,
      availability: 'available',
      languages: ['Arabic', 'English'],
      certifications: ['LEED AP', 'ASHRAE Member', 'NFPA Certified'],
      avatar: '/experts/fatima.jpg',
      bio: 'MEP systems expert specializing in energy-efficient building design and sustainable HVAC solutions. Certified in green building standards.',
      location: 'Dammam, Saudi Arabia',
      responseTime: '< 3 hours',
      consultationTypes: ['video', 'audio', 'chat']
    },
    {
      id: '5',
      name: 'Eng. Omar Al-Harbi',
      title: 'Construction Safety Expert',
      specialization: ['Safety Management', 'Risk Assessment', 'Compliance'],
      experience: 14,
      rating: 4.8,
      reviews: 102,
      hourlyRate: 300,
      availability: 'available',
      languages: ['Arabic', 'English'],
      certifications: ['CSP', 'OSHA 30', 'NEBOSH'],
      avatar: '/experts/omar.jpg',
      bio: 'Safety management expert with extensive experience in construction site safety and regulatory compliance. Certified Safety Professional with proven track record.',
      location: 'Riyadh, Saudi Arabia',
      responseTime: '< 2 hours',
      consultationTypes: ['video', 'audio', 'chat', 'site-visit']
    }
  ]);

  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: '1',
      expertId: '1',
      expertName: 'Dr. Ahmed Al-Rashid',
      type: 'video',
      topic: 'Structural Analysis Review',
      description: 'Review of structural calculations for 20-story building',
      status: 'scheduled',
      scheduledDate: '2024-02-15T10:00:00',
      duration: 60,
      cost: 350,
      attachments: ['structural-plans.pdf', 'calculations.xlsx'],
      notes: 'Need to review beam sizing and connection details'
    },
    {
      id: '2',
      expertId: '2',
      expertName: 'Eng. Sarah Al-Mahmoud',
      type: 'chat',
      topic: 'Quality Control Process',
      description: 'Guidance on implementing quality control procedures',
      status: 'completed',
      scheduledDate: '2024-02-10T14:00:00',
      duration: 45,
      cost: 210,
      rating: 5,
      feedback: 'Excellent guidance on quality procedures. Very helpful!',
      attachments: ['qc-checklist.pdf'],
      notes: 'Implemented recommended procedures successfully'
    }
  ]);

  const [newRequest, setNewRequest] = useState<ConsultationRequest>({
    expertId: '',
    type: 'video',
    topic: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'medium',
    budget: 0,
    attachments: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [maxRate, setMaxRate] = useState(500);

  const specializations = ['all', ...Array.from(new Set(experts.flatMap(e => e.specialization)))];
  const availabilities = ['all', 'available', 'busy', 'offline'];

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialization = selectedSpecialization === 'all' || expert.specialization.includes(selectedSpecialization);
    const matchesAvailability = selectedAvailability === 'all' || expert.availability === selectedAvailability;
    const matchesRate = expert.hourlyRate <= maxRate;
    
    return matchesSearch && matchesSpecialization && matchesAvailability && matchesRate;
  });

  const getAvailabilityColor = (availability: Expert['availability']) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Consultation['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConsultationTypeIcon = (type: Consultation['type']) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Phone className="w-4 h-4" />;
      case 'chat': return <MessageSquare className="w-4 h-4" />;
      case 'site-visit': return <User className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleRequestConsultation = (expertId: string) => {
    const expert = experts.find(e => e.id === expertId);
    if (expert) {
      setNewRequest({
        ...newRequest,
        expertId,
        budget: expert.hourlyRate
      });
    }
  };

  const handleSubmitRequest = () => {
    if (newRequest.expertId && newRequest.topic && newRequest.description) {
      const expert = experts.find(e => e.id === newRequest.expertId);
      if (expert) {
        const consultation: Consultation = {
          id: Date.now().toString(),
          expertId: newRequest.expertId,
          expertName: expert.name,
          type: newRequest.type,
          topic: newRequest.topic,
          description: newRequest.description,
          status: 'scheduled',
          scheduledDate: `${newRequest.preferredDate}T${newRequest.preferredTime}:00`,
          duration: 60,
          cost: newRequest.budget,
          attachments: newRequest.attachments,
          notes: ''
        };

        setConsultations([...consultations, consultation]);
        setNewRequest({
          expertId: '',
          type: 'video',
          topic: '',
          description: '',
          preferredDate: '',
          preferredTime: '',
          urgency: 'medium',
          budget: 0,
          attachments: []
        });
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Expert Consultation</h1>
        <p className="text-gray-600">Connect with construction experts for professional guidance and support</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search experts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec === 'all' ? 'All Specializations' : spec}
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
                    {availability === 'all' ? 'All Availability' : availability.charAt(0).toUpperCase() + availability.slice(1)}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <span className="text-sm">Max Rate:</span>
                <Input
                  type="number"
                  value={maxRate}
                  onChange={(e) => setMaxRate(parseInt(e.target.value) || 500)}
                  className="w-20"
                />
                <span className="text-sm">SAR/h</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="experts">Find Experts</TabsTrigger>
          <TabsTrigger value="consultations">My Consultations</TabsTrigger>
          <TabsTrigger value="request">Request Consultation</TabsTrigger>
        </TabsList>

        <TabsContent value="experts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={expert.avatar} alt={expert.name} />
                      <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{expert.name}</CardTitle>
                      <p className="text-sm text-gray-600">{expert.title}</p>
                      <p className="text-xs text-gray-500">{expert.location}</p>
                    </div>
                    <Badge className={getAvailabilityColor(expert.availability)}>
                      {expert.availability}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{expert.rating}</span>
                      <span className="text-sm text-gray-500">({expert.reviews} reviews)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">{expert.hourlyRate} SAR</span>
                      <span className="text-sm text-gray-500">/hour</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{expert.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Response time: {expert.responseTime}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Specializations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialization.slice(0, 2).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {expert.specialization.length > 2 && (
                        <span className="text-xs text-blue-600">+{expert.specialization.length - 2} more</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Languages:</h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Certifications:</h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-gray-600">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Consultation Types:</h4>
                    <div className="flex gap-2">
                      {expert.consultationTypes.map((type, index) => (
                        <div key={index} className="flex items-center gap-1">
                          {getConsultationTypeIcon(type)}
                          <span className="text-xs">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{expert.bio}</p>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleRequestConsultation(expert.id)}
                      disabled={expert.availability === 'offline'}
                    >
                      Book Consultation
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

        <TabsContent value="consultations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{consultation.topic}</h4>
                        <p className="text-sm text-gray-600">{consultation.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">👤 {consultation.expertName}</span>
                          <div className="flex items-center gap-1">
                            {getConsultationTypeIcon(consultation.type)}
                            <span className="text-xs text-gray-500">{consultation.type}</span>
                          </div>
                          <span className="text-xs text-gray-500">📅 {new Date(consultation.scheduledDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">{consultation.cost} SAR</p>
                          <p className="text-xs text-gray-500">{consultation.duration} min</p>
                        </div>
                        <Badge className={getStatusColor(consultation.status)}>
                          {consultation.status}
                        </Badge>
                      </div>
                    </div>

                    {consultation.attachments.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{consultation.attachments.length} attachments</span>
                      </div>
                    )}

                    {consultation.rating && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{consultation.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">{consultation.feedback}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {consultation.status === 'scheduled' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                            <Calendar className="w-3 h-3 mr-1" />
                            Reschedule
                          </Button>
                          <Button size="sm" onClick={() => alert('Button clicked')}>
                            <Video className="w-3 h-3 mr-1" />
                            Join Meeting
                          </Button>
                        </>
                      )}
                      {consultation.status === 'completed' && !consultation.rating && (
                        <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                          <Star className="w-3 h-3 mr-1" />
                          Rate & Review
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Consultation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expertSelect">Select Expert</Label>
                  <select
                    id="expertSelect"
                    value={newRequest.expertId}
                    onChange={(e) => setNewRequest({...newRequest, expertId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Choose an expert</option>
                    {experts.map(expert => (
                      <option key={expert.id} value={expert.id}>
                        {expert.name} - {expert.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="consultationType">Consultation Type</Label>
                  <select
                    id="consultationType"
                    value={newRequest.type}
                    onChange={(e) => setNewRequest({...newRequest, type: e.target.value as ConsultationRequest['type']})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="video">Video Call</option>
                    <option value="audio">Audio Call</option>
                    <option value="chat">Chat</option>
                    <option value="site-visit">Site Visit</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={newRequest.topic}
                    onChange={(e) => setNewRequest({...newRequest, topic: e.target.value})}
                    placeholder="e.g., Structural Analysis Review"
                  />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <select
                    id="urgency"
                    value={newRequest.urgency}
                    onChange={(e) => setNewRequest({...newRequest, urgency: e.target.value as ConsultationRequest['urgency']})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={newRequest.preferredDate}
                    onChange={(e) => setNewRequest({...newRequest, preferredDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={newRequest.preferredTime}
                    onChange={(e) => setNewRequest({...newRequest, preferredTime: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="budget">Budget (SAR)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newRequest.budget}
                    onChange={(e) => setNewRequest({...newRequest, budget: parseInt(e.target.value) || 0})}
                    placeholder="350"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  placeholder="Provide detailed information about your consultation needs..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="attachments">Attachments</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setNewRequest({...newRequest, attachments: files.map(f => f.name)});
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Upload relevant documents, drawings, or photos</p>
              </div>
              <Button onClick={handleSubmitRequest} className="w-full">
                Submit Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}





